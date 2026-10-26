import {useCallback, useEffect, useRef, useState} from 'react';
import {useSync} from '../context/SyncContext';
import {formatLastUpdated, readCache, writeCache} from '../storage/cache';

export type UseCachedQueryOptions<T> = {
  key: string;
  fetcher: () => Promise<T>;
  initialData?: T;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
};

export type UseCachedQueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error: string | null;
  lastUpdated: string | null;
  rawUpdatedAt: string | null;
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
};

export function useCachedQuery<T>({
  key,
  fetcher,
  initialData,
  enabled = true,
  onSuccess,
}: UseCachedQueryOptions<T>): UseCachedQueryResult<T> {
  const {isOnline} = useSync();
  const [data, setData] = useState<T | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rawUpdatedAt, setRawUpdatedAt] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const loadData = useCallback(
    async (isManualRefresh = false) => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      setError(null);
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (data === null) {
        setIsLoading(true);
      }

      let existingData: T | null = data;
      let cacheReadError: string | null = null;

      // 1. Chiến lược "Cache trước": nếu chưa có dữ liệu, thử đọc cache
      if (!isManualRefresh) {
        try {
          const cached = await readCache<T>(key);
          if (cached !== null) {
            existingData = cached.data;
            setData(cached.data);
            setRawUpdatedAt(cached.updatedAt);
            setIsLoading(false);
          }
        } catch (cacheError) {
          cacheReadError =
            cacheError instanceof Error
              ? cacheError.message
              : 'Không thể đọc dữ liệu trong bộ nhớ máy.';
        }
      }

      // 2. "Mạng sau": Nếu có mạng, gọi API lấy dữ liệu mới nhất
      if (isOnline) {
        try {
          const freshData = await fetcherRef.current();
          const savedCache = await writeCache(key, freshData);
          setData(freshData);
          setRawUpdatedAt(savedCache.updatedAt);
          setError(null);
          setIsLoading(false);
          onSuccessRef.current?.(freshData);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : 'Không thể tải dữ liệu từ máy chủ.';
          // Nếu chưa hề có dữ liệu (kể cả cache), báo lỗi để UI hiển thị ErrorState
          if (!existingData) {
            setError(
              cacheReadError
                ? `${message} Lỗi đọc cache: ${cacheReadError}`
                : message,
            );
          }
          setIsLoading(false);
        } finally {
          setIsRefreshing(false);
        }
      } else {
        // Đang offline: nếu không có cache thì báo lỗi cần mạng
        if (!existingData) {
          setError(
            cacheReadError ||
              'Không có kết nối mạng và chưa có dữ liệu trong bộ nhớ đệm.',
          );
        }
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [data, enabled, isOnline, key],
  );

  useEffect(() => {
    loadData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isOnline, enabled]);

  const refetch = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  return {
    data,
    isLoading: isLoading && data === null && !error,
    isRefreshing,
    isError: Boolean(error && data === null),
    error,
    lastUpdated: rawUpdatedAt ? formatLastUpdated(rawUpdatedAt) : null,
    rawUpdatedAt,
    refetch,
    setData,
  };
}
