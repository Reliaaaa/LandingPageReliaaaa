import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('LCP observer logs the latest buffered candidate when the page becomes hidden', () => {
  let observer;
  let onVisibilityChange;
  const logs = [];
  const document = {
    visibilityState: 'visible',
    addEventListener: (_name, listener) => { onVisibilityChange = listener; },
    removeEventListener: () => { onVisibilityChange = null; },
  };
  class MockObserver {
    static supportedEntryTypes = ['largest-contentful-paint'];
    constructor(callback) { this.callback = callback; observer = this; }
    observe(options) { this.options = options; }
    takeRecords() { return [{ startTime: 1450 }]; }
    disconnect() { this.disconnected = true; }
  }
  runInNewContext(readFileSync(new URL('../public/lcp.js', import.meta.url), 'utf8'), {
    window: { PerformanceObserver: MockObserver }, PerformanceObserver: MockObserver,
    document, console: { info: (...args) => logs.push(args) },
  });
  assert.equal(observer.options.buffered, true);
  observer.callback({ getEntries: () => [{ startTime: 1200, element: null }] });
  onVisibilityChange();
  assert.equal(observer.disconnected, undefined);
  document.visibilityState = 'hidden';
  onVisibilityChange();
  assert.equal(observer.disconnected, true);
  assert.equal(logs.at(-1)[1], 1450);
  assert.equal(onVisibilityChange, null);
});
