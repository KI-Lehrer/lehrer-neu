import { useEffect, useState } from 'react';
import { isCloudSyncConfigured, SyncState } from '../services/cloudSync';
import { ViewTab } from '../types';

export default function SyncStatus({ navigate }: { navigate: (tab: ViewTab) => void }) {
  const [state, setState] = useState<SyncState>(isCloudSyncConfigured() ? 'synced' : 'local');

  useEffect(() => {
    const update = (event: Event) => setState((event as CustomEvent<SyncState>).detail);
    window.addEventListener('lehrerplaner-sync-state', update);
    return () => window.removeEventListener('lehrerplaner-sync-state', update);
  }, []);

  const content = state === 'syncing'
    ? { icon: 'sync', label: 'Synchronisiert…', color: 'text-primary' }
    : state === 'synced'
      ? { icon: 'cloud_done', label: 'Cloud gespeichert', color: 'text-secondary' }
      : state === 'error'
        ? { icon: 'cloud_off', label: 'Sync-Fehler', color: 'text-error' }
        : { icon: 'save', label: 'Lokal gespeichert', color: 'text-on-surface-variant' };

  return (
    <button type="button" onClick={() => navigate('jahresuebersicht')} className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-[11px] font-bold ${content.color}`} title="Speicherung und Cloud-Verbindung öffnen">
      <span className="material-symbols-outlined text-[16px]">{content.icon}</span>
      {content.label}
    </button>
  );
}
