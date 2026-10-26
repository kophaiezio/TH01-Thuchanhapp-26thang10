export const CACHE_PREFIX = '@learning-app/cache/';
export const OUTBOX_KEY = '@learning-app/outbox';

export function cacheKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}
