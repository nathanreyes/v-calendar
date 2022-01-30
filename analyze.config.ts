import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

// https://vitejs.dev/config/
const config: UserConfig = {
  plugins: [
    vue(),
    visualizer({
      open: true,
      title: 'V-Calendar Visualizer',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'v-calendar',
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
