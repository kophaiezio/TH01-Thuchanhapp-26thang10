import type {OutboxOperation} from '../types';
import {shouldApplyOfflinePatch} from '../utils/conflictResolution';
import {request} from './client';

export async function applyOutboxOperation(
  operation: OutboxOperation,
): Promise<void> {
  const entityPath = `/${operation.resource}/${encodeURIComponent(
    operation.entityId,
  )}`;

  if (operation.method === 'PATCH') {
    const serverEntity = await request<{updatedAt?: string}>(entityPath);
    if (
      !shouldApplyOfflinePatch(serverEntity.updatedAt, operation.updatedAt)
    ) {
      return;
    }

    await request<unknown>(entityPath, {
      method: 'PATCH',
      body: JSON.stringify({
        ...operation.payload,
        updatedAt: operation.updatedAt,
      }),
    });
    return;
  }

  if (operation.method === 'POST') {
    await request<unknown>(`/${operation.resource}`, {
      method: 'POST',
      body: JSON.stringify(operation.payload),
    });
    return;
  }

  await request<unknown>(entityPath, {method: 'DELETE'});
}
