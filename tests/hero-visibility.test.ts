import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasPassedOpeningHero } from '../src/lib/hero-visibility.ts';

test('hero visibility uses its current edge and header, including small screens and reverse scrolling', () => {
  assert.equal(hasPassedOpeningHero(740, 84), false);
  assert.equal(hasPassedOpeningHero(715, 84), false);
  assert.equal(hasPassedOpeningHero(84, 84), true);
  assert.equal(hasPassedOpeningHero(85, 84), false);
  assert.equal(hasPassedOpeningHero(57, 56), false);
  assert.equal(hasPassedOpeningHero(56, 56), true);
});

test('pages without an opening hero keep the content assistant available', () => {
  assert.equal(hasPassedOpeningHero(null, 56), true);
  assert.equal(hasPassedOpeningHero(null, 84), true);
});
