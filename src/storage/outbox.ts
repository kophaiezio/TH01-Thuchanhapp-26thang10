import AsyncStorage from '@react-native-async-storage/async-storage';
import type {OutboxOperation} from '../types';
import {OUTBOX_KEY} from './keys';

let queue = Promise.resolve();

async function exclusive<T>(operation: () => Promise<T>): Promise<T> {
  const current = queue.then(operation, operation);
  queue = current.then(
    () => undefined,
    () => undefined,
  );
  return current;
}

async function readUnsafe(): Promise<OutboxOperation[]> {
  const value = await AsyncStorage.getItem(OUTBOX_KEY);
  return value === null ? [] : (JSON.parse(value) as OutboxOperation[]);
}

async function writeUnsafe(operations: OutboxOperation[]): Promise<void> {
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(operations));
}

export function readOutbox(): Promise<OutboxOperation[]> {
  return exclusive(readUnsafe);
}

export function enqueueOperation(
  operation: OutboxOperation,
): Promise<OutboxOperation[]> {
  return exclusive(async () => {
    const operations = await readUnsafe();
    const next = [...operations, operation];
    await writeUnsafe(next);
    return next;
  });
}

export function removeOutboxOperation(id: string): Promise<OutboxOperation[]> {
  return exclusive(async () => {
    const operations = await readUnsafe();
    const next = operations.filter(operation => operation.id !== id);
    await writeUnsafe(next);
    return next;
  });
}

export function clearOutbox(): Promise<void> {
  return exclusive(async () => {
    await AsyncStorage.removeItem(OUTBOX_KEY);
  });
}
