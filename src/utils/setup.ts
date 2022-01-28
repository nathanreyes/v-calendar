import { Defaults, setupDefaults } from './defaults';
import screensPlugin from './screens';

export default (app: any, defaults: Defaults) => {
  // Setup defaults
  const { screens } = setupDefaults(app, defaults);
  // Use screens plugin
  app.use(screensPlugin, screens);
};
