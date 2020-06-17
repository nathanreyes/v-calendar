import * as components from './components';
import * as utils from './utils';

// Declare install function executed by Vue.use()
function install(Vue, opts) {
  // Don't install more than once
  if (install.installed) return;
  install.installed = true;
  // Manually setup calendar with options
  const defaults = utils.setupCalendar(opts);
  // Register components
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(`${defaults.componentPrefix}${componentName}`, component);
  });
}

// Create module definition for Vue.use()
const plugin = {
  install,
  ...components,
  ...utils,
};

// Use automatically when global Vue instance detected
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Default export is library as a whole, registered via Vue.use()
export default plugin;

// Allow component use individually
export * from './components';

// Allow util use individually
export * from './utils';
