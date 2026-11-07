// @ts-check
import { defineConfig } from 'astro/config';
import { copyFile, writeFile } from 'node:fs/promises';

export default defineConfig({
  outDir: './dist-approval',
  vite: { define: { 'import.meta.env.PUBLIC_NATIONAL_APPROVAL': JSON.stringify('1') } },
  integrations: [{
    name: 'national-approval',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        const route = (pattern, entrypoint) => injectRoute({ pattern, entrypoint, prerender: true });
        route('/national-preview', './src/national/Preview.astro');
        route('/heritage-listing/[...province]', './src/national/ApprovalListing.astro');
        route('/en/heritage-listing/[...province]', './src/national/ApprovalListing.astro');
        route('/review/[lang]/[featured]/[seasonal]', './src/national/ApprovalVariant.astro');
        for (const [path, page] of [['am-thuc', 'Cuisine'], ['luu-tru', 'Stays']]) {
          for (const prefix of ['', '/en', '/national-preview']) {
            route(prefix + '/' + path, './src/national/' + page + '.astro');
          }
        }
      },
      'astro:build:done': async ({ dir }) => {
        // Promote the static National entry in this output only. Hanoi remains at /hanoi/.
        await copyFile(new URL('national-preview/index.html', dir), new URL('index.html', dir));
        await writeFile(new URL('_headers', dir), [
          '/*',
          '  X-Robots-Tag: noindex, nofollow, noarchive',
          '  X-Content-Type-Options: nosniff',
          '  Referrer-Policy: strict-origin-when-cross-origin',
          '',
        ].join('\n'));
      },
    },
  }],
});
