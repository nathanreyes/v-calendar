import { defineConfig } from 'vite';
import { createViteConfig } from './vite.common';

export default defineConfig({
  ...createViteConfig('mjs'),
});
