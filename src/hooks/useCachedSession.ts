import {useCallback} from 'react';
import {sessionService} from '../api/sessionService';
import type {ScheduleSession} from '../types';
import {useCachedQuery} from './useCachedQuery';

export function useCachedSession(
  id: string,
  initialData?: ScheduleSession,
) {
  const fetcher = useCallback(() => sessionService.getById(id), [id]);
  return useCachedQuery({
    key: `session_${id}`,
    fetcher,
    initialData,
  });
}
