// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [{
    name: 'national-preview',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command === 'dev') {
          injectRoute({
            pattern: '/national-preview',
            entrypoint: './src/national/Preview.astro',
            prerender: false,
          });
          injectRoute({
            pattern: '/national-preview/am-thuc',
            entrypoint: './src/national/Cuisine.astro',
            prerender: false,
          });
          injectRoute({
            pattern: '/national-preview/luu-tru',
            entrypoint: './src/national/Stays.astro',
            prerender: false,
          });
        }
      },
    },
  }],
});
