import { defineConfig } from 'vite';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    nodeResolve({
      exportConditions: ['node'],
      modulePaths: [
        path.resolve(__dirname, '../'),
        path.resolve(__dirname, '../../'),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'v-calendar': path.resolve(__dirname, '../../src'),
    },
  },
});
