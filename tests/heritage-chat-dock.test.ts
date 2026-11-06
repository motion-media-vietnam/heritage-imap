import assert from 'node:assert/strict';
import test from 'node:test';
import { centerDock, chooseHeritageDock, dockBounds, overlapsDock, type DockViewport } from '../src/lib/heritage-chat-dock.ts';

const desktop: DockViewport = {
  right: 1280, top: 100, bottom: 884, height: 900, verticalWidth: 36, verticalHeight: 152, compactSize: 44, compactOnly: false,
};

test('the vertical tab fits in an editorial gutter without overlapping the card', () => {
  const card = { left: 38, right: 1242, top: 150, bottom: 850 };
  assert.deepEqual(chooseHeritageDock(desktop, [card]), centerDock);
  assert.equal(overlapsDock(dockBounds(centerDock, desktop), card), false);
});

test('compact docking keeps the launcher accessible in a short slot', () => {
  const left = 1200, right = 1280;
  const blockers = [{ left, right, top: 0, bottom: 415 }, { left, right, top: 485, bottom: 900 }];
  assert.deepEqual(chooseHeritageDock(desktop, blockers), { mode: 'compact', position: 0.5 });
});

test('a fully occupied map rail leaves the header entry as the mobile alternative', () => {
  const mobile = { ...desktop, compactOnly: true, right: 360, height: 720, top: 72, bottom: 704 };
  assert.equal(chooseHeritageDock(mobile, [{ left: 0, right: 360, top: 72, bottom: 720 }]), undefined);
  assert.deepEqual(chooseHeritageDock(mobile, []), { mode: 'compact', position: 0.5 });
});

test('the previous safe dock is kept when the preferred position clears', () => {
  const previous = { mode: 'vertical', position: 0.68 } as const;
  assert.deepEqual(chooseHeritageDock(desktop, [], previous), previous);
});
