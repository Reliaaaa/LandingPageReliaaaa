import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchFigma } from './figma.mjs';
import { fetchLinkedInProfile } from './linkedin.mjs';

test('Figma builds an asset request and sends the token in a header', async () => {
  const result = await fetchFigma({ token: 'example', fileKey: 'abc123', nodeIds: '1:2,3:4', request: async (url, options) => {
    assert.equal(url.hostname, 'api.figma.com');
    assert.equal(url.pathname, '/v1/images/abc123');
    assert.equal(url.searchParams.get('ids'), '1:2,3:4');
    assert.equal(options.headers['X-Figma-Token'], 'example');
    return { ok: true, json: async () => ({ images: {} }) };
  } });
  assert.deepEqual(result, { images: {} });
});

test('Figma rejects invalid keys before making a request', async () => {
  await assert.rejects(fetchFigma({ token: 'example', fileKey: '../other', request: () => assert.fail('unexpected request') }), /valid Figma file key/);
});

test('LinkedIn requests the authenticated user profile and reports API errors', async () => {
  await assert.rejects(fetchLinkedInProfile({ token: 'example', request: async (url, options) => {
    assert.equal(url, 'https://api.linkedin.com/v2/userinfo');
    assert.equal(options.headers.Authorization, 'Bearer example');
    return { ok: false, status: 403 };
  } }), /HTTP 403/);
});
