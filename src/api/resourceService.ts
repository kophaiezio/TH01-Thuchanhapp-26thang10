import type {ApiResource} from '../types';
import {request} from './client';

export function createResourceService<T extends {id: string}>(
  resource: ApiResource,
) {
  return {
    list: (params?: Record<string, string>) => {
      const query = params
        ? '?' +
          Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&')
        : '';
      return request<T[]>(`/${resource}${query}`);
    },
    getById: (id: string) =>
      request<T>(`/${resource}/${encodeURIComponent(id)}`),
    create: (value: T) =>
      request<T>(`/${resource}`, {
        method: 'POST',
        body: JSON.stringify(value),
      }),
    patch: (id: string, changes: Partial<T>) =>
      request<T>(`/${resource}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
      }),
    delete: (id: string) =>
      request<void>(`/${resource}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
  };
}
