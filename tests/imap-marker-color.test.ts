import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
const route = readFileSync(new URL('../src/components/imap/PrototypeExplorer.astro', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
// Source-contract checks only, not computed browser styles or visual acceptance.
const rules = Array.from(css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g))
  .map(([, selector, body]) => ({ selector: selector!.trim(), body: body! }));
const rule = (selector: string) => {
  const result = rules.find(item => item.selector === selector);
  assert(result, `Missing rule: ${selector}`);
  return result.body;
};

test('all prototype pins default to exact navy and white icons without category or URL fill overrides', () => {
  const pin = rule('.curated-pin');
  assert.match(pin, /background:\s*#203A5E;/);
  assert.match(pin, /color:\s*#fff;/);
  assert.match(pin, /width: 48px; height: 48px;/);
  for (const item of rules.filter(item => item.selector.includes('.curated-pin'))) {
    for (const fill of item.body.matchAll(/(?:^|;)\s*background(?:-color)?:\s*([^;]+)/g)) {
      assert.equal(fill[1]!.trim(), '#203A5E', item.selector);
    }
  }
  assert(!css.includes('data-marker-color') && !css.includes('#FF6666'));
  assert(controller.includes("stroke: 'currentColor'"));
});

test('selected singles and clusters inherit navy and use light double rings, not red or scaling', () => {
  const selected = rule('.curated-icon.is-selected .curated-pin');
  assert.match(selected, /box-shadow:\s*0 0 0 2px #F8F7F3, 0 0 0 4px #203A5E, 0 0 0 6px #E4DCCB;/);
  assert(!/background|transform|width|height|prototype-red/.test(selected));
  assert(controller.includes("createCategoryIcon(clustered ? 'cluster' : markerCategory(place))"));
  const badge = rule('.cluster-count');
  assert.match(badge, /background: var\(--prototype-paper\);/);
  assert.match(badge, /color: #203A5E;/);
  assert(controller.includes('count.textContent = String(group.length)'));
});

test('comparison control and query handling are removed, so old red links cannot override navy', () => {
  assert(!/prototype-marker-color|marker-color-control|marker-color-note|markerColor|dataset\.markerColor/.test(route));
  assert(route.includes('data-presentation-init'));
  assert(route.includes("get('presentation') === '1'"));
  assert(!css.includes('marker-color-control'));
});

test('white icons on approved navy exceed 3:1 graphical contrast', () => {
  const linear = (byte: number) => {
    const value = byte / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * linear(0x20) + 0.7152 * linear(0x3A) + 0.0722 * linear(0x5E);
  const contrast = 1.05 / (luminance + 0.05);
  assert(contrast > 11 && contrast < 12);
});
