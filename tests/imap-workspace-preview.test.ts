import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { prototypePlaces } from '../src/data/imap-prototype.ts';
import { featuredPrototypeStories } from '../src/data/imap-featured.ts';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const main = read('../src/pages/index.astro');
const standalone = read('../src/pages/imap-prototype.astro');
const view = read('../src/components/imap/PrototypeExplorer.astro');
const css = read('../src/styles/imap-prototype.css');
const layout = read('../src/layouts/Layout.astro');
const controller = read('../src/scripts/imap-prototype.ts');

// Source contracts only, not a signed-in workspace/browser acceptance pass.
test('main page mounts one native shared explorer between hero and unchanged Heritage listing', () => {
  const hero = main.indexOf('<section class="hero"');
  const map = main.indexOf('<PrototypeExplorer embedded />');
  const videos = main.indexOf('<HeritageChoice />');
  assert(hero >= 0 && map > hero && videos > map);
  assert.equal(main.split('<PrototypeExplorer embedded />').length - 1, 1);
  assert(!main.includes('<IMap '));
  assert(!main.includes('<iframe'));
  assert(main.includes('<Layout wide overlayHeader>'));
  assert(layout.indexOf('<slot />') < layout.indexOf('<footer class="site-footer">'));
  assert(!main.includes('id="nearby"'), 'no disconnected legacy map filter control');
});

test('standalone and home reuse the same renderer/data/controller, not a second map or standalone iframe', () => {
  assert(standalone.includes('<PrototypeExplorer />'));
  assert(!standalone.includes('data-prototype-story='));
  assert(view.includes('prototypeCollection as places'));
  assert(view.includes("import '../../scripts/imap-prototype'"));
  assert.equal(controller.match(/L\.map\('prototype-map'/g)?.length, 1);
  assert.equal(view.split('id="prototype-map"').length - 1, 1);
  assert(view.includes('data-prototype-story={place.slug}'));
  assert(!view.includes('<html') && !view.includes('<body') && !view.includes('<main>'));
  assert(!view.includes('preview.code.arvigeus.one'));
  assert.equal(prototypePlaces.length, 12);
  assert.equal(new Set(prototypePlaces.map(place => place.slug)).size, 12);
  const existing = prototypePlaces.filter(place => place.slug !== 'nha-hat-opera-ha-noi');
  assert.deepEqual(Object.keys(featuredPrototypeStories).sort(), existing.map(place => place.slug).sort());
  for (const place of existing) assert(place.portraitImage);
  assert.equal(featuredPrototypeStories['nha-hat-opera-ha-noi'], undefined);
});

test('CSS and mobile viewport ownership stay inside the explorer, leaving the footer in normal flow', () => {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  assert(withoutComments.startsWith('.imap-prototype {'));
  assert(!css.includes(':root'));
  assert(!/^\s*body\s*\{/m.test(css));
  assert(!/^\s*main\s*\{/m.test(css));
  assert(css.includes('&[data-embedded=true] .prototype-main { height: auto; display: block;'));
  assert(css.includes('&[data-embedded=true] .explorer { flex: none; height: clamp(360px, 62svh, 620px); margin-inline: 12px; }'));
  assert(!css.includes('body { overflow: hidden'));
  assert(view.includes("const Slogan = embedded ? 'h2' : 'h1'"));
  assert(view.includes('id={embedded ? \'experiences\' : undefined}'));
  assert(view.includes('id={embedded ? \'search\' : undefined}'));
});

test('approved portraits, source facts, player behavior and directions remain in the shared view', () => {
  assert(view.includes('<DestinationPortrait src={place.portraitImage} />'));
  assert(view.includes('<DestinationPortrait src={nearby.place.portraitImage} />'));
  assert(view.includes('googleWalkingDirections(place.coordinates)'));
  assert(view.includes('<DestinationMedia media={media} title={place.name} />'));
  assert(read('../src/components/DestinationMedia.astro').includes('href={media.videoUrl}'));
  assert(view.includes('href={item.sourceUrl}'));
  assert(view.includes("featuredAffiliateUrl(featured)"));
  for (const heading of ['Chạm để khám phá', 'Chọn một địa điểm', 'Thông tin tham khảo', 'Trải nghiệm cùng nơi', 'Địa điểm gần đây']) assert(view.includes(heading));
  assert(controller.includes('stopVideo(); selected = slug;'));
  assert(controller.includes("frame.src = 'about:blank'"));
});
