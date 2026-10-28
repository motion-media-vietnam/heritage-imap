import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { prototypePlaces } from '../src/data/imap-prototype.ts';
import { featuredPrototypeStories as stories } from '../src/data/imap-featured.ts';

const route = readFileSync(new URL('../src/components/imap/PrototypeExplorer.astro', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
const rules = (selector: string) => styles.split(`${selector} {`).slice(1).map(block => block.split('}')[0]).join('\n');

// Source contracts only: rendered visual/mobile acceptance still requires a browser.
test('every destination template uses the shared approved story class without a destination gate', () => {
  assert.equal(prototypePlaces.length, 12, 'preserve eleven existing records and the verified Opera House');
  assert.equal(Object.keys(stories).length, 11);
  assert(route.includes('{places.map(place => {'));
  assert(route.includes('<article class:list={[\'destination-story\', { \'featured-story\': !!featured }]}>'));
  assert(!route.includes('tactile-metropole'));
  assert(!styles.includes('tactile-metropole'));
  assert(!styles.includes('data-select-place='), 'row styling must not depend on destination ID');
  assert(route.includes('featured.practical.map(item =>'));
  assert(route.includes('<DestinationPortrait src={place.portraitImage} />'));
  assert(route.includes('<DestinationPortrait src={nearby.place.portraitImage} />'));
});

test('approved media, facts, pill directions, nearby rows and selected-state effects are shared', () => {
  assert.match(rules('.destination-story .destination-video'), /border-radius: 14px/);
  assert.match(rules('.destination-story .destination-video'), /box-shadow:/);
  assert.match(rules('.destination-video'), /aspect-ratio: 16 \/ 9/);
  assert.match(rules('.destination-story .practical-facts'), /padding: 8px 16px/);
  assert.match(rules('.destination-story .practical-facts'), /border-radius: 18px/);
  assert.match(rules('.destination-story .practical-facts'), /box-shadow:/);
  assert.match(rules('.destination-story .directions'), /min-height: 52px/);
  assert.match(rules('.destination-story .directions'), /border-radius: 999px/);
  assert.match(rules('.destination-story .directions'), /color: var\(--prototype-navy\)/);
  assert.match(rules('.destination-story .directions'), /background: #FFFFFF/);
  assert.match(rules('.destination-story .nearby button'), /border-radius: 12px/);
  assert.match(rules('.directory .directory-row[aria-pressed=true]'), /inset 3px 0 0 var\(--prototype-navy\)/);
  assert(styles.includes('.destination-story .directions:focus-visible'));
  assert(styles.includes('.destination-story .directions:hover'));
  const reducedMotion = styles.slice(styles.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
  assert(reducedMotion.includes('.destination-story .directions'));
  assert(reducedMotion.includes('.directory .directory-row'));
  assert(reducedMotion.includes('transform: none'));
  assert.match(rules('.story h2'), /var\(--prototype-display\)/);
  assert.match(rules('.story h3'), /var\(--prototype-body\)/);
});

test('required review destinations keep their distinct information types and no blank practical fields', () => {
  for (const slug of ['sofitel-legend-metropole-hanoi', 'pho-sach-dinh-le',
    'nha-hat-mua-roi-thang-long-hoan-kiem', 'ho-hoan-kiem', 'den-ngoc-son']) {
    assert(prototypePlaces.some(place => place.slug === slug));
    const story = stories[slug]!;
    assert(story.practical.length > 0);
    for (const fact of story.practical) { assert(fact.label.trim()); assert(fact.value.trim()); }
    assert(story.practicalNote.trim());
  }
  assert(stories['sofitel-legend-metropole-hanoi']!.practical.some(fact => fact.label === 'Lễ tân' && fact.value === '24/7'));
  assert(stories['pho-sach-dinh-le']!.practical.some(fact => fact.value === 'Miễn phí tham quan'));
  assert(stories['nha-hat-mua-roi-thang-long-hoan-kiem']!.practical.some(fact => fact.value === 'Từ 100.000 VNĐ/người'));
  assert(stories['ho-hoan-kiem']!.practical.some(fact => fact.label === 'Giờ tham quan' && fact.value === '24/7'));
  assert(stories['den-ngoc-son']!.practical.some(fact => fact.value === '50.000 VNĐ/lượt'));
});

test('exact shorter slogan and current headings are retained on the one responsive prototype markup path', () => {
  assert.equal(route.split('<Slogan class="prototype-slogan">Chạm để khám phá</Slogan>').length - 1, 1);
  assert(route.includes("const Slogan = embedded ? 'h2' : 'h1'"));
  assert(!route.includes('Chạm một điểm. Mở một Hà Nội.'));
  for (const heading of ['Thông tin tham khảo', 'Trải nghiệm cùng nơi', 'Địa điểm gần đây', 'Chọn một địa điểm']) assert(route.includes(heading));
  assert(styles.includes('@media (max-width: 960px)'));
  assert(styles.includes('grid-template-columns: minmax(0, 26fr) minmax(0, 74fr)'));
  assert(styles.includes('/* Single Metropole pin only.'));
  assert(styles.includes('.curated-pin[data-destination="sofitel-legend-metropole-hanoi"]'));
});
