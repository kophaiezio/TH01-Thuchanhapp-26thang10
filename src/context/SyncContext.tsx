import React, {createContext, useContext} from 'react';
import {useNetworkStatus} from '../hooks/useNetworkStatus';
import {useOutboxSync} from '../hooks/useOutboxSync';
import type {OutboxOperation} from '../types';

export type SyncContextValue = {
  isOnline: boolean;
  isConnected: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
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

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export function SyncProvider({
  children,
  onSynced,
}: React.PropsWithChildren<{onSynced?: (count: number) => void}>): React.JSX.Element {
  const {
    isConnected,
    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
  } = useNetworkStatus();

  const {
    outbox,
    pendingCount,
    isSyncing,
    syncMessage,
    syncError,
    syncRevision,
    triggerSync,
    queueOperation,
    hasPendingSync,
    clearSyncMessage,
  } = useOutboxSync(isOnline, onSynced);

  const value: SyncContextValue = {
    isOnline,
    isConnected,
    isSimulatedOffline,
    toggleSimulatedOffline,
    outbox,
    pendingCount,
    isSyncing,
    syncMessage,
    syncError,
    syncRevision,
    triggerSync,
    queueOperation,
    hasPendingSync,
    clearSyncMessage,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync phải được dùng bên trong SyncProvider.');
  }
  return context;
}
