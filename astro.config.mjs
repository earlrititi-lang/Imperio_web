// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

const base = process.env.GITHUB_PAGES === 'true' ? '/Imperio_web' : '/';

// https://astro.build/config
export default defineConfig({
  base,
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()]
  }
});
