import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { mobileStoryViewport, mobileSheetHeight } from '../src/lib/imap-mobile.ts';

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const controller = source('src/scripts/imap-prototype.ts');
const css = source('src/styles/imap-prototype.css');
function functions(...names: string[]) {
  const ast = ts.createSourceFile('controller.ts', controller, ts.ScriptTarget.Latest, true);
  return ts.transpileModule(ast.statements.filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text ?? ''))
    .map(node => node.getText(ast)).join('\n'), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
}

test('story fills the visible viewport beneath the measured header, including Safari viewport offsets', () => {
  assert.deepEqual(mobileStoryViewport(740, 0, 800, { top: 0, bottom: 72 }), { top: 72, height: 668, bottom: 60 });
  assert.deepEqual(mobileStoryViewport(680, 30, 800, { top: 0, bottom: 88 }), { top: 88, height: 622, bottom: 90 });
  assert.deepEqual(mobileStoryViewport(740, 0, 800, { top: -64, bottom: 0 }), { top: 0, height: 740, bottom: 60 });
  assert.deepEqual(mobileStoryViewport(740, 0, 800), { top: 0, height: 740, bottom: 60 });
});

test('both marker and list selection use the full-height mobile opening path; desktop retains half state', () => {
  const requests: string[] = [];
  const context = {
    mobile: { matches: true }, selected: undefined, visible: new Set(['ho-hoan-kiem']),
    selectDestination: (_previous: unknown, slug: string) => slug,
    prototypeCollection: [{ slug: 'ho-hoan-kiem', name: 'Hồ Hoàn Kiếm' }],
    templates: new Map([['ho-hoan-kiem', { content: { cloneNode: () => ({}) } }]]),
    story: { hidden: true, focus() {} }, storyLabel: { textContent: '' },
    content: { append() {}, querySelectorAll: () => [], querySelector: () => ({ focus() {} }), scrollTop: 200 },
    explorer: { classList: { add() {} } }, reopen: { hidden: false },
    cameraFlight: false, previousFocus: null, videoHeight: 0, cameraIntent: 'discovery',
    stopVideo() {}, filter() {}, setSheetState: (state: string) => requests.push(state),
    measureStoryFrame: () => 300, resizeMap() {}, keepSelectedVisible() {},
  };
  runInNewContext(functions('openPlace'), context);
  runInNewContext("openPlace('ho-hoan-kiem', {});", context);
  assert.deepEqual(requests, ['expanded', 'expanded']);
  assert.equal(context.content.scrollTop, 0);
  context.mobile.matches = false;
  runInNewContext("openPlace('ho-hoan-kiem', {});", context);
  assert.deepEqual(requests.slice(2), ['half', 'half']);
  assert(controller.includes("marker.on('click', () => clustered ? openDirectory(ids) : openPlace(place.slug, marker.getElement()))"));
  assert(controller.includes("on(button, 'click', () => openPlace(button.dataset.selectPlace!, button))"));
});

test('selected mobile story cannot reopen at half height, while discovery snaps stay available', () => {
  let painted = 0;
  let locked = false;
  const directory = { inert: false };
  const context = {
    mobile: { matches: true }, story: { hidden: false, inert: false }, sheetState: 'collapsed',
    sheet: { dataset: {}, classList: { remove() {} } }, explorer: { dataset: {} },
    content: { inert: false }, document: { querySelector: () => directory },
    syncMobileStoryLayout: (active: boolean) => { locked = active; return active ? 668 : undefined; },
    paintSheetHeight: (height: number) => { painted = height; }, mobileSheetHeight,
    availableHeight: () => 400, safeArea: () => 0, videoHeight: 300,
    discovery: { setAttribute() {} }, stateButtons: [],
  };
  runInNewContext(functions('setSheetState'), context);
  runInNewContext("setSheetState('half');", context);
  assert.equal(context.sheetState, 'expanded');
  assert.equal(painted, 668);
  assert.equal(locked, true);
  context.story.hidden = true;
  runInNewContext("setSheetState('half');", context);
  assert.equal(context.sheetState, 'half');
  assert.equal(locked, false);
  runInNewContext("setSheetState('collapsed');", context);
  assert.equal(painted, 52);
});

test('mobile close unloads content and retains camera, selected pin and filter state', () => {
  const state = { radius: 1000, category: 'experience', center: { lat: 21.03, lng: 105.85 } };
  const camera = { center: { ...state.center }, zoom: 15.4 };
  let unloaded = 0;
  let snap = '';
  const context = {
    mobile: { matches: true }, story: { hidden: false }, selected: 'ho-hoan-kiem', state, camera,
    cameraReady: true, cameraFlight: false, sheetState: 'expanded',
    map: { invalidateSize() {}, panBy() { assert.fail('closing must not pan'); }, setView() { assert.fail('closing must not refit'); } },
    renderMarkers() {}, stopVideo() { unloaded++; }, reopen: { hidden: true },
    explorer: { classList: { remove() {} } }, setSheetState: (next: string) => { snap = next; },
  };
  runInNewContext(`${functions('resizeMap', 'closeStory')}\ncloseStory(false);`, context);
  assert.equal(unloaded, 1);
  assert.equal(snap, 'collapsed');
  assert.equal(context.selected, 'ho-hoan-kiem');
  assert.equal(context.state, state);
  assert.deepEqual(context.camera, camera);
});

test('mobile-only CSS removes container cap, compacts controls, keeps toolbar outside scroll and video uncropped', () => {
  const block = css.slice(css.indexOf('/* Selected stories escape'), css.indexOf('.prototype-sheet[data-sheet-state=collapsed]:not(.is-dragging)'));
  assert(css.lastIndexOf('@media (max-width: 960px)', css.indexOf('/* Selected stories escape')) > css.indexOf('@media (min-width: 961px)'));
  assert(block.includes('position: fixed;'));
  assert(block.includes('height: var(--story-available-height, 100dvh)'));
  assert(block.includes('max-height: none;'));
  assert(block.includes('transition: none;'));
  assert(block.includes('.explorer.has-story .sheet-handle { display: none; }'));
  assert(block.includes('.story-toolbar { display: flex; justify-content: flex-end;'));
  assert(block.includes('overscroll-behavior: none; touch-action: pan-y pinch-zoom;'));
  assert(css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
  assert(css.includes('height: clamp(360px, 68svh, 680px)'));
  assert(css.includes('aspect-ratio: 16 / 9'));
  assert(css.includes('object-fit: contain'));
  const component = source('src/components/imap/PrototypeExplorer.astro');
  assert(component.indexOf('class="story-toolbar"') < component.indexOf('id="prototype-story-content"'));
  assert.equal((component.match(/<h2 tabindex="-1">\{place.name\}<\/h2>/g) ?? []).length, 1);
});
