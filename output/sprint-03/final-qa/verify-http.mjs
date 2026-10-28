// Bounded local HTTP checks; no browser execution, OSM tiles or video requests.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const origin = 'http://localhost:4321/';
const results = [];
const modules = new Set();
function localUrl(path, from = origin) {
  try { return new URL(path, from); }
  catch (cause) { throw new Error('Invalid local QA URL', { cause }); }
}
async function local(path, from = origin) {
  const url = localUrl(path, from);
  assert.equal(url.origin, 'http://localhost:4321', 'external traffic is excluded');
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, 200, `${url.pathname}: ${response.status}`);
  return { url, response };
}
for (const [route, id] of [['/', 'home-imap'], ['/imap/', 'full-imap']]) {
  const { response } = await local(route);
  const html = await response.text();
  assert.match(html, /<!doctype html>/i); assert.match(html, /<\/html>/i);
  assert.equal([...html.matchAll(/<hanoi-imap\b/g)].length, 1);
  assert(html.includes(`data-imap-instance="${id}"`));
  const templates = [...html.matchAll(/<template\b[^>]*data-imap-story="([^"]+)"[^>]*>([\s\S]*?)<\/template>/g)];
  assert.equal(templates.length, 6);
  for (const [, slug, story] of templates) {
    assert(story.includes('Chưa có video riêng đã xác minh'));
    assert(!story.includes('<video') && !story.includes('<iframe'));
    assert(story.indexOf('<h2') < story.indexOf('data-destination-video'), slug);
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  const entry = [...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(match => match[1])
    .find(path => /\/_astro\/IMap\./.test(path));
  assert(entry, 'missing production iMap controller');
  const controller = await local(entry);
  assert.match(controller.response.headers.get('content-type') || '', /(?:java|ecma)script/);
  const code = await controller.response.text();
  const dependency = code.match(/\bimport\s*\(\s*(['"`])([^'"`]*leaflet[^'"`]*)\1\s*\)/)?.[2];
  assert(dependency, 'missing Leaflet dependency');
  const dependencyUrl = localUrl(dependency, controller.url).href;
  if (!modules.has(dependencyUrl)) {
    const leaflet = await local(dependencyUrl);
    assert.match(leaflet.response.headers.get('content-type') || '', /(?:java|ecma)script/);
    assert.match(await leaflet.response.text(), /\bexport\s*(?:default|\{)/);
    modules.add(dependencyUrl);
  }
  results.push({ route, completeHtml: true, instances: 1, destinationTemplates: 6,
    leafletModuleDelivered: true, compactMobileDiscoveryEnabled: html.includes('data-mobile-discovery="true"') });
  console.log(`${route}: complete HTML, one instance, six title/frame templates, valid controller/Leaflet module`);
}
const { response } = await local('/images/heritage-lotus.webp');
assert.match(response.headers.get('content-type') || '', /^image\/webp/);
assert.deepEqual(Buffer.from(await response.arrayBuffer()), readFileSync('public/images/heritage-lotus.webp'));
console.log('Approved lotus cover: HTTP 200, WebP MIME and exact local asset bytes');
console.log('KNOWN QA GAP: /imap/ does not enable the homepage compact mobile discovery architecture. No runtime fix made.');
writeFileSync('output/sprint-03/final-qa/http-results.json', JSON.stringify({ results, browserVerified: false, externalRequests: 0 }, null, 2) + '\n');
