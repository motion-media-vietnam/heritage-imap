import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext, createContext, runInContext } from 'node:vm';
import ts from 'typescript';
import { places } from '../src/data/places.ts';
import { createExplorerState, filterExplorerPlaces } from '../src/lib/imap.ts';
import { selectDestination } from '../src/lib/imap-prototype.ts';

const source = readFileSync(new URL('../src/scripts/imap.ts', import.meta.url), 'utf8');
const ast = ts.createSourceFile('imap.ts', source, ts.ScriptTarget.Latest, true);

// These are controller/Node tests, not browser/Leaflet rendering or gesture tests.
test('the actual custom-element lifecycle mounts once and cleans up before reconnecting', () => {
  const declaration = ast.statements.find(node => ts.isClassDeclaration(node) && node.name?.text === 'HanoiIMap');
  assert(declaration);
  let mounts = 0; let cleanups = 0; let nextFrame = 0;
  const frames = new Map<number, () => void>();
  const compiled = ts.transpileModule(declaration.getText(ast), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  const Component = runInNewContext(`${compiled}\nHanoiIMap;`, {
    HTMLElement: class { isConnected = true; },
    requestAnimationFrame: (callback: () => void) => { const id = ++nextFrame; frames.set(id, callback); return id; },
    cancelAnimationFrame: (id: number) => frames.delete(id),
    mountIMap: () => { mounts++; return () => cleanups++; },
  }) as new () => { isConnected: boolean; connectedCallback(): void; disconnectedCallback(): void };
  const flush = () => { for (const [id, callback] of frames) { frames.delete(id); callback(); } };
  const first = new Component();
  first.connectedCallback(); first.connectedCallback(); assert.equal(frames.size, 1);
  flush(); first.connectedCallback(); assert.equal(mounts, 1); assert.equal(frames.size, 0);
  first.disconnectedCallback(); first.disconnectedCallback(); assert.equal(cleanups, 1);
  first.connectedCallback(); flush(); assert.equal(mounts, 2);
  const second = new Component(); second.connectedCallback();
  second.isConnected = false; second.disconnectedCallback(); flush(); assert.equal(mounts, 2);
  first.disconnectedCallback(); assert.equal(cleanups, 2);
});

test('one guarded Leaflet construction and one layer are shared by selection and directory events', () => {
  const constructors: ts.CallExpression[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
      && node.expression.expression.getText(ast) === 'L' && ['map', 'tileLayer'].includes(node.expression.name.text)) constructors.push(node);
    ts.forEachChild(node, visit);
  };
  visit(ast);
  assert.equal(constructors.length, 2);
  const connect = source.slice(source.indexOf('async function connect()'), source.indexOf("on(retry, 'click'"));
  assert(connect.includes('if (lifetime.disposed || connecting || map) return;'));
  assert(connect.indexOf('connecting = true') < connect.indexOf("await import('leaflet')"));
  assert(connect.includes('if (lifetime.disposed) return;'));
  assert(connect.includes('finally { connecting = false; }'));
  assert(connect.includes('destroyMap();') && connect.includes('retry.hidden = false'));
  assert(source.includes("marker.on('click', () => openPlace(place.slug, marker.getElement()))"));
  assert(source.includes("on(button, 'click', () => openPlace(button.dataset.imapPlace!, button))"));
});

test('actual tile status callbacks do not announce successful map loading after tile failures', () => {
  const handlers = new Map<string, string>();
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === 'tiles.on') {
      const event = node.arguments[0];
      if (event && ts.isStringLiteral(event)) handlers.set(event.text, node.arguments[1]!.getText(ast));
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  let deadline = () => {};
  const status = { textContent: '' };
  const context = createContext({ status, setTimeout: (callback: () => void) => { deadline = callback; return 1; }, clearTimeout: () => {} });
  runInContext(`let failures = 0; let timeout; const lifetime = {disposed:false};
    const loading = ${handlers.get('loading')}; const tileerror = ${handlers.get('tileerror')}; const load = ${handlers.get('load')};`, context);
  runInContext('loading(); tileerror(); load();', context);
  assert(status.textContent.includes('chưa tải được'));
  assert(!status.textContent.includes('Chọn ghim'));
  runInContext('loading();', context); deadline();
  assert(status.textContent.includes('tải quá lâu'));
  runInContext('load();', context);
  assert(status.textContent.includes('Chọn ghim'));
});

test('all six identities/coordinates remain fixed and repeated filtered selections agree', () => {
  assert.deepEqual(places.map(place => [place.slug, place.coordinates.lat, place.coordinates.lng]), [
    ['ho-hoan-kiem', 21.0286, 105.8525], ['pho-co', 21.0358, 105.8504],
    ['van-mieu', 21.0273, 105.8355], ['hoang-thanh-thang-long', 21.0352, 105.8403],
    ['ho-tay', 21.0479, 105.8369], ['cau-long-bien', 21.0436, 105.8587],
  ]);
  const state = createExplorerState();
  for (const query of ['', 'ho', 'pho co', 'van mieu', 'no-match']) {
    state.query = query;
    const visible = new Set(filterExplorerPlaces(places, state).map(place => place.slug));
    for (const place of places) {
      const selected = selectDestination(state.selected, place.slug, visible);
      assert.equal(selected, visible.has(place.slug) ? place.slug : state.selected);
      state.selected = selected;
    }
  }
});
