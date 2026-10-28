import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { places, demoLocation } from '../src/data/places.ts';
import { collections, itineraries, examplePrompts, imapHref, destinationPhotos } from '../src/data/concierge.ts';
import { recommend, normalizeRequest, type ConciergePreferences } from '../src/lib/concierge.ts';
import { linkedDestination } from '../src/lib/imap-destination-link.ts';

const preferences = (changes: Partial<ConciergePreferences> = {}): ConciergePreferences => ({
  query: '', area: 'all', time: '', mobility: '', interests: [], requirements: [], ...changes,
});
test('recommendations are deterministic and retain canonical /imap/ identities', () => {
  const request = preferences({ query: examplePrompts[3]! });
  assert.deepEqual(recommend(request), recommend(request));
  assert(recommend(request).matches.length > 0);
  for (const match of recommend(request).matches) {
    assert(places.includes(match.place));
    assert(destinationPhotos[match.place.slug]);
    assert.equal(linkedDestination(new URL(imapHref(match.place.slug), 'https://example.test').search, places.map(place => place.slug)), match.place.slug);
    assert.equal(match.distance, undefined);
  }
});
test('Vietnamese spelling, canonical names, area and time budgets work', () => {
  assert.equal(normalizeRequest('ĐỐNG ĐA'), 'dong da');
  assert.equal(recommend(preferences({ query: 'VĂN MIẾU' })).matches[0]?.place.slug, 'van-mieu');
  const result = recommend(preferences({ query: examplePrompts[0]! }));
  assert(result.matches.length > 0 && result.matches.length <= 2);
  assert(result.matches.every(match => match.place.area === 'Khu vực Hoàn Kiếm'));
  assert.equal(recommend(preferences({ time: '1' })).matches.length, 1);
  assert.equal(recommend(preferences({ area: 'Khu vực Tây Hồ' })).matches[0]?.place.slug, 'ho-tay');
});
test('unverified dietary, family and accessibility requests fail closed', () => {
  assert.equal(recommend(preferences({ query: examplePrompts[1]! })).matches.length, 0);
  for (const requirement of ['Ăn chay', 'Halal', 'Phù hợp gia đình', 'Hỗ trợ tiếp cận']) {
    assert.equal(recommend(preferences({ requirements: [requirement] })).matches.length, 0);
  }
  assert.equal(recommend(preferences({ query: 'Tìm nơi cho xe lăn' })).matches.length, 0);
});
test('missing editorial interests are not replaced silently', () => {
  assert.equal(recommend(preferences({ interests: ['food'] })).matches.length, 0);
  assert.equal(recommend(preferences({ interests: ['art'] })).matches.length, 0);
  const partial = recommend(preferences({ query: examplePrompts[2]! }));
  assert(partial.matches.length > 0);
  assert(partial.notes.some(note => note.includes('Nghệ thuật')));
  const mixed = recommend(preferences({ query: 'Tìm quán ăn', interests: ['culture'] }));
  assert(mixed.notes.some(note => note.includes('Ẩm thực')));
});
test('unknown requests and incompatible filters have graceful empty results', () => {
  assert.equal(recommend(preferences({ query: 'zzzzzz' })).matches.length, 0);
  assert.equal(recommend(preferences({ query: 'Bảo tàng Hà Nội' })).matches.length, 0);
  assert.equal(recommend(preferences({ area: 'Khu vực Tây Hồ', interests: ['culture'] })).matches.length, 0);
  assert(recommend(preferences()).matches.length > 0);
});
test('nearby needs an explicit location; geographic distance is not a route', () => {
  assert.equal(recommend(preferences({ query: 'Gần đây' })).matches.length, 0);
  const result = recommend(preferences({ origin: demoLocation }));
  assert.equal(result.matches[0]?.place.slug, 'ho-hoan-kiem');
  assert.equal(result.matches[0]?.distance, 0);
  assert(result.notes.some(note => note.includes('đường chim bay')));
  for (let index = 1; index < result.matches.length; index++) {
    assert(result.matches[index - 1]!.distance! <= result.matches[index]!.distance!);
  }
});
test('editorial references resolve without making missing itineraries navigable', () => {
  const ids = places.map(place => place.slug);
  for (const entry of [...collections, ...itineraries]) for (const slug of entry.slugs) assert(ids.includes(slug));
  assert.equal(itineraries.find(entry => entry.id === 'yeu-nghe-thuat')!.slugs.length, 0);
});
test('deep links reject unknown, repeated and malicious identity values', () => {
  const ids = places.map(place => place.slug);
  for (const query of ['', '?place=unknown', '?place=pho-co&place=ho-tay', '?place=%3Cscript%3E', '?place=PHO-CO']) {
    assert.equal(linkedDestination(query, ids), undefined);
  }
  assert.equal(linkedDestination('?place=pho-co&other=keep', ids), 'pho-co');
});
test('deep link selection is standalone-only and uses the normal story path', () => {
  const controller = readFileSync(new URL('../src/scripts/imap.ts', import.meta.url), 'utf8');
  assert.match(controller, /if \(root.id === 'full-imap'\)/);
  assert.match(controller, /if \(destination\) openPlace\(destination\)/);
  const page = readFileSync(new URL('../src/pages/heritage-mach-ban.astro', import.meta.url), 'utf8');
  assert.match(page, /<details class="concierge-preferences">/);
  assert.doesNotMatch(page, /<iframe|<video|<IMap/);
});
