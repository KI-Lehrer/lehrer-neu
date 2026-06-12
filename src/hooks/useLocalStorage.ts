import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { isCloudSyncConfigured, readCloudValue, writeCloudValue } from '../services/cloudSync';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readLocal = () => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : initialValue;
    } catch {
      return initialValue;
    }
  };
  const [value, setValue] = useState<T>(readLocal);
  const hydratedKey = useRef(isCloudSyncConfigured() ? '' : key);
  const changeTimestamp = useRef(Number(window.localStorage.getItem(`${key}.__updatedAt`)) || 0);

  useEffect(() => {
    setValue(readLocal());
    changeTimestamp.current = Number(window.localStorage.getItem(`${key}.__updatedAt`)) || 0;
    hydratedKey.current = isCloudSyncConfigured() ? '' : key;

    let active = true;
    const pullCloud = async () => {
      const cloud = await readCloudValue<T>(key);
      if (!active) return;
      if (cloud && cloud.updatedAt > changeTimestamp.current) {
        changeTimestamp.current = cloud.updatedAt;
        window.localStorage.setItem(key, JSON.stringify(cloud.value));
        window.localStorage.setItem(`${key}.__updatedAt`, String(cloud.updatedAt));
        setValue(cloud.value);
      } else if (cloud === null && isCloudSyncConfigured()) {
        const localValue = readLocal();
        const timestamp = changeTimestamp.current || Date.now();
        changeTimestamp.current = timestamp;
        void writeCloudValue(key, localValue, timestamp);
      }
      hydratedKey.current = key;
    };
    void pullCloud();
    const polling = isCloudSyncConfigured() ? window.setInterval(() => void pullCloud(), 30_000) : undefined;

    const onStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue) setValue(JSON.parse(event.newValue) as T);
    };
    window.addEventListener('storage', onStorage);
    return () => {
      active = false;
      if (polling) window.clearInterval(polling);
      window.removeEventListener('storage', onStorage);
    };
  }, [key]);

  useEffect(() => {
    if (hydratedKey.current !== key) return;
    const timestamp = Date.now();
    changeTimestamp.current = timestamp;
    window.localStorage.setItem(key, JSON.stringify(value));
    window.localStorage.setItem(`${key}.__updatedAt`, String(timestamp));
    const timeout = window.setTimeout(() => void writeCloudValue(key, value, timestamp), 500);
    return () => window.clearTimeout(timeout);
  }, [key, value]);

  return [value, setValue as Dispatch<SetStateAction<T>>] as const;
}
