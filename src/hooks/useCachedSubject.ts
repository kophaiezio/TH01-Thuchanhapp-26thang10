import {useCallback} from 'react';
import {courseService} from '../api/courseService';
import type {Subject} from '../types';
import {useCachedQuery} from './useCachedQuery';

export function useCachedSubject(id: string, initialData?: Subject) {
  const fetcher = useCallback(() => courseService.getById(id), [id]);
  return useCachedQuery({
    key: `course_${id}`,
    fetcher,
    initialData,
  });
}
