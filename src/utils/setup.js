import setupScreens from '@/utils/screens';
import defaults from '@/utils/defaults';
import { isString, isObject, defaultsDeep } from '@/utils/_';
import Locale from './locale';

export const setupCalendar = (Vue, opts) => {
  // Merge built-in and locale defaults with user defaults
  const mergedDefaults = isObject(opts) ? { ...opts } : {};
  defaultsDeep(mergedDefaults, defaults);
  // Install support for responsive screens
  setupScreens(Vue, mergedDefaults.screens);
  // Create a component for global state & event bus communication
  // ...Sorry, can't assume we are using Vuex as a library
  const vc = new Vue({
    data() {
      return {
        activeRefs: {},
        defaults: mergedDefaults,
        locales: {},
      };
    },
    computed: {
      formats() {
        return this.defaults.formats;
      },
    },
    methods: {
      getLocale(locale) {
        const meta = this.getLocaleMeta(locale);
        locale = this.locales[meta.id];
        if (!locale) {
          locale = new Locale(meta);
          this.locales[meta.id] = locale;
        }
        return locale;
      },
      getLocaleMeta(locale) {
        // Set default locale id if needed
        if (!locale) {
          locale = new Intl.DateTimeFormat().resolvedOptions().locale;
        }
        // Configure with locale id
        if (isString(locale)) {
          const { locales } = this.defaults;
          const { firstDayOfWeek, dow, masks, L } =
            locales[locale] || locales[locale.substring(0, 2)] || {};
          locale = {
            id: locale,
            firstDayOfWeek: firstDayOfWeek || dow,
            masks: masks || { L },
          };
          // Configure with object and locale id
        } else if (isObject(locale)) {
          defaultsDeep(locale, this.defaults.locales[locale.id]);
        }
        // Set defaults values if missing
        return defaultsDeep(locale, {
          firstDayOfWeek: 1,
          masks: { L: 'DD/MM/YYYY' },
        });
      },
    },
  });
  Vue.prototype.$vc = vc;
  return vc;
};
