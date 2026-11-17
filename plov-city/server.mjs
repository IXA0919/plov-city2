import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve, extname } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const storeDir = resolve(root, 'data');
const storeFile = resolve(storeDir, 'store.json');
const port = Number(process.env.PORT || 3000);
const username = process.env.ADMIN_USERNAME;
let passwordHash = process.env.ADMIN_PASSWORD_HASH || (process.env.ADMIN_PASSWORD ? hashPassword(process.env.ADMIN_PASSWORD) : '');
const sessions = new Map();
const attempts = new Map();

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return salt + ':' + scryptSync(password, salt, 64).toString('hex');
}
function verifyPassword(password, saved) {
  if (!saved || !saved.includes(':')) return false;
  const [salt, digest] = saved.split(':');
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, 'hex');
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
async function readStore() {
  try { return JSON.parse(await readFile(storeFile, 'utf8')); }
  catch { return { menu: null, orders: [], visitors: [] }; }
}
async function saveStore(data) {
  await mkdir(storeDir, { recursive: true });
  const tmp = storeFile + '.tmp';
  await writeFile(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
  const { rename } = await import('node:fs/promises');
  await rename(tmp, storeFile);
}
function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(body));
}
async function body(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new Error('So‘rov hajmi juda katta.');
  }
  return raw ? JSON.parse(raw) : {};
}
function sessionId(req) {
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)plov_admin_session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}
function isAdmin(req) {
  const id = sessionId(req), expiry = sessions.get(id);
  if (!id || !expiry || expiry < Date.now()) { sessions.delete(id); return false; }
  sessions.set(id, Date.now() + 8 * 60 * 60 * 1000);
  return true;
}
function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  send(res, 401, { error: 'Admin tizimiga qayta kiring.' }); return false;
}
const mime = { '.html':'text/html; charset=utf-8', '.jpg':'image/jpeg', '.json':'application/json; charset=utf-8', '.css':'text/css', '.js':'text/javascript' };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/api/menu') {
      const data = await readStore(); send(res, 200, { menu: data.menu }); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/orders') {
      const order = await body(req);
      if (!order || typeof order.orderNum !== 'string' || !Array.isArray(order.items) || order.items.length > 100) {
        send(res, 400, { error: 'Buyurtma ma’lumotlari noto‘g‘ri.' }); return;
      }
      const data = await readStore(); data.orders.unshift(order); data.orders = data.orders.slice(0, 5000); await saveStore(data);
      send(res, 201, { ok: true }); return;
    }
    if (req.method === 'GET' && url.pathname === '/api/admin/session') {
      send(res, 200, { authenticated: isAdmin(req) }); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/admin/login') {
      const ip = req.socket.remoteAddress || 'unknown';
      const state = attempts.get(ip) || { count: 0, until: 0 };
      if (state.until > Date.now()) { send(res, 429, { error: 'Ko‘p urinish bo‘ldi. Birozdan keyin qayta urinib ko‘ring.' }); return; }
      const input = await body(req);
      const stored=await readStore(); const valid = username && (input.username || '') === username && verifyPassword(input.password || '', stored.adminPasswordHash || passwordHash);
      if (!valid) {
        state.count++; if (state.count >= 6) { state.count = 0; state.until = Date.now() + 10 * 60 * 1000; }
        attempts.set(ip, state); send(res, 401, { error: 'Login yoki parol noto‘g‘ri.' }); return;
      }
      attempts.delete(ip);
      const id = randomBytes(32).toString('hex'); sessions.set(id, Date.now() + 8 * 60 * 60 * 1000);
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      send(res, 200, { ok: true }, { 'Set-Cookie': 'plov_admin_session=' + id + '; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800' + secure }); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/admin/logout') {
      sessions.delete(sessionId(req)); send(res, 200, { ok: true }, { 'Set-Cookie': 'plov_admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' }); return;
    }
    if (url.pathname.startsWith('/api/admin/')) {
      if (!requireAdmin(req, res)) return;
      const data = await readStore();
      if (req.method === 'GET' && url.pathname === '/api/admin/orders') { send(res, 200, { orders: data.orders }); return; }
      if (req.method === 'PUT' && url.pathname === '/api/admin/menu') {
        const input = await body(req);
        if (!Array.isArray(input.menu) || input.menu.length > 500) { send(res, 400, { error: 'Menyu ma’lumotlari noto‘g‘ri.' }); return; }
        data.menu = input.menu; await saveStore(data); send(res, 200, { ok: true }); return;
      }
      if (req.method === 'DELETE' && url.pathname === '/api/admin/orders') { data.orders = []; await saveStore(data); send(res, 200, { ok: true }); return; }
      if (url.pathname.startsWith('/api/admin/orders/')) {
        const orderNum = decodeURIComponent(url.pathname.slice('/api/admin/orders/'.length));
        const index = data.orders.findIndex(o => o.orderNum === orderNum);
        if (index < 0) { send(res, 404, { error: 'Buyurtma topilmadi.' }); return; }
        if (req.method === 'DELETE') data.orders.splice(index, 1);
        else if (req.method === 'PATCH') {
          const input = await body(req);
          if (!['Yangi','Tayyorlanmoqda','Yetkazildi','Bekor qilindi'].includes(input.status)) { send(res, 400, { error: 'Buyurtma holati noto‘g‘ri.' }); return; }
          data.orders[index].status = input.status;
        } else { send(res, 405, { error: 'Method not allowed.' }); return; }
        await saveStore(data); send(res, 200, { ok: true }); return;
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/password') {
        const input = await body(req);
        if (!verifyPassword(input.currentPassword || '', data.adminPasswordHash || passwordHash)) { send(res, 401, { error: 'Joriy parol noto‘g‘ri.' }); return; }
        if (typeof input.newPassword !== 'string' || input.newPassword.length < 10) { send(res, 400, { error: 'Yangi parol kamida 10 ta belgidan iborat bo‘lsin.' }); return; }
        passwordHash = hashPassword(input.newPassword); data.adminPasswordHash=passwordHash; await saveStore(data);
        send(res, 200, { ok: true }); return;
      }
      send(res, 404, { error: 'API manzili topilmadi.' }); return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { send(res, 405, { error: 'Method not allowed.' }); return; }
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const file = resolve(root, '.' + pathname);
    if ((file !== root && !file.startsWith(root + '\\')) || file === storeDir || file.startsWith(storeDir + '\\')) { send(res, 404, { error: 'Topilmadi.' }); return; }
    try {
      const stat = await import('node:fs/promises').then(m => m.stat(file));
      if (!stat.isFile()) throw new Error('not file');
      res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
      if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(res);
    } catch { send(res, 404, { error: 'Topilmadi.' }); }
  } catch (error) {
    console.error(error); send(res, 400, { error: 'So‘rovni qayta ishlashda xatolik.' });
  }
});
if (!username || !passwordHash) {
  console.error('ADMIN_USERNAME va ADMIN_PASSWORD (yoki ADMIN_PASSWORD_HASH) ni muhit o‘zgaruvchilarida sozlang.');
  process.exit(1);
}

server.listen(port, () => console.log('Plov City server http://localhost:' + port));

