export type SyncState = 'local' | 'syncing' | 'synced' | 'error';

interface CloudRecord<T> {
  value: T;
  updatedAt: number;
}

const DEFAULT_SYNC_ENDPOINT = 'https://lehrerplaner-sync.schulgeraete.workers.dev';
const LEGACY_SYNC_ORIGIN = 'https://lehrerplaner-sync.luescher-sascha.workers.dev';

// Existing browsers and build settings may still carry the previous account subdomain.
const normalizeEndpoint = (endpoint: string) => {
  const value = endpoint.trim().replace(/\/$/, '');
  try {
    const url = new URL(value);
    if (url.origin === LEGACY_SYNC_ORIGIN) {
      url.hostname = 'lehrerplaner-sync.schulgeraete.workers.dev';
      return url.toString().replace(/\/$/, '');
    }
  } catch { /* Keep custom settings unchanged; fetch will report invalid URLs. */ }
  return value;
};
const getEndpoint = () => {
  const stored = window.localStorage.getItem('lehrerplaner.sync-endpoint');
  const endpoint = normalizeEndpoint(stored || import.meta.env.VITE_SYNC_ENDPOINT || DEFAULT_SYNC_ENDPOINT);
  if (stored && endpoint !== stored) window.localStorage.setItem('lehrerplaner.sync-endpoint', endpoint);
  return endpoint;
};
const getToken = () => window.localStorage.getItem('lehrerplaner.sync-token') || '';

export const isCloudSyncConfigured = () => Boolean(getEndpoint() && getToken());

export const getCloudSyncSettings = () => ({ endpoint: getEndpoint(), token: getToken() });

export const saveCloudSyncSettings = (endpoint: string, token: string) => {
  window.localStorage.setItem('lehrerplaner.sync-endpoint', normalizeEndpoint(endpoint));
  window.localStorage.setItem('lehrerplaner.sync-token', token.trim());
  window.location.reload();
};

const notify = (state: SyncState) => {
  window.dispatchEvent(new CustomEvent<SyncState>('lehrerplaner-sync-state', { detail: state }));
};

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

export async function readCloudValue<T>(key: string): Promise<CloudRecord<T> | null | undefined> {
  const endpoint = getEndpoint();
  if (!endpoint || !getToken()) return null;
  notify('syncing');
  try {
    const response = await fetch(`${endpoint}?key=${encodeURIComponent(key)}`, { headers: headers() });
    if (response.status === 404) {
      notify('synced');
      return null;
    }
    if (!response.ok) throw new Error(`Cloud-Speicherung antwortete mit ${response.status}.`);
    const record = await response.json() as CloudRecord<T>;
    notify('synced');
    return record;
  } catch (error) {
    console.error(error);
    notify('error');
    return undefined;
  }
}

export async function writeCloudValue<T>(key: string, value: T, updatedAt: number) {
  const endpoint = getEndpoint();
  if (!endpoint || !getToken()) return;
  notify('syncing');
  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ key, value, updatedAt }),
    });
    if (!response.ok) throw new Error(`Cloud-Speicherung antwortete mit ${response.status}.`);
    notify('synced');
  } catch (error) {
    console.error(error);
    notify('error');
  }
}
