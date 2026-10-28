import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { probePrototypeInitialization } from './fixtures/prototype-init-runtime.mjs';

const source = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');

test('geographic startup initializes the view before circle projection, without a fixed seed zoom', async () => {
  const connect = source.slice(source.indexOf('async function connect()'));
  assert(connect.indexOf('focusDiscovery();') < connect.indexOf('updateCircle();'));
  assert.doesNotMatch(source, /radiusCircle\.getBounds\(/);
  const result = await probePrototypeInitialization(source, { query: 'no-matching-destination' });
  assert.deepEqual(result.errors, []); assert.equal(result.viewCalls, 1);
  assert.equal(result.fitCalls, 0); assert.equal(result.initializationCompleted, true);
  assert.equal(result.markerCandidates.length, 0);
});

test('initial view makes real circle projection/bounds ready before tiles and default filtering', async () => {
  // Controlled dimensions, NOT measured browser/mobile layout or rendered images.
  for (const [width, height] of [[960, 640], [360, 360], [390, 440], [430, 500]]) {
    const result = await probePrototypeInitialization(source, { width, height });
    assert.deepEqual(result.errors, []);
    assert.equal(result.viewCalls, 1);
    assert.equal(result.fitCalls, 0);
    assert.equal(result.fittedBounds.length, 2);
    assert.equal(result.tileLayerAdds, 1);
    assert.deepEqual(result.markerCandidates, ['ho-hoan-kiem', 'pho-co']);
    assert.equal(result.retryOffered, false);
    assert.equal(result.initializationCompleted, true);
  }
});

test('repaired initialization preserves every discovery-radius result without duplicate tile layers', async () => {
  for (const [radius, count] of [[500, 1], [1000, 2], [2000, 5], ['All', 6]] as const) {
    const result = await probePrototypeInitialization(source, { radius });
    assert.deepEqual(result.errors, []);
    assert.equal(result.tileLayerAdds, 1);
    assert.equal(result.markerCandidates.length, count);
    assert.equal(result.initializationCompleted, true);
  }
});
