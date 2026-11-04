import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

test('every published page exposes the shared image logo as its accessible home link', () => {
  const root = new URL('../dist/', import.meta.url);
  const pages = readdirSync(root, { recursive: true, encoding: 'utf8' })
    .filter(file => file === 'index.html' || file.endsWith('/index.html') || file.endsWith('\\index.html'));
  assert(pages.length >= 10);
  assert(existsSync(new URL('images/hanoi-imap-brand.png', root)));
  for (const page of pages) {
    const html = readFileSync(new URL(page.replaceAll('\\', '/'), root), 'utf8');
    const home = page.startsWith('hanoi/') || page.startsWith('hanoi\\') ? '/hanoi/' : '/';
    const links = [...html.matchAll(/<a\b(?=[^>]*aria-label="Hanoi iMap — trang chủ")[^>]*>([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, 1, `${page}: one accessible home logo`);
    assert(links[0]![0].includes('href="' + home + '"'), page + ': expected home path');
    assert.match(links[0]![1]!, /<image\b[^>]*href="\/images\/hanoi-imap-brand\.png"/, `${page}: supplied logo`);
  }
});
