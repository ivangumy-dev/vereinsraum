# Vereinsraum – eigener Server für OMV

Diese App läuft komplett bei euch, mit echter geteilter Datenbank für alle Geräte.

## Voraussetzung

Auf OMV muss das Plugin **openmediavault-compose** installiert sein
(System → Plugins → nach "compose" suchen → installieren).

## Installation

1. Diesen ganzen Ordner (`vereinsraum-server`) auf euer NAS kopieren,
   z. B. per SMB-Freigabe (Datengrab o. ä.) in einen eigenen Ordner,
   z. B. `/sharedfolders/docker/vereinsraum/`

2. In OMV: **Compose** (im Menü) → **Files** → **+** (neue Datei)
   - Name: `vereinsraum`
   - Pfad auf den Ordner mit der `docker-compose.yml` zeigen lassen
     (oder Inhalt der Datei direkt reinkopieren)

3. **Up** anklicken (baut den Container und startet ihn)

4. Fertig! Die App ist erreichbar unter:
   - Im Heim-WLAN: `http://<NAS-IP>:8420`
   - Über Tailscale (von überall): `http://100.76.112.69:8420`
     (deine Tailscale-Adresse aus der anderen Unterhaltung)

## Daten

Alle Vereinsdaten (Mitglieder, Kasse, Kalender, Chat usw.) liegen in
`./data/db.json` neben der docker-compose.yml – das ist gleichzeitig
euer Backup. Diese Datei regelmässig sichern.

## Auf den Home-Bildschirm

Wie gehabt: Adresse in Safari öffnen → Teilen-Symbol → "Zum Home-Bildschirm".
Jetzt zeigen alle Geräte immer denselben, aktuellen Stand.

## Ohne Docker/Portainer (Alternative)

Falls Compose nicht installiert werden soll: SSH auf die NAS, dann im
Ordner `vereinsraum-server`:

```
npm install
npm start
```

Läuft dann direkt mit Node.js auf Port 3000 (in server.js oder per
Umgebungsvariable PORT änderbar).
