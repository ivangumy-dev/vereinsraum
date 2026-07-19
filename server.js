const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const MIXES_DIR = path.join(DATA_DIR, "mixes");
const PHOTOS_DIR = path.join(DATA_DIR, "photos");
const BACKUPS_DIR = path.join(DATA_DIR, "backups");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "{}", "utf8");
if (!fs.existsSync(MIXES_DIR)) fs.mkdirSync(MIXES_DIR, { recursive: true });
if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });
if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });

function makeBackup() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dest = path.join(BACKUPS_DIR, `db-${stamp}.json`);
  fs.copyFileSync(DB_FILE, dest);
  // Nur die letzten 60 Backups behalten (sonst wächst der Ordner endlos)
  const files = fs.readdirSync(BACKUPS_DIR).filter((f) => f.startsWith("db-")).sort();
  while (files.length > 60) {
    fs.unlinkSync(path.join(BACKUPS_DIR, files.shift()));
  }
  return dest;
}
// Tägliches automatisches Backup, zusätzlich zum Backup beim Abmelden
setInterval(makeBackup, 24 * 60 * 60 * 1000);
makeBackup(); // gleich beim Start eins erstellen

function makeUploader(dir, maxSize) {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, dir),
      filename: (req, file, cb) => {
        const safe = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        cb(null, safe);
      },
    }),
    limits: { fileSize: maxSize },
  });
}
const upload = makeUploader(MIXES_DIR, 250 * 1024 * 1024); // 250 MB pro Mix
const uploadPhoto = makeUploader(PHOTOS_DIR, 20 * 1024 * 1024); // 20 MB pro Foto

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return {};
  }
}
function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db), "utf8");
}

app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/mixes", express.static(MIXES_DIR));
app.use("/photos", express.static(PHOTOS_DIR));

// ---- DJ-Mixe hochladen (echte Audiodatei, liegt auf dem eigenen Server) ----
app.post("/api/mixes/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Keine Datei erhalten" });
  res.json({ url: "/mixes/" + req.file.filename, filename: req.file.filename });
});

// ---- Fotos hochladen (Bildergalerie) ----
app.post("/api/photos/upload", uploadPhoto.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Keine Datei erhalten" });
  res.json({ url: "/photos/" + req.file.filename, filename: req.file.filename });
});

// ---- Backup ----
app.post("/api/backup", (req, res) => {
  try {
    const dest = makeBackup();
    res.json({ ok: true, file: path.basename(dest), time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});
app.get("/api/backup/list", (req, res) => {
  const files = fs.readdirSync(BACKUPS_DIR).filter((f) => f.startsWith("db-")).sort().reverse();
  res.json({ files: files.slice(0, 20) });
});

// ---- Speicher-API (ersetzt Claude's window.storage, echtes Backend) ----
app.get("/api/storage", (req, res) => {
  const prefix = req.query.prefix || "";
  const db = readDb();
  const keys = Object.keys(db).filter((k) => k.startsWith(prefix));
  res.json({ keys, prefix, shared: true });
});

app.get("/api/storage/:key", (req, res) => {
  const db = readDb();
  const key = req.params.key;
  if (!(key in db)) return res.status(404).json(null);
  res.json({ key, value: db[key], shared: true });
});

app.put("/api/storage/:key", (req, res) => {
  const db = readDb();
  const key = req.params.key;
  db[key] = req.body.value;
  writeDb(db);
  res.json({ key, value: db[key], shared: true });
});

app.delete("/api/storage/:key", (req, res) => {
  const db = readDb();
  const key = req.params.key;
  const existed = key in db;
  delete db[key];
  writeDb(db);
  res.json({ key, deleted: existed, shared: true });
});

// Alles andere -> die App ausliefern (Single Page App)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Vereinsraum-Server läuft auf Port ${PORT}`);
});
