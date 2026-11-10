import test from 'node:test';
import assert from 'node:assert/strict';
import { menuScrollPosition } from '../src/menu-scroll.js';

test('menu Home always targets the absolute top', () => {
  assert.equal(menuScrollPosition('#home', 1200, 100, 80, 800), 0);
});

test('menu Experience centers its heading and never scrolls above the page', () => {
  assert.equal(menuScrollPosition('#experience', 2000, 112, 80, 800), 1752);
  assert.equal(menuScrollPosition('#experience', 0, 20, 50, 800), 0);
  assert.equal(menuScrollPosition('#about', 100, 0, 0, 800), null);
});
