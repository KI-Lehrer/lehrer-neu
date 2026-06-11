# LehrerPlaner

Ein lokaler, datenschutzbewusster Planer für Unterricht, Wochenplanung und Aufgaben.

## Funktionen

- Dynamische Tages-, Wochen- und Jahresübersicht
- Stundenplan mit Gruppenfiltern und Druckansicht
- Automatisch gespeicherte Tages-, Wochen- und Lektionsnotizen
- Aufgaben mit Kategorien, Filtern und Erledigt-Status
- Umschaltbarer Planer `25/26` mit eigenem Stundenplan und Zeitraum vom 12.06.2026 bis 03.07.2026
- JSON-Export der Tagesplanung
- Keine Schülernamen oder Kontaktadressen im Frontend-Bundle

Alle Planungsdaten werden ausschliesslich im `localStorage` des verwendeten Browsers gespeichert. Besonders schützenswerte Personendaten gehören nicht in lokale Notizen.

## Entwicklung

```bash
npm install
npm run dev
npm run check
```
