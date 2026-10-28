import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { featuredPrototypeStories, featuredYouTubeEmbedUrl } from '../src/data/imap-featured.ts';
import { prototypePlaces } from '../src/data/imap-prototype.ts';
import { resolveDestinationMedia, galleryIndex, gallerySupportIndices, gallerySwipeStep, type DestinationMedia } from '../src/lib/destination-media.ts';

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const renderer = source('src/components/DestinationMedia.astro');
const gallery = source('src/scripts/destination-media.ts');
const controller = source('src/scripts/imap-prototype.ts');

function functions(...names: string[]) {
  const ast = ts.createSourceFile('controller.ts', controller, ts.ScriptTarget.Latest, true);
  return ts.transpileModule(ast.statements.filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text ?? ''))
    .map(node => node.getText(ast)).join('\n'), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
}

test('explicit gallery wins over the retained legacy URL; unrelated videos keep their original source', () => {
  const pilot = featuredPrototypeStories['pho-sach-dinh-le']!;
  assert.equal(pilot.youtubeUrl, 'https://www.youtube.com/watch?v=lfqbodYX8ow');
  assert.equal(resolveDestinationMedia(pilot), pilot.media);
  assert.equal(resolveDestinationMedia(pilot).type, 'gallery');
  for (const [slug, story] of Object.entries(featuredPrototypeStories)) {
    if (!story || slug === 'pho-sach-dinh-le') continue;
    const media = resolveDestinationMedia(story);
    assert.equal(media.type, 'video');
    if (media.type !== 'video') assert.fail();
    assert.equal(media.videoUrl, story.youtubeUrl);
    assert.equal(media.source, 'youtube');
    assert(featuredYouTubeEmbedUrl(media.videoUrl)?.includes('autoplay=1&mute=1&playsinline=1&rel=0'));
  }
});

test('pilot maps exactly one existing client image without changing its identity, pin or content', () => {
  const media = resolveDestinationMedia(featuredPrototypeStories['pho-sach-dinh-le']);
  assert.equal(media.type, 'gallery');
  if (media.type !== 'gallery') assert.fail();
  assert.equal(media.images.length, 1);
  const image = media.images[0]!;
  assert.equal(image.src, '/images/pho%20sach%20Dinh%20Le.jpg');
  assert.equal(image.width, 655); assert.equal(image.height, 874);
  assert(image.alt.includes('kệ sách'));
  assert(existsSync(new URL(`../public${decodeURI(image.src)}`, import.meta.url)));
  const place = prototypePlaces.find(place => place.slug === 'pho-sach-dinh-le')!;
  assert.equal(place.portraitImage, image.src);
  assert.equal(place.name, 'Phố sách Đinh Lễ');
  assert.equal(place.story, 'Nơi Hà Nội cất giữ những trang sách cũ.');
  assert.equal(featuredPrototypeStories[place.slug]!.practical[0]!.value, '08:00–21:00');
});

test('backward compatibility: native file, missing media and explicit empty/placeholder choices', () => {
  assert.deepEqual(resolveDestinationMedia(undefined, { url: '/approved.mp4' }), { type: 'video', source: 'file', videoUrl: '/approved.mp4' });
  assert.deepEqual(resolveDestinationMedia(), { type: 'placeholder' });
  assert.deepEqual(resolveDestinationMedia({ youtubeUrl: 'invalid' }), { type: 'placeholder' });
  assert.deepEqual(resolveDestinationMedia({ youtubeUrl: 'invalid' }, { url: '/approved.mp4' }), { type: 'video', source: 'file', videoUrl: '/approved.mp4' });
  const empty: DestinationMedia = { type: 'gallery', images: [] };
  assert.equal(resolveDestinationMedia({ media: empty }), empty);
  assert.deepEqual(resolveDestinationMedia({ media: { type: 'placeholder' }, youtubeUrl: featuredPrototypeStories['pho-co']!.youtubeUrl }), { type: 'placeholder' });
  assert(renderer.includes("media.type === 'gallery' && first"));
  assert(renderer.includes("'Ảnh đang được cập nhật'"));
  assert(renderer.includes('Video đang được cập nhật'));
});

test('one/two/three/five-image navigation never invents duplicate or empty support tiles', () => {
  assert.deepEqual(gallerySupportIndices(0, 0), []);
  assert.deepEqual(gallerySupportIndices(0, 1), []);
  assert.deepEqual(gallerySupportIndices(0, 2), [1]);
  assert.deepEqual(gallerySupportIndices(0, 3), [1, 2]);
  for (const count of [1, 2, 3, 5]) for (let index = 0; index < count; index++) {
    const supports = gallerySupportIndices(index, count);
    assert.equal(supports.length, Math.min(2, count - 1));
    assert.equal(new Set(supports).size, supports.length);
    assert(!supports.includes(index));
    assert(supports.every(value => value >= 0 && value < count));
    assert.equal(galleryIndex(index + count, count), index);
    assert.equal(galleryIndex(index - count, count), index);
  }
  assert.equal(galleryIndex(-1, 5), 4);
});

test('horizontal swipe steps; vertical scroll and small accidental gestures do not', () => {
  assert.equal(gallerySwipeStep(-80, 10), 1);
  assert.equal(gallerySwipeStep(80, 10), -1);
  assert.equal(gallerySwipeStep(40, 0), 0);
  assert.equal(gallerySwipeStep(-60, 100), 0);
  assert.equal(gallerySwipeStep(0, 80), 0);
  assert(gallery.includes('if (!event.isPrimary) { gesture = undefined; return; }'));
  assert(renderer.includes('touch-action: pan-y pinch-zoom'));
  assert(!gallery.includes('setInterval('));
  assert(!gallery.includes('setTimeout('));
});

test('video→video→gallery→video→map retains the existing unload-before-replace lifecycle', () => {
  let frames: Array<{ src: string }> = [];
  let paused = 0; let removed = 0;
  const native = { pause() { paused++; }, removeAttribute() {}, load() {} };
  const context = { content: {
    querySelectorAll: (selector: string) => selector === 'iframe' ? frames : [native],
    replaceChildren() { assert(frames.every(frame => frame.src === 'about:blank')); frames = []; removed++; },
  } };
  runInNewContext(functions('stopVideo'), context);
  for (const slug of ['ho-hoan-kiem', 'pho-co', 'pho-sach-dinh-le', 'ho-tay']) {
    runInNewContext('stopVideo();', context);
    const media = resolveDestinationMedia(featuredPrototypeStories[slug]);
    if (media.type === 'video') frames.push({ src: featuredYouTubeEmbedUrl(media.videoUrl)! });
    else assert.equal(frames.length, 0);
  }
  runInNewContext('stopVideo();', context);
  assert.equal(removed, 5); assert.equal(paused, 5);
  assert.equal(frames.length, 0);
});

test('gallery is delegated for cloned templates; enlargement is native modal with independent Escape', () => {
  assert(gallery.includes("document.addEventListener('click'"));
  assert(gallery.includes('dialog.showModal()'));
  assert(gallery.includes("event.key === 'Escape'"));
  assert(gallery.includes('event.stopPropagation(); return;'));
  assert(gallery.includes('capture: true'));
  assert(renderer.includes('aria-label="Đóng ảnh phóng to"'));
  assert(renderer.includes('aria-label="Ảnh trước"'));
  assert(renderer.includes('aria-label="Ảnh tiếp theo"'));
  assert(renderer.includes('disabled={images.length < 2}'));
  assert(renderer.includes('aria-live="polite"'));
});

test('only current plus up to two supports render images; original enlargement stays click-only', () => {
  assert(renderer.includes('gallerySupportIndices(0, images.length).map'));
  assert(!renderer.includes('images.map('));
  assert(renderer.includes('loading="lazy" decoding="async"'));
  assert(renderer.includes('width={first.width} height={first.height}'));
  assert(renderer.includes('<img data-gallery-full alt=')); // No src until enlargement.
  assert(renderer.includes('object-fit: contain'));
  assert(renderer.includes('.gallery-supports { display: none; }'));
  const parent = source('src/components/imap/PrototypeExplorer.astro');
  assert(parent.includes('<DestinationMedia media={media} title={place.name} />'));
  assert(parent.includes('resolveDestinationMedia(featured, dedicatedVideos[place.slug])'));
  assert(!renderer.includes('pho-sach-dinh-le'));
  assert(controller.includes("const openingState = mobile.matches ? 'expanded' : 'half'"));
  assert(controller.includes('map.invalidateSize({ pan: true, animate: false })'));
});
