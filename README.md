# LehrerPlaner

Ein lokaler, datenschutzbewusster Planer für Unterricht, Wochenplanung und Aufgaben.

## Funktionen

- Dynamische Tages-, Wochen- und Jahresübersicht
- Stundenplan mit Gruppenfiltern und Druckansicht
- Automatisch gespeicherte Tages-, Wochen- und Lektionsnotizen
- Aufgaben mit Kategorien, Filtern und Erledigt-Status
- JSON-Export der Tagesplanung
- Keine Schülernamen oder Kontaktadressen im Frontend-Bundle

Alle Planungsdaten werden ausschliesslich im `localStorage` des verwendeten Browsers gespeichert. Besonders schützenswerte Personendaten gehören nicht in lokale Notizen.

## Entwicklung

```bash
npm install
npm run dev
npm run check
```
