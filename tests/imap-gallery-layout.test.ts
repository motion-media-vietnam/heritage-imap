import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { join } from 'node:path';

// Run against an existing dev server OR the production-build preview. No server,
// browser installation or app mutation is performed by this test.
// HERITAGE_PLAYWRIGHT_MODULE may point at an already provisioned runtime.
const preview = process.env.HERITAGE_PREVIEW_URL;
const require = createRequire(import.meta.url);
const sizes = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
];

for (const viewport of sizes) {
  test(`Dinh Le gallery controls are visible and directly clickable at ${viewport.width}px`,
    { skip: !preview, timeout: 45000 }, async () => {
      const { chromium } = require(process.env.HERITAGE_PLAYWRIGHT_MODULE ?? 'playwright');
      const browser = await chromium.launch(process.env.HERITAGE_BROWSER_EXECUTABLE
        ? { executablePath: process.env.HERITAGE_BROWSER_EXECUTABLE, headless: true }
        : { channel: process.env.HERITAGE_BROWSER_CHANNEL, headless: true });
      try {
        const mobile = viewport.width <= 960;
        const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile,
          reducedMotion: 'reduce', locale: 'vi-VN' });
        const page = await context.newPage();
        page.setDefaultTimeout(10000);
        const errors: string[] = [];
        page.on('pageerror', (error: Error) => errors.push(error.message));
        await page.goto(preview!, { waitUntil: 'domcontentloaded' });
        await page.locator('#prototype-search').fill('pho sach');
        // Position the explorer BEFORE opening the story. Never scroll a gallery
        // control into view: locator.click() would hide the original clipping bug.
        await page.locator('#prototype-explorer').evaluate((node: HTMLElement) =>
          node.scrollIntoView({ block: 'center', behavior: 'instant' }));
        if (mobile) await page.locator('#prototype-discovery').click();
        await page.locator('[data-select-place="pho-sach-dinh-le"]').click();
        const gallery = page.locator('#prototype-story-content .destination-gallery');
        await gallery.waitFor({ state: 'visible' });
        await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
        const capture = process.env.HERITAGE_GALLERY_CAPTURE_DIR;
        if (capture) await page.screenshot({ path: join(capture, `gallery-${viewport.width}.png`) });
        const geometry = await gallery.evaluate((root: HTMLElement) => {
          const box = root.getBoundingClientRect();
          const nav = root.querySelector<HTMLElement>('.gallery-navigation')!.getBoundingClientRect();
          const editorial = root.closest('.destination-story')!.querySelector<HTMLElement>('.editorial')!.getBoundingClientRect();
          return {
            height: box.height, navigationBottom: nav.bottom - box.top,
            scrollTop: root.scrollTop,
            editorialClear: editorial.top >= box.bottom - 1,
            overflow: document.documentElement.scrollWidth - innerWidth,
            controls: Array.from(root.querySelectorAll<HTMLButtonElement>('.gallery-navigation button')).map(button => {
              const rect = button.getBoundingClientRect();
              const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
              const hit = document.elementFromPoint(x, y);
              return { x, y, width: rect.width, height: rect.height,
                inside: rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1
                  && rect.left >= box.left - 1 && rect.right <= box.right + 1,
                hit: hit === button || (hit !== null && button.contains(hit)) };
            }),
          };
        });
        assert(geometry.navigationBottom <= geometry.height + 1,
          `navigation extends outside gallery: ${JSON.stringify(geometry)}`);
        assert.equal(geometry.scrollTop, 0, 'gallery must not need hidden internal scrolling');
        assert(geometry.editorialClear, 'gallery/navigation must not cover the story text');
        assert(geometry.overflow <= 1, 'gallery must not introduce horizontal overflow');
        assert.equal(geometry.controls.length, 3);
        for (const control of geometry.controls) {
          assert(control.inside && control.hit, 'each control must be unclipped and physically hittable before any interaction');
          assert(control.width >= 44 && control.height >= 44, 'preserve accessible touch targets');
        }
        const activate = async (index: number) => {
          const { x, y } = geometry.controls[index]!;
          if (mobile) await page.touchscreen.tap(x, y);
          else await page.mouse.click(x, y);
        };
        const counter = gallery.locator('.gallery-navigation [data-gallery-counter]');
        assert.equal(await counter.innerText(), '1 / 6');
        for (let step = 1; step <= 6; step++) {
          await activate(1);
          assert.equal(await counter.innerText(), `${step % 6 + 1} / 6`);
        }
        await activate(0);
        assert.equal(await counter.innerText(), '6 / 6');
        await activate(2);
        assert.equal(await gallery.locator('dialog[open]').count(), 1);
        await page.keyboard.press('ArrowRight');
        assert.equal(await gallery.locator('.gallery-dialog [data-gallery-counter]').innerText(), '1 / 6');
        await page.keyboard.press('Escape');
        assert.equal(await gallery.locator('dialog[open]').count(), 0);
        assert.equal(await page.locator('#prototype-story').evaluate((node: HTMLElement) => node.hidden), false);
        assert.equal(await gallery.evaluate((node: HTMLElement) => node.scrollTop), 0);
        assert.deepEqual(errors, []);
        console.log(JSON.stringify({ width: viewport.width, galleryHeight: geometry.height,
          navigationBottom: geometry.navigationBottom, directHitTargets: geometry.controls.length,
          allSixImages: true, enlargementAndEscape: true }));
      } finally { await browser.close(); }
    });
}
