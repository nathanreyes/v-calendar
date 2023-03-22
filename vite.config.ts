/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { createViteConfig } from './build/configs/vite.common';

export default defineConfig({
  ...createViteConfig('es'),
  test: {
    environment: 'happy-dom',
  },
});
