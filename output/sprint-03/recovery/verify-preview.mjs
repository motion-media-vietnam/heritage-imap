// Lightweight HTTP verification only. Does not execute browser code or request tiles.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const origin = 'http://localhost:4321';
const assets = new Map();
const killCount = () => Number(readFileSync('/sys/fs/cgroup/memory.events', 'utf8').match(/^oom_kill\s+(\d+)/m)?.[1] || 0);
const beforeKills = killCount();
async function request(path) {
  const url = new URL(path, origin);
  assert.equal(url.origin, origin, 'no external requests during recovery verification');
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${url.pathname}: ${response.status} ${response.statusText}`);
  const body = await response.text();
  assert(body.length > 0, `${url.pathname}: empty body`);
  return { url, body, type: response.headers.get('content-type') || '' };
}
async function script(path) {
  const url = new URL(path, origin).href;
  if (!assets.has(url)) {
    const result = await request(url);
    assert.match(result.type, /(?:java|ecma)script/, `wrong module MIME: ${url}`);
    assets.set(url, result);
  }
  return assets.get(url);
}
for (const [route, instance] of [['/', 'home-imap'], ['/imap/', 'full-imap'], ['/imap-prototype/', null]]) {
  const { body: html } = await request(route);
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<\/body>\s*<\/html>/i, 'incomplete document');
  if (instance) {
    assert(html.includes(`data-imap-instance="${instance}"`));
    assert.equal([...html.matchAll(/<hanoi-imap\b/g)].length, 1);
    assert.equal([...html.matchAll(/data-imap-story=/g)].length, 6);
    assert(!html.includes('id="live-map"') && !html.includes('data-map-detail'));
  } else {
    assert(html.includes('id="prototype-explorer"'));
    assert.equal([...html.matchAll(/data-prototype-story=/g)].length, 6);
  }
  const entries = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)].map(m => m[1]);
  const entry = entries.find(path => instance ? path.includes('/src/components/imap/IMap.astro') || /\/_astro\/IMap\./.test(path)
    : /\/(?:src\/pages\/|_astro\/)imap-prototype/.test(path));
  assert(entry, 'missing map browser entry');
  let module = await script(entry);
  const imported = module.body.match(/import\s*["']([^"']*\/src\/scripts\/imap(?:-prototype)?\.ts(?:\?[^"']*)?)["']/)?.[1];
  if (imported) module = await script(new URL(imported, module.url));
  assert(!module.body.includes('/src/scripts/explore.ts'));
  const dependency = module.body.match(/\bimport\s*\(\s*(['"`])([^'"`]*leaflet[^'"`]*)\1\s*\)/)?.[2];
  assert(dependency, 'missing Leaflet dynamic import');
  const leaflet = await script(new URL(dependency, module.url));
  assert.match(leaflet.body, /\bexport\s*(?:default|\{)/);
  assert.equal(killCount(), beforeKills, 'new OOM kill during HTTP verification');
  console.log(`${route}: complete HTML (${html.length} chars), correct instance/templates; Leaflet HTTP 200, JavaScript (${leaflet.body.length} chars)`);
  if (route === '/') {
    assert.equal([...html.matchAll(/<article\b[^>]*class="(?:current-choice|past-choice)"[^>]*>/g)].length, 3);
    for (const id of ['2CxNZtrFedo', 'Sige0y8XxeU', '-jVXCHcCoiw']) assert(html.includes(`https://www.youtube.com/watch?v=${id}`));
    for (const asset of ['autumn', 'com', 'tea']) {
      const image = await fetch(`${origin}/images/heritage-temporary-${asset}.jpg`, { signal: AbortSignal.timeout(10000) });
      assert.equal(image.status, 200); assert.match(image.headers.get('content-type') || '', /^image\/jpeg/);
      assert((await image.arrayBuffer()).byteLength > 0);
    }
    console.log('Homepage: 3 correct Heritage associations and all 3 local cover JPEGs verified');
  }
}
console.log('HTTP checks passed; no OSM tile or video requests made. Browser/touch/geographic-tile acceptance remains pending.');
