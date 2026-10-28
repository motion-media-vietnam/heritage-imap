import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { galleryIndex, gallerySupportIndices, gallerySwipeStep } from '../src/lib/destination-media.ts';

// Controlled DOM/event harness for the ACTUAL gallery controller, not a browser
// renderer. Native modal focus, CSS layout and real touch remain device QA.
class ElementStub {
  root!: ElementStub;
  button?: ElementStub;
  surface = false;
  disabled = false;
  isConnected = true;
  dataset: Record<string, string> = {};
  attributes = new Map<string, string>();
  selectors: Record<string, ElementStub> = {};
  lists: Record<string, ElementStub[]> = {};
  textContent = '';
  alt = ''; src = ''; srcset = ''; width = 0; height = 0;
  open = false;
  closest(selector: string) {
    if (selector.startsWith('[data-destination-media=')) return this.root;
    if (selector === 'button') return this.button;
    if (selector === '.gallery-feature, .gallery-dialog-image') return this.surface ? this : null;
    return null;
  }
  querySelector(selector: string) { return this.selectors[selector] ?? null; }
  querySelectorAll(selector: string) { return this.lists[selector] ?? []; }
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  removeAttribute(name: string) { this.attributes.delete(name); }
  hasAttribute(name: string) { return this.attributes.has(name); }
  showModal() { this.open = true; }
  close() { this.open = false; }
}

function harness(count: number) {
  const callbacks = new Map<string, { callback: (event: any) => void; options: any }>();
  let clock = 1000;
  const root = new ElementStub(); root.root = root;
  // Synthetic metadata only; no fixture image is published or fetched.
  const images = Array.from({ length: count }, (_, index) => ({ src: `/qa/${index}.jpg`, fullSrc: `/qa/full-${index}.jpg`,
    thumbnailSrc: `/qa/thumb-${index}.jpg`, alt: `Test image ${index + 1}`, width: 960, height: 540 }));
  root.dataset.galleryImages = JSON.stringify(images); root.dataset.galleryIndex = '0';
  const node = () => { const element = new ElementStub(); element.root = root; return element; };
  const button = (name: string, value = '') => {
    const element = node(); element.button = element; element.setAttribute(name, value); return element;
  };
  const feature = node(); feature.src = images[0]?.src ?? '';
  const enlarge = button('data-gallery-enlarge'); enlarge.surface = true;
  const dialog = node(); const full = node(); dialog.selectors['[data-gallery-full]'] = full;
  const previous = button('data-gallery-step', '-1'); previous.dataset.galleryStep = '-1'; previous.disabled = count < 2;
  const next = button('data-gallery-step', '1'); next.dataset.galleryStep = '1'; next.disabled = count < 2;
  const close = button('data-gallery-close');
  const counters = [node(), node()]; counters.forEach(counter => { counter.textContent = `1 / ${count}`; });
  const supports = gallerySupportIndices(0, count).map((index, slot) => {
    const support = button('data-gallery-select'); support.dataset.gallerySelect = String(index);
    support.dataset.gallerySupport = String(slot); support.selectors.img = node(); return support;
  });
  root.selectors = { '[data-gallery-feature]': feature, '[data-gallery-enlarge]': enlarge, '[data-gallery-dialog]': dialog };
  root.lists = { '[data-gallery-counter]': counters, '[data-gallery-support]': supports };
  const source = readFileSync(new URL('../src/scripts/destination-media.ts', import.meta.url), 'utf8');
  const ast = ts.createSourceFile('gallery.ts', source, ts.ScriptTarget.Latest, true);
  const code = ts.transpileModule(ast.statements.filter(node => !ts.isImportDeclaration(node)).map(node => node.getText(ast)).join('\n'),
    { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(code, {
    Element: ElementStub, AbortController, performance: { now: () => clock },
    galleryIndex, gallerySupportIndices, gallerySwipeStep,
    document: { addEventListener: (event: string, callback: (event: any) => void, options: any) => callbacks.set(event, { callback, options }) },
    window: { addEventListener() {} },
  });
  function fire(name: string, target: ElementStub, data: Record<string, unknown> = {}) {
    const event = { target, isPrimary: true, pointerId: 1, pointerType: 'touch', clientX: 0, clientY: 0,
      prevented: false, stopped: false, preventDefault() { this.prevented = true; }, stopPropagation() { this.stopped = true; }, ...data };
    callbacks.get(name)!.callback(event); return event;
  }
  return { root, feature, enlarge, dialog, full, previous, next, close, counters, supports, callbacks, fire,
    advance: () => { clock += 500; } };
}

test('desktop next/previous/support selection updates actual image, counters and supporting indices', () => {
  const h = harness(3);
  h.fire('click', h.next);
  assert.equal(h.feature.src, '/qa/1.jpg');
  assert(h.counters.every(counter => counter.textContent === '2 / 3'));
  assert.deepEqual(h.supports.map(button => button.dataset.gallerySelect), ['2', '0']);
  assert.equal(h.supports[0]!.selectors.img!.src, '/qa/thumb-2.jpg');
  h.fire('click', h.supports[1]!);
  assert.equal(h.root.dataset.galleryIndex, '0');
  h.fire('click', h.previous);
  assert.equal(h.root.dataset.galleryIndex, '2');
  assert(h.counters.every(counter => counter.textContent === '3 / 3'));
});

test('single-image pilot has no supporting tiles, disabled navigation and working enlargement/close', () => {
  const h = harness(1);
  assert.equal(h.supports.length, 0);
  assert(h.previous.disabled && h.next.disabled);
  h.fire('click', h.next);
  assert.equal(h.feature.src, '/qa/0.jpg');
  assert(h.counters.every(counter => counter.textContent === '1 / 1'));
  h.fire('click', h.enlarge);
  assert.equal(h.dialog.open, true);
  assert.equal(h.full.src, '/qa/full-0.jpg');
  h.fire('click', h.close);
  assert.equal(h.dialog.open, false);
});

test('horizontal mobile swipe changes image/counter without opening enlargement from the synthetic click', () => {
  const h = harness(5);
  h.fire('pointerdown', h.enlarge, { clientX: 200, clientY: 100 });
  h.fire('pointerup', h.enlarge, { clientX: 110, clientY: 105 });
  assert.equal(h.feature.src, '/qa/1.jpg');
  assert(h.counters.every(counter => counter.textContent === '2 / 5'));
  const click = h.fire('click', h.enlarge);
  assert.equal(click.prevented, true);
  assert.equal(h.dialog.open, false);
  h.advance();
  h.fire('click', h.enlarge);
  assert.equal(h.dialog.open, true);
  assert.equal(h.full.src, '/qa/full-1.jpg');
});

test('vertical scroll, small movements, pinch and pointer cancellation do not advance the gallery', () => {
  const h = harness(3);
  h.fire('pointerdown', h.enlarge, { clientX: 100, clientY: 100 });
  h.fire('pointerup', h.enlarge, { clientX: 80, clientY: 200 });
  assert.equal(h.root.dataset.galleryIndex, '0');
  h.fire('pointerdown', h.enlarge, { clientX: 100 });
  h.fire('pointerup', h.enlarge, { clientX: 80 });
  assert.equal(h.root.dataset.galleryIndex, '0');
  h.fire('pointerdown', h.enlarge, { clientX: 100 });
  h.fire('pointerdown', h.enlarge, { isPrimary: false, pointerId: 2 });
  h.fire('pointerup', h.enlarge, { clientX: 0 });
  assert.equal(h.root.dataset.galleryIndex, '0');
  h.fire('pointerdown', h.enlarge, { clientX: 100 });
  h.fire('pointercancel', h.enlarge);
  h.fire('pointerup', h.enlarge, { clientX: 0 });
  assert.equal(h.root.dataset.galleryIndex, '0');
});

test('keyboard switching updates enlarged image; Escape is captured without preventing native dialog closure', () => {
  const h = harness(3);
  h.fire('click', h.enlarge);
  const right = h.fire('keydown', h.next, { key: 'ArrowRight' });
  assert.equal(right.prevented, true); assert.equal(right.stopped, true);
  assert.equal(h.full.src, '/qa/full-1.jpg');
  const escape = h.fire('keydown', h.close, { key: 'Escape' });
  assert.equal(escape.stopped, true); assert.equal(escape.prevented, false);
  assert.equal(h.callbacks.get('keydown')!.options.capture, true);
  // The harness deliberately does not pretend to implement native browser focus/default actions.
});

test('a removed story ignores a pending swipe and a newly cloned gallery starts at image one', () => {
  const old = harness(3);
  old.fire('pointerdown', old.enlarge, { clientX: 200 });
  old.root.isConnected = false;
  old.fire('pointerup', old.enlarge, { clientX: 100 });
  assert.equal(old.root.dataset.galleryIndex, '0');
  const next = harness(3);
  assert.equal(next.root.dataset.galleryIndex, '0');
  assert(next.counters.every(counter => counter.textContent === '1 / 3'));
});
