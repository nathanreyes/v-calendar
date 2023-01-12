// import { $ } from 'deploy/execute';

// const runBuild = (cb: () => void | Promise<void>) => {
//   const r = cb();
//   if (r && r.then) {
//     r.then(() => process.exit(0));
//     r.catch(e => {
//       console.error(e);
//       process.exit(1);
//     });
//   }
// };

// runBuild(async () => {
//   // buildStart()

//   await Promise.all([
//     $('npm run build:types', { successMessage: 'types built' }),
//     $('vite build --config ./build/configs/vite.cjs.ts', {
//       successMessage: 'cjs built',
//     }),
//     $('vite build --config ./build/configs/vite.iife.ts', {
//       successMessage: 'iife built',
//     }),
//     $('vite build --config ./build/configs/vite.es.ts', {
//       successMessage: 'esm built',
//     }),
//     $('vite build --config ./build/configs/vite.mjs.ts', {
//       successMessage: 'esm-node built',
//     }),
//   ]);

//   await $('vite build --config ./build/configs/vite.styles-essential.ts', {
//     successMessage: 'essential styles built',
//   });
//   await $('vite build --config ./build/configs/vite.styles.ts', {
//     successMessage: 'styles built',
//   });

//   // buildEnd()
// });
