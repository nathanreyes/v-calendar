import { setupDefaults } from '@/utils/defaults';
import { setupScreens } from '@/utils/screens';

export default opts => {
  // Register plugin defaults
  const defaults = setupDefaults(opts);
  // Install support for responsive screens
  setupScreens(defaults.screens, true);
  return defaults;
};
