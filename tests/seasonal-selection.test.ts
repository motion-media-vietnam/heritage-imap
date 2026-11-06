import assert from 'node:assert/strict';
import { test } from 'node:test';
import { seasonalPreviewMode, selectSeasonal, type SeasonalSponsor } from '../src/lib/seasonal-selection.ts';

const valid: SeasonalSponsor = {
  id: 'test-approved', sponsorName: 'Test partner', status: 'approved',
  visualApproved: true, priority: 10, start: '2026-11-01', end: '2026-11-30',
  bookingUrl: 'https://example.test/booking',
};
const demo = { id: 'test-preview', bookingUrl: 'https://example.test/preview' };

test('Seasonal Auto selects the highest-priority approved campaign within its dates', () => {
  const lower = { ...valid, id: 'lower', priority: 5 };
  assert.deepEqual(selectSeasonal('auto', [lower, valid], '2026-11-01', demo),
    { mode: 'sponsored', campaign: valid, demo: false });
  assert.deepEqual(selectSeasonal('auto', [valid], '2026-11-30'), { mode: 'sponsored', campaign: valid, demo: false });
});

test('expired, future, draft, unapproved art and unsafe booking links fall back to Editorial', () => {
  for (const campaign of [
    { ...valid, end: '2026-11-05' }, { ...valid, start: '2026-11-07' },
    { ...valid, status: 'draft' as const }, { ...valid, visualApproved: false },
    { ...valid, bookingUrl: 'http://example.test/booking' },
  ]) assert.deepEqual(selectSeasonal('auto', [campaign], '2026-11-06', demo), { mode: 'editorial' });
  assert.deepEqual(selectSeasonal('auto', [], '2026-11-06', demo), { mode: 'editorial' });
});

test('forced mode and preview art stay separate from live sponsorship eligibility', () => {
  assert.equal(seasonalPreviewMode('sponsored', false), 'auto');
  assert.equal(seasonalPreviewMode('editorial', true), 'editorial');
  assert.equal(seasonalPreviewMode('unknown', true), 'auto');
  assert.deepEqual(selectSeasonal('editorial', [valid], '2026-11-06', demo), { mode: 'editorial' });
  assert.deepEqual(selectSeasonal('sponsored', [], '2026-11-06', demo), { mode: 'sponsored', campaign: demo, demo: true });
  assert.deepEqual(selectSeasonal('sponsored', [], '2026-11-06'), { mode: 'editorial' });
});
