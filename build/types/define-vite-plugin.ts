import { UserConfig } from 'vite';

export const defineVitePlugin = <T extends UserConfig>(p: T): UserConfig & T =>
  p;
