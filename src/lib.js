import Calendar from '@/components/Calendar';
import DatePicker from '@/components/DatePicker';
import Popover from '@/components/Popover';
import PopoverRef from '@/components/PopoverRef';
import getLocaleDefaults from '@/utils/locales';
import defaults from '@/utils/defaults';
import installScreens from '@/utils/screens';
import { isObject, defaultsDeep } from '@/utils/_';
// import '@/styles/themes.sass';

const setupCalendar = (Vue, options) => {
  // Create a component for global state & event bus
  // ...Sorry, can't assume we are using Vuex as a library
  Vue.prototype.$vc = new Vue({
    data: {
      activeRefs: {},
    },
  });
  // Assign locale if it isn't already specified
  const mergedDefaults = isObject(options) ? { ...options } : {};
  const locale = mergedDefaults
    ? mergedDefaults.locale
    : new Intl.DateTimeFormat().resolvedOptions().locale;
  // Merge built-in and locale defaults with user defaults
  defaultsDeep(mergedDefaults, getLocaleDefaults(locale), defaults);
  console.log(mergedDefaults);
  // Install support for responsive screens
  installScreens(Vue, mergedDefaults.screens);
  return mergedDefaults;
};

// Export components individually
export { setupCalendar, Calendar, DatePicker, Popover, PopoverRef };

// Installs the library as a plugin
const components = {
  Calendar,
  DatePicker,
  Popover,
  PopoverRef,
};
const VCalendar = {
  install: (Vue, options) => {
    // Setup plugin with options
    const resolvedDefaults = setupCalendar(Vue, options);
    Object.keys(components).forEach(k =>
      Vue.component(`${resolvedDefaults.componentPrefix}${k}`, components[k]),
    );
  },
};
export default VCalendar;

// Use automatically when global Vue instance detected
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VCalendar);
}
