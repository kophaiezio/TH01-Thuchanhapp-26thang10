import AsyncStorage from '@react-native-async-storage/async-storage';
import {cacheKey} from './keys';

export type CachedValue<T> = {
  data: T;
  updatedAt: string;
};

export async function readCache<T>(
  key: string,
): Promise<CachedValue<T> | null> {
  const value = await AsyncStorage.getItem(cacheKey(key));
  if (value === null) {
    return null;
  }
  return JSON.parse(value) as CachedValue<T>;
}

export async function writeCache<T>(
  key: string,
  data: T,
  customUpdatedAt?: string,
): Promise<CachedValue<T>> {
  const cached: CachedValue<T> = {
    data,
    updatedAt: customUpdatedAt || new Date().toISOString(),
  };
  await AsyncStorage.setItem(cacheKey(key), JSON.stringify(cached));
  return cached;
}

export async function removeCache(key: string): Promise<void> {
  await AsyncStorage.removeItem(cacheKey(key));
}

export function formatLastUpdated(isoDate?: string | Date | null): string {
  if (!isoDate) {
    return '--:--, --/--/----';
  }
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;
  if (isNaN(date.getTime())) {
    return '--:--, --/--/----';
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}
