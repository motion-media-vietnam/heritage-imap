import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import audit from '../output/sprint-05a/candidates.draft.json' with { type: 'json' };
import { places } from '../src/data/places.ts';
import { migrateImapCategory } from '../src/lib/imap-categories.ts';
import { prototypePlaces, integratedPrototypeIds, heldPrototypeIds, prototypeDistrictPlaceSlugs,
  populatedPrototypeDistricts, prototypeReferences, prototypeLinkedStories } from '../src/data/imap-prototype.ts';
import { createNeighborhoodState, filterNeighborhoodPlaces, markerCategory } from '../src/lib/imap-neighborhood.ts';
import { nearbyDestinations, selectDestination, dedicatedVideos } from '../src/lib/imap-prototype.ts';

const route = readFileSync(new URL('../src/components/imap/PrototypeExplorer.astro', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');

test('prototype retains original content/pins, five audit additions and one verified Opera record', () => {
  assert.equal(prototypePlaces.length, 12);
  assert.equal(new Set(prototypePlaces.map(place => place.slug)).size, 12);
  for (const original of places) {
    const actual = prototypePlaces.find(place => place.slug === original.slug)!;
    const { portraitImage, ...content } = actual;
    assert.deepEqual(content, original);
    assert.equal(actual.coordinates, original.coordinates);
    assert(!('portraitImage' in original), 'production record must not be mutated');
    if (portraitImage) assert(portraitImage.startsWith('/images/'));
  }
  assert.equal(integratedPrototypeIds.length, 5);
  for (const id of integratedPrototypeIds) {
    const source = audit.candidates.find(candidate => candidate.id === id)!;
    const actual = prototypePlaces.find(place => place.slug === id)!;
    assert(source && source.coordinates && actual);
    assert.equal(source.existingDestinationId, null);
    assert.deepEqual(actual.coordinates, source.coordinates);
    assert.equal(actual.name, source.name);
    assert.equal(markerCategory(actual), migrateImapCategory(source.categoryId, id));
    assert.equal(prototypeReferences[id]!.address, source.address.value);
  }
  assert.equal(prototypePlaces.find(place => place.slug === 'pho-sach-dinh-le')!.story,
    'Nơi Hà Nội cất giữ những trang sách cũ.');
});

test('real coordinates produce 5/8/11/12 results; neighborhood, category and accent-insensitive search compose', () => {
  const state = createNeighborhoodState();
  const filtered = (next = state) => filterNeighborhoodPlaces(prototypePlaces, next, prototypeDistrictPlaceSlugs);
  for (const [radius, count] of [[500, 5], [1000, 8], [2000, 11], ['All', 12]] as const) {
    assert.equal(filtered({ ...state, radius }).length, count);
  }
  assert.equal(filtered({ ...state, district: 'Hoàn Kiếm' }).length, 8);
  assert.equal(filtered({ ...state, category: 'stamp-worthy-spot' }).length, 5);
  assert.equal(filtered({ ...state, category: 'experience' }).length, 2);
  assert.equal(filtered({ ...state, category: 'shopping' }).length, 1);
  assert.equal(filtered({ ...state, category: 'food-drink', radius: 'All' }).length, 0);
  assert.deepEqual(filtered({ ...state, query: 'dinh le', category: 'shopping', district: 'Hoàn Kiếm', radius: 500 })
    .map(place => place.slug), ['pho-sach-dinh-le']);
  assert.deepEqual(filtered({ ...state, query: 'roi thang long', category: 'experience', district: 'Hoàn Kiếm' })
    .map(place => place.slug), ['nha-hat-mua-roi-thang-long-hoan-kiem']);
  assert.equal(populatedPrototypeDistricts.find(district => district.name === 'Hoàn Kiếm')!.count, 9);
});

test('Giang and retired ice cream never become display records; the unresolved audit entry is retained', () => {
  const giang = audit.candidates.find(candidate => candidate.id === heldPrototypeIds[0])!;
  assert(giang); assert.equal(giang.coordinates, null); assert.equal(giang.coordinateLeads?.length, 2);
  for (const id of [...heldPrototypeIds, 'kem-trang-tien-35', 'la-terrasse-metropole', 'khong-gian-di-bo-hoan-kiem']) {
    assert(!prototypePlaces.some(place => place.slug === id), id);
  }
  assert(!prototypePlaces.some(place => /mão/i.test(place.name)));
});

test('exactly two linked stories attach to the approved parents without duplicating markers or media', () => {
  assert.deepEqual(Object.keys(prototypeLinkedStories).sort(), ['ho-hoan-kiem', 'sofitel-legend-metropole-hanoi']);
  assert.deepEqual(prototypeLinkedStories['ho-hoan-kiem']!.map(story => story.id), ['khong-gian-di-bo-hoan-kiem']);
  assert.deepEqual(prototypeLinkedStories['sofitel-legend-metropole-hanoi']!.map(story => story.id), ['la-terrasse-metropole']);
  for (const stories of Object.values(prototypeLinkedStories)) for (const story of stories) {
    const source = audit.candidates.find(candidate => candidate.id === story.id)!;
    assert.equal(story.categoryId, source.categoryId);
    assert.equal(story.sourceUrl, source.sourceUrls[0]);
    assert(!('coordinates' in story)); assert(!('video' in story));
  }
  assert(route.includes('data-linked-story={linked.id}'));
});

test('new records use explicit 16:9 media placeholders and retain the provisional cathedral warning', () => {
  for (const id of integratedPrototypeIds) {
    const source = audit.candidates.find(candidate => candidate.id === id)!;
    const actual = prototypePlaces.find(place => place.slug === id)!;
    assert.equal(source.cover.status, 'missing'); assert.equal(source.video.status, 'missing');
    assert.equal(source.openingHours, null); assert.equal(source.ticketPrice, null);
    assert.equal(actual.art, undefined); assert.equal(dedicatedVideos[id], undefined);
  }
  const media = readFileSync(new URL('../src/components/DestinationMedia.astro', import.meta.url), 'utf8');
  assert(route.includes('<DestinationMedia media={media} title={place.name} />'));
  assert(media.includes('Video đang được cập nhật'));
  assert(!route.includes('PlaceArt'));
  assert(media.includes('Chưa có ảnh hoặc video được duyệt · Khung chờ nội dung'));
  assert(route.includes('Ghim tham khảo tạm thời · Không phải lối vào đã xác minh.'));
  assert(controller.includes('video.autoplay = false'));
});

test('new destination identities work with existing selection/nearby contracts and one shared controller/page catalog', () => {
  const visible = new Set(filterNeighborhoodPlaces(prototypePlaces, createNeighborhoodState(), prototypeDistrictPlaceSlugs)
    .map(place => place.slug));
  for (const id of integratedPrototypeIds) {
    assert.equal(selectDestination(undefined, id, visible), id);
    const place = prototypePlaces.find(place => place.slug === id)!;
    assert(nearbyDestinations(place, prototypePlaces).every(nearby => nearby.place.slug !== id));
  }
  assert.equal(selectDestination('pho-sach-dinh-le', heldPrototypeIds[0], visible), 'pho-sach-dinh-le');
  assert(route.includes('prototypeCollection as places') && controller.includes('prototypePlaces as places'));
  for (const path of ['../src/pages/index.astro', '../src/pages/imap.astro']) {
    assert(!readFileSync(new URL(path, import.meta.url), 'utf8').includes('data/imap-prototype'));
  }
});
