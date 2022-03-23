import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import typescript from 'rollup-plugin-typescript2';

// https://vitejs.dev/config/
const config: UserConfig = {
  plugins: [
    vue(),
    typescript({
      check: false,
      include: ['src/components/*.vue'],
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
      },
      exclude: ['vite.config.ts', 'tests'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vcalendar',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: format =>
        format === 'es'
          ? 'index.js'
          : format === 'cjs'
          ? 'index.cjs'
          : `v-calendar.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', '@popperjs/core'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          '@popperjs/core': 'PopperCore',
        },
      },
    },
  },
};

export default config;
