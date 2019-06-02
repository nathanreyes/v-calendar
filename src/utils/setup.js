import pluginDefaults from '@/utils/defaults';
import { setupScreens } from '@/utils/screens';
import { createVC } from '@/utils/vc';
import { isObject, defaultsDeep } from '@/utils/_';

export const setupCalendar = (Vue, opts) => {
  // Merge built-in defaults with user defaults
  const mergedDefaults = isObject(opts) ? { ...opts } : {};
  defaultsDeep(mergedDefaults, pluginDefaults);
  // Install support for responsive screens
  setupScreens(Vue, mergedDefaults.screens);
  // Create a component for global state & event bus communication
  // ...Sorry, can't assume we are using Vuex as a library
  return (Vue.prototype.$vc = createVC(Vue, mergedDefaults));
};
