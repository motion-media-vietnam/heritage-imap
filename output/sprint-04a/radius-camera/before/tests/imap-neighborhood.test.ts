import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { demoLocation, places } from '../src/data/places.ts';
import { distanceKm } from '../src/lib/explore.ts';
import { selectDestination } from '../src/lib/imap-prototype.ts';
import { categoryIconSvg, clusterProjectedPoints, createNeighborhoodState, discoveryCategories,
  filterNeighborhoodPlaces, markerCategory, offerDiscoveryArea, parseDiscoveryRadius, resolveDiscoveryLocation, type DiscoveryPlace } from '../src/lib/imap-neighborhood.ts';

const controller = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
const route = readFileSync(new URL('../src/pages/imap-prototype.astro', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
const ast = ts.createSourceFile('prototype.ts', controller, ts.ScriptTarget.Latest, true);
function callMatching(predicate: (call: ts.CallExpression) => boolean) {
  let found: ts.CallExpression | undefined;
  const visit = (node: ts.Node) => { if (ts.isCallExpression(node) && predicate(node)) found = node; ts.forEachChild(node, visit); };
  visit(ast); assert(found); return found;
}

test('default Hoan Kiem discovery uses actual geographic distances with 500m/1km/2km/All', () => {
  const state = createNeighborhoodState();
  assert.deepEqual(state.center, demoLocation); assert.notEqual(state.center, demoLocation); assert.equal(state.radius, 1000);
  const expected = [[500, 1], [1000, 2], [2000, 5], ['All', 6]] as const;
  for (const [radius, count] of expected) assert.equal(filterNeighborhoodPlaces(places, { ...state, radius }).length, count);
  assert.deepEqual(filterNeighborhoodPlaces(places, state).map(place => place.slug), ['ho-hoan-kiem', 'pho-co']);
  assert(Math.abs(distanceKm(demoLocation, places[1]!.coordinates) * 1000 - 830) < 2);
  assert.deepEqual(['500', '1000', '2000', 'All', 'invalid'].map(parseDiscoveryRadius), [500, 1000, 2000, 'All', 1000]);
});

test('radius and administrative filters stay separate; empty category results are honest', () => {
  const state = createNeighborhoodState();
  assert.equal(filterNeighborhoodPlaces(places, { ...state, district: 'Tây Hồ' }).length, 0);
  assert.deepEqual(filterNeighborhoodPlaces(places, { ...state, radius: 'All', district: 'Tây Hồ' }).map(place => place.slug), ['ho-tay']);
  assert.deepEqual(filterNeighborhoodPlaces(places, { ...state, query: 'pho co' }).map(place => place.slug), ['pho-co']);
  for (const category of discoveryCategories) {
    assert.equal(filterNeighborhoodPlaces(places, { ...state, category: category.id }).length, category.id === 'landmark' ? 2 : 0);
  }
  assert(places.every(place => markerCategory(place) === 'landmark'));
  const futureCategories: DiscoveryPlace['category'][] = discoveryCategories.map(category => category.id);
  assert.deepEqual(futureCategories, ['landmark', 'utensils', 'coffee', 'theater', 'bed']);
  assert.equal(new Set(discoveryCategories.map(category => categoryIconSvg(category.id))).size, 5);
});

test('actual denied-geolocation callback preserves discovery and leaves manual filtering available', () => {
  const request = callMatching(call => call.expression.getText(ast) === 'navigator.geolocation.getCurrentPosition');
  const original = createNeighborhoodState();
  const context = { state: original, lifetime: { disposed: false }, resolveDiscoveryLocation,
    locate: { disabled: true }, locationMessage: { textContent: '' } };
  runInNewContext(`(${request.arguments[1]!.getText(ast)})({code:1});`, context);
  assert.equal(context.state, original); assert.deepEqual(context.state.center, demoLocation);
  assert.equal(context.locate.disabled, false); assert(context.locationMessage.textContent.includes('giữ nguyên'));
  assert.equal(filterNeighborhoodPlaces(places, context.state).length, 2);
  assert(controller.indexOf('navigator.geolocation.getCurrentPosition') > controller.indexOf("on(locate, 'click'"));
  assert.equal([...controller.matchAll(/getCurrentPosition\(/g)].length, 1);
  assert(!/watchPosition|localStorage|sessionStorage/.test(controller));
});

test('actual map move callback only offers a new area; accepting it does not move the camera', () => {
  const moved = callMatching(call => call.expression.getText(ast) === 'map.on' && call.arguments[0]?.getText(ast) === "'moveend'");
  const accept = callMatching(call => call.expression.getText(ast) === 'on' && call.arguments[0]?.getText(ast) === 'exploreArea');
  const update = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'updateAreaOffer');
  assert(update);
  const target = places.find(place => place.slug === 'ho-tay')!.coordinates;
  const context = { state: { ...createNeighborhoodState(), radius: 'All' as const }, allowAreaOffer: false,
    map: { getCenter: () => target, setView: () => assert.fail('must not recenter'), fitBounds: () => assert.fail('must not fit city') },
    exploreArea: { hidden: true }, centerLabel: { textContent: '' }, radiusSelect: { value: 'All' },
    renderMarkers: () => {}, updateCircle: () => {}, filter: () => {}, offerDiscoveryArea, resolveDiscoveryLocation };
  runInNewContext(`${update.getText(ast)}; (${moved.arguments[1]!.getText(ast)})();`, context);
  assert(context.exploreArea.hidden); assert.deepEqual(context.state.center, demoLocation);
  context.allowAreaOffer = true;
  runInNewContext(`${update.getText(ast)}; (${moved.arguments[1]!.getText(ast)})();`, context);
  assert.equal(context.exploreArea.hidden, false); assert.deepEqual(context.state.center, demoLocation);
  runInNewContext(`(${accept.arguments[2]!.getText(ast)})();`, context);
  assert.deepEqual(context.state.center, target); assert.equal(context.radiusSelect.value, '1000'); assert(context.exploreArea.hidden);
  assert(!/fitBounds\(places|setView\(\[position\.coords/.test(controller));
});

test('pixel clustering resolves overlapping tap targets transitively without a twelve-record cap', () => {
  // Synthetic SCREEN points only, not invented destination records/coordinates.
  const points = Array.from({ length: 20 }, (_, index) => ({ id: `screen-${index}`, x: index * 20, y: 0 }));
  assert.equal(clusterProjectedPoints(points).length, 1);
  assert.equal(clusterProjectedPoints(points)[0]!.length, 20);
  assert.deepEqual(clusterProjectedPoints([]), []);
  assert.equal(clusterProjectedPoints([{ id: 'left', x: -2, y: 0 }, { id: 'right', x: 2, y: 0 }]).length, 1);
  assert.equal(clusterProjectedPoints([{ id: 'left', x: 0, y: 0 }, { id: 'right', x: 56, y: 0 }]).length, 2);
  assert.throws(() => clusterProjectedPoints(points, 0), RangeError);
});

test('real-coordinate marker projections have no cross-cluster overlap at simulated mobile widths', () => {
  // Geometry simulation, NOT a rendered browser check. WGS84 Web Mercator projection.
  for (const width of [360, 390, 430]) for (const zoom of [11, 13, 15, 17]) {
    const scale = 256 * 2 ** zoom;
    const projected = places.map(place => {
      const latitude = place.coordinates.lat * Math.PI / 180;
      return { id: place.slug, x: (place.coordinates.lng + 180) / 360 * scale + width / 2,
        y: (1 - Math.log(Math.tan(latitude) + 1 / Math.cos(latitude)) / Math.PI) / 2 * scale };
    });
    const groups = clusterProjectedPoints(projected);
    assert.equal(groups.reduce((total, group) => total + group.length, 0), places.length);
    for (let a = 0; a < groups.length; a++) for (let b = a + 1; b < groups.length; b++) {
      for (const p of groups[a]!) for (const q of groups[b]!) assert(Math.hypot(p.x - q.x, p.y - q.y) >= 56);
    }
  }
});

test('actual marker click routes single destinations to stories and clusters to a scoped directory', () => {
  const click = callMatching(call => call.expression.getText(ast) === 'marker.on' && call.arguments[0]?.getText(ast) === "'click'");
  const actions: string[] = [];
  const context = { clustered: false, ids: ['ho-hoan-kiem', 'pho-co'], place: places[1], marker: { getElement: () => null },
    openPlace: (slug: string) => actions.push(slug), openDirectory: (ids: string[]) => actions.push(ids.join(',')) };
  runInNewContext(`(${click.arguments[1]!.getText(ast)})();`, context);
  assert.deepEqual(actions, ['pho-co']); context.clustered = true;
  runInNewContext(`(${click.arguments[1]!.getText(ast)})();`, context);
  assert.equal(actions[1], 'ho-hoan-kiem,pho-co');
  const visible = new Set(filterNeighborhoodPlaces(places, createNeighborhoodState()).map(place => place.slug));
  assert.equal(selectDestination('pho-co', 'van-mieu', visible), 'pho-co');
  assert(controller.includes("setSheetState('half')") && controller.includes("content.querySelector<HTMLElement>('h2')?.focus"));
});

test('prototype retains accessible category targets, selected names and compact video-first sheets', () => {
  assert(controller.includes('iconSize: [48, 48]') && controller.includes("setAttribute('aria-label'"));
  assert(controller.includes('permanent: selectedInGroup') && controller.includes("' is-selected'"));
  assert(css.includes('width: 48px; height: 48px') && css.includes('.curated-icon.is-selected'));
  assert(route.includes('data-marker-number=') && !controller.includes('pin.textContent = String(index'));
  assert(route.includes('id="prototype-discovery"') && route.includes('value="1000" selected'));
  assert(css.includes('.prototype-sheet[data-sheet-state=collapsed] :is(.sheet-states, .directory, .story) { display: none; }'));
  assert(controller.includes('mobileSheetHeight') && controller.includes('nearestMobileSheetState'));
  assert(controller.includes('video.autoplay = false') && !/\.play\s*\(/.test(controller));
  assert(controller.includes('referrerPolicy: \'strict-origin-when-cross-origin\''));
});
