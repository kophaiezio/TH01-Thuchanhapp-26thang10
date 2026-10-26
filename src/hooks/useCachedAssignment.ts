import {useCallback} from 'react';
import {assignmentService} from '../api/assignmentService';
import type {Assignment} from '../types';
import {useCachedQuery} from './useCachedQuery';

export function useCachedAssignment(id: string, initialData?: Assignment) {
  const fetcher = useCallback(() => assignmentService.getById(id), [id]);
  return useCachedQuery({
    key: `assignment_${id}`,
    fetcher,
    initialData,
  });
}
