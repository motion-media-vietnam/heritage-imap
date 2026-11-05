import assert from 'node:assert/strict';
import { test } from 'node:test';
import { destinationDirectory, travelAreaParents } from '../src/data/destinations/directory.ts';
import { chooseMapSpotlight, landmarkOffsets, mapSpotlightHref, orderedMapDirectory, type MapSpotlightPlacement } from '../src/lib/national-map-selection.ts';

const photo = { src: '/review.webp', small: '/review.webp', width: 192, height: 192, alt: ['Ảnh', 'Image'] as const };
const places = ['hanoi', 'quang-ninh', 'ho-chi-minh'].map(id => ({ id, photo, description: ['Giới thiệu', 'Introduction'] as const }));
const paid = { destinationId: 'quang-ninh', status: 'approved', start: '2026-11-01', end: '2026-12-31', priority: 2, display: true, visualApproved: true } satisfies MapSpotlightPlacement;

test('spotlight runs an inclusive two-month campaign, rolls over, then returns to configured editorial fallback', () => {
  const campaigns: MapSpotlightPlacement[] = [paid, { ...paid, destinationId: 'ho-chi-minh', start: '2026-12-01', end: '2027-02-28', priority: 1 }];
  for (const day of ['2026-11-01', '2026-12-31']) assert.equal(chooseMapSpotlight(places, campaigns, day, ['hanoi'])?.destination.id, 'quang-ninh');
  assert.equal(chooseMapSpotlight(places, campaigns, '2027-01-01', ['hanoi'])?.destination.id, 'ho-chi-minh');
  assert.equal(chooseMapSpotlight(places, campaigns, '2027-03-01', ['hanoi'])?.destination.id, 'hanoi');
  assert.equal(chooseMapSpotlight(places, [], '2026-11-05', ['ho-chi-minh'])?.destination.id, 'ho-chi-minh');
});

test('spotlight rejects drafts, hidden/unapproved images, unknown destinations and invalid calendar windows', () => {
  const invalid: MapSpotlightPlacement[] = [
    { ...paid, status: 'draft' }, { ...paid, display: false }, { ...paid, visualApproved: false },
    { ...paid, destinationId: 'missing' }, { ...paid, start: '2026-11-31' }, { ...paid, end: '2026-02-30' },
    { ...paid, start: '2027-01-01' }, { ...paid, end: '2026-11-04' }, { ...paid, priority: NaN },
    { ...paid, teaser: ['', ''] },
  ];
  for (const record of invalid) assert.equal(chooseMapSpotlight(places, [record], '2026-11-05', ['hanoi'])?.placement, undefined);
  assert.equal(chooseMapSpotlight([{ id: 'quang-ninh' }], [paid], '2026-11-05', [])?.placement, undefined);
  assert.equal(chooseMapSpotlight([], [paid], '2026-11-05', []), undefined);
});

test('spotlight accepts approved creative overrides without inventing an unpublished hub route', () => {
  const campaign = { ...paid, image: photo, teaser: ['Nội dung', 'Story'] as const };
  assert.equal(chooseMapSpotlight([{ id: 'quang-ninh' }], [campaign], '2026-11-05', [])?.placement, campaign);
  assert.equal(mapSpotlightHref(undefined, campaign), undefined);
  for (const url of ['javascript:alert(1)', 'http://example.com', 'https://user:secret@example.com', '/quang-ninh/']) {
    assert.equal(mapSpotlightHref('/hanoi/', { ...paid, bookingUrl: url }), '/hanoi/');
  }
  assert.equal(mapSpotlightHref(undefined, { ...paid, bookingUrl: 'https://example.com/visit' }), 'https://example.com/visit');
});

test('provincial directory contains 34 unique current units and keeps 33 outside any initial spotlight', () => {
  assert.equal(destinationDirectory.length, 34);
  assert.equal(new Set(destinationDirectory.map(item => item.id)).size, 34);
  assert.equal(new Set(destinationDirectory.map(item => item.code)).size, 34);
  const priority = ['ho-chi-minh', 'hue', 'da-nang', 'khanh-hoa', 'an-giang'];
  for (const spotlight of destinationDirectory) {
    const directory = orderedMapDirectory(destinationDirectory, spotlight.id, priority);
    assert.equal(directory.length, 33); assert.equal(new Set(directory.map(item => item.id)).size, 33);
    assert(!directory.some(item => item.id === spotlight.id));
  }
  assert.deepEqual(orderedMapDirectory(destinationDirectory, 'hanoi', priority).slice(0, 5).map(item => item.id), priority);
  for (const item of destinationDirectory) {
    assert(item.geonameId > 0); assert(item.coordinates[0] >= 8.5 && item.coordinates[0] <= 23.5);
    assert(item.coordinates[1] >= 102 && item.coordinates[1] <= 110);
  }
  assert.equal(Object.keys(travelAreaParents).length, 8);
  assert(Object.values(travelAreaParents).every(id => destinationDirectory.some(item => item.id === id)));
});

test('photo pins separate at overview, remain within the frame, and return to exact coordinates up close', () => {
  const points = Array.from({ length: 5 }, (_, i) => ({ id: String(i), x: 145 + i * 4, y: 140 + i * 3 }));
  const offsets = landmarkOffsets(points, 320, 500, true);
  const positions = points.map(point => { const offset = offsets.get(point.id)!; return { x: point.x + offset[0], y: point.y + offset[1] }; });
  positions.forEach((position, i) => {
    assert(position.x >= 30 && position.x <= 290 && position.y >= 70 && position.y <= 488);
    for (const other of positions.slice(i + 1)) assert(Math.hypot(position.x - other.x, position.y - other.y) >= 59);
  });
  assert([...landmarkOffsets(points, 320, 500, false).values()].every(offset => offset[0] === 0 && offset[1] === 0));
  assert.deepEqual(landmarkOffsets([{ id: 'offscreen', x: -100, y: 100 }], 320, 500, true).get('offscreen'), [0, 0]);
});
