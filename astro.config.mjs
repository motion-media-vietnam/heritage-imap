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
        }
      },
    },
  }],
});
