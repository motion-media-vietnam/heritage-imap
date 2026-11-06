import assert from 'node:assert/strict';
import { test } from 'node:test';
import { destinationDirectory } from '../src/data/destinations/directory.ts';
import { destinationSearchIndex } from '../src/data/destinations/search-index.ts';
import { searchDestinations } from '../src/lib/destination-search.ts';

test('National search ranks actual landmarks before their parent provinces across accents and aliases', () => {
  for (const [queries, ids] of [
    [['Hạ Long', 'Ha Long', '  HA-LONG ', 'Halong Bay'], ['ha-long-bay', 'quang-ninh']],
    [['Hoa Lư', 'Hoa Lu', 'Đền Vua Đinh'], ['hoa-lu', 'ninh-binh']],
    [['Hồ Gươm', 'Hoan Kiem Lake'], ['ho-hoan-kiem', 'hanoi']],
    [['Văn Miếu', 'Temple of Literature'], ['van-mieu', 'hanoi']],
    [['Tràng An'], ['trang-an', 'ninh-binh']],
    [['Fansipan', 'Phan Xi Păng'], ['fansipan', 'lao-cai']],
  ]) {
    for (const query of queries!) {
      assert.deepEqual(searchDestinations(destinationSearchIndex, query).slice(0, 2).map(item => item.id), ids);
    }
  }
});

test('search indexes all configured provinces and distinguishes POI coordinates and Heritage routes', () => {
  assert.deepEqual(destinationSearchIndex.filter(item => item.type === 'destination').map(item => item.id),
    destinationDirectory.map(item => item.id));
  const index = new Map(destinationSearchIndex.map(item => [item.id, item]));
  assert.equal(index.size, destinationSearchIndex.length);
  for (const item of destinationSearchIndex.filter(item => item.type !== 'destination')) {
    const province = index.get(item.provinceId);
    assert.equal(province?.type, 'destination');
    assert.notDeepEqual(item.coordinates, province?.coordinates);
    assert.match(item.sourceUrl, /^https:\/\//);
  }
  assert.equal(index.get('ho-hoan-kiem')?.existingContentUrl, '/hanoi/places/ho-hoan-kiem/');
  assert.equal(index.get('van-mieu')?.existingContentUrl, '/hanoi/places/van-mieu/');
  assert.equal(index.get('hoa-lu')?.existingContentUrl, undefined);
  assert.equal(searchDestinations(destinationSearchIndex, 'Hà Nội')[0]?.id, 'hanoi');
  assert.equal(searchDestinations(destinationSearchIndex, 'hcmc')[0]?.id, 'ho-chi-minh');
});

test('blank and unmatched searches return no suggestions and broad queries are capped', () => {
  assert.deepEqual(searchDestinations(destinationSearchIndex, '   '), []);
  assert.deepEqual(searchDestinations(destinationSearchIndex, 'xyz-khongco'), []);
  assert(searchDestinations(destinationSearchIndex, 'a').length <= 7);
});
