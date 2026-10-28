import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mobileSheetHeight, nearestMobileSheetState } from '../src/lib/imap-mobile.ts';

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('mobile discovery is 52px plus the actual safe area at every normal viewport height', () => {
  for (const available of [280, 380, 540, 800]) {
    assert.equal(mobileSheetHeight('collapsed', available), 52);
    assert.equal(mobileSheetHeight('collapsed', available, 0, 34), 86);
    assert(mobileSheetHeight('collapsed', available) < available * .2);
  }
  assert.equal(mobileSheetHeight('collapsed', 0), 0);
});

test('initial story fits measured title/video when possible, without exceeding available sheet space', () => {
  assert.equal(mobileSheetHeight('half', 540, 310), 310);
  assert.equal(mobileSheetHeight('half', 540, 310, 34), 344);
  assert.equal(mobileSheetHeight('half', 280, 340), 252);
  assert.equal(mobileSheetHeight('half', 800, 310), 400);
  for (const available of [280, 540, 800]) {
    for (const required of [0, 240, 400]) {
      const half = mobileSheetHeight('half', available, required);
      assert(half >= mobileSheetHeight('collapsed', available));
      assert(half <= mobileSheetHeight('expanded', available));
      assert.equal(nearestMobileSheetState(half, available, required), 'half');
    }
    assert.equal(nearestMobileSheetState(52, available), 'collapsed');
    assert.equal(nearestMobileSheetState(available * .9, available), 'expanded');
  }
});

test('shared route discovery provides native keyboard control and filtered-count updates', () => {
  const component = source('src/components/imap/IMap.astro');
  const script = source('src/scripts/imap.ts');
  const css = source('src/styles/imap.css');
  assert(component.includes('data-mobile-discovery="true"'));
  assert(!component.includes("idPrefix === 'home-imap'"), 'discovery must not depend on the route ID');
  assert(source('src/pages/imap.astro').includes('<main data-imap-viewport-container>'));
  assert(script.includes('containerStyle?.paddingTop') && script.includes('containerStyle?.paddingBottom'));
  assert.match(component, /data-imap="directory-close"[^>]*\bhidden>/);
  assert(script.includes('directoryClose.hidden = !mobile.matches'), 'mobile-only directory close cannot leak into the approved desktop directory');
  assert.match(component, /<button[^>]*data-imap="discovery"[^>]*aria-expanded="false"[^>]*aria-controls=/);
  assert(script.includes('`Khám phá ${visible.size} địa điểm`'));
  assert(script.includes("window.visualViewport, 'resize', resize"));
  assert(script.includes("on(sheet, 'transitionend'"));
  assert(script.includes("get('directory').inert = mobileDiscovery()"));
  const opening = script.slice(script.indexOf('function openPlace'), script.indexOf('function resetView'));
  assert(opening.indexOf("videoHeight = 0; setSheet('half')") < opening.indexOf('const required ='), 'unhide story before measuring title/video');
  assert(script.includes('content.scrollTop + 12'), 'resizing a scrolled story measures its original frame position');
  assert(css.includes('.imap-sheet[data-sheet-state=collapsed] :is(.imap-sheet-states, .imap-directory, .imap-story) { display: none; }'));
  assert(css.includes('touch-action: none'));
});
