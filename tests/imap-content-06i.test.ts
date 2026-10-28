import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { featuredPrototypeStories as stories, featuredYouTubeEmbedUrl, featuredAffiliateUrl } from '../src/data/imap-featured.ts';
import { prototypePlaces } from '../src/data/imap-prototype.ts';
import { places as originals } from '../src/data/places.ts';

const route = readFileSync(new URL('../src/components/imap/PrototypeExplorer.astro', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
const supplied = {
  'van-mieu': '3_7tOtNattU',
  'ho-tay': 'KPwNA0PidEY',
  'cau-long-bien': 'ewsKEvRHtvs',
  'hoang-thanh-thang-long': 'ABbiKgWuhrA',
};

test('eleven existing stories stay unchanged and the twelfth mapped destination has no invented video', () => {
  assert.equal(prototypePlaces.length, 12);
  assert.equal(new Set(prototypePlaces.map(place => place.slug)).size, 12);
  assert.deepEqual(Object.keys(stories).sort(), prototypePlaces.filter(place => place.slug !== 'nha-hat-opera-ha-noi').map(place => place.slug).sort());
  assert.equal(stories['nha-hat-opera-ha-noi'], undefined);
  for (const [slug, id] of Object.entries(supplied)) {
    const story = stories[slug]!;
    const record = prototypePlaces.find(place => place.slug === slug)!;
    const original = originals.find(place => place.slug === slug)!;
    assert.equal(story.youtubeUrl, `https://www.youtube.com/watch?v=${id}`);
    assert.equal(featuredYouTubeEmbedUrl(story.youtubeUrl), `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`);
    const { portraitImage, ...unchanged } = record;
    assert.deepEqual(unchanged, original);
    assert(portraitImage);
    const words = story.description.trim().split(/\s+/).length;
    assert(words >= 100 && words <= 150, `${slug}: ${words} whitespace-separated Vietnamese words`);
    assert.match(story.practicalNote, /21\/10\/2026/);
  }
  for (const story of Object.values(stories)) assert.equal(featuredAffiliateUrl(story!), undefined);
  assert(!prototypePlaces.some(place => place.name.includes('Hoành')));
});

test('every numeric admission or schedule fact in the new stories has its own source URL', () => {
  for (const slug of Object.keys(supplied)) {
    for (const fact of stories[slug]!.practical) {
      if (/(?:\d[\d.]*\s*VNĐ|\d{2}:\d{2})/.test(fact.value)) {
        assert(fact.sourceUrl, `${slug}: ${fact.label}`);
        assert.equal(new URL(fact.sourceUrl).protocol, 'https:');
      }
    }
  }
  assert(route.includes('href={item.sourceUrl}'));
  assert(route.includes('aria-label={`Nguồn cho ${item.label}`}'));
});

test('Văn Miếu daytime tickets/hours are separate from the night programme', () => {
  const facts = stories['van-mieu']!.practical;
  assert(facts.some(fact => fact.label === 'Vé tiêu chuẩn ban ngày' && fact.value === '70.000 VNĐ/người lớn'));
  assert(facts.some(fact => fact.label === 'Giờ tham quan ban ngày' && fact.value.includes('08:00–17:00')));
  const night = facts.find(fact => fact.label === 'Trải nghiệm đêm — vé riêng')!;
  assert(night.value.includes('299.000 VNĐ'));
  assert(night.value.includes('399.000 VNĐ'));
  assert.equal(night.sourceUrl, 'https://www.vanmieu.gov.vn/vi/experience/night-tour');
  assert.match(stories['van-mieu']!.practicalNote, /Vé ban ngày không thay thế vé chương trình đêm/);
});

test('citadel current operator notice wins over the historical 70,000 VND rate', () => {
  const facts = stories['hoang-thanh-thang-long']!.practical;
  const admission = facts.find(fact => fact.label === 'Vé tham quan tiêu chuẩn')!;
  assert(admission.value.startsWith('100.000 VNĐ'));
  assert(admission.value.includes('01/01/2025'));
  assert(admission.sourceUrl?.includes('/thong-bao-thau-doi-gia-ve-'));
  assert(facts.some(fact => fact.value.startsWith('08:00–17:00') && fact.sourceUrl === 'https://hoangthanhthanglong.vn/'));
  assert.match(stories['hoang-thanh-thang-long']!.practicalNote, /giá năm 2024/);
});

test('public lake/bridge fees and access remain provisional without round-the-clock guarantees', () => {
  for (const slug of ['ho-tay', 'cau-long-bien']) {
    const story = stories[slug]!;
    const provisional = story.practical.filter(fact => fact.label.includes('tạm thời'));
    assert.equal(provisional.length, 2);
    assert(provisional.every(fact => fact.value.includes('Chưa xác minh')));
    assert(story.practical.some(fact => /[Kk]hông bảo đảm tiếp cận 24\/7/.test(fact.value)));
    assert(!story.practical.some(fact => fact.value.startsWith('Miễn phí')));
  }
  assert.match(stories['cau-long-bien']!.description, /Tuyệt đối không bước vào đường ray/);
  assert.match(stories['cau-long-bien']!.practicalNote, /ảnh minh họa không phải hướng dẫn vị trí chụp an toàn/);
});

test('existing single-player controller and approved shared presentation remain in use', () => {
  assert(controller.includes('stopVideo(); selected = slug;'));
  assert(controller.includes("frame.src = 'about:blank'"));
  assert(route.includes('<article class:list={[\'destination-story\', { \'featured-story\': !!featured }]}>'));
  assert(route.includes('<Slogan class="prototype-slogan">Chạm để khám phá</Slogan>'));
  for (const heading of ['Chọn một địa điểm', 'Thông tin tham khảo', 'Trải nghiệm cùng nơi', 'Địa điểm gần đây']) assert(route.includes(heading));
  assert(route.includes('<DestinationMedia media={media} title={place.name} />'));
  assert(readFileSync(new URL('../src/components/DestinationMedia.astro', import.meta.url), 'utf8').includes('href={media.videoUrl}'));
  for (const path of ['../src/pages/index.astro', '../src/pages/imap.astro']) {
    assert(!readFileSync(new URL(path, import.meta.url), 'utf8').includes('imap-featured'));
  }
});
