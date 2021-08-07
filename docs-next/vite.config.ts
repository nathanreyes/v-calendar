import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown(),
  ],
  server: {
    port: 8080,
  },
});
