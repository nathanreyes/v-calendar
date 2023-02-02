import { defineConfig } from 'vite';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';

console.log(path.resolve(__dirname, '../node_modules'));
console.log(path.resolve(__dirname, '../../node_modules'));

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    nodeResolve({
      exportConditions: ['node'],
      modulePaths: [
        path.resolve(__dirname, '../node_modules'),
        path.resolve(__dirname, '../../node_modules'),
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
