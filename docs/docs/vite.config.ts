import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './') },
      { find: 'v-calendar', replacement: path.resolve(__dirname, '../../src') },
      {
        find: /^.*\/VPDoc\.vue$/,
        replacement: fileURLToPath(
          new URL('./.vitepress/theme/components/NRDoc.vue', import.meta.url),
        ),
      },
    ],
  },
});
