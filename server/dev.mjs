import http from 'node:http';
import contact from '../api/contact.js';
import analytics from '../api/analytics.js';
import { reply } from './http.js';

const handlers = { '/api/contact': contact, '/api/analytics': analytics };
const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  const handler = handlers[path];
  if (!handler) return reply(res, 404, { error: 'Not found.' });
  await handler(req, res);
});
server.requestTimeout = 15000;
server.listen(Number(process.env.API_PORT || 3001), '127.0.0.1', () => console.log('API listening on http://127.0.0.1:' + (process.env.API_PORT || 3001)));
