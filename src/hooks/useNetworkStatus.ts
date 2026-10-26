import {useEffect, useState} from 'react';
import NetInfo, {type NetInfoState} from '@react-native-community/netinfo';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  setSimulatedOffline: (simulated: boolean) => void;
  toggleSimulatedOffline: () => void;
};

// Global state for simulated offline across components if needed
let globalSimulatedOffline = false;
const simulatedListeners = new Set<(val: boolean) => void>();

export function useNetworkStatus(): NetworkStatus {
  const [netInfo, setNetInfo] = useState<NetInfoState | null>(null);
  const [isSimulatedOffline, setIsSimulatedOfflineState] = useState(
    globalSimulatedOffline,
  );

  useEffect(() => {
    const listener = (val: boolean) => setIsSimulatedOfflineState(val);
    simulatedListeners.add(listener);

    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state);
    });

    return () => {
      simulatedListeners.delete(listener);
      unsubscribe();
    };
  }, []);

  const setSimulatedOffline = (simulated: boolean) => {
    globalSimulatedOffline = simulated;
    simulatedListeners.forEach(listener => listener(simulated));
  };

  const toggleSimulatedOffline = () => {
    setSimulatedOffline(!globalSimulatedOffline);
  };

  const rawOnline =
    netInfo?.isConnected === true && netInfo.isInternetReachable !== false;
  const isOnline = !isSimulatedOffline && Boolean(rawOnline);

  return {
    isConnected: Boolean(netInfo?.isConnected),
    isInternetReachable: netInfo?.isInternetReachable ?? null,
    isOnline,
    isSimulatedOffline,
    setSimulatedOffline,
    toggleSimulatedOffline,
  };
}
