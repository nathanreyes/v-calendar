import { App } from 'vue';
import { setup as setupDefaults, Defaults } from './defaults';
import screensPlugin from './screens';

export default (app: App, defaults: Defaults) => {
  // Setup defaults
  defaults = setupDefaults(defaults);
  // Use screens plugin
  app.use(screensPlugin, defaults.screens);

  return defaults;
};
