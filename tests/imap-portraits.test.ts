import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { prototypePlaces } from '../src/data/imap-prototype.ts';
import { nearbyDestinations } from '../src/lib/imap-prototype.ts';

const route = readFileSync(new URL('../src/components/imap/PrototypeExplorer.astro', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles/imap-prototype.css', import.meta.url), 'utf8');
const component = readFileSync(new URL('../src/components/DestinationPortrait.astro', import.meta.url), 'utf8');
const expected = {
  'ho-hoan-kiem': '/images/Ho%20Hoan%20kiem.jpg',
  'pho-co': '/images/Pho%20co.jpg',
  'van-mieu': '/images/văn%20miếu%20quốc%20tử%20giám%20ht.jpg',
  'ho-tay': '/images/Ho%20tay.jpg',
  'cau-long-bien': '/images/Cau%20Long%20Bien.jpg',
  'hoang-thanh-thang-long': '/images/Hoang%20thanh%20Thang%20Long.jpg',
  'den-ngoc-son': '/images/den%20ngoc%20son.jpg',
  'nha-tho-lon-ha-noi': '/images/Nha%20tho%20lon.jpg',
  'pho-sach-dinh-le': '/images/pho%20sach%20Dinh%20Le.jpg',
  'sofitel-legend-metropole-hanoi': '/images/Metropole%20legand.jpeg',
  'nha-hat-mua-roi-thang-long-hoan-kiem': '/images/nha%20hat%20mua%20roi%20nuoc%20Thang%20Long.jpg',
};

test('all eleven records use their supplied local assets with no unrelated photograph', () => {
  const mapped = Object.fromEntries(prototypePlaces.filter(place => place.portraitImage).map(place => [place.slug, place.portraitImage]));
  assert.deepEqual(mapped, expected);
  for (const src of Object.values(expected)) assert(statSync(new URL(`../public${src}`, import.meta.url)).size > 0);
  assert.deepEqual(prototypePlaces.filter(place => !place.portraitImage), []);
});

test('directory and nearby rows consume the same record field and component without a second mapping', () => {
  assert(route.includes('<DestinationPortrait src={place.portraitImage} />'));
  assert(route.includes('<DestinationPortrait src={nearby.place.portraitImage} />'));
  assert(!route.includes('/images/'));
  assert(!route.includes('categoryIllustrations'));
  assert(!route.includes('directory-media'));
  assert(!route.includes('featuredYouTubeThumbnailUrl'));
  assert(!route.includes('category-choices'));
  for (const place of prototypePlaces) {
    for (const nearby of nearbyDestinations(place, prototypePlaces)) {
      assert.equal(nearby.place, prototypePlaces.find(candidate => candidate.slug === nearby.place.slug));
      assert.equal(nearby.place.portraitImage, prototypePlaces.find(candidate => candidate.slug === nearby.place.slug)!.portraitImage);
    }
  }
  assert(component.includes('{src && <img'));
  assert(component.includes('aspect-ratio: 3 / 4'));
  assert(component.includes('object-fit: cover'));
  assert(styles.includes('--portrait-width: 72px'));
  assert(styles.includes('--portrait-width: 64px'));
  assert(styles.includes('--portrait-width: 40px'));
  assert(styles.includes('flex: 1; min-width: 0; overflow-wrap: break-word'));
  assert(route.includes('{formatDistance(nearby.km)} ↗'));
});

test('all rows retain full-row click binding and nearby navigation uses the destination slug', () => {
  const binding = controller.match(/^for \(const button of directory\) on\(button, 'click', .*$/m)?.[0];
  assert(binding);
  const rows = prototypePlaces.map(place => ({ dataset: { selectPlace: place.slug } }));
  const listeners = new Map<object, () => void>();
  const opened: string[] = [];
  runInNewContext(binding, {
    directory: rows,
    on(button: object, event: string, callback: () => void) { assert.equal(event, 'click'); listeners.set(button, callback); },
    openPlace(slug: string, button: typeof rows[number]) { assert.equal(slug, button.dataset.selectPlace); opened.push(slug); },
  }, { timeout: 1000 });
  for (const row of rows) listeners.get(row)!();
  assert.deepEqual(opened, prototypePlaces.map(place => place.slug));
  assert(controller.includes("event.target.closest<HTMLButtonElement>('[data-nearby-place]')"));
  assert(controller.includes('openPlace(button.dataset.nearbyPlace!)'));
  assert(route.includes('aria-pressed="false" aria-controls="prototype-story"'));
});

test('portrait handling covers pending, cached and failed images, including future template clones', () => {
  const script = component.split('<script>')[1]!.split('</script>')[0]!;
  const ast = ts.createSourceFile('portrait.ts', script, ts.ScriptTarget.Latest, true);
  const sync = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'syncPortrait');
  assert(sync);
  const source = ts.transpileModule(`${sync.getText(ast)}\nsyncPortrait(image);`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const scenario of ['pending', 'cached', 'failed'] as const) {
    const image = { complete: scenario !== 'pending', naturalWidth: scenario === 'cached' ? 900 : 0,
      hidden: false, dataset: {} as Record<string, string> };
    runInNewContext(source, { image }, { timeout: 1000 });
    assert.equal(image.dataset.ready === 'true', scenario === 'cached');
    assert.equal(image.hidden, scenario === 'failed');
  }
  assert(component.includes("document.addEventListener('load', handlePortrait, true)"));
  assert(component.includes("document.addEventListener('error', handlePortrait, true)"));
  assert(component.includes('opacity: 0'));
  assert(component.includes('img[data-ready] { opacity: 1; }'));
  assert(!controller.includes('data-directory-thumbnail'));
});
