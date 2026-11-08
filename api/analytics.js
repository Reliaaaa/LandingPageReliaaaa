import { database } from '../server/db.js';
import { adminAuthorized, clientKey, handleError, rateLimit, readJson, reply, sameOrigin } from '../server/http.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!adminAuthorized(req)) return reply(res, 401, { error: 'Unauthorized.' });
    try {
      const result = await database().query("SELECT event, count(*)::int AS count FROM analytics_events WHERE created_at > now() - interval '30 days' GROUP BY event ORDER BY event");
      return reply(res, 200, { periodDays: 30, events: result.rows });
    } catch (error) { return handleError(res, error); }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return reply(res, 405, { error: 'Method not allowed.' }); }
  if (!sameOrigin(req)) return reply(res, 403, { error: 'Request origin not allowed.' });
  const key = clientKey(req);
  if (!key) return reply(res, 503, { error: 'Service temporarily unavailable. Please try again later.' });
  if (!rateLimit(`analytics:${key}`, 30)) return reply(res, 429, { error: 'Too many requests.' });
  try {
    const { event, path } = await readJson(req);
    if (!['page_view', 'contact_submit'].includes(event) || typeof path !== 'string' || path.length > 200 || !/^\/[a-zA-Z0-9/_-]*$/.test(path)) {
      return reply(res, 400, { error: 'Invalid analytics event or path.' });
    }
    await database().query('INSERT INTO analytics_events (event, path) VALUES ($1,$2)', [event, path]);
    return reply(res, 201, { ok: true });
  } catch (error) { return handleError(res, error); }
}
