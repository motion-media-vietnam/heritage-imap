import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { places } from '../src/data/places.ts';
import { mobileSheetHeight } from '../src/lib/imap-mobile.ts';
import { prototypeFitPadding, prototypeMarkerPan, prototypeStoryHeight } from '../src/lib/imap-prototype-camera.ts';
import { parseDiscoveryRadius, createNeighborhoodState, resolveDiscoveryLocation } from '../src/lib/imap-neighborhood.ts';
import { selectDestination } from '../src/lib/imap-prototype.ts';
import { probePrototypeInitialization } from './fixtures/prototype-init-runtime.mjs';

const source = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
const ast = ts.createSourceFile('prototype.ts', source, ts.ScriptTarget.Latest, true);
function functions(...names: string[]) {
  return ts.transpileModule(ast.statements.filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text ?? ''))
    .map(node => node.getText(ast)).join('\n'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
}
function handler(target: string, event: string, receiver = 'on') {
  let found: ts.CallExpression | undefined;
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === receiver
      && (receiver === 'on' ? node.arguments[0]?.getText(ast) === target && node.arguments[1]?.getText(ast) === `'${event}'`
        : node.arguments[0]?.getText(ast) === `'${event}'`)) found = node;
    ts.forEachChild(node, visit);
  };
  visit(ast); assert(found);
  return found.arguments[receiver === 'on' ? 2 : 1]!.getText(ast);
}

test('padding reserves the target mobile sheet, attribution, toolbar and clipped browser viewport', () => {
  const padding = prototypeFitPadding({ width: 390, height: 500, sheetHeight: 86, toolbarBottom: 60 });
  assert(padding); assert.deepEqual(padding.paddingTopLeft, [36, 96]); assert.deepEqual(padding.paddingBottomRight, [36, 142]);
  const withStatus = prototypeFitPadding({ width: 390, height: 500, sheetHeight: 86, toolbarBottom: 60, bottomOverlayHeight: 57 });
  assert(withStatus); assert.equal(withStatus.paddingBottomRight[1], 179);
  const clipped = prototypeFitPadding({ width: 430, height: 600, sheetHeight: 52, toolbarBottom: 60,
    clippedTop: 100, clippedBottom: 180, clippedLeft: 10, clippedRight: 20 });
  assert(clipped); assert.deepEqual(clipped.paddingTopLeft, [46, 136]); assert.deepEqual(clipped.paddingBottomRight, [56, 216]);
  assert.equal(prototypeFitPadding({ width: 390, height: 280, sheetHeight: 252, toolbarBottom: 60 }), undefined);
  assert.equal(prototypeFitPadding({ width: 0, height: 500 }), undefined);
});

test('real Leaflet fit planning keeps each radius and All bounds inside padded mobile space', async () => {
  // Real Leaflet fit/projection math with controlled dimensions, NOT browser rendering.
  for (const width of [360, 390, 430]) for (const radius of [500, 1000, 2000, 'All'] as const) {
    const result = await probePrototypeInitialization(source, { width, height: 500, mobile: true, sheetHeight: 86, bottomOverlayHeight: 57, radius });
    assert.deepEqual(result.errors, []); assert.equal(result.fitCalls, radius === 'All' ? 1 : 0);
    const padding = result.fitOptions; assert(padding);
    const box = result.fittedPixels;
    assert(box.minX >= padding.paddingTopLeft[0] - 1);
    assert(box.minY >= padding.paddingTopLeft[1] - 1);
    assert(box.maxX <= width - padding.paddingBottomRight[0] + 1);
    assert(box.maxY <= 500 - padding.paddingBottomRight[1] + 1);
    assert(Number.isFinite(result.fittedZoom) && result.fittedZoom <= 16);
  }
});

test('All frames only currently eligible destinations; zero results never fit invalid/world bounds', async () => {
  const all = await probePrototypeInitialization(source, { radius: 'All' });
  assert.equal(all.markerCandidates.length, 6); assert.equal(all.fitCalls, 1);
  const subset = await probePrototypeInitialization(source, { radius: 'All', query: 'pho co' });
  assert.deepEqual(subset.markerCandidates, ['pho-co']); assert.equal(subset.fitCalls, 1);
  assert.equal(subset.fittedBounds[0]!.lat, places[1]!.coordinates.lat);
  assert.equal(subset.fittedBounds[1]!.lng, places[1]!.coordinates.lng);
  const empty = await probePrototypeInitialization(source, { radius: 'All', query: 'no-matching-destination' });
  assert.deepEqual(empty.errors, []); assert.equal(empty.markerCandidates.length, 0); assert.equal(empty.fitCalls, 0);
});

test('actual radius handler collapses exploration before fitting, without changing other filters', () => {
  for (const radius of ['500', '1000', '2000', 'All']) {
    const steps: string[] = [];
    const state = { ...createNeighborhoodState(), query: 'hanoi', district: 'Hoàn Kiếm' };
    const context = { state, radiusSelect: { value: radius }, parseDiscoveryRadius,
      closeStory: () => steps.push('compact'), updateCircle: () => steps.push('circle'), filter: () => steps.push('filter'),
      resizeMap: () => steps.push('invalidate'), focusDiscovery: (animate: boolean) => { assert.equal(animate, true); steps.push('fit'); } };
    runInNewContext(`(${handler('radiusSelect', 'change')})();`, context);
    assert.deepEqual(steps, ['compact', 'circle', 'filter', 'invalidate', 'fit']);
    assert.equal(state.radius, parseDiscoveryRadius(radius)); assert.equal(state.query, 'hanoi'); assert.equal(state.district, 'Hoàn Kiếm');
  }
});

test('selection pans minimally only when obscured; manual camera movement cancels correction', () => {
  const padding = prototypeFitPadding({ width: 390, height: 600, sheetHeight: 300, toolbarBottom: 60 }); assert(padding);
  const size = { x: 390, y: 600 };
  assert.equal(prototypeMarkerPan({ x: 150, y: 150 }, size, padding), undefined);
  assert.deepEqual(prototypeMarkerPan({ x: 370, y: 500 }, size, padding), [16, 256]);
  const calls: unknown[] = [];
  const context = { selected: 'pho-co', places, mobile: { matches: true }, story: { hidden: false }, cameraIntent: 'selection', cameraFlight: false,
    cameraFitOptions: () => padding, prototypeMarkerPan,
    map: { getSize: () => size, latLngToContainerPoint: () => ({ x: 370, y: 500 }), panBy: (offset: unknown) => calls.push(offset) } };
  const keep = functions('keepSelectedVisible');
  runInNewContext(`${keep}\nkeepSelectedVisible();`, context); assert.equal(calls.length, 1);
  context.cameraIntent = 'manual'; runInNewContext(`${keep}\nkeepSelectedVisible();`, context); assert.equal(calls.length, 1);
  context.cameraIntent = 'selection'; context.story.hidden = true;
  runInNewContext(`${keep}\nkeepSelectedVisible();`, context); assert.equal(calls.length, 1);
  const manual = { framingCamera: false, cameraFlight: false, cameraIntent: 'discovery', allowAreaOffer: false };
  runInNewContext(`${functions('manualCamera')}\n(${handler('', 'dragstart', 'map.on')})();`, manual);
  assert.equal(manual.cameraIntent, 'manual'); assert.equal(manual.allowAreaOffer, true);
  manual.cameraIntent = 'discovery'; manual.framingCamera = true;
  runInNewContext(`(${handler('', 'zoomstart', 'map.on')})();`, manual); assert.equal(manual.cameraIntent, 'discovery');
  manual.framingCamera = false;
  runInNewContext(`(${handler('', 'zoomstart', 'map.on')})();`, manual); assert.equal(manual.cameraIntent, 'manual');
});

test('accept-area and layout changes preserve the manual camera instead of snapping to discovery', () => {
  let fits = 0;
  const target = places.find(place => place.slug === 'ho-tay')!.coordinates;
  const context = { state: { ...createNeighborhoodState(), radius: 'All' as const }, cameraIntent: 'selection', cameraFlight: false,
    map: { getCenter: () => target, panBy: () => assert.fail('manual view must not be corrected') }, selected: 'pho-co', places,
    radiusSelect: { value: 'All' }, centerLabel: { textContent: '' }, allowAreaOffer: true, exploreArea: { hidden: false },
    resolveDiscoveryLocation, updateCircle() {}, filter() {},
    window: { visualViewport: { height: 800 }, innerHeight: 800 }, document: { documentElement: { style: { setProperty() {} } } },
    story: { hidden: true }, mobile: { matches: true }, sheetState: 'collapsed', videoHeight: 0,
    measureStoryFrame: () => 366, setSheetState() {}, resizeMap() {}, focusDiscovery: () => fits++ };
  runInNewContext(`(${handler('exploreArea', 'click')})();`, context);
  assert.equal(context.cameraIntent, 'manual'); assert.deepEqual(context.state.center, target);
  const layout = functions('resize', 'keepSelectedVisible');
  runInNewContext(`${layout}\nresize();`, context); assert.equal(fits, 0);
  context.story.hidden = false; runInNewContext(`${layout}\nresize();`, context); assert.equal(fits, 0);
  context.story.hidden = true; context.cameraIntent = 'discovery';
  runInNewContext(`${layout}\nresize();`, context); assert.equal(fits, 0, 'even automatic discovery is never refitted by a layout callback');
});

test('story height includes the complete frame, scroller padding, border and safe-area space', () => {
  const required = prototypeStoryHeight(52, 290.25, 20, 1);
  assert.equal(required, 366);
  assert(mobileSheetHeight('half', 600, required, 34) >= required + 34);
  assert.equal(mobileSheetHeight('half', 300, required, 34), 270, 'short screens retain scrolling and the original aspect ratio');
  assert.equal(mobileSheetHeight('collapsed', 600, required, 34), 86);
});

test('actual marker-open and close functions preserve selection and restore compact sheet state', () => {
  const attributes = new Map<string, string>(); const heights: number[] = []; let cameraChecks = 0;
  const directory = { inert: false };
  const content = { inert: false, scrollTop: 0, append() {}, querySelectorAll: () => [],
    querySelector: () => ({ focus() {} }) };
  const context = { prototypeCollection: places, visible: new Set(['ho-hoan-kiem', 'pho-co']), selected: undefined, selectDestination,
    templates: new Map([['pho-co', { content: { cloneNode: () => ({}) } }]]),
    story: { hidden: true, inert: false }, content, storyLabel: { textContent: '' }, reopen: { hidden: true },
    explorer: { dataset: {}, classList: { add() {}, remove() {} } },
    sheet: { dataset: {}, classList: { remove() {} } }, sheetState: 'collapsed', videoHeight: 0,
    mobile: { matches: true }, availableHeight: () => 600, safeArea: () => 34, mobileSheetHeight,
    paintSheetHeight: (height: number) => heights.push(height), stateButtons: [],
    discovery: { setAttribute: (key: string, value: string) => attributes.set(key, value) },
    document: { querySelector: () => directory }, previousFocus: null,
    stopVideo() {}, filter() {}, measureStoryFrame: () => 366, resizeMap() {}, map: undefined, connect() {},
    cameraFlight: false, keepSelectedVisible: () => cameraChecks++, cameraIntent: 'manual' };
  const bodies = functions('openPlace', 'closeStory', 'setSheetState');
  runInNewContext(`${bodies}\nopenPlace('pho-co', {});`, context);
  assert.equal(context.story.hidden, false); assert.equal(context.sheetState, 'half'); assert.equal(context.selected, 'pho-co');
  assert.equal(heights.at(-1), 400); assert.equal(content.inert, false); assert.equal(cameraChecks, 1);
  runInNewContext(`${bodies}\ncloseStory(false);`, context);
  assert.equal(context.story.hidden, true); assert.equal(context.sheetState, 'collapsed'); assert.equal(context.selected, 'pho-co');
  assert.equal(heights.at(-1), 86); assert.equal(content.inert, true); assert.equal(cameraChecks, 1);
  assert.equal(attributes.get('aria-expanded'), 'false');
});

test('geographic radii have strictly monotonic zoom, 80% occupancy and centered search focus', async t => {
  for (const view of [
    { width: 1050, height: 640, toolbarBottom: 76, bottomOverlayHeight: 57 },
    { width: 560, height: 640, toolbarBottom: 76, bottomOverlayHeight: 57 },
    ...[360, 390, 430].map(width => ({ width, height: 500, mobile: true, sheetHeight: 86, toolbarBottom: 76, bottomOverlayHeight: 57 })),
  ]) {
    const zooms: number[] = [];
    for (const radius of [500, 1000, 2000] as const) {
      const result = await probePrototypeInitialization(source, { ...view, radius });
      assert.deepEqual(result.errors, []); assert.equal(result.viewCalls, 1); assert.equal(result.fitCalls, 0);
      const padding = result.fitOptions!; const box = result.fittedPixels;
      const usableW = view.width - padding.paddingTopLeft[0] - padding.paddingBottomRight[0];
      const usableH = view.height - padding.paddingTopLeft[1] - padding.paddingBottomRight[1];
      assert(box.minX >= padding.paddingTopLeft[0] - 1 && box.maxX <= view.width - padding.paddingBottomRight[0] + 1);
      assert(box.minY >= padding.paddingTopLeft[1] - 1 && box.maxY <= view.height - padding.paddingBottomRight[1] + 1);
      const occupancy = Math.max((box.maxX - box.minX) / usableW, (box.maxY - box.minY) / usableH);
      assert(occupancy >= .75 && occupancy <= .85, `occupancy=${occupancy}`);
      assert(Math.abs(result.focusPixel.x - (padding.paddingTopLeft[0] + usableW / 2)) <= 1);
      assert(Math.abs(result.focusPixel.y - (padding.paddingTopLeft[1] + usableH / 2)) <= 1);
      zooms.push(result.fittedZoom);
      // Same geography/viewport, completely different (including empty) destination sets.
      for (const query of ['pho co', 'no-matching-destination']) {
        const filtered = await probePrototypeInitialization(source, { ...view, radius, query });
        assert.equal(filtered.fittedZoom, result.fittedZoom);
        assert.deepEqual(filtered.fittedBounds, result.fittedBounds);
      }
    }
    assert(zooms[0]! > zooms[1]! && zooms[1]! > zooms[2]!);
    assert(Math.abs(zooms[0]! - zooms[1]! - 1) < .001);
    assert(Math.abs(zooms[1]! - zooms[2]! - 1) < .001);
    t.diagnostic(`${view.width}x${view.height}: zoom(500/1000/2000)=${zooms.map(z => z.toFixed(6)).join(' / ')}`);
  }
});

test('real Leaflet RAF: latest radius wins; layout and repeated initialization cannot overwrite final zoom', async () => {
  const expected = await probePrototypeInitialization(source, { radius: 2000 });
  const result = await probePrototypeInitialization(source, { exercise: async context => {
    for (const radius of [500, 'All', 1000, 2000]) {
      context.state.radius = radius;
      context.run('updateCircle(); focusDiscovery(true);');
      assert.equal(context.cameraFlight, true);
      context.run('resize(); resizeMap();');
    }
    context.flushFlights(); assert.equal(context.cameraFlight, false);
    assert(Math.abs(context.map.getZoom() - expected.fittedZoom) < 1e-10);
    const finalZoom = context.map.getZoom(); const center = context.map.getCenter();
    context.run('resize(); resizeMap();');
    await context.run('connect();'); // Existing map guard, no second seed/fit.
    context.flushFlights();
    assert.equal(context.map.getZoom(), finalZoom);
    assert(context.map.project(context.map.getCenter()).distanceTo(context.map.project(center)) <= 1);
  } });
  assert.deepEqual(result.errors, []); assert(Math.abs(result.fittedZoom - expected.fittedZoom) < 1e-10);
  assert.equal(result.flightCalls, 4);
});

test('real Leaflet RAF: manual input cancels old flight and prevents delayed camera restoration', async () => {
  const result = await probePrototypeInitialization(source, { exercise: context => {
    const accepted = { ...context.state.center };
    context.state.radius = 500; context.run('focusDiscovery(true);');
    assert.equal(context.cameraFlight, true);
    context.map.fire('dragstart');
    assert.equal(context.cameraIntent, 'manual'); assert.equal(context.cameraFlight, false);
    const manualZoom = context.map.getZoom() - .25;
    context.map.setView([21.04, 105.86], manualZoom, { animate: false });
    const center = context.map.getCenter();
    context.flushFlights(); context.run('resize(); resizeMap();'); context.flushFlights();
    assert.equal(context.map.getZoom(), manualZoom);
    assert(context.map.project(context.map.getCenter()).distanceTo(context.map.project(center)) <= 1);
    assert.deepEqual(context.state.center, accepted, 'pan does not silently accept a new search center');
    // A plain pointer-down also stops Leaflet, even if no dragstart follows.
    context.run('focusDiscovery(true);'); assert.equal(context.cameraFlight, true);
    context.mapElement = {};
    context.on = (_target: unknown, event: string, callback: () => void) => { if (event === 'pointerdown') callback(); };
    const input = source.slice(source.indexOf("for (const event of ['pointerdown'"), source.indexOf("on(mapElement, 'keydown'"));
    context.run(input); assert.equal(context.cameraFlight, false); assert.equal(context.cameraIntent, 'manual');
    const interruptedZoom = context.map.getZoom();
    context.flushFlights(); context.run('resize();');
    assert.equal(context.map.getZoom(), interruptedZoom, 'tap cancellation must not leave an old RAF or suspended resize guard');
  } });
  assert.deepEqual(result.errors, []);
});

test('selection/close/resize controller paths never set a captured or marker-derived zoom', () => {
  let invalidations = 0;
  const context = { cameraReady: true, cameraFlight: false, cameraIntent: 'selection', selected: 'ho-hoan-kiem', places,
    story: { hidden: false }, mobile: { matches: true }, renderMarkers() {},
    cameraFitOptions: () => prototypeFitPadding({ width: 1050, height: 640 }), prototypeMarkerPan,
    map: { invalidateSize: () => invalidations++, getSize: () => ({ x: 1050, y: 640 }),
      latLngToContainerPoint: () => ({ x: 500, y: 300 }),
      setView: () => assert.fail('selection/layout must not write zoom'),
      fitBounds: () => assert.fail('selection/layout must not fit destination markers'),
      panBy: () => assert.fail('already visible marker needs no pan') } };
  runInNewContext(`${functions('resizeMap', 'keepSelectedVisible')}\nresizeMap(); keepSelectedVisible();`, context);
  context.story.hidden = true;
  runInNewContext(`${functions('resizeMap', 'keepSelectedVisible')}\nresizeMap(); keepSelectedVisible();`, context);
  assert.equal(invalidations, 2);
});
