import { App as Application, Plugin } from 'vue';
import * as components from './components/index';
import setup from './utils/setup';
import { setVueInstance } from './utils/config/index';
import { Defaults } from './utils/defaults';

export { setup as setupCalendar };
export { default as screensPlugin } from './utils/screens';

const install: Exclude<Plugin['install'], undefined> = (
  instance: Application,
  defaults: Defaults,
) => {
  setVueInstance(instance);
  setup(instance, defaults);
  for (const componentKey in components) {
    instance.use((components as any)[componentKey]);
  }
};

export default install;
export * from './components';
