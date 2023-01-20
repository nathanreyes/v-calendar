import { type BuildFormat } from './configs/vite.common';
import { execSync } from 'child_process';

const formats: BuildFormat[] = ['es', 'mjs', 'cjs', 'iife'];

async function executeBuild() {
  // Build types
  execSync('vue-tsc --declaration --emitDeclarationOnly --outDir dist/types', {
    stdio: 'inherit',
  });

  // Build lib with formats
  for (const format of formats) {
    execSync(`yarn build:${format}`, { stdio: 'inherit' });
  }
}

executeBuild();
