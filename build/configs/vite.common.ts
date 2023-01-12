import { readFileSync, lstatSync, readdirSync } from 'fs';
import vue from '@vitejs/plugin-vue';
import { resolve as resolver } from 'path';
// import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
// import { appendComponentCss } from './plugins/append-component-css';
// import { fixImportHell } from './plugins/fix-import-hell';
import { defineVitePlugin } from '../types/define-vite-plugin';

import type { RollupOptions } from 'rollup';

export type BuildFormat = 'iife' | 'es' | 'cjs' | 'esm-node';

export const resolve = {
  alias: {
    '@': resolver(process.cwd(), 'src'),
    '~/': resolver(process.cwd(), 'src'),
  },
};

const libBuildOptions = (format: 'iife' | 'es' | 'cjs') => ({
  entry: resolver(process.cwd(), 'src/index.ts'),
  fileName: () => 'index.js',
  formats: [format],
  // Only for iife/umd
  name: 'VCalendar',
});

const rollupOptions = {
  external: ['vue', '@popperjs/core'],
  output: {
    // Provide global variables to use in the UMD build
    // for externalized deps
    globals: {
      vue: 'Vue',
      '@popperjs/core': 'PopperCore',
    },
  },
};

const rollupMjsBuildOptions: RollupOptions = {
  input: resolver(process.cwd(), 'src/index.ts'),
  output: {
    sourcemap: true,
    dir: 'dist/esm-node',
    format: 'esm',
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name].mjs',
    assetFileNames: '[name].[ext]',
  },
};

export default function createViteConfig(format: BuildFormat) {
  const isEsm = ['es', 'esm-node'].includes(format);
  const isNode = format === 'esm-node';

  const config = defineVitePlugin({
    resolve,

    build: {
      outDir: `dist/${format}`,
      cssCodeSplit: isEsm,
      sourcemap: true,

      // may be in future - less transpiling, faster (default 'modules')
      // if the build.minify option is 'terser', 'esnext' will be forced down to 'es2019'
      // target: 'esnext',

      // default esbuild, not available for esm format in lib mode
      minify: format === 'iife' ? 'terser' : false,
      terserOptions: {
        // https://stackoverflow.com/questions/57720816/rails-webpacker-terser-keep-fnames
        // disable mangling class names (for vue class component)
        keep_classnames: true,
        // disable mangling functions names
        keep_fnames: true,
      },
      lib: libBuildOptions(isNode ? 'es' : format),
      rollupOptions: isNode
        ? { ...rollupOptions, ...rollupMjsBuildOptions }
        : rollupOptions,
    },

    plugins: [
      vue({
        isProduction: true,
        exclude: [/\.md$/, /\.spec\.ts$/, /\.spec\.disabled$/],
      }),
    ],
  });

  // https://github.com/sanyuan0704/vite-plugin-chunk-split
  // isEsm && config.plugins.push(chunkSplitPlugin({ strategy: 'unbundle' }));
  // isEsm && !isNode && config.plugins.push(appendComponentCss());
  // isEsm && config.plugins.push(fixImportHell());

  return config;
}
