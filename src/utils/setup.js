import { setupDefaults } from './defaults';
import { setupScreens, addMixin } from './screens';

export default (app, opts) => {
  // Register plugin defaults
  const defaults = setupDefaults(opts);

  addMixin(app);

  // Install support for responsive screens
  setupScreens(defaults.screens, true);

  return defaults;
};
