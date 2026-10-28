import { test } from 'node:test';
import assert from 'node:assert/strict';
import { places, demoLocation } from '../src/data/places.ts';
import { distanceKm, findPlaces, formatDistance } from '../src/lib/explore.ts';

test('Hanoi guide contains exactly the six selected destinations', () => {
  assert.deepEqual(places.map(place => place.name), [
    'Hồ Hoàn Kiếm', 'Phố Cổ', 'Văn Miếu', 'Hoàng thành Thăng Long', 'Hồ Tây', 'Cầu Long Biên',
  ]);
  assert.equal(new Set(places.map(place => place.slug)).size, 6);
  for (const place of places) assert(distanceKm(demoLocation, place.coordinates) < 10);
});
test('search accepts Vietnamese accents, plain spelling and alternative names', () => {
  assert.equal(findPlaces(places, 'ho hoan kiem', 'All', demoLocation)[0]?.slug, 'ho-hoan-kiem');
  assert.equal(findPlaces(places, 'CẦU LONG BIÊN', 'All', demoLocation)[0]?.slug, 'cau-long-bien');
  assert.equal(findPlaces(places, 'quoc tu giam', 'All', demoLocation)[0]?.slug, 'van-mieu');
  assert.equal(findPlaces(places, 'pho co', 'Phố & cầu', demoLocation)[0]?.slug, 'pho-co');
  assert.equal(findPlaces(places, 'ho guom', 'All', demoLocation)[0]?.slug, 'ho-hoan-kiem');
});
test('search and category filters combine and can return no matches', () => {
  assert.equal(findPlaces(places, 'Văn Miếu', 'Hồ & cảnh quan', demoLocation).length, 0);
  for (const category of ['Hồ & cảnh quan', 'Phố & cầu', 'Di sản'] as const) {
    assert.equal(findPlaces(places, '', category, demoLocation).length, 2);
  }
  assert.equal(findPlaces(places, 'zzzzzz', 'All', demoLocation).length, 0);
});
test('nearby results change with the visitor location', () => {
  const local = findPlaces(places, '', 'All', demoLocation, true);
  assert.equal(local.length, places.length);
  assert.equal(local[0].slug, 'ho-hoan-kiem');
  // A point north of the city includes only the northern part of the sample.
  const northern = findPlaces(places, '', 'All', { lat: 21.13, lng: 105.84 }, true);
  assert(northern.length > 0 && northern.length < places.length);
  assert.equal(findPlaces(places, '', 'All', { lat: 52.52, lng: 13.405 }, true).length, 0);
});
test('distance uses geographic coordinates and results are nearest first', () => {
  assert.equal(distanceKm(demoLocation, demoLocation), 0);
  assert(Math.abs(distanceKm({ lat: 0, lng: 0 }, { lat: 0, lng: 1 }) - 111.195) < 0.01);
  const temple = places.find(place => place.slug === 'van-mieu')!;
  const sorted = findPlaces(places, '', 'All', temple.coordinates);
  assert.equal(sorted[0].slug, temple.slug);
  for (let i = 1; i < sorted.length; i++) {
    assert(distanceKm(temple.coordinates, sorted[i - 1].coordinates) <= distanceKm(temple.coordinates, sorted[i].coordinates));
  }
});
test('distances use Vietnamese number formatting', () => {
  assert.equal(formatDistance(0.45), '450 m');
  assert.equal(formatDistance(1.25), '1,3 km');
});
