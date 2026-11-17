import { createHmac, timingSafeEqual, scryptSync, randomBytes } from 'node:crypto';

const STORE_KEY = 'plov-city:store:v1';
const cookieName = 'pc_admin_session';
const sessions = new Map();
const failedLogins = new Map();

function json(res, status, payload, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(payload));
}
function safeEqual(a, b) {
  const left = Buffer.from(String(a ?? ''));
  const right = Buffer.from(String(b ?? ''));
  return left.length === right.length && timingSafeEqual(left, right);
}
function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return salt + ':' + scryptSync(password, salt, 64).toString('hex');
}
function verifyPassword(password, saved) {
  if (!saved || !saved.includes(':')) return false;
  const [salt, digest] = saved.split(':');
  const expected = Buffer.from(digest, 'hex');
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    const error = new Error('Vercel loyihasida Upstash Redis ulanmagan. Storage → Create Database orqali Redis ulang va redeploy qiling.');
    error.status = 503;
    throw error;
  }
  return { url, token };
}
async function redisCommand(command) {
  const { url, token } = getRedisConfig();
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  const result = await response.json();
  if (!response.ok || result.error) throw new Error(result.error || 'Redis bilan aloqa xatosi.');
  return result.result;
}
async function readStore() {
  const value = await redisCommand(['GET', STORE_KEY]);
  if (!value) return { menu: null, orders: [], adminPasswordHash: null };
  const parsed = JSON.parse(value);
  return { menu: null, orders: [], adminPasswordHash: null, ...parsed };
}
async function saveStore(store) {
  await redisCommand(['SET', STORE_KEY, JSON.stringify(store)]);
}
async function readBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};
    return req.body || {};
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}
function routePath(req) {
  const raw = req.query?.path ?? new URL(req.url, 'http://localhost').searchParams.get('path') ?? '';
  return (Array.isArray(raw) ? raw.join('/') : String(raw)).replace(/^\/+|\/+$/g, '');
}
function getCookie(req, name) {
  const raw = req.headers.cookie || '';
  const match = raw.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[1]) : '';
}
function sessionSignature(expiry) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
  return createHmac('sha256', secret).update(String(expiry)).digest('base64url');
}
function hasAdminSession(req) {
  const token = getCookie(req, cookieName);
  const [expiryText, signature] = token.split('.');
  const expiry = Number(expiryText);
  if (!expiry || expiry < Math.floor(Date.now() / 1000) || !signature) return false;
  return safeEqual(signature, sessionSignature(expiry));
}
function cookieHeader(req, value, maxAge) {
  const secure = req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return cookieName + '=' + encodeURIComponent(value) + '; HttpOnly; SameSite=Strict; Path=/; Max-Age=' + maxAge + secure;
}
function requireAdmin(req, res) {
  if (hasAdminSession(req)) return true;
  json(res, 401, { error: 'Admin tizimiga qayta kiring.' });
  return false;
}
function currentOrderId(path) {
  return decodeURIComponent(path.slice('admin/orders/'.length));
}

export default async function handler(req, res) {
  try {
    const path = routePath(req);
    if (req.method === 'GET' && path === 'menu') {
      const store = await readStore();
      json(res, 200, { menu: store.menu });
      return;
    }
    if (req.method === 'POST' && path === 'orders') {
      const order = await readBody(req);
      if (!order || typeof order.orderNum !== 'string' || !Array.isArray(order.items) || order.items.length > 100) {
        json(res, 400, { error: 'Buyurtma ma’lumotlari noto‘g‘ri.' });
        return;
      }
      const store = await readStore();
      store.orders.unshift(order);
      store.orders = store.orders.slice(0, 5000);
      await saveStore(store);
      json(res, 201, { ok: true });
      return;
    }
    if (req.method === 'GET' && path === 'admin/session') {
      json(res, 200, { authenticated: hasAdminSession(req) });
      return;
    }
    if (req.method === 'POST' && path === 'admin/login') {
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
      const lock = failedLogins.get(ip);
      if (lock?.until > Date.now()) {
        json(res, 429, { error: 'Juda ko‘p urinish bo‘ldi. Keyinroq qayta urinib ko‘ring.' });
        return;
      }
      const input = await readBody(req);
      const store = await readStore();
      const configuredUsername = process.env.ADMIN_USERNAME || 'owner';
      const configuredPassword = process.env.ADMIN_PASSWORD || '';
      const validPassword = store.adminPasswordHash
        ? verifyPassword(input.password || '', store.adminPasswordHash)
        : safeEqual(input.password, configuredPassword);
      if (!configuredPassword || !safeEqual(input.username, configuredUsername) || !validPassword) {
        const state = lock || { count: 0, until: 0 };
        state.count++;
        if (state.count >= 6) { state.count = 0; state.until = Date.now() + 10 * 60 * 1000; }
        failedLogins.set(ip, state);
        json(res, 401, { error: 'Login yoki parol noto‘g‘ri.' });
        return;
      }
      failedLogins.delete(ip);
      const expiry = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
      const token = expiry + '.' + sessionSignature(expiry);
      json(res, 200, { ok: true }, { 'Set-Cookie': cookieHeader(req, token, 8 * 60 * 60) });
      return;
    }
    if (req.method === 'POST' && path === 'admin/logout') {
      json(res, 200, { ok: true }, { 'Set-Cookie': cookieHeader(req, '', 0) });
      return;
    }
    if (!path.startsWith('admin/') || !requireAdmin(req, res)) return;

    const store = await readStore();
    if (req.method === 'GET' && path === 'admin/orders') {
      json(res, 200, { orders: store.orders });
      return;
    }
    if (req.method === 'PUT' && path === 'admin/menu') {
      const input = await readBody(req);
      if (!Array.isArray(input.menu) || input.menu.length > 500) {
        json(res, 400, { error: 'Menyu ma’lumotlari noto‘g‘ri.' });
        return;
      }
      store.menu = input.menu;
      await saveStore(store);
      json(res, 200, { ok: true });
      return;
    }
    if (req.method === 'DELETE' && path === 'admin/orders') {
      store.orders = [];
      await saveStore(store);
      json(res, 200, { ok: true });
      return;
    }
    if (path.startsWith('admin/orders/')) {
      const orderNum = currentOrderId(path);
      const index = store.orders.findIndex(order => order.orderNum === orderNum);
      if (index < 0) { json(res, 404, { error: 'Buyurtma topilmadi.' }); return; }
      if (req.method === 'DELETE') store.orders.splice(index, 1);
      else if (req.method === 'PATCH') {
        const input = await readBody(req);
        if (!['Yangi', 'Tayyorlanmoqda', 'Yetkazildi', 'Bekor qilindi'].includes(input.status)) {
          json(res, 400, { error: 'Buyurtma holati noto‘g‘ri.' });
          return;
        }
        store.orders[index].status = input.status;
      } else { json(res, 405, { error: 'Method not allowed.' }); return; }
      await saveStore(store);
      json(res, 200, { ok: true });
      return;
    }
    if (req.method === 'POST' && path === 'admin/password') {
      const input = await readBody(req);
      const configuredPassword = process.env.ADMIN_PASSWORD || '';
      const valid = store.adminPasswordHash
        ? verifyPassword(input.currentPassword || '', store.adminPasswordHash)
        : safeEqual(input.currentPassword, configuredPassword);
      if (!valid) { json(res, 401, { error: 'Joriy parol noto‘g‘ri.' }); return; }
      if (typeof input.newPassword !== 'string' || input.newPassword.length < 10) {
        json(res, 400, { error: 'Yangi parol kamida 10 ta belgidan iborat bo‘lsin.' });
        return;
      }
      store.adminPasswordHash = hashPassword(input.newPassword);
      await saveStore(store);
      json(res, 200, { ok: true });
      return;
    }
    json(res, 404, { error: 'API manzili topilmadi.' });
  } catch (error) {
    console.error('Plov City API:', error);
    json(res, error.status || 500, { error: error.status === 503 ? error.message : 'Server so‘rovni bajara olmadi.' });
  }
}
