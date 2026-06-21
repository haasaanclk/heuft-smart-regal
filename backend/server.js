// HEUFT Smart Regal System — Auth & data backend
// Express + JWT + RBAC (Role-Based Access Control)
//
// Çalıştırma / Start:
//   cd heuft_regal_system/backend
//   npm install
//   npm start            -> http://localhost:4000
//
// Frontend (HEUFT_Sunum.html) bu API'ye fetch ile bağlanacak şekilde
// genişletilebilir. Şu an tek-dosya HTML istemci tarafı auth ile çalışır;
// bu sunucu, gerçek kullanıcı yönetimi/kalıcı veri için hazır iskelettir.

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JWT_SECRET = process.env.JWT_SECRET || 'heuft-dev-secret-change-me';
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'data.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ---- Basit JSON veri deposu (Datenspeicher) ----
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = {
      users: [
        { id: 1, user: 'admin', name: 'Hasan Çelik', role: 'admin',
          hash: bcrypt.hashSync('1234', 8) },
        { id: 2, user: 'operator', name: 'Operatör', role: 'operator',
          hash: bcrypt.hashSync('1234', 8) }
      ],
      ARTS: [], RFIDS: [], RD: [], AUDIT: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function saveDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

// ---- Auth middleware ----
function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'no_token' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'invalid_token' }); }
}
// RBAC: belirli rolleri zorunlu kıl
function requireRole(...roles) {
  return (req, res, next) =>
    roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'forbidden' });
}
function log(db, user, action, target) {
  db.AUDIT.unshift({ user, action, target, ts: new Date().toISOString() });
  if (db.AUDIT.length > 500) db.AUDIT.pop();
}

// ---- Routes ----
app.post('/api/login', (req, res) => {
  const { user, pass } = req.body || {};
  const db = loadDB();
  const u = db.users.find(x => x.user === String(user || '').toLowerCase());
  if (!u || !bcrypt.compareSync(String(pass || ''), u.hash))
    return res.status(401).json({ error: 'auth_fail' });
  const token = jwt.sign({ id: u.id, user: u.user, role: u.role, name: u.name },
    JWT_SECRET, { expiresIn: '12h' });
  log(db, u.user, 'login', '-'); saveDB(db);
  res.json({ token, user: { user: u.user, name: u.name, role: u.role } });
});

app.post('/api/change-password', auth, (req, res) => {
  const { newPass } = req.body || {};
  if (!newPass) return res.status(400).json({ error: 'missing' });
  const db = loadDB();
  const u = db.users.find(x => x.id === req.user.id);
  u.hash = bcrypt.hashSync(String(newPass), 8);
  log(db, u.user, 'change_pass', u.user); saveDB(db);
  res.json({ ok: true });
});

// Veri okuma — her oturum açmış kullanıcı
app.get('/api/state', auth, (req, res) => {
  const db = loadDB();
  res.json({ ARTS: db.ARTS, RFIDS: db.RFIDS, RD: db.RD });
});

// Veri yazma — sadece admin (RBAC)
app.put('/api/state', auth, requireRole('admin'), (req, res) => {
  const db = loadDB();
  ['ARTS', 'RFIDS', 'RD'].forEach(k => { if (req.body[k]) db[k] = req.body[k]; });
  log(db, req.user.user, 'update_state', '-'); saveDB(db);
  res.json({ ok: true });
});

app.get('/api/audit', auth, requireRole('admin'), (req, res) => {
  res.json(loadDB().AUDIT.slice(0, 100));
});

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'heuft-regal' }));

app.listen(PORT, () => console.log(`HEUFT backend -> http://localhost:${PORT}`));
