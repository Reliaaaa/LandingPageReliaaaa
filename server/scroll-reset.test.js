import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script id="scroll-reset">([\s\S]*?)<\/script>/)?.[1];

test('reload clears a section fragment and resets the scroll position', () => {
  assert.ok(script);
  let replaced;
  let scroll;
  const history = { state: { saved: true }, replaceState: (...args) => { replaced = args; } };
  runInNewContext(script, {
    history,
    performance: { getEntriesByType: () => [{ type: 'reload' }] },
    location: { hash: '#experience', pathname: '/', search: '?view=all' },
    window: { scrollTo: options => { scroll = options; } },
  });
  assert.equal(history.scrollRestoration, 'manual');
  assert.equal(replaced[2], '/?view=all');
  assert.equal(scroll.top, 0);
  assert.equal(scroll.behavior, 'instant');
});

test('a first navigation does not remove a section fragment', () => {
  let replaced = false;
  runInNewContext(script, {
    history: { replaceState: () => { replaced = true; } },
    performance: { getEntriesByType: () => [{ type: 'navigate' }] },
    location: { hash: '#experience' },
    window: { scrollTo: () => {} },
  });
  assert.equal(replaced, false);
});
