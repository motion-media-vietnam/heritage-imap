import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { destinations } from '../src/data/destinations/index.ts';
import { places } from '../src/data/destinations/hanoi/places.ts';
import { prototypePlaces } from '../src/data/destinations/hanoi/imap-prototype.ts';
import { destinationRoutes } from '../src/lib/destination-routes.ts';

const built = (path: string) => new URL('../dist' + path + 'index.html', import.meta.url);
const read = (path: string) => readFileSync(built(path), 'utf8');

test('Hanoi uses stable scoped place IDs and its explorer derives core records from the same catalog', () => {
  const keys = prototypePlaces.map(place => place.cityId + ':' + place.slug);
  assert.equal(new Set(keys).size, keys.length);
  assert(prototypePlaces.every(place => place.cityId === destinations.hanoi.id));
  for (const place of places) {
    const explorerPlace = prototypePlaces.find(entry => entry.slug === place.slug);
    assert.equal(explorerPlace?.cityId, place.cityId);
    assert.equal(explorerPlace?.name, place.name);
    assert.deepEqual(explorerPlace?.coordinates, place.coordinates);
  }
});

test('Hanoi namespaced routes and original public URLs render their destination content', () => {
  const routes = destinationRoutes(destinations.hanoi.id);
  for (const [legacy, namespaced, content] of [
    ['/', routes.home, 'id="explore"'],
    ['/imap/', routes.map, 'data-imap-instance="full-imap"'],
    ['/heritage-mach-ban/', routes.home + 'heritage-mach-ban/', 'id="hoi-heritage"'],
    ...places.map(place => [
      '/places/' + place.slug + '/',
      routes.home + 'places/' + place.slug + '/',
      '<h1>' + place.name + '</h1>',
    ]),
  ] as const) {
    assert(read(legacy).includes(content), legacy);
    const html = read(namespaced);
    assert(html.includes(content), namespaced);
    assert(html.includes('href="/hanoi/"'), namespaced);
    assert.equal((html.match(/<dialog id="heritage-drawer"/g) ?? []).length, 1, namespaced);
  }
  assert(read('/imap-prototype/').includes('prototype-directory'));
  assert(read(routes.home + 'heritage-mach-ban/').includes('href="/hanoi/map/?place=ho-hoan-kiem"'));
  assert(read('/heritage-mach-ban/').includes('href="/imap/?place=ho-hoan-kiem"'));
});

test('Ninh Binh is reserved as draft and cannot emit Hanoi assets or content under its URL', () => {
  const draft = destinations['ninh-binh'];
  assert.equal(draft.status, 'draft');
  const routes = destinationRoutes(draft.id);
  for (const route of [routes.home, routes.map, routes.home + 'heritage-mach-ban/']) {
    assert(!existsSync(built(route)), route);
  }
});
