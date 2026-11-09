import test from 'node:test';
import assert from 'node:assert/strict';
import { overlapOffset } from '../src/overlap.js';

test('interest icons overlap when collapsed and separate when expanded', () => {
  assert.equal(overlapOffset(0, false), 0);
  assert.ok(overlapOffset(1, false) < 48);
  assert.equal(overlapOffset(1, true), 56);
  assert.equal(overlapOffset(3, true), 168);
});
