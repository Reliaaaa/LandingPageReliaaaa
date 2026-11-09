import { createHash, timingSafeEqual } from 'node:crypto';

const windows = new Map();
export function reply(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

export function allowMethod(req, res, method) {
  if (req.method === method) return true;
  res.setHeader('Allow', method);
  reply(res, 405, { error: 'Method not allowed.' });
  return false;
}

export function sameOrigin(req) {
  const origin = req.headers.origin;
  // Non-browser clients may omit Origin; rate limiting still applies.
  if (!origin) return true;
  try {
    const expected = process.env.APP_ORIGIN;
    if (expected) return new URL(origin).origin === new URL(expected).origin;
    return new URL(origin).host === req.headers.host;
  } catch { return false; }
}

export async function readJson(req) {
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    const error = new Error('Send JSON.'); error.status = 415; throw error;
  }
  if (Number(req.headers['content-length']) > 8192) {
    const error = new Error('Request too large.'); error.status = 413; throw error;
  }
  let data = req.body;
  if (data === undefined) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += Buffer.byteLength(chunk);
      if (size > 8192) {
        const error = new Error('Request too large.'); error.status = 413; throw error;
      }
      chunks.push(Buffer.from(chunk));
    }
    data = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.byteLength(typeof data === 'string' ? data : JSON.stringify(data)) > 8192) {
    const error = new Error('Request too large.'); error.status = 413; throw error;
  }
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch {
    const error = new Error('Invalid JSON object.'); error.status = 400; throw error;
  }
}

export function clientKey(req) {
  // Vercel sets x-vercel-forwarded-for. Locally use the actual socket peer.
  if ((process.env.VERCEL || process.env.NODE_ENV === 'production') && !process.env.IP_HASH_SALT) return null;
  const ip = process.env.VERCEL ? String(req.headers['x-vercel-forwarded-for'] || '').split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';
  return createHash('sha256').update(`${process.env.IP_HASH_SALT || 'local-development'}:${ip}`).digest('hex');
}

export function rateLimit(key, limit, duration = 60000) {
  const now = Date.now();
  if (windows.size > 10000) {
    for (const [key, value] of windows) if (value.expires <= now) windows.delete(key);
    if (windows.size > 10000) return false;
  }
  const item = windows.get(key);
  if (!item || item.expires <= now) { windows.set(key, { count: 1, expires: now + duration }); return true; }
  item.count += 1;
  return item.count <= limit;
}

export function adminAuthorized(req) {
  const secret = process.env.ANALYTICS_ADMIN_TOKEN;
  if (!secret || secret.length < 32) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(String(req.headers.authorization || ''));
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function handleError(res, error) {
  if (error.status) return reply(res, error.status, { error: error.message });
  console.error('API request failed', { code: error.code || 'UNKNOWN' });
  return reply(res, 503, { error: 'Service temporarily unavailable. Please try again later.' });
}
