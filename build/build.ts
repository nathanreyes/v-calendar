import fs from 'fs';
import { execSync } from 'child_process';
import { type BuildFormat } from './configs/vite.common';

const formats: BuildFormat[] = ['es', 'mjs', 'cjs', 'iife'];

async function executeBuild() {
  // Build types
  execSync('vue-tsc --declaration --emitDeclarationOnly --outDir dist/types', {
    stdio: 'inherit',
  });

  // Build lib with formats
  for (const format of formats) {
    execSync(`vite build --config ./build/configs/vite.${format}.ts`, {
      stdio: 'inherit',
    });
  }

  // Copy css to root
  fs.copyFileSync('dist/es/style.css', 'dist/style.css');
}

executeBuild();
