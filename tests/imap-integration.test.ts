import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import postcss from 'postcss';
import ts from 'typescript';
import { places, demoLocation } from '../src/data/places.ts';
import { createExplorerState, filterExplorerPlaces, createInstanceLifetime } from '../src/lib/imap.ts';

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('frozen Hero and sections outside the explorer are byte-identical', () => {
  const index = source('src/pages/index.astro');
  const before = JSON.parse(source('tests/fixtures/homepage-frozen-sections.json'));
  assert.equal(index.slice(index.indexOf('  <section class="hero"'), index.indexOf('  <HeritageChoice />')), before.hero);
  assert.equal(index.slice(index.indexOf('  <div class="editorial-topics shell">'), index.indexOf('</Layout>')), before.afterExplorer);
  assert.equal([...index.matchAll(/<HeritageChoice\s*\/>/g)].length, 1);
  assert(index.includes('searchId="search"') && index.includes('filtersId="experiences"'));
  assert(index.includes('id="explore"') && index.includes('id="results-heading"') && index.includes('id="nearby"'));
  assert(!index.includes('MapExplorer') && !index.includes("import '../scripts/explore'"));
});

test('every shared explorer CSS selector is scoped, with approved ratios and media framing', () => {
  const css = postcss.parse(source('src/styles/imap.css'));
  css.walkRules(rule => {
    for (const selector of rule.selectors) assert(selector.startsWith('.imap-root'), `unscoped selector: ${selector}`);
  });
  const text = css.toString();
  assert(text.includes('22fr) minmax(0, 45fr) minmax(0, 33fr)'));
  assert(text.includes('22fr) minmax(0, 78fr)'));
  assert(text.includes('aspect-ratio: 16 / 9') && text.includes('object-fit: contain'));
  assert(text.includes('var(--imap-chrome-height'));
  assert(text.includes('prefers-reduced-motion'));
});

test('each explorer has independent origin, filters, selection and sheet state', () => {
  const first = createExplorerState();
  const second = createExplorerState();
  assert.notEqual(first, second); assert.notEqual(first.origin, second.origin);
  first.origin.lat = 52.52; first.origin.lng = 13.405; first.nearby = true; first.selected = 'pho-co'; first.sheet = 'expanded';
  assert.equal(filterExplorerPlaces(places, first).length, 0);
  assert.equal(filterExplorerPlaces(places, second).length, 6);
  assert.deepEqual(second.origin, demoLocation); assert.equal(second.selected, undefined); assert.equal(second.sheet, 'collapsed');
  second.query = 'pho co'; second.category = 'Phố & cầu'; second.district = 'Hoàn Kiếm';
  assert.deepEqual(filterExplorerPlaces(places, second).map(place => place.slug), ['pho-co']);
  second.district = 'Tây Hồ'; assert.equal(filterExplorerPlaces(places, second).length, 0);
  assert.equal(filterExplorerPlaces(places, second, false).length, 1);
});

test('instance disposal aborts only its own listeners and releases every owned resource once', () => {
  const first = createInstanceLifetime(); const second = createInstanceLifetime();
  const target = new EventTarget(); let firstEvents = 0; let secondEvents = 0; const released: string[] = [];
  target.addEventListener('selection', () => firstEvents++, { signal: first.signal });
  target.addEventListener('selection', () => secondEvents++, { signal: second.signal });
  for (const resource of ['map', 'observer', 'player']) first.onCleanup(() => released.push(resource));
  target.dispatchEvent(new Event('selection')); first.dispose(); first.dispose();
  target.dispatchEvent(new Event('selection'));
  assert.equal(firstEvents, 1); assert.equal(secondEvents, 2);
  assert(first.disposed && first.signal.aborted && !second.disposed && !second.signal.aborted);
  assert.deepEqual(released, ['player', 'observer', 'map']);
  first.onCleanup(() => released.push('late-import')); assert.equal(released.at(-1), 'late-import'); second.dispose();
});

test('the active shared Leaflet layer retains the approved endpoint, referrer policy and attribution', () => {
  const text = source('src/scripts/imap.ts');
  const ast = ts.createSourceFile('imap.ts', text, ts.ScriptTarget.Latest, true);
  const layers: ts.CallExpression[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'tileLayer') layers.push(node);
    ts.forEachChild(node, visit);
  };
  visit(ast); assert.equal(layers.length, 1);
  assert.equal(layers[0]!.arguments[0]?.getText(ast), "'https://tile.openstreetmap.org/{z}/{x}/{y}.png'");
  const options = layers[0]!.arguments[1]!.getText(ast);
  assert(options.includes("referrerPolicy: 'strict-origin-when-cross-origin'"));
  assert(options.includes('maxZoom: 19') && options.includes('https://www.openstreetmap.org/copyright'));
  assert(!text.includes('window.location') && !text.includes('localStorage'));
  assert(text.includes('new ResizeObserver(resize)') && text.includes('observer.disconnect()'));
  assert(text.includes('map.invalidateSize({ pan: false })') && text.includes('map.setView(center, zoom, { animate: false })'));
  assert(text.includes('lifetime.disposed') && text.includes('disconnectedCallback()'));
});

function verifyIntegrated(html: string, prefix: string) {
  assert.match(html, /<\/html>/);
  assert.equal([...html.matchAll(/<hanoi-imap\b/g)].length, 1);
  assert(html.includes(`data-imap-instance="${prefix}"`));
  assert(html.includes('data-mobile-discovery="true"'));
  assert(html.includes('data-content-mode="published"'));
  assert.equal([...html.matchAll(/data-imap="discovery"/g)].length, 1);
  assert(html.includes('data-sheet-state="collapsed"'));
  assert.equal([...html.matchAll(/data-imap="map"/g)].length, 1);
  assert.equal([...html.matchAll(/data-imap="search"/g)].length, 1);
  assert.equal([...html.matchAll(/data-imap="category"/g)].length, 1);
  assert.equal([...html.matchAll(/data-imap="district"/g)].length, 1);
  assert(!html.includes('id="live-map"') && !html.includes('data-map-detail'));
  assert(!html.includes('cmY1LfX3Aa4') && !html.includes('data-video-trigger="overview"'));
  const templates = [...html.matchAll(/<template\b[^>]*data-imap-story="([^"]+)"[^>]*>([\s\S]*?)<\/template>/g)];
  assert.equal(templates.length, places.length);
  for (const [, slug, story] of templates) {
    const place = places.find(place => place.slug === slug)!;
    assert(place && story?.includes(place.name));
    assert(!story.includes('Chưa có video riêng đã xác minh'));
    assert(!story.includes('Chưa xác minh thông tin thực tế'));
    assert(!story.includes('VIDEO ĐIỂM ĐẾN'));
    assert(story.includes('data-media-state="missing"'));
    assert(story.includes('role="img"'), 'missing media is an illustration, never a player');
    assert(story.indexOf('<h2') < story.indexOf('data-destination-video'));
    assert(!story.includes('<iframe') && !story.includes('<video'));
    assert(story.includes(`to=${place.coordinates.lat}%2C${place.coordinates.lng}`));
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'rendered IDs are unique');
}
const built = new URL('../dist/index.html', import.meta.url);
test('built homepage and full iMap each render one shared explorer without legacy embeds', { skip: !existsSync(built) }, () => {
  const home = source('dist/index.html'); const full = source('dist/imap/index.html');
  verifyIntegrated(home, 'home-imap'); verifyIntegrated(full, 'full-imap');
  assert(home.includes('href="/imap/"') && home.includes('id="results"') && home.includes('id="search"'));
  assert(full.includes('href="/#explore"'));
});

const preview = process.env.HERITAGE_PREVIEW_URL;
test('live homepage and full route serve the active map controller and real Leaflet module', { skip: !preview }, async () => {
  for (const [path, prefix] of [['/', 'home-imap'], ['/imap/', 'full-imap']]) {
    const page = await fetch(new URL(path!, preview), { signal: AbortSignal.timeout(15000) }); assert.equal(page.status, 200);
    const html = await page.text(); verifyIntegrated(html, prefix!);
    const entry = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)].map(m => m[1]!)
      .find(path => path.includes('/src/components/imap/IMap.astro') || /\/_astro\/IMap\./.test(path));
    assert(entry, 'shared component browser entry must be present');
    let moduleUrl = new URL(entry, preview);
    let response = await fetch(moduleUrl); assert.equal(response.status, 200); let code = await response.text();
    const client = code.match(/import\s*["']([^"']*\/src\/scripts\/imap\.ts(?:\?[^"']*)?)["']/)?.[1];
    if (client) { moduleUrl = new URL(client, moduleUrl); response = await fetch(moduleUrl); assert.equal(response.status, 200); code = await response.text(); }
    assert(!code.includes('/src/scripts/explore.ts'), 'legacy homepage controller must not run');
    const dependency = code.match(/\bimport\s*\(\s*(['"`])([^'"`]*leaflet[^'"`]*)\1\s*\)/)?.[2];
    assert(dependency, 'active controller must import Leaflet');
    const leaflet = await fetch(new URL(dependency, moduleUrl)); assert.equal(leaflet.status, 200, leaflet.statusText);
    assert.match(leaflet.headers.get('content-type') || '', /(?:java|ecma)script/);
    await leaflet.arrayBuffer();
  }
});
