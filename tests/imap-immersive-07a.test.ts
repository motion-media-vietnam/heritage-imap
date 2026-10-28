import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { prototypeCollection, prototypePlaces, filterPrototypeCollection, isMappedPrototypePlace, operaLocationEvidence } from '../src/data/imap-prototype.ts';
import { createNeighborhoodState, filterNeighborhoodPlaces, markerCategory, clusterProjectedPoints } from '../src/lib/imap-neighborhood.ts';
import { demoLocation } from '../src/data/places.ts';
import { dedicatedVideos } from '../src/lib/imap-prototype.ts';
import { selectDestination } from '../src/lib/imap-prototype.ts';
import { featuredPrototypeStories, featuredYouTubeEmbedUrl } from '../src/data/imap-featured.ts';

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const controller = source('src/scripts/imap-prototype.ts');
const route = source('src/components/imap/PrototypeExplorer.astro');
const css = source('src/styles/imap-prototype.css');
function functions(...names: string[]) {
  const ast = ts.createSourceFile('controller.ts', controller, ts.ScriptTarget.Latest, true);
  return ts.transpileModule(ast.statements.filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text ?? ''))
    .map(node => node.getText(ast)).join('\n'), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
}

test('Opera is one verified mapped record immediately after Phố Cổ, with content/video still pending', () => {
  const index = prototypeCollection.findIndex(place => place.slug === 'pho-co');
  const opera = prototypeCollection[index + 1]!;
  assert.equal(opera.name, 'Nhà hát Opera Hà Nội');
  assert.equal(isMappedPrototypePlace(opera), true);
  assert.deepEqual(opera.coordinates, { lat: 21.0242022, lng: 105.8578344 });
  assert.deepEqual(opera.coordinates, operaLocationEvidence.coordinates);
  assert(operaLocationEvidence.mapSourceUrl.includes('W37933050'));
  assert.equal(opera.area, '1 Tràng Tiền, phường Cửa Nam, Hà Nội');
  assert.equal(markerCategory(opera), 'stamp-worthy-spot');
  assert.equal(opera.story, 'Nội dung đang được cập nhật.');
  assert.equal(opera.portraitImage, undefined);
  assert.equal(featuredPrototypeStories[opera.slug], undefined);
  assert.equal(dedicatedVideos[opera.slug], undefined);
  assert.equal(prototypeCollection, prototypePlaces);
  assert.equal(new Set(prototypeCollection.map(place => place.slug)).size, prototypeCollection.length);
});

test('Opera obeys the same radius/category/district/search filters as every mapped destination', () => {
  const state = createNeighborhoodState();
  const operaId = 'nha-hat-opera-ha-noi';
  const ids = (next = state) => filterPrototypeCollection(next).map(place => place.slug);
  assert(ids().includes(operaId));
  assert.deepEqual(ids({ ...state, query: 'opera ha noi' }), [operaId]);
  assert(ids({ ...state, district: 'Hoàn Kiếm' }).includes(operaId));
  assert(!ids({ ...state, category: 'experience' }).includes(operaId));
  assert(ids({ ...state, category: 'stamp-worthy-spot' }).includes(operaId));
  assert.deepEqual(ids({ ...state, query: 'no-matching-destination' }), []);
  assert(!ids({ ...state, radius: 500 }).includes(operaId));
  for (const radius of [1000, 2000, 'All'] as const) assert(ids({ ...state, radius }).includes(operaId));
  const opera = prototypePlaces.find(place => place.slug === operaId)!;
  assert(ids({ ...state, center: opera.coordinates, radius: 500 }).includes(operaId));
  for (const radius of [500, 1000, 2000, 'All'] as const) {
    const next = { ...state, center: { ...demoLocation }, radius };
    const snapshot = structuredClone(next);
    const expected = filterNeighborhoodPlaces(prototypePlaces, next).map(place => place.slug).sort();
    assert.deepEqual(ids(next).sort(), expected);
    assert.deepEqual(next, snapshot, 'filtering must not change radius or camera origin');
  }
  assert.equal(selectDestination('pho-co', operaId, new Set(ids({ ...state, radius: 500 }))), 'pho-co');
  assert.equal(selectDestination('pho-co', operaId, new Set(ids())), operaId);
});

test('Opera enters the normal marker/clustering pipeline exactly once, with shared marker/list selection handlers', () => {
  const filtered = filterPrototypeCollection(createNeighborhoodState());
  const groups = clusterProjectedPoints(filtered.map(place => ({ id: place.slug,
    x: place.coordinates.lng * 100000, y: place.coordinates.lat * 100000 })));
  const members = groups.flat().map(point => point.id);
  assert.equal(members.filter(id => id === 'nha-hat-opera-ha-noi').length, 1);
  assert.equal(new Set(members).size, filtered.length);
  assert(controller.includes('const candidates = places.filter(place => visible.has(place.slug));'));
  assert(controller.includes("marker.on('click', () => clustered ? openDirectory(ids) : openPlace(place.slug, marker.getElement()))"));
  assert(controller.includes("on(button, 'click', () => openPlace(button.dataset.selectPlace!, button))"));
});

test('desktop hides only the map, keeps the collection, and enlarges the uncropped player; mobile layout remains separate', () => {
  assert(css.includes('@media (min-width: 961px)'));
  assert(css.includes("grid-template-areas: 'directory story'"));
  assert(css.includes('minmax(0, 26fr) minmax(0, 74fr)'));
  assert(css.includes('.explorer.has-story .map-column { display: none; }'));
  assert(css.includes('aspect-ratio: 16 / 9'));
  assert(css.includes('object-fit: contain'));
  assert(css.includes('.explorer, .explorer.has-story { display: block;'));
  assert(route.includes('Quay lại bản đồ'));
  assert(source('src/components/DestinationMedia.astro').includes('Video đang được cập nhật'));
  assert(route.includes('<DestinationMedia media={media} title={place.name} />'));
  assert(!route.includes('PlaceArt'));
  assert(route.includes('mappedPlace && googleWalkingDirections(mappedPlace.coordinates)'));
  assert(route.includes('nearbyDestinations(mappedPlace, mappedPlaces)'));
  assert(!controller.includes('requestFullscreen'));
  assert(controller.includes('trackResize: false'), 'Leaflet must not resize itself while hidden');
});

test('desktop selection never resizes or pans the hidden map; closing resizes the same map without changing camera or filters', () => {
  let invalidations = 0; let markers = 0; let unloaded = 0;
  const state = createNeighborhoodState();
  const context = {
    mobile: { matches: false }, story: { hidden: false }, selected: 'pho-co',
    cameraReady: true, cameraFlight: false, cameraIntent: 'selection', state,
    map: { invalidateSize() { invalidations++; }, panBy() { assert.fail('desktop selection must not pan'); } },
    renderMarkers() { markers++; }, stopVideo() { unloaded++; }, reopen: { hidden: true },
    explorer: { classList: { remove() {} } }, setSheetState() {},
  };
  runInNewContext(`${functions('resizeMap', 'keepSelectedVisible', 'closeStory')}\nresizeMap(); keepSelectedVisible();`, context);
  assert.equal(invalidations, 0);
  runInNewContext('closeStory(false);', context);
  assert.equal(invalidations, 1); assert.equal(markers, 1); assert.equal(unloaded, 1);
  assert.equal(context.selected, 'pho-co'); assert.equal(context.story.hidden, true);
  assert.deepEqual(context.state, state);
});

test('switching directly between desktop stories and the Opera placeholder unloads the old player first', () => {
  const ids = ['pho-co', 'pho-sach-dinh-le', 'nha-hat-opera-ha-noi'];
  let frames: Array<{ src: string }> = [];
  const context = {
    prototypeCollection, visible: new Set(ids), selectDestination,
    selected: undefined as string | undefined, previousFocus: null, cameraFlight: false,
    mobile: { matches: false }, story: { hidden: true, focus() {} }, storyLabel: { textContent: '' },
    templates: new Map(ids.map(id => [id, { content: { cloneNode: () => {
      const featured = featuredPrototypeStories[id];
      return { src: featured && featuredYouTubeEmbedUrl(featured.youtubeUrl) };
    } } }])),
    content: {
      querySelectorAll: (selector: string) => selector === 'iframe' ? frames : [],
      replaceChildren() { for (const frame of frames) assert.equal(frame.src, 'about:blank'); frames = []; },
      append(frame: { src?: string }) { assert.equal(frames.length, 0); if (frame.src) frames.push({ src: frame.src }); },
      scrollTop: 0,
    },
    explorer: { classList: { add() {} } }, reopen: { hidden: true },
    filter() {}, setSheetState() {}, measureStoryFrame: () => 0, resizeMap() {}, keepSelectedVisible() {},
    videoHeight: 0, cameraIntent: 'discovery',
  };
  runInNewContext(functions('stopVideo', 'openPlace'), context);
  let previous: { src: string } | undefined;
  for (const id of [...ids, ids[0]!]) {
    runInNewContext(`openPlace('${id}', {});`, context);
    assert.equal(context.selected, id);
    assert.equal(frames.length, id === 'nha-hat-opera-ha-noi' ? 0 : 1);
    if (previous) assert.equal(previous.src, 'about:blank');
    previous = frames[0];
  }
});
