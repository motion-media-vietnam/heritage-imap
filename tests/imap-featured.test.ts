import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { featuredPrototypeStories as stories, featuredYouTubeEmbedUrl, featuredAffiliateUrl,
  type FeaturedStory } from '../src/data/imap-featured.ts';
import { prototypePlaces } from '../src/data/imap-prototype.ts';
import { googleWalkingDirections } from '../src/lib/imap-directions.ts';
import { createNeighborhoodState, filterNeighborhoodPlaces, markerCategory } from '../src/lib/imap-neighborhood.ts';
import { prototypeDistrictPlaceSlugs } from '../src/data/imap-prototype.ts';

const route = readFileSync(new URL('../src/components/imap/PrototypeExplorer.astro', import.meta.url), 'utf8');
const media = readFileSync(new URL('../src/components/DestinationMedia.astro', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
const expected = [
  ['sofitel-legend-metropole-hanoi', 'LpleBDMdAMc', 'experience'],
  ['pho-sach-dinh-le', 'lfqbodYX8ow', 'shopping'],
  ['nha-hat-mua-roi-thang-long-hoan-kiem', '-bezb1tRCZM', 'experience'],
  ['ho-hoan-kiem', 'xI_NOm3MYJI', 'stamp-worthy-spot'],
  ['nha-tho-lon-ha-noi', '4i9crZgDwSE', 'stamp-worthy-spot'],
  ['pho-co', 'lfqbodYX8ow', 'stamp-worthy-spot'],
  ['den-ngoc-son', 'GyC4fn_7T0o', 'stamp-worthy-spot'],
  ['van-mieu', '3_7tOtNattU', 'stamp-worthy-spot'],
  ['ho-tay', 'KPwNA0PidEY', 'stamp-worthy-spot'],
  ['cau-long-bien', 'ewsKEvRHtvs', 'stamp-worthy-spot'],
  ['hoang-thanh-thang-long', 'ABbiKgWuhrA', 'stamp-worthy-spot'],
] as const;

test('eleven exact existing IDs retain client videos; the verified Opera record has no video', () => {
  assert.deepEqual(Object.keys(stories).sort(), expected.map(([id]) => id).sort());
  assert.equal(prototypePlaces.length, 12);
  assert.equal(new Set(prototypePlaces.map(place => place.slug)).size, 12);
  for (const [id, videoId, category] of expected) {
    const story = stories[id]!;
    assert.equal(story.youtubeUrl, `https://www.youtube.com/watch?v=${videoId}`);
    assert.equal(featuredYouTubeEmbedUrl(story.youtubeUrl),
      `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`);
    assert.equal(markerCategory(prototypePlaces.find(place => place.slug === id)!), category);
  }
  for (const place of prototypePlaces.filter(place => !Object.hasOwn(stories, place.slug))) {
    assert.equal(stories[place.slug], undefined);
  }
  const state = createNeighborhoodState();
  for (const [radius, count] of [[500, 5], [1000, 8], [2000, 11], ['All', 12]] as const) {
    assert.equal(filterNeighborhoodPlaces(prototypePlaces, { ...state, radius }, prototypeDistrictPlaceSlugs).length, count);
  }
});

test('practical facts preserve client caveats without claiming live rates or exact ticket times', () => {
  const hotel = stories[expected[0][0]]!;
  assert.deepEqual(hotel.practical, [
    { label: 'Lễ tân', value: '24/7' },
    { label: 'Giá tham khảo', value: 'Từ 6.000.000 VNĐ/đêm' },
  ]);
  assert.match(hotel.practicalNote, /không phải giá trực tiếp/);
  assert.match(hotel.practicalNote, /chỉ áp dụng cho lễ tân/);
  const books = stories[expected[1][0]]!;
  assert.equal(books.practical[0]!.value, '08:00–21:00');
  assert.equal(books.practical[1]!.value, 'Miễn phí tham quan');
  assert.match(books.practicalNote, /giờ từng hiệu sách có thể khác nhau/);
  assert.match(books.practicalNote, /không phải Phố sách Hà Nội ở đường 19\/12/);
  const theatre = stories[expected[2][0]]!;
  assert.equal(theatre.practical.length, 2);
  assert.deepEqual(theatre.practical[1], { label: 'Giá vé tham khảo', value: 'Từ 100.000 VNĐ/người' });
  assert.equal(theatre.practical[0]!.label, 'Khung giờ có suất diễn (tham khảo)');
  assert.match(theatre.practical[0]!.value, /13:45–22:00/);
  assert.match(theatre.practical[0]!.value, /Chủ nhật: có suất từ 09:30/);
  assert.match(theatre.practicalNote, /chưa xác minh độc lập/);
  assert.match(theatre.practicalNote, /không phải thời lượng biểu diễn liên tục/);
  assert.match(theatre.practicalNote, /Kiểm tra lịch mới nhất/);
});

test('booking stays absent unless explicitly enabled with a valid absolute HTTPS URL', () => {
  const hotel = stories[expected[0][0]]!;
  assert.equal(hotel.affiliateUrl, null);
  assert.equal(hotel.affiliateEnabled, false);
  assert.equal(hotel.affiliateLabel, 'Đặt phòng');
  for (const story of Object.values(stories)) assert.equal(featuredAffiliateUrl(story!), undefined);
  for (const affiliateUrl of [null, '', '#', '/booking', 'javascript:alert(1)', 'data:text/html,test',
    'http://example.com', 'not a URL', 'https://user:password@example.com', 'https://localhost']) {
    assert.equal(featuredAffiliateUrl({ ...hotel, affiliateEnabled: true, affiliateUrl }), undefined, String(affiliateUrl));
  }
  const fixture: FeaturedStory = { ...hotel, affiliateEnabled: true, affiliateUrl: 'https://example.com/book?ref=demo' };
  assert.equal(featuredAffiliateUrl(fixture), fixture.affiliateUrl);
  assert.equal(featuredAffiliateUrl({ ...fixture, affiliateEnabled: false }), undefined);
  assert(route.includes('{affiliateUrl && <a class="affiliate-booking"'));
});

test('only validated supplied YouTube watch links produce embeds', () => {
  for (const value of ['#', 'javascript:alert(1)', 'http://www.youtube.com/watch?v=LpleBDMdAMc',
    'https://www.youtube.com.evil.test/watch?v=LpleBDMdAMc', 'https://www.youtube.com/watch?v=bad',
    'https://user@www.youtube.com/watch?v=LpleBDMdAMc', 'https://www.youtube.com:444/watch?v=LpleBDMdAMc',
    'https://www.youtube.com/embed/LpleBDMdAMc']) assert.equal(featuredYouTubeEmbedUrl(value), undefined, value);
});

test('templates use escaped text, 16:9 privacy-enhanced iframe and persistent original-URL fallback', () => {
  assert(route.includes('<DestinationMedia media={media} title={place.name} />'));
  assert(media.includes('src={embedUrl}'));
  assert(media.includes('referrerpolicy="strict-origin-when-cross-origin"'));
  assert(media.includes('allowfullscreen'));
  assert(media.includes('allow="autoplay; encrypted-media; fullscreen; picture-in-picture; web-share"'));
  assert(route.includes('Thông tin tham khảo'));
  assert(route.includes('Địa điểm gần đây'));
  assert(!route.includes('Gợi ý biên tập:'));
  assert(!route.includes('Thông tin tham khảo · Do khách hàng cung cấp'));
  assert(media.includes('href={media.videoUrl} target="_blank" rel="noopener noreferrer"'));
  assert(media.includes('Xem video trên YouTube'));
  assert(route.includes('{featured?.description ?? place.story}'));
  assert(route.includes('<dt>{item.label}</dt><dd>{item.value}'));
  assert(route.includes('href={item.sourceUrl}'));
  assert(!route.includes('set:html={featured'));
  assert.match(css, /\.destination-video \{[^}]*aspect-ratio: 16 \/ 9/s);
  assert.match(css, /\.destination-video iframe \{[^}]*width: 100%; height: 100%; border: 0/s);
  assert(media.includes('Chưa có ảnh hoặc video được duyệt · Khung chờ nội dung'));
  for (const path of ['../src/pages/index.astro', '../src/pages/imap.astro']) {
    assert(!readFileSync(new URL(path, import.meta.url), 'utf8').includes('imap-featured'));
  }
  // The existing catalog and controller stay independent of the editorial overlay.
  assert(!controller.includes('imap-featured'));
});

test('real stopVideo callback unloads external player before removing content', () => {
  const ast = ts.createSourceFile('controller.ts', controller, ts.ScriptTarget.Latest, true);
  const node = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'stopVideo');
  assert(node);
  const source = ts.transpileModule(`${node.getText(ast)}\nstopVideo();`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const frame = { src: 'https://www.youtube-nocookie.com/embed/LpleBDMdAMc' };
  let removed = false;
  const context = { content: {
    querySelectorAll(selector: string) { return selector === 'iframe' ? [frame] : []; },
    replaceChildren() { assert.equal(frame.src, 'about:blank'); removed = true; },
  } };
  runInNewContext(source, context, { timeout: 1000 });
  assert(removed);
});

test('directions use each selected identity’s coordinates, walking mode and no origin', () => {
  for (const place of prototypePlaces) {
    const result = googleWalkingDirections(place.coordinates)!;
    const url = new URL(result);
    assert.equal(url.origin, 'https://www.google.com');
    assert.equal(url.pathname, '/maps/dir/');
    assert.equal(url.searchParams.get('api'), '1');
    assert.equal(url.searchParams.get('destination'), `${place.coordinates.lat},${place.coordinates.lng}`);
    assert.equal(url.searchParams.get('travelmode'), 'walking');
    assert(!url.searchParams.has('origin'));
    assert(result.includes('%2C'));
  }
  assert(route.includes('googleWalkingDirections(place.coordinates)'));
  assert(route.includes('{directionsUrl && <a class="directions" href={directionsUrl} target="_blank" rel="noopener noreferrer"'));
  assert(route.includes('<span>Chỉ đường đến đây</span>'));
  assert(!route.includes('openstreetmap.org/directions'));
});

test('missing, nonfinite and out-of-range coordinates never create a broken action', () => {
  for (const invalid of [undefined, null, { lat: NaN, lng: 105 }, { lat: 21, lng: Infinity },
    { lat: 91, lng: 105 }, { lat: -91, lng: 105 }, { lat: 21, lng: 181 }, { lat: 21, lng: -181 }]) {
    assert.equal(googleWalkingDirections(invalid), undefined);
  }
  assert(googleWalkingDirections({ lat: 0, lng: 0 }));
  assert(googleWalkingDirections({ lat: -90, lng: 180 }));
  const helper = readFileSync(new URL('../src/lib/imap-directions.ts', import.meta.url), 'utf8');
  assert(!helper.includes('navigator.'));
  assert(!helper.includes('getCurrentPosition'));
});
