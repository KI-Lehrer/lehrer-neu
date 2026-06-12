import { FormEvent, useState } from 'react';
import { getCloudSyncSettings, isCloudSyncConfigured, saveCloudSyncSettings } from '../services/cloudSync';

export default function CloudSyncPanel() {
  const settings = getCloudSyncSettings();
  const [visible, setVisible] = useState(!isCloudSyncConfigured());

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    saveCloudSyncSettings(String(data.get('endpoint') ?? ''), String(data.get('token') ?? ''));
  };

  return (
    <section className={`rounded-3xl border p-5 ${isCloudSyncConfigured() ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-extrabold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined">{isCloudSyncConfigured() ? 'cloud_done' : 'cloud_off'}</span>
            {isCloudSyncConfigured() ? 'Geräteübergreifende Speicherung aktiv' : 'Cloud-Speicherung noch nicht verbunden'}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">{isCloudSyncConfigured() ? 'Änderungen werden lokal gespeichert und automatisch mit verbundenen Geräten synchronisiert.' : 'Lokale Speicherung ist aktiv. Für mehrere Geräte den persönlichen Cloud-Endpunkt verbinden.'}</p>
        </div>
        <button type="button" onClick={() => setVisible((current) => !current)} className="px-4 py-2 rounded-xl bg-white border border-outline-variant font-bold text-sm">{visible ? 'Schließen' : 'Verbindung bearbeiten'}</button>
      </div>
      {visible && (
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <input name="endpoint" type="url" required defaultValue={settings.endpoint} placeholder="https://…workers.dev" className="px-3 py-2.5 rounded-xl border border-outline-variant" aria-label="Cloud-Endpunkt" />
          <input name="token" type="password" required defaultValue={settings.token} placeholder="Persönlicher Synchronisationsschlüssel" className="px-3 py-2.5 rounded-xl border border-outline-variant" aria-label="Synchronisationsschlüssel" />
          <button type="submit" className="justify-self-start px-5 py-2.5 rounded-xl bg-primary text-white font-bold">Verbinden und synchronisieren</button>
        </form>
      )}
    </section>
  );
}
