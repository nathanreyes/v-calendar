import path from 'path';
import { lstatSync, readdirSync } from 'fs';
import vue from '@vitejs/plugin-vue';
import { type InlineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import type { RollupOptions } from 'rollup';

export type BuildFormat = 'es' | 'mjs' | 'cjs' | 'iife';

export const resolve = {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
    '~/': path.resolve(process.cwd(), 'src'),
  },
};

export const readDirRecursive = (path: string): string[] => {
  return readdirSync(path).reduce<string[]>((acc, entry) => {
    const p = `${path}/${entry}`;
    if (lstatSync(p).isDirectory()) {
      return [...acc, ...readDirRecursive(p)];
    }
    return [...acc, p];
  }, []);
};

const rollupOptions: RollupOptions = {
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
  input: path.resolve(process.cwd(), 'src/index.ts'),
  output: {
    sourcemap: true,
    dir: 'dist/mjs',
    format: 'esm',
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name].mjs',
    assetFileNames: '[name].[ext]',
  },
};

export function createViteConfig(format: BuildFormat): InlineConfig {
  const isEs = format === 'es';
  const isEsm = ['es', 'mjs'].includes(format);
  const isNode = format === 'mjs';
  const useTerser = format === 'iife';

  const config: InlineConfig = {
    resolve,
    build: {
      outDir: `dist/${format}`,
      cssCodeSplit: !isEsm,
      sourcemap: true,
      lib: {
        entry: path.resolve(process.cwd(), 'src/index.ts'),
        fileName: () => 'index.js',
        formats: [isNode ? 'es' : format],
        // Only for iife/umd
        name: 'VCalendar',
      },
      rollupOptions: isNode
        ? { ...rollupOptions, ...rollupMjsBuildOptions }
        : rollupOptions,
      // default esbuild, not available for esm format in lib mode
      minify: useTerser ? 'terser' : false,
      terserOptions: useTerser
        ? {
            // https://stackoverflow.com/questions/57720816/rails-webpacker-terser-keep-fnames
            // disable mangling class names (for vue class component)
            keep_classnames: true,
            // disable mangling functions names
            keep_fnames: true,
          }
        : undefined,
    },
    plugins: [
      vue({
        isProduction: true,
        exclude: [/\.md$/, /\.spec\.ts$/, /\.spec\.disabled$/],
      }),
    ],
  };

  // Add visualizer for es build
  if (isEs) {
    config.plugins!.push(
      visualizer({
        filename: 'dist/stats.html',
        title: 'V-Calendar Visualizer',
      }),
    );
  }

  return config;
}
