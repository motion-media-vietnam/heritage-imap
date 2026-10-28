import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { mobileSheetHeight, mobileStoryViewport } from '../src/lib/imap-mobile.ts';
import { prototypeFitPadding } from '../src/lib/imap-prototype-camera.ts';
import { probePrototypeInitialization } from './fixtures/prototype-init-runtime.mjs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const controller = read('src/scripts/imap-prototype.ts');
function functions(...names: string[]) {
  const ast = ts.createSourceFile('controller.ts', controller, ts.ScriptTarget.Latest, true);
  return ts.transpileModule(ast.statements.filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text ?? ''))
    .map(node => node.getText(ast)).join('\n'), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
}

test('mobile radius fits are immediate, monotonic and independent of destination membership', async () => {
  for (const width of [320, 390, 430]) {
    const zooms: number[] = [];
    for (const radius of [500, 1000, 2000] as const) {
      const options = { width, height: 500, mobile: true, radius };
      const expected = await probePrototypeInitialization(controller, options);
      assert.deepEqual(expected.errors, []);
      zooms.push(expected.fittedZoom);
      const empty = await probePrototypeInitialization(controller, { ...options, query: 'no-matching-destination' });
      assert.equal(empty.fittedZoom, expected.fittedZoom);
      assert.deepEqual(empty.cameraCenter, expected.cameraCenter);
    }
    assert(zooms[0]! > zooms[1]! && zooms[1]! > zooms[2]!);
    assert(Math.abs(zooms[0]! - zooms[1]! - 1) < .001);
    assert(Math.abs(zooms[1]! - zooms[2]! - 1) < .001);
  }
});

test('rapid mobile radius changes refresh size before fitting and leave no queued flight', async () => {
  const expected = await probePrototypeInitialization(controller, { width: 390, height: 500, mobile: true, radius: 2000 });
  const result = await probePrototypeInitialization(controller, { width: 390, height: 500, mobile: true, exercise: context => {
    const accepted = { ...context.state.center };
    const invalidate = context.map.invalidateSize.bind(context.map);
    let invalidations = 0;
    context.map.invalidateSize = (options: unknown) => { invalidations++; return invalidate(options); };
    for (const radius of [500, 1000, 2000, 'All', 500, 2000]) {
      context.state.radius = radius;
      const before = invalidations;
      context.run('updateCircle(); focusDiscovery(true);');
      assert(invalidations > before);
      assert.equal(context.cameraFlight, false);
      assert.deepEqual(context.state.center, accepted);
    }
    const zoom = context.map.getZoom();
    const center = context.map.getCenter();
    context.flushFlights();
    assert.equal(context.map.getZoom(), zoom);
    assert(context.map.project(context.map.getCenter()).distanceTo(context.map.project(center)) <= 1);
  } });
  assert.deepEqual(result.errors, []);
  assert.equal(result.flightCalls, 0);
  assert(Math.abs(result.fittedZoom - expected.fittedZoom) < 1e-10);
  assert.deepEqual(result.cameraCenter, expected.cameraCenter);
});

test('mobile radius fit uses the new container size rather than Leaflet cached dimensions', async () => {
  const expected = await probePrototypeInitialization(controller, { width: 390, height: 560, mobile: true, radius: 500 });
  const resized = await probePrototypeInitialization(controller, { width: 390, height: 500, mobile: true, exercise: context => {
    assert.equal(context.map.getSize().y, 500); // Prime Leaflet's size cache.
    context.map._container.clientHeight = 560;
    context.cameraFitOptions = () => {
      const size = context.map.getSize();
      return prototypeFitPadding({ width: size.x, height: size.y, sheetHeight: 52, toolbarBottom: 60, bottomOverlayHeight: 20 }, 0);
    };
    context.state.radius = 500;
    context.run('focusDiscovery(true);');
    assert.equal(context.map.getSize().y, 560);
  } });
  assert.deepEqual(resized.errors, []);
  assert(Math.abs(resized.fittedZoom - expected.fittedZoom) < 1e-10);
  assert.deepEqual(resized.cameraCenter, expected.cameraCenter);
});

test('All still frames eligible records and desktop retains animated radius transitions', async () => {
  const all = await probePrototypeInitialization(controller, { mobile: true, radius: 'All' });
  assert.deepEqual(all.errors, []);
  assert.equal(all.fitCalls, 1);
  const empty = await probePrototypeInitialization(controller, { mobile: true, radius: 'All', query: 'no-matching-destination' });
  assert.equal(empty.fitCalls, 0);
  const desktop = await probePrototypeInitialization(controller, { exercise: context => {
    context.state.radius = 500;
    context.run('focusDiscovery(true);');
    assert.equal(context.cameraFlight, true);
    context.flushFlights();
    assert.equal(context.cameraFlight, false);
  } });
  assert.deepEqual(desktop.errors, []);
  assert.equal(desktop.flightCalls, 1);
});

test('manual camera and story-return resize do not refit a radius or reset the accepted center', async () => {
  const result = await probePrototypeInitialization(controller, { mobile: true, exercise: context => {
    const accepted = { ...context.state.center };
    context.map.fire('zoomstart');
    context.map.setView([21.04, 105.86], 14.25, { animate: false });
    const center = context.map.getCenter();
    const zoom = context.map.getZoom();
    context.selected = 'ho-hoan-kiem';
    context.story.hidden = false;
    context.sheetState = 'expanded';
    context.stopVideo = () => {};
    context.explorer = { classList: { remove() {} } };
    context.reopen = { hidden: true };
    context.run(`${functions('closeStory')}\ncloseStory(false); resize();`);
    context.flushFlights();
    assert.equal(context.map.getZoom(), zoom);
    assert(context.map.project(context.map.getCenter()).distanceTo(context.map.project(center)) <= 1);
    assert.deepEqual(context.state.center, accepted);
    assert.equal(context.selected, 'ho-hoan-kiem');
    assert.equal(context.cameraIntent, 'manual');
  } });
  assert.deepEqual(result.errors, []);
});

test('mobile camera clipping accounts for header without treating it as extra bottom clipping', () => {
  const context = {
    mobile: { matches: true }, state: { radius: 1000 }, sheetState: 'collapsed', videoHeight: 0,
    map: { getSize: () => ({ x: 390, y: 500 }) },
    mapElement: { getBoundingClientRect: () => ({ top: 30, bottom: 530, left: 0, right: 390 }) },
    window: { innerHeight: 600, innerWidth: 390, visualViewport: { offsetTop: 20, offsetLeft: 0, height: 500, width: 390 } },
    document: { querySelector: (selector: string) => selector === '.site-header'
      ? { getBoundingClientRect: () => ({ top: 0, bottom: 80 }) } : null },
    getComputedStyle: () => ({ visibility: 'hidden' }), status: {},
    availableHeight: () => 500, safeArea: () => 0,
    mobileStoryViewport, mobileSheetHeight, prototypeFitPadding,
  };
  const mobile = runInNewContext(`${functions('cameraFitOptions')}\ncameraFitOptions();`, context);
  assert.deepEqual(Array.from(mobile.paddingTopLeft), [0, 50]);
  assert.deepEqual(Array.from(mobile.paddingBottomRight), [0, 72]);
  context.mobile.matches = false;
  const desktop = runInNewContext('cameraFitOptions();', context);
  assert.deepEqual(Array.from(desktop.paddingTopLeft), [0, 0]);
  assert.deepEqual(Array.from(desktop.paddingBottomRight), [0, 20]);
});

test('category text switches only the default option, without changing selected category or option values', () => {
  const option = { value: 'All', textContent: 'Mọi danh mục' };
  const context = { mobile: { matches: true }, categorySelect: { value: 'experience',
    querySelector: (selector: string) => { assert.equal(selector, 'option[value="All"]'); return option; } } };
  runInNewContext(`${functions('syncCategoryLabel')}\nsyncCategoryLabel();`, context);
  assert.equal(option.textContent, 'Danh mục');
  assert.equal(option.value, 'All');
  assert.equal(context.categorySelect.value, 'experience');
  context.mobile.matches = false;
  runInNewContext('syncCategoryLabel();', context);
  assert.equal(option.textContent, 'Mọi danh mục');
  assert(controller.includes("on(mobile, 'change', syncCategoryLabel)"));
});

test('one zoom group is configured and mobile three-filter row keeps an inset keyboard-focus outline', () => {
  assert(controller.includes('zoomControl: false'));
  assert.equal((controller.match(/L\.control\.zoom\(/g) ?? []).length, 1);
  const css = read('src/styles/imap-prototype.css');
  assert(css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
  assert(css.includes('.filter-label select:focus-visible { outline-offset: -2px; }'));
  assert(css.includes('outline: 2px solid var(--prototype-navy)'));
  assert(css.includes('min-width: 0; width: 100%'));
});
