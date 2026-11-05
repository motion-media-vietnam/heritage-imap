import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { discoveryAnchor, discoveryPins, discoveryViewBox } from '../src/data/national/map-graphic.ts';
import { destinationDirectory } from '../src/data/destinations/directory.ts';

test('illustrated pins resolve to the shared directory and remain usable in the narrowest map', () => {
  assert.equal(discoveryPins.length, 5);
  assert.equal(new Set(discoveryPins.map(pin => pin.id)).size, 5);
  // 360px viewport, including the page gutters and map border.
  const width = 305;
  const scale = 560 / discoveryViewBox.height;
  const points = discoveryPins.map(pin => ({ x: width / 2 + (pin.x - discoveryViewBox.width / 2) * scale, y: pin.y * scale }));
  discoveryPins.forEach((pin, index) => {
    const place = destinationDirectory.find(item => item.id === pin.id);
    assert(place);
    const anchor = discoveryAnchor(place.coordinates);
    assert(anchor.x > 0 && anchor.x < discoveryViewBox.width);
    assert(anchor.y > 0 && anchor.y < discoveryViewBox.height);
    const point = points[index]!;
    assert(point.x >= 26 && point.x <= width - 26);
    assert(point.y >= 64 && point.y <= 490);
    for (const other of points.slice(index + 1)) assert(Math.hypot(point.x - other.x, point.y - other.y) > 64);
  });
});

test('the local atlas is a small self-contained vector without tile or external image requests', () => {
  const atlas = readFileSync(new URL('../src/assets/national/map/vietnam-discovery.svg', import.meta.url), 'utf8');
  assert(Buffer.byteLength(atlas) < 16000);
  assert(atlas.includes('Natural Earth'));
  assert(atlas.includes('Hoàng Sa') && atlas.includes('Trường Sa'));
  assert(!/<(?:image|script|foreignObject)\b/i.test(atlas));
  assert(!/(?:href|src)=["']https?:/i.test(atlas));
});
