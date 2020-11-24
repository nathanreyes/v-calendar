import { App as Application, Plugin } from 'vue';
import * as components from './components/index';
import setup from './utils/setup';
import { setVueInstance } from './utils/config/index';
import { Defaults } from './utils/defaults';

const install: Exclude<Plugin['install'], undefined> = (
  app: Application,
  defaults: Defaults,
) => {
  setVueInstance(app);
  defaults = setup(app, defaults);
  for (const componentKey in components) {
    const component = (components as any)[componentKey];
    app.component(`${defaults.componentPrefix}${component.name}`, component);
  }
};

export default install;
export * from './components';
export { setup as SetupCalendar };
export { default as Screens } from './utils/screens';
