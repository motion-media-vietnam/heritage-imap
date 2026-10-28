import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const renderer = readFileSync(new URL('../src/components/DestinationMedia.astro', import.meta.url), 'utf8');

// Source contracts only: rendered geometry, cropping and native gestures need browser QA.
test('gallery browsing fills an editorial frame while enlargement contains the original', () => {
  assert(renderer.includes('.destination-gallery { aspect-ratio: auto; background: transparent;'));
  assert(renderer.includes('.gallery-layout { grid-template-columns: minmax(0, 1fr); aspect-ratio: 4 / 3; }'));
  assert(renderer.includes('object-fit: cover; object-position: var(--gallery-object-position, 50% 40%);'));
  assert(renderer.includes('.gallery-dialog-image img { object-fit: contain; object-position: center; }'));
  assert(renderer.includes('<img data-gallery-full alt=')); // Still no eager original request.
  assert(!renderer.includes('gallery-enlarge-hint'));
  assert(!renderer.includes('padding-bottom: 44px'));
});

test('expand action shares the compact navigation toolbar with accessible touch targets', () => {
  const toolbar = renderer.slice(renderer.indexOf('<div class="gallery-navigation">'), renderer.indexOf('<dialog'));
  assert(toolbar.includes('data-gallery-step="-1"'));
  assert(toolbar.includes('data-gallery-counter'));
  assert(toolbar.includes('data-gallery-step="1"'));
  assert(toolbar.includes('class="gallery-expand" data-gallery-enlarge aria-label="Phóng to ảnh gốc"'));
  assert(toolbar.includes('aria-haspopup="dialog"'));
  assert(toolbar.includes('aria-hidden="true" focusable="false"'));
  assert(renderer.includes('.gallery-expand) { min-width: 44px; min-height: 44px; }'));
  assert(!renderer.includes('.gallery-navigation { position: absolute;'));
});

test('desktop keeps featured/support hierarchy with no forced empty supporting tiles', () => {
  assert(renderer.includes('grid-template-columns: minmax(0, 2fr) minmax(0, 1fr)'));
  assert(renderer.includes("'gallery-layout-single': images.length === 1"));
  assert(renderer.includes('images.length > 1 && <div class="gallery-supports">'));
  assert(renderer.includes('gallerySupportIndices(0, images.length).map'));
  assert(renderer.includes('.gallery-supports { display: none; }'));
});
