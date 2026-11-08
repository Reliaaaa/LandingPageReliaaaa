import test from 'node:test';
import assert from 'node:assert/strict';
import contact from '../api/contact.js';
import analytics from '../api/analytics.js';

let sequence = 0;
function request(body, overrides = {}) {
  return { method: 'POST', headers: { 'content-type': 'application/json' }, body, socket: { remoteAddress: `test-${sequence++}` }, ...overrides };
}
function response() {
  return { headers: {}, setHeader(name, value) { this.headers[name] = value; }, end(value) { this.body = JSON.parse(value); } };
}
async function call(handler, req) { const res = response(); await handler(req, res); return res; }

test('contact rejects invalid fields without connecting to database', async () => {
  const res = await call(contact, request({ name: 'x', email: 'bad', message: 'short' }));
  assert.equal(res.statusCode, 400);
});
test('filled honeypot returns synthetic success', async () => {
  const res = await call(contact, request({ company: 'spam' }));
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
});
test('unsupported methods publish allowed methods', async () => {
  const res = await call(contact, request({}, { method: 'GET' }));
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, 'POST');
});
test('analytics summary requires a secret bearer token', async () => {
  const res = await call(analytics, request({}, { method: 'GET' }));
  assert.equal(res.statusCode, 401);
});
test('analytics rejects unapproved events and paths containing query data', async () => {
  for (const body of [{ event: 'unknown', path: '/' }, { event: 'page_view', path: '/?email=private' }]) {
    assert.equal((await call(analytics, request(body))).statusCode, 400);
  }
});
test('public writes require JSON and enforce the byte budget', async () => {
  assert.equal((await call(contact, request({}, { headers: { 'content-type': 'text/plain' } }))).statusCode, 415);
  assert.equal((await call(contact, request({ message: 'a'.repeat(9000) }))).statusCode, 413);
});
test('cross-origin browser writes are rejected', async () => {
  const res = await call(analytics, request({}, { headers: { 'content-type': 'application/json', origin: 'https://evil.example', host: 'site.example' } }));
  assert.equal(res.statusCode, 403);
});
test('contact request quota applies even to honeypot submissions', async () => {
  for (let count = 0; count < 5; count++) {
    assert.equal((await call(contact, request({ company: 'spam' }, { socket: { remoteAddress: 'quota-test' } }))).statusCode, 200);
  }
  assert.equal((await call(contact, request({ company: 'spam' }, { socket: { remoteAddress: 'quota-test' } }))).statusCode, 429);
});
