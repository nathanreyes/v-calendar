import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      external: ['vue'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'v-calendar': path.resolve(__dirname, '../../src'),
    },
  },
});
