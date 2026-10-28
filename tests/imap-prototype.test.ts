import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { places } from '../src/data/places.ts';
import { nearbyDestinations, selectDestination, sheetHeight, dedicatedVideos, practicalInformation, populatedDistricts, filterPrototypeDestinations, sheetStates, sheetStateHeight, nearestSheetState, videoSelectionSheetState } from '../src/lib/imap-prototype.ts';

test('selection is synchronized through one slug and rejects filtered destinations', () => {
  assert.equal(selectDestination(undefined, 'pho-co', new Set(['pho-co'])), 'pho-co');
  assert.equal(selectDestination('pho-co', 'van-mieu', new Set(['pho-co'])), 'pho-co');
});
test('nearby destinations exclude self and sort straight-line distances', () => {
  for (const place of places) {
    const nearby = nearbyDestinations(place, places);
    assert.equal(nearby.length, 3);
    assert(nearby.every(candidate => candidate.place.slug !== place.slug));
    assert(nearby.every((candidate, i) => i === 0 || candidate.km >= nearby[i - 1].km));
  }
});
test('sheet drag clamps expanded and collapsed heights', () => {
  assert.equal(sheetHeight(400, -900, 800), 680);
  assert.equal(sheetHeight(400, 900, 800), 160);
  assert.equal(sheetHeight(400, 50, 800), 350);
});
test('unverified videos are absent and practical facts carry primary source and verification date', () => {
  assert.equal(Object.keys(dedicatedVideos).length, 0);
  assert.equal(practicalInformation['van-mieu'].source, 'https://vanmieu.gov.vn/en');
  assert.match(practicalInformation['van-mieu'].checked, /^\d{4}-\d{2}-\d{2}$/);
});
test('isolated route does not import approved Heritage or production map and preserves OSM fix', () => {
  const route = readFileSync(new URL('../src/pages/imap-prototype.astro', import.meta.url), 'utf8');
  const script = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
  assert(!route.includes('HeritageChoice'));
  assert(!route.includes('MapExplorer'));
  assert(!route.includes('youtube.com/embed'));
  assert.match(script, /referrerPolicy: 'strict-origin-when-cross-origin'/);
  assert.match(script, /https:\/\/tile.openstreetmap.org\/\{z\}\/\{x\}\/\{y\}.png/);
  assert(!script.includes('window.location'));
  assert.match(script, /invalidateSize\(\{ pan: true, animate: false \}\)/);
  assert.doesNotMatch(script, /map\.setView\(center, zoom/, 'resize must not replay a captured camera');
});

test('district discovery contains only populated areas and filters combine', () => {
  assert.deepEqual(populatedDistricts.map(district => district.name).sort(), ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Đống Đa'].sort());
  assert(populatedDistricts.every(district => district.count > 0));
  assert.equal(populatedDistricts.reduce((total, district) => total + district.count, 0), places.length);
  assert.equal(filterPrototypeDestinations(places, '', 'All').length, places.length);
  assert.deepEqual(filterPrototypeDestinations(places, 'pho co', 'Phố & cầu', 'Hoàn Kiếm').map(place => place.slug), ['pho-co']);
  assert.equal(filterPrototypeDestinations(places, 'Văn Miếu', 'All', 'Tây Hồ').length, 0);
  assert.equal(filterPrototypeDestinations(places, '', 'All', 'unknown').length, 0);
});

test('mobile sheet has three distinct snap states inside the map viewport', () => {
  assert.deepEqual(sheetStates, ['collapsed', 'half', 'expanded']);
  for (const available of [280, 640, 800]) {
    const heights = sheetStates.map(state => sheetStateHeight(state, available));
    assert(heights[0]! < heights[1]! && heights[1]! < heights[2]!);
    assert(heights[2]! < available, 'expanded sheet leaves some map visible');
    for (const state of sheetStates) assert.equal(nearestSheetState(sheetStateHeight(state, available), available), state);
    assert.equal(nearestSheetState(-100, available), 'collapsed');
    assert.equal(nearestSheetState(available * 2, available), 'expanded');
  }
});

test('route keeps discovery in an overlay sheet and uses the immersive desktop grid', () => {
  const route = readFileSync(new URL('../src/pages/imap-prototype.astro', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
  const sheet = route.slice(route.indexOf('id="prototype-sheet"'), route.indexOf('<div class="map-column">'));
  assert(sheet.includes('id="prototype-directory"') && sheet.includes('id="prototype-story"'));
  for (const state of sheetStates) assert(sheet.includes(`data-sheet-state="${state}"`));
  assert(route.includes('id="prototype-district"') && route.includes('id="prototype-category"'));
  assert(css.includes('grid-template-columns: minmax(0, 26fr) minmax(0, 74fr)'));
  assert.match(css, /\.prototype-sheet \{ position: absolute;/);
  assert(css.includes('--sheet-overlay-height'), 'attribution is offset above the sheet');
  assert(!route.includes('90 GIÂY') && !route.includes('▶'));
  assert(!route.includes('<iframe') && !route.includes('cmY1LfX3Aa4'));
});

function verifyPrototype(html: string) {
  assert.match(html, /<\/html>/);
  const districts = html.match(/<select\b[^>]*id="prototype-district"[^>]*>([\s\S]*?)<\/select>/)?.[1];
  assert(districts);
  assert.equal([...districts.matchAll(/<option\b/g)].length, populatedDistricts.length + 1);
  const templates = [...html.matchAll(/<template\b[^>]*data-prototype-story="([^"]+)"[^>]*>([\s\S]*?)<\/template>/g)];
  assert.equal(templates.length, places.length);
  for (const [, slug, template] of templates) {
    const place = places.find(candidate => candidate.slug === slug)!;
    assert(place && template?.includes(place.name));
    assert(template.indexOf('<h2') < template.indexOf('data-destination-video'), 'title precedes the landscape frame');
    assert(template.includes('Chưa có video riêng đã xác minh'));
    assert(!template.includes('<iframe') && !template.includes('<video'));
    assert(template.includes(`to=${place.coordinates.lat}%2C${place.coordinates.lng}`));
  }
}
const builtPrototype = new URL('../dist/imap-prototype/index.html', import.meta.url);
test('built prototype retains all destinations and honest per-place video placeholders', { skip: !existsSync(builtPrototype) }, () => {
  verifyPrototype(readFileSync(builtPrototype, 'utf8'));
});
const previewOrigin = process.env.HERITAGE_PREVIEW_URL;
test('isolated prototype preview renders without integrating into the homepage', { skip: !previewOrigin }, async () => {
  const response = await fetch(new URL('/imap-prototype/', previewOrigin), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  verifyPrototype(await response.text());
  const homepage = await fetch(previewOrigin!, { signal: AbortSignal.timeout(15000) });
  assert.equal(homepage.status, 200);
  assert(!(await homepage.text()).includes('id="prototype-explorer"'));
});

test('prototype Leaflet browser module loads, not just its HTML shell', { skip: !previewOrigin }, async () => {
  // Resolve the actual served entry/dependency URL. Never execute it or request OSM tiles.
  const page = await fetch(new URL('/imap-prototype/', previewOrigin), { signal: AbortSignal.timeout(15000) });
  assert.equal(page.status, 200);
  const html = await page.text();
  const entry = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)]
    .map(match => match[1]!).find(path => /\/(?:src\/pages\/|_astro\/)imap-prototype/.test(path));
  assert(entry, 'prototype must have a browser script entry');
  let moduleUrl = new URL(entry, previewOrigin);
  let response = await fetch(moduleUrl, { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  let code = await response.text();
  // Astro dev entry imports the TypeScript client; production entries are bundled.
  const client = code.match(/import\s*["']([^"']*\/src\/scripts\/imap-prototype\.ts(?:\?[^"']*)?)["']/)?.[1];
  if (client) {
    moduleUrl = new URL(client, moduleUrl);
    response = await fetch(moduleUrl, { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    code = await response.text();
  }
  const dependency = code.match(/\bimport\s*\(\s*(['"`])([^'"`]*leaflet[^'"`]*)\1\s*\)/)?.[2];
  assert(dependency, 'client must reference the Leaflet dynamic import');
  const leafletUrl = new URL(dependency, moduleUrl);
  assert.equal(leafletUrl.origin, new URL(previewOrigin!).origin, 'Leaflet code is bundled locally');
  const leaflet = await fetch(leafletUrl, { signal: AbortSignal.timeout(15000) });
  assert.equal(leaflet.status, 200, `${leafletUrl.pathname}: ${leaflet.statusText}`);
  assert.match(leaflet.headers.get('content-type') || '', /(?:java|ecma)script/);
  assert.match(await leaflet.text(), /\bexport\s*(?:default|\{)/);
});

test('destination video preserves the original landscape frame and native user controls', () => {
  const route = readFileSync(new URL('../src/pages/imap-prototype.astro', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
  const native = route.match(/<video\b[^>]*>/)?.[0];
  assert(native && /\bcontrols\b/.test(native) && /\bplaysinline\b/.test(native));
  assert(native.includes('width="1920"') && native.includes('height="1080"'));
  assert(native.includes('preload="none"') && !native.includes('autoplay'));
  const frame = css.match(/\.destination-video\s*\{([^}]+)\}/)?.[1];
  assert(frame && /aspect-ratio:\s*16\s*\/\s*9/.test(frame));
  assert.match(css, /\.destination-video video\s*\{[^}]*object-fit: contain/);
  assert.match(css, /video:fullscreen\s*\{[^}]*object-fit: contain/);
  assert.match(css, /video:-webkit-full-screen\s*\{[^}]*object-fit: contain/);
  const script = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
  assert(script.includes('video.autoplay = false') && !/\.play\s*\(/.test(script));
  assert(script.includes('document.fullscreenElement || fullscreenVideo?.webkitDisplayingFullscreen'));
  assert.equal(Object.keys(dedicatedVideos).length, 0, 'do not invent playable destination sources');
});

test('mobile selection opens enough of an existing sheet state for title and landscape video', () => {
  assert.equal(videoSelectionSheetState(350, 800), 'half');
  assert.equal(videoSelectionSheetState(430, 640), 'expanded');
  assert.equal(videoSelectionSheetState(1000, 300), 'expanded', 'short viewports scroll rather than crop the frame');
});

test('presentation mode hides only marked development chrome without altering map attribution', () => {
  const route = readFileSync(new URL('../src/pages/imap-prototype.astro', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
  const inline = route.match(/<script\b[^>]*data-presentation-init[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert(inline);
  for (const search of ['', '?presentation=0', '?presentation=1']) {
    const document = { documentElement: { dataset: {} as Record<string, string> }, title: 'Prototype' };
    runInNewContext(inline, { document, window: { location: { search } }, URLSearchParams });
    assert.equal(document.documentElement.dataset.presentation, search === '?presentation=1' ? 'true' : undefined);
    assert.equal(document.title, search === '?presentation=1' ? 'iMap · Hanoi' : 'Prototype');
  }
  assert.match(css, /:root\[data-presentation=true\] \.development-only\s*\{\s*display: none;/);
  assert(css.includes(':root[data-presentation=true] astro-dev-toolbar { display: none; }'));
  assert.equal([...route.matchAll(/class="[^"]*\bdevelopment-only\b[^"]*"/g)].length, 3);
  const script = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
  assert(script.includes('https://www.openstreetmap.org/copyright'));
  assert(!script.includes('development-only'));
});

test('mobile header is compact and map-return states preserve destination and camera', () => {
  const route = readFileSync(new URL('../src/pages/imap-prototype.astro', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
  const mobile = css.slice(css.indexOf('@media (max-width: 960px)'));
  assert(mobile.includes('.story-toolbar { display: contents; }'));
  assert.match(mobile, /#prototype-story-label\s*\{[^}]*clip-path: inset\(50%\)/);
  assert(route.includes('<h2 tabindex="-1">{place.name}</h2>'));
  assert.match(route, /<button\b[^>]*data-sheet-state="collapsed"[^>]*>Bản đồ<\/button>/);
  assert(mobile.includes('transition: bottom .18s ease'));
  assert.match(mobile, /@media \(prefers-reduced-motion: reduce\)[\s\S]*transition: none/);
  const script = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
  const snap = script.slice(script.indexOf('function setSheetState('), script.indexOf('function syncSelection('));
  const close = script.slice(script.indexOf('function closeStory('), script.indexOf('function filter('));
  for (const body of [snap, close]) {
    assert(body.length > 0);
    assert(!/\bselected\s*=/.test(body));
    assert(!/resetView\(|\.fitBounds\(|\.setView\(|\.panTo\(/.test(body));
  }
});
