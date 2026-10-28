import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { places } from '../src/data/places.ts';
import { districtPlaceSlugs } from '../src/data/districts.ts';
import { prototypePlaces, prototypeDistrictPlaceSlugs } from '../src/data/imap-prototype.ts';
import { createNeighborhoodState, discoveryCategories, filterNeighborhoodPlaces, markerCategory,
  neighborhoodEmptyMessage, resetNeighborhoodFilters, type DiscoveryPlace } from '../src/lib/imap-neighborhood.ts';

const controller = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
const route = readFileSync(new URL('../src/components/imap/PrototypeExplorer.astro', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
const ast = ts.createSourceFile('prototype.ts', controller, ts.ScriptTarget.Latest, true);
const javascript = (source: string) => ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
function functionSource(name: string) {
  const node = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name);
  assert(node); return node.getText(ast);
}
let resetCallback: ts.CallExpression | undefined;
function findReset(node: ts.Node) {
  if (ts.isCallExpression(node) && node.expression.getText(ast) === 'on'
    && node.arguments[0]?.getText(ast) === 'clearFilters') resetCallback = node;
  ts.forEachChild(node, findReset);
}
findReset(ast);
assert(resetCallback);
const resetSource = javascript(`(${resetCallback.arguments[2]!.getText(ast)})();`);
const filterFunctions = javascript(`${functionSource('filter')}\n${functionSource('syncSelection')}`);

/** Executes real filter/reset callbacks against controlled DOM nodes, not a browser renderer. */
function filterHarness(all: DiscoveryPlace[] = places,
  membership: Readonly<Record<string, readonly string[]>> = districtPlaceSlugs) {
  const nodes: Record<string, { textContent: string; hidden: boolean }> = Object.fromEntries([
    '#prototype-count', '#directory-heading', '#prototype-empty', '#prototype-empty-message', '#prototype-filter-feedback',
  ].map(id => [id, { textContent: '', hidden: true }]));
  const buttons = all.map(place => {
    const item = { hidden: false }; const attributes = new Map<string, string>();
    return { dataset: { selectPlace: place.slug }, item, attributes,
      closest: () => item, setAttribute: (name: string, value: string) => attributes.set(name, value) };
  });
  const evidence = { rendered: [] as string[], renderedSelection: undefined as string | undefined,
    closes: 0, restoreFocus: true, circles: [] as Array<number | 'All'>, focus: false };
  const context = {
    places: all, districtPlaceSlugs: membership, createNeighborhoodState, discoveryCategories, filterNeighborhoodPlaces,
    markerCategory, neighborhoodEmptyMessage, resetNeighborhoodFilters,
    state: createNeighborhoodState(), selected: undefined as string | undefined,
    clusterIds: undefined as Set<string> | undefined, visible: new Set<string>(),
    search: { value: '', focus: (options: { preventScroll: boolean }) => { assert(options.preventScroll); evidence.focus = true; } },
    categorySelect: { value: 'All' }, districtSelect: { value: 'All' }, radiusSelect: { value: '1000' },
    districtOptions: Object.keys(membership).map(value => ({ value, hidden: false, textContent: '' })),
    categoryOptions: discoveryCategories.map(category => ({ value: category.id, textContent: '' })),
    directory: buttons, directoryAll: { hidden: true }, clearFilters: { hidden: true },
    reopen: { hidden: true }, story: { hidden: true }, discovery: { textContent: '' },
    content: { querySelectorAll: () => [] }, document: { querySelector: (selector: string) => {
      assert(nodes[selector], `Unexpected DOM query: ${selector}`); return nodes[selector];
    } },
    closeStory(restoreFocus: boolean) { evidence.closes++; evidence.restoreFocus = restoreFocus; context.story.hidden = true; },
    renderMarkers() { evidence.rendered = [...context.visible]; evidence.renderedSelection = context.selected; },
    updateCircle() { evidence.circles.push(context.state.radius); },
    // Any camera write from filter/reset is a regression, even when the selected item is cleared.
    map: { setView: () => assert.fail('must not recenter'), fitBounds: () => assert.fail('must not fit'),
      flyTo: () => assert.fail('must not fly'), panBy: () => assert.fail('must not pan') },
    focusDiscovery: () => assert.fail('must not fit discovery'),
  };
  const run = (source: string) => runInNewContext(source, context, { timeout: 2000 });
  run(filterFunctions);
  return { context, nodes, buttons, evidence, run };
}

test('explicit filter reset restores approved defaults without changing accepted center or input state', () => {
  const state = { ...createNeighborhoodState(), center: { ...places[4]!.coordinates },
    query: 'pho co', category: 'food-drink' as const, radius: 'All' as const, district: 'Tây Hồ' };
  const before = structuredClone(state); const reset = resetNeighborhoodFilters(state);
  assert.deepEqual(state, before);
  assert.deepEqual(reset, { ...createNeighborhoodState(), center: before.center });
  assert.notEqual(reset.center, state.center);
});

test('empty messages distinguish unpublished categories, absent search terms and combined geographic filters', () => {
  const defaults = createNeighborhoodState();
  assert.match(neighborhoodEmptyMessage(places, { ...defaults, category: 'food-drink', query: 'zzzz' }), /Danh mục này chưa/);
  assert.match(neighborhoodEmptyMessage(places, { ...defaults, query: 'zzzz' }), /từ khóa/);
  const narrowed = { ...defaults, radius: 500 as const, query: 'pho co', category: 'stamp-worthy-spot' as const };
  assert.equal(filterNeighborhoodPlaces(places, narrowed).length, 0);
  assert.match(neighborhoodEmptyMessage(places, narrowed), /mở rộng bán kính/);
  assert.equal(filterNeighborhoodPlaces(places, { ...narrowed, radius: 1000 }).length, 1);
});

test('real filter callback keeps count, list, marker inputs, selection and empty messages synchronized', () => {
  const { context: c, nodes, buttons, evidence, run } = filterHarness();
  run('filter()');
  assert.deepEqual(evidence.rendered, ['ho-hoan-kiem', 'pho-co']);
  assert.equal(nodes['#prototype-count']!.textContent, '2 địa điểm');
  assert.equal(buttons.filter(button => !button.item.hidden).length, 2);
  assert.equal(c.clearFilters.hidden, true);
  c.selected = 'pho-co'; run('filter(false)');
  assert.equal(buttons[1]!.attributes.get('aria-pressed'), 'true');
  assert.equal(evidence.renderedSelection, 'pho-co');
  c.story.hidden = false; c.search.value = 'ho guom'; run('filter()');
  assert.deepEqual(evidence.rendered, ['ho-hoan-kiem']);
  assert.equal(buttons.filter(button => !button.item.hidden).length, 1);
  assert.equal(nodes['#prototype-count']!.textContent, '1 địa điểm');
  assert.equal(c.selected, undefined); assert.equal(c.reopen.hidden, true);
  assert.equal(c.story.hidden, true); assert.equal(evidence.closes, 1); assert.equal(evidence.restoreFocus, false);
  assert(buttons.every(button => button.attributes.get('aria-pressed') === 'false'));
  assert.match(nodes['#prototype-filter-feedback']!.textContent, /không còn trong bộ lọc/);
  c.search.value = ''; c.categorySelect.value = 'stay'; run('filter()');
  assert.equal(nodes['#prototype-count']!.textContent, '0 địa điểm');
  assert.equal(nodes['#prototype-empty']!.hidden, false);
  assert.match(nodes['#prototype-empty-message']!.textContent, /Danh mục này chưa/);
  assert.equal(buttons.filter(button => !button.item.hidden).length, 0);
  assert.deepEqual(evidence.rendered, []); assert.equal(c.clearFilters.hidden, false);
  assert.equal(c.categorySelect.value, 'stay'); // No automatic fallback to another category.
  assert.equal(c.state.category, 'stay');
});

test('actual clear action updates all controls, radius circle and results without changing map/center or scrolling focus', () => {
  const { context: c, nodes, evidence, run } = filterHarness();
  const center = { ...places[4]!.coordinates };
  c.state = { ...c.state, center, radius: 'All' }; c.radiusSelect.value = 'All';
  c.search.value = 'zzzz'; c.categorySelect.value = 'experience'; c.districtSelect.value = 'Hoàn Kiếm';
  c.clusterIds = new Set(['ho-hoan-kiem']); run('filter()');
  run(resetSource);
  assert.deepEqual(c.state.center, center);
  assert.equal(c.search.value, ''); assert.equal(c.categorySelect.value, 'All');
  assert.equal(c.radiusSelect.value, '1000'); assert.equal(c.districtSelect.value, 'All');
  assert.equal(c.state.radius, 1000); assert.equal(c.clusterIds, undefined);
  assert.deepEqual(evidence.circles, [1000]); assert(evidence.focus);
  const eligible = filterNeighborhoodPlaces(places, c.state);
  assert.deepEqual(evidence.rendered, eligible.map(place => place.slug));
  assert.equal(nodes['#prototype-count']!.textContent, `${eligible.length} địa điểm`);
});

test('search, category, radius and neighborhood compose without silently resetting any filter', () => {
  const { context: c, nodes, evidence, run } = filterHarness();
  c.search.value = 'pho co'; c.categorySelect.value = 'stamp-worthy-spot';
  c.districtSelect.value = 'Hoàn Kiếm'; c.state.radius = 500;
  run('filter()');
  assert.deepEqual(evidence.rendered, []); assert.match(nodes['#prototype-empty-message']!.textContent, /mở rộng bán kính/);
  c.state.radius = 1000; run('filter()'); assert.deepEqual(evidence.rendered, ['pho-co']);
  c.search.value = 'zzzz'; run('filter()');
  assert.match(nodes['#prototype-empty-message']!.textContent, /từ khóa/);
  assert.equal(c.search.value, 'zzzz'); assert.equal(c.state.radius, 1000);
  assert.equal(c.categorySelect.value, 'stamp-worthy-spot'); assert.equal(c.districtSelect.value, 'Hoàn Kiếm');
});

test('05B catalog: actual filter callback synchronizes new categories, neighborhoods, selected records and counts', () => {
  const { context: c, nodes, buttons, evidence, run } = filterHarness(prototypePlaces, prototypeDistrictPlaceSlugs);
  run('filter()');
  assert.equal(evidence.rendered.length, 7);
  assert.equal(nodes['#prototype-count']!.textContent, '7 địa điểm');
  assert.equal(buttons.filter(button => !button.item.hidden).length, 7);
  c.selected = 'pho-sach-dinh-le'; c.story.hidden = false; run('filter(false)');
  assert.equal(buttons.find(button => button.dataset.selectPlace === c.selected)!.attributes.get('aria-pressed'), 'true');
  assert.equal(evidence.renderedSelection, 'pho-sach-dinh-le');
  c.categorySelect.value = 'experience'; c.districtSelect.value = 'Hoàn Kiếm'; run('filter()');
  assert.equal(evidence.rendered.length, 2);
  assert.equal(buttons.filter(button => !button.item.hidden).length, 2);
  assert.equal(nodes['#prototype-count']!.textContent, '2 địa điểm');
  c.search.value = 'dinh le'; c.state.radius = 500; run('filter()');
  assert.deepEqual(evidence.rendered, ['pho-sach-dinh-le']);
  c.search.value = ''; c.categorySelect.value = 'stay'; run('filter()');
  assert.equal(c.selected, undefined); assert.equal(c.story.hidden, true); assert.equal(c.reopen.hidden, true);
  assert.deepEqual(evidence.rendered, []);
  assert.match(nodes['#prototype-empty-message']!.textContent, /mở rộng bán kính/);
  c.state.radius = 1000; run('filter()');
  assert.deepEqual(evidence.rendered, ['sofitel-legend-metropole-hanoi']);
  assert.equal(nodes['#prototype-count']!.textContent, '1 địa điểm');
});

test('05B catalog: held food marker remains absent and explicit reset restores seven defaults without recentering', () => {
  const { context: c, nodes, evidence, run } = filterHarness(prototypePlaces, prototypeDistrictPlaceSlugs);
  const center = { ...c.state.center };
  c.categorySelect.value = 'food-drink'; c.state.radius = 'All'; c.radiusSelect.value = 'All';
  run('filter()');
  assert.deepEqual(evidence.rendered, []);
  assert.match(nodes['#prototype-empty-message']!.textContent, /Danh mục này chưa/);
  assert.equal(c.categorySelect.value, 'food-drink');
  run(resetSource);
  assert.deepEqual(c.state.center, center);
  assert.equal(c.state.radius, 1000); assert.equal(c.categorySelect.value, 'All');
  assert.equal(evidence.rendered.length, 7); assert.equal(nodes['#prototype-count']!.textContent, '7 địa điểm');
  assert.equal(c.clearFilters.hidden, true); assert(evidence.focus);
});

test('reset/feedback and selected list cue remain accessible without changing sheet or video geometry', () => {
  assert(route.includes('id="prototype-clear-filters" type="button"'));
  assert(route.includes('Xóa bộ lọc</button>'));
  assert(route.includes('id="prototype-filter-feedback" class="sr-only" role="status" aria-atomic="true"'));
  assert(css.includes('#prototype-clear-filters { min-height: 44px;'));
  assert(css.includes('.directory button[aria-pressed=true] strong { text-decoration: underline;'));
  assert(css.includes('aspect-ratio: 16 / 9;'));
  assert(css.includes('object-fit: contain;'));
  assert(controller.includes("setSheetState('collapsed')"));
});
