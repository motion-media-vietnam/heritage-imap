import assert from 'node:assert/strict';
import { test } from 'node:test';
import { activeOffers, activeSponsorships, activeWindow, featuredDestinations, httpsLink, type Sponsorship } from '../src/lib/national-selection.ts';

const today = '2026-11-04';
const entry = { destinationId: 'hanoi', start: today, end: today, priority: 1, display: true, visualApproved: true } satisfies Sponsorship;

test('sponsored selection gates visibility, image approval, hub eligibility and contract dates', () => {
  const records = [
    entry,
    { ...entry, priority: 5 },
    { ...entry, priority: 7, visualApproved: false },
    { ...entry, destinationId: 'hue', priority: 8, display: false },
    { ...entry, destinationId: 'hue', priority: 9, end: '2026-11-03' },
    { ...entry, destinationId: 'ninh-binh', priority: 10 },
    { ...entry, destinationId: 'hue', priority: 2 },
  ];
  assert.deepEqual(activeSponsorships(records, today, new Set(['hanoi', 'hue'])).map(record => [record.destinationId, record.priority]), [['hanoi', 5], ['hue', 2]]);
  assert(activeWindow(entry, today));
  assert(!activeWindow({ start: '2026-1-01', end: '2026-12-01' }, today));
});

test('featured mosaic fills five distinct windows and labels only contracted placements', () => {
  const list = ['hue', 'hanoi', 'ninh-binh', 'hoi-an', 'ha-giang', 'quang-ninh'].map(id => ({ id }));
  const windows = featuredDestinations(list, [entry]);
  assert.deepEqual(windows.map(({ item, sponsored }) => [item.id, sponsored]), [
    ['hanoi', true], ['hue', false], ['ninh-binh', false], ['hoi-an', false], ['ha-giang', false],
  ]);
});

test('booking link validation rejects missing and unsafe destinations', () => {
  for (const value of [undefined, '', '#book', 'http://example.com', 'javascript:alert(1)', 'https://user:pass@example.com']) {
    assert.equal(httpsLink(value), undefined);
  }
  assert.equal(httpsLink('https://example.com/offer'), 'https://example.com/offer');
});

test('offers appear only with an approved partner, active window and booking URL', () => {
  const offer = { start: today, end: today, approved: true, partner: 'Partner fixture', booking: 'https://example.com/offer' };
  assert.deepEqual(activeOffers([], today), []);
  assert.deepEqual(activeOffers([offer, { ...offer, approved: false }, { ...offer, partner: '' }, { ...offer, booking: 'http://example.com' }, { ...offer, end: '2026-11-03' }], today), [offer]);
});
