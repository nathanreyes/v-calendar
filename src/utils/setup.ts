import { App } from 'vue';
import { Defaults, setupDefaults } from './defaults';
import screensPlugin from './screens';

export default (app: App, defaults: Defaults) => {
  // Setup defaults
  const { screens } = setupDefaults(app, defaults);
  // Use screens plugin
  app.use(screensPlugin, screens);
};
