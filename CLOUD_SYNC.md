# Geräteübergreifende Speicherung

Die Website speichert alle Eingaben weiterhin offline im Browser und synchronisiert sie zusätzlich über einen privaten Cloudflare Worker.

## Einmalige Einrichtung

1. In Cloudflare eine KV-Namespace erstellen.
2. `cloud/wrangler.toml.example` nach `cloud/wrangler.toml` kopieren und die KV-ID eintragen.
3. Im Verzeichnis `cloud` den Worker mit Wrangler deployen.
4. Für den Worker das Secret `SYNC_TOKEN` mit einem langen, zufälligen Wert setzen.
5. In GitHub das Repository-Secret `VITE_SYNC_ENDPOINT` mit der Worker-URL anlegen.
6. In der Jahresübersicht auf jedem Gerät dieselbe Worker-URL und denselben Synchronisationsschlüssel eingeben.

Der Synchronisationsschlüssel wird nur lokal auf den verbundenen Geräten gespeichert und nicht in die öffentliche Website eingebaut.
