/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { createViteConfig } from './build/configs/vite.common';

export default defineConfig({
  ...createViteConfig('es'),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/unit/setup.ts'],
  },
});
