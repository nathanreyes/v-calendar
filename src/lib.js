import * as components from './components';
import * as utils from './utils';

// Declare install function executed by app.use()
function install(app, opts) {
  // Don't install more than once
  if (install.installed) return;
  install.installed = true;
  // Manually setup calendar with options
  const defaults = utils.setupCalendar(app, opts);
  // Register components
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(`${defaults.componentPrefix}${componentName}`, component);
  });
}

// Create module definition for app.use()
const plugin = {
  install,
  ...components,
  ...utils,
};

// Default export is library as a whole, registered via app.use()
export default plugin;

// Allow component use individually
export * from './components';

// Allow util use individually
export * from './utils';
