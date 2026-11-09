import { database } from '../server/db.js';
import { allowMethod, clientKey, handleError, rateLimit, readJson, reply, sameOrigin } from '../server/http.js';

export default async function handler(req, res) {
  if (!allowMethod(req, res, 'POST')) return;
  if (!sameOrigin(req)) return reply(res, 403, { error: 'Request origin not allowed.' });
  const key = clientKey(req);
  if (!key) return reply(res, 503, { error: 'Service temporarily unavailable. Please try again later.' });
  if (!rateLimit(`contact:${key}`, 5, 600000)) return reply(res, 429, { error: 'Please wait before sending another message.' });
  try {
    const body = await readJson(req);
    if (typeof body.company === 'string' && body.company.trim()) return reply(res, 200, { ok: true });
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (name.length < 2 || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 4000) {
      return reply(res, 400, { error: 'Enter a name (2–100 characters), valid email, and message (10–4,000 characters).' });
    }
    // The database lock makes the contact quota hold across serverless instances.
    const connection = await database().connect();
    try {
      await connection.query('BEGIN');
      await connection.query('SELECT pg_advisory_xact_lock(hashtext($1))', [key]);
      const recent = await connection.query("SELECT count(*)::int AS count FROM contact_messages WHERE client_hash = $1 AND created_at > now() - interval '10 minutes'", [key]);
      if (recent.rows[0].count >= 5) {
        await connection.query('ROLLBACK');
        return reply(res, 429, { error: 'Please wait before sending another message.' });
      }
      await connection.query('INSERT INTO contact_messages (name, email, message, client_hash) VALUES ($1,$2,$3,$4)', [name, email, message, key]);
      await connection.query('COMMIT');
    } catch (error) { await connection.query('ROLLBACK'); throw error; }
    finally { connection.release(); }
    return reply(res, 201, { ok: true });
  } catch (error) { return handleError(res, error); }
}
