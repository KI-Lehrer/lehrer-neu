# Geräteübergreifende Speicherung

Die Website speichert alle Eingaben weiterhin offline im Browser und synchronisiert sie zusätzlich über einen privaten Cloudflare Worker.

## Einmalige Einrichtung

Der Cloudflare-Endpunkt ist eingerichtet:

`https://lehrerplaner-sync.schulgeraete.workers.dev`

Auf einem weiteren Gerät muss in der Jahresübersicht nur noch derselbe persönliche Synchronisationsschlüssel eingegeben werden.

Der Synchronisationsschlüssel wird nur lokal auf den verbundenen Geräten gespeichert und nicht in die öffentliche Website eingebaut.

## Adressumstellung am 6. November 2026

Die Cloudflare-Konto-Unterdomain wurde auf `schulgeraete.workers.dev` geändert. Der Lehrerplaner verwendet nun den neuen Endpunkt. Bereits im Browser gespeicherte Einstellungen und ein alter Endpunkt aus der Build-Konfiguration werden beim Laden automatisch auf die neue Adresse umgestellt. Der vorhandene Synchronisationsschlüssel und lokale Planungsdaten bleiben erhalten. Andere selbst eingetragene Endpunkte bleiben unverändert.

Auf jedem Gerät die Website einmal neu laden. Unter **Verbindung bearbeiten** muss `https://lehrerplaner-sync.schulgeraete.workers.dev` stehen. Falls ein Gerät noch eine ältere zwischengespeicherte App verwendet, die Adresse dort manuell eintragen und den vorhandenen Synchronisationsschlüssel beibehalten.
