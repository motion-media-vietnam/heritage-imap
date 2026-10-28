import { test } from 'node:test';
import assert from 'node:assert/strict';
import { districtGroups, districtPlaceSlugs } from '../src/data/districts.ts';
import { places } from '../src/data/places.ts';

test('the historical district directory contains 30 distinct areas', () => {
  assert.deepEqual(districtGroups.map(group => group.names.length), [12, 17, 1]);
  const names = districtGroups.flatMap(group => group.names);
  assert.equal(names.length, 30);
  assert.equal(new Set(names).size, 30);
});

test('each curated place belongs to exactly one known directory area', () => {
  const names = new Set(districtGroups.flatMap(group => group.names));
  const slugs = Object.values(districtPlaceSlugs).flat();
  for (const name of Object.keys(districtPlaceSlugs)) assert(names.has(name));
  assert.equal(new Set(slugs).size, slugs.length);
  assert.deepEqual([...slugs].sort(), places.map(place => place.slug).sort());
});
