import getLocaleDefaults from '@/utils/locales';
import setupScreens from '@/utils/screens';
import defaults from '@/utils/defaults';
import { isObject, defaultsDeep, get } from '@/utils/_';

export const setupCalendar = (Vue, opts) => {
  // Assign locale if it isn't already specified
  const mergedDefaults = isObject(opts) ? { ...opts } : {};
  const locale = mergedDefaults
    ? mergedDefaults.locale
    : new Intl.DateTimeFormat().resolvedOptions().locale;
  // Merge built-in and locale defaults with user defaults
  defaultsDeep(mergedDefaults, getLocaleDefaults(locale), defaults);
  // Install support for responsive screens
  setupScreens(Vue, mergedDefaults.screens);

  // Create a component for global state & event bus communication
  // ...Sorry, can't assume we are using Vuex as a library
  const vc = new Vue({
    data() {
      return {
        activeRefs: {},
        defaults: mergedDefaults,
      };
    },
    computed: {
      $formats() {
        return this.defaults.formats;
      },
      $screens() {
        return this.defaults.screens;
      },
    },
  });
  Vue.prototype.$vc = vc;
  return vc;
};
