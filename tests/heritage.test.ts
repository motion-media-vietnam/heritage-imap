import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { heritageVideos, currentHeritageChoice, pastHeritageChoices } from '../src/data/heritage.ts';
import { places } from '../src/data/places.ts';

const expectedIds = ['2CxNZtrFedo', 'Sige0y8XxeU', '-jVXCHcCoiw'];

function verifyHomepage(html: string) {
  // A streaming render failure can return HTTP 200 with only Vite's script.
  assert.match(html, /<\/html>/i, 'homepage render must finish');
  assert.doesNotMatch(html, /Cannot destructure property/);
  const articles = [...html.matchAll(/<article\b[^>]*class="(?:current-choice|past-choice)"[^>]*>[\s\S]*?<\/article>/g)];
  assert.equal(articles.length, 3, 'render all three editorial cards');
  articles.forEach(([article], index) => {
    const video = heritageVideos[index]!;
    assert(article.includes(video.title), `exact headline for ${video.videoId}`);
    assert(article.includes(`src="${video.cover.src}"`), `cover for ${video.videoId}`);
    assert(article.includes(`datetime="${video.publicationDate}"`), `date for ${video.videoId}`);
    const links = [...article.matchAll(/<a\b[^>]*data-video-trigger[^>]*>/g)];
    assert.equal(links.length, 3, 'cover, headline and story link activate video');
    for (const [link] of links) {
      assert(link.includes(`href="${video.url}"`));
      assert(link.includes(`data-video-id="${video.videoId}"`));
      assert(link.includes(`aria-controls="heritage-video-${video.videoId}"`));
    }
    assert(article.includes(`id="heritage-video-${video.videoId}"`));
    assert(!article.includes('<iframe'), 'editorial player remains interaction-only');
  });
  const templates = [...html.matchAll(/<template\b[^>]*data-imap-story[^>]*>[\s\S]*?<\/template>/g)];
  assert.equal(templates.length, places.length, 'all new iMap destination templates render');
  for (const [template] of templates) {
    assert(!template.includes('Chưa có video riêng đã xác minh'));
    assert(template.includes('data-media-state="missing"'));
    assert(template.includes('data-destination-video') && !template.includes('<video'));
    assert(!template.includes('<iframe'), 'do not reuse a city overview for a destination story');
  }
}

test('Heritage records retain the three verified IDs and matching URLs', () => {
  assert.deepEqual(heritageVideos.map(video => video.videoId), expectedIds);
  assert.equal(currentHeritageChoice, heritageVideos[0]);
  assert.deepEqual(pastHeritageChoices, heritageVideos.slice(1));
  for (const video of heritageVideos) {
    assert.equal(new URL(video.url).searchParams.get('v'), video.videoId);
    assert(video.title && video.description && video.excerpt && video.publicationDate);
  }
});

const builtPage = new URL('../dist/index.html', import.meta.url);
test('built homepage renders unchanged Heritage cards and gated destination media', { skip: !existsSync(builtPage) }, () => {
  verifyHomepage(readFileSync(builtPage, 'utf8'));
});

const previewUrl = process.env.HERITAGE_PREVIEW_URL;
test('running homepage completes rendering and preserves all video associations', { skip: !previewUrl }, async () => {
  const response = await fetch(previewUrl!, { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  verifyHomepage(await response.text());
  for (const video of heritageVideos) {
    const image = await fetch(new URL(video.cover.src, previewUrl), { signal: AbortSignal.timeout(15000) });
    assert.equal(image.status, 200, video.cover.src);
    assert.match(image.headers.get('content-type') || '', video.cover.src.endsWith('.webp') ? /^image\/webp/ : /^image\/jpeg/);
    assert((await image.arrayBuffer()).byteLength > 0);
  }
});
