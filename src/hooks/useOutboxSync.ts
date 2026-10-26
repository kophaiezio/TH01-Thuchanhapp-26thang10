import {useCallback, useEffect, useRef, useState} from 'react';
import {applyOutboxOperation} from '../api/outboxService';
import {
  enqueueOperation,
  readOutbox,
  removeOutboxOperation,
} from '../storage/outbox';
import type {OutboxOperation} from '../types';

export type UseOutboxSyncResult = {
  outbox: OutboxOperation[];
  pendingCount: number;
  isSyncing: boolean;
  syncMessage: string | null;
  syncError: boolean;
  syncRevision: number;
  triggerSync: () => Promise<number>;
  queueOperation: (op: OutboxOperation) => Promise<void>;
  hasPendingSync: (entityId: string) => boolean;
  clearSyncMessage: () => void;
};

export function useOutboxSync(
  isOnline: boolean,
  onSynced?: (count: number) => void,
): UseOutboxSyncResult {
  const [outbox, setOutbox] = useState<OutboxOperation[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncError, setSyncError] = useState(false);
  const [syncRevision, setSyncRevision] = useState(0);

  const isOnlineRef = useRef(isOnline);
  isOnlineRef.current = isOnline;
  const isSyncingRef = useRef(false);

  const onSyncedRef = useRef(onSynced);
  onSyncedRef.current = onSynced;

  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOutbox = useCallback(async () => {
    try {
      setOutbox(await readOutbox());
    } catch (error) {
      setSyncError(true);
      setSyncMessage(
        error instanceof Error
          ? `Không thể đọc hàng đợi đồng bộ: ${error.message}`
          : 'Không thể đọc hàng đợi đồng bộ.',
      );
    }
  }, []);

  useEffect(() => {
    loadOutbox();
  }, [loadOutbox]);

  const clearSyncMessage = useCallback(() => {
    setSyncMessage(null);
    setSyncError(false);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
  }, []);

  const triggerSync = useCallback(async (): Promise<number> => {
    if (!isOnlineRef.current || isSyncingRef.current) {
      return 0;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);
    let syncedCount = 0;
    let failureMessage: string | null = null;

    try {
      const currentOps = await readOutbox();
      for (const op of currentOps) {
        try {
          await applyOutboxOperation(op);
          await removeOutboxOperation(op.id);
          syncedCount++;
        } catch (error) {
          failureMessage =
            error instanceof Error
              ? error.message
              : 'Yêu cầu đồng bộ thất bại.';
          break;
        }
      }

      setOutbox(await readOutbox());
      setSyncRevision(revision => revision + 1);
    } catch (error) {
      failureMessage =
        error instanceof Error
          ? error.message
          : 'Không thể đọc hàng đợi đồng bộ.';
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }

    if (syncedCount > 0) {
      setSyncMessage(
        failureMessage
          ? `Đã đồng bộ ${syncedCount} thay đổi; ${failureMessage}`
          : `Đã đồng bộ ${syncedCount} thay đổi`,
      );
      setSyncError(Boolean(failureMessage));
      onSyncedRef.current?.(syncedCount);

      if (!failureMessage) {
        if (messageTimeoutRef.current) {
          clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = setTimeout(() => {
          setSyncMessage(null);
        }, 4000);
      }
    } else if (failureMessage) {
      setSyncMessage(`Đồng bộ chưa hoàn tất: ${failureMessage}`);
      setSyncError(true);
    } else {
      setSyncMessage(null);
      setSyncError(false);
    }

    return syncedCount;
  }, []);

  // Tự động đồng bộ khi chuyển sang online
  const prevOnlineRef = useRef(isOnline);
  useEffect(() => {
    if (!prevOnlineRef.current && isOnline) {
      triggerSync();
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, triggerSync]);

  const queueOperation = useCallback(
    async (op: OutboxOperation) => {
      const next = await enqueueOperation(op);
      setOutbox(next);

      // Nếu đang online thì tự động đẩy lên ngay
      if (isOnlineRef.current) {
        setTimeout(() => {
          triggerSync();
        }, 100);
      }
    },
    [triggerSync],
  );

  const hasPendingSync = useCallback(
    (entityId: string): boolean => {
      return outbox.some(
        op => op.entityId === entityId,
      );
    },
    [outbox],
  );

  return {
    outbox,
    pendingCount: outbox.length,
    isSyncing,
    syncMessage,
    syncError,
    syncRevision,
    triggerSync,
    queueOperation,
    hasPendingSync,
    clearSyncMessage,
  };
}
