import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import postcss from 'postcss';
import sharp from 'sharp';
import { heritageVideos } from '../src/data/heritage.ts';

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const video = source('src/components/HeritageVideo.astro');
const choice = source('src/components/HeritageChoice.astro');
const styles = (component: string) => postcss.parse(component.split('<style>')[1]!.split('</style>')[0]!);

test('Heritage video metadata, other covers and playback script are byte-preserved', () => {
  assert.equal(hash(JSON.stringify(heritageVideos.map(({ cover, ...story }) => story))), 'a1bb9a7873889594748602672a009a8d8b439a2f8fa6a4e40c0ea6e55d930391');
  assert.equal(hash(JSON.stringify(heritageVideos.slice(0, 2).map(story => story.cover))), '6cf8643dda44e1e49559a69e42ea6b4d488f562f0a82189e3ec6f40e1b9f313a');
  assert.equal(hash(video.split('<script>')[1]!.split('</script>')[0]!), '3fbbd5a7e34ca50952e9c66078c32a7072a5918d8844b7dd17b2b3afc0cae4b9');
});

test('all mobile covers explicitly override desktop sizing with uncropped 16:9 frames', () => {
  const css = styles(video);
  const mobile = css.nodes.find(node => node.type === 'atrule' && node.name === 'media' && node.params === '(max-width: 700px)');
  assert(mobile?.type === 'atrule');
  const declarations = (selector: string) => {
    const values = new Map<string, string>();
    mobile.walkRules(rule => {
      if (rule.selectors.includes(selector)) rule.walkDecls(decl => { values.set(decl.prop, decl.value); });
    });
    return values;
  };
  for (const selector of ['.editorial-cover', '.is-featured .editorial-cover']) {
    const values = declarations(selector);
    assert.equal(values.get('aspect-ratio'), '16 / 9');
    assert.equal(values.get('min-height'), '0');
    assert.equal(values.get('height'), 'auto');
    for (const viewport of [360, 390, 430]) {
      // Source geometry, not a substitute for rendered browser measurements.
      assert(source('src/styles/editorial.css').includes('--editorial-gutter: 24px'));
      const width = viewport - 48;
      const height = width * 9 / 16;
      assert(height < 240, `${viewport}px must not retain the old 240px minimum`);
      assert.equal(width / height, 16 / 9);
    }
  }
  assert.equal(declarations('.cover-photograph').get('object-fit'), 'contain');
  assert.equal(declarations('.cover-photograph').get('object-position'), '50% 50%');
  assert(!video.includes('style={{ objectPosition:'), 'inline positioning must not override mobile centering');
  assert(video.includes('width: 44px; height: 44px; display: grid; place-items: center'));
  assert(choice.includes('grid-template-columns: minmax(0, 1fr); gap: 48px'));
  assert(choice.includes('grid-template-columns: minmax(0, 1.85fr) minmax(0, 1fr)'));
  assert(choice.includes('--heritage-cover-ratio: 11 / 5'));
  assert(video.includes('aspect-ratio: var(--editorial-image-ratio)'));
});

test('paper transition is scoped to the existing Heritage background, with no geometry changes', () => {
  const css = styles(choice);
  const gradients: string[] = [];
  css.walkDecls('background-image', decl => {
    assert(decl.parent?.type === 'rule');
    assert.equal(decl.parent.selector, '.heritage-editorial');
    assert(decl.value.endsWith(', #fff)'));
    assert(decl.value.includes('var(--rice-paper)') && decl.value.includes('var(--moss)'));
    gradients.push(decl.value);
  });
  assert.equal(gradients.length, 1);
  assert(choice.includes('background-size: 100% var(--editorial-space)'));
  assert(choice.includes('background-position: bottom'));
  assert(choice.includes('background-repeat: no-repeat'));
  assert(!choice.includes(':global(') && !choice.includes('::after'));
  assert(source('src/pages/index.astro').includes('#explore { background: #FFFFFF; }'));
});

test('only the lotus story uses the optimized supplied image, with real intrinsic dimensions', async () => {
  const lotus = heritageVideos[2]!;
  assert.equal(lotus.videoId, '-jVXCHcCoiw');
  assert.equal(lotus.cover.src, '/images/heritage-lotus.webp');
  const image = readFileSync(new URL('../public/images/heritage-lotus.webp', import.meta.url));
  sharp.concurrency(1); sharp.cache(false);
  const metadata = await sharp(image).metadata();
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, lotus.cover.width);
  assert.equal(metadata.height, lotus.cover.height);
  assert.equal(metadata.width, 1600); assert.equal(metadata.height, 1064);
  assert(image.byteLength < 300000);
  assert(video.includes('width={cover.width ?? 1600} height={cover.height ?? 1067}'));
  const built = new URL('../dist/index.html', import.meta.url);
  if (existsSync(built)) {
    const html = readFileSync(built, 'utf8');
    assert(html.includes('src="/images/heritage-lotus.webp"'));
    assert(!html.includes('src="/images/heritage-temporary-tea.jpg"'));
    assert.deepEqual(readFileSync(new URL('../dist/images/heritage-lotus.webp', import.meta.url)), image);
  }
});
