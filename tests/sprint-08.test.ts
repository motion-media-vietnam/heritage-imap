import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { imapCategories, migrateImapCategory } from '../src/lib/imap-categories.ts';
import { prototypePlaces } from '../src/data/imap-prototype.ts';
import { categoryIconPath, markerCategory, createNeighborhoodState, filterNeighborhoodPlaces } from '../src/lib/imap-neighborhood.ts';
import { createExplorerState, filterExplorerPlaces } from '../src/lib/imap.ts';
import { places } from '../src/data/places.ts';
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('08: exactly four shared categories and explicit non-destructive migration', () => {
  assert.deepEqual(imapCategories.map(item => item.label), ['Điểm tham quan', 'Khám phá', 'Ẩm thực', 'Mua sắm']);
  assert.equal(migrateImapCategory('stay'), 'experience');
  assert.equal(migrateImapCategory('experience', 'pho-sach-dinh-le'), 'shopping');
  assert.equal(prototypePlaces.length, 12);
  assert.equal(new Set(prototypePlaces.map(place => place.slug)).size, 12);
  assert.equal(markerCategory(prototypePlaces.find(place => place.slug === 'pho-sach-dinh-le')!), 'shopping');
  assert.equal(markerCategory(prototypePlaces.find(place => place.slug === 'sofitel-legend-metropole-hanoi')!), 'experience');
  for (const category of imapCategories) {
    assert(categoryIconPath(category.id));
    const filtered = filterNeighborhoodPlaces(prototypePlaces, { ...createNeighborhoodState(), radius: 'All', category: category.id });
    assert(filtered.every(place => markerCategory(place) === category.id));
    const legacy = filterExplorerPlaces(places, { ...createExplorerState(), category: category.id });
    assert.equal(legacy.length, category.id === 'stamp-worthy-spot' ? places.length : 0);
  }
});

test('08: header reuses actual Heritage route; experience anchor does not target iMap', () => {
  const layout = source('src/layouts/Layout.astro');
  assert(layout.includes("href: '/#unmissable-experiences', label: 'Khám phá'"));
  assert(layout.includes('heritage-nav-cta'));
  assert(layout.includes("prefers-reduced-motion: reduce"));
  assert(source('src/components/LowerHomepage.astro').includes("id: 'unmissable-experiences'"));
  assert(source('src/pages/heritage-mach-ban.astro').includes('chưa sử dụng AI hội thoại'));
  assert(source('src/components/HeritageExperiences.astro').includes('<EditorialEyebrow text="Kho báu của Hà Nội" />'));
  assert(source('src/components/EditorialEyebrow.astro').includes("text = 'Khám phá Hà Nội theo cách của bạn'"));
});

test('08: three non-clickable event placeholders, with client-selected HANIFF artwork labeled', () => {
  const homepage = source('src/components/LowerHomepage.astro');
  const events = homepage.slice(homepage.indexOf("{ id: 'homepage-events'"), homepage.indexOf('];\n---'));
  const titles = ['Concert BIGBANG tại Hà Nội', 'Festival Thu Hà Nội 2026', 'Liên hoan Phim Quốc tế Hà Nội lần thứ VIII (HANIFF VIII)'];
  assert.equal((events.match(/description: ''/g) ?? []).length, 3);
  assert(!events.includes('href:'));
  assert(events.includes('Chờ xác minh'));
  assert(titles.every((title, index) => events.includes(title) && (index === 0 || events.indexOf(title) > events.indexOf(titles[index - 1]!))));
  for (const file of ['Bigbang hanoi 2026.jpg', 'festival Thu Hafnoi 2026.jpg', 'Haniff2026.jpg']) assert(existsSync(new URL(`../public/images/${file}`, import.meta.url)));
  assert(homepage.includes("src: '/images/Haniff2026.jpg'"));
  assert(homepage.includes('poster HANIFF VII (2024), không xác nhận HANIFF VIII.'));
  assert(homepage.includes('image?.note ??'));
});

test('08A.1 supersedes 08: shared accessible launcher opens an in-page drawer, not a second AI integration', () => {
  const launcher = source('src/components/HeritageLauncher.astro');
  const controller = source('src/scripts/heritage-assistant.ts');
  assert(launcher.includes('data-heritage-open'));
  assert(launcher.includes('Hỏi Heritage nhé'));
  assert(launcher.includes('writing-mode: vertical-rl'));
  assert(launcher.includes('focus-visible'));
  assert(launcher.includes('safe-area-inset-bottom'));
  assert(controller.includes('dialog[open]'));
  assert(controller.includes('drawer.showModal()'));
  assert(controller.includes("import { recommend } from '../lib/concierge'"));
  assert(!/<a\b|<iframe\b|fetch\(/.test(launcher));
  for (const path of ['src/layouts/Layout.astro', 'src/pages/imap.astro', 'src/pages/imap-prototype.astro']) assert(source(path).includes('<HeritageLauncher />'));
});
