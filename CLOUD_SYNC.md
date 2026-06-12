# Geräteübergreifende Speicherung

Die Website speichert alle Eingaben weiterhin offline im Browser und synchronisiert sie zusätzlich über einen privaten Cloudflare Worker.

## Einmalige Einrichtung

Der Cloudflare-Endpunkt ist eingerichtet:

`https://lehrerplaner-sync.luescher-sascha.workers.dev`

Auf einem weiteren Gerät muss in der Jahresübersicht nur noch derselbe persönliche Synchronisationsschlüssel eingegeben werden.

Der Synchronisationsschlüssel wird nur lokal auf den verbundenen Geräten gespeichert und nicht in die öffentliche Website eingebaut.
