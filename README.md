# Vereinsraum Web-App (PWA)

## Starten
Eine installierbare PWA muss über HTTPS oder lokal über einen Webserver geöffnet werden.

### Auf dem Mac testen
1. Terminal im Ordner öffnen.
2. `python3 -m http.server 8080` ausführen.
3. Im Browser `http://localhost:8080` öffnen.

### Auf iPhone/iPad installieren
1. Den Ordner auf einen HTTPS-Webserver hochladen.
2. Die Adresse in Safari öffnen.
3. Teilen → **Zum Home-Bildschirm**.

## Dateien
- `index.html`: komplette App
- `manifest.webmanifest`: App-Name, Farben und Icons
- `service-worker.js`: Offline-Cache
- `icon-*.png`: App-Icons

Hinweis: Die App speichert lokale Daten weiterhin im Browser-Speicher des jeweiligen Geräts. Für gemeinsame Daten auf mehreren Geräten wäre zusätzlich ein Backend mit Anmeldung und Datenbank nötig.
