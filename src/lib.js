import Calendar from '@/components/Calendar';
import DatePicker from '@/components/DatePicker';
import Popover from '@/components/Popover';
import PopoverRef from '@/components/PopoverRef';
import getLocaleDefaults from '@/utils/locales';
import defaults, { mergeDefaults } from '@/utils/defaults';
import installScreens from '@/utils/screens';
// import '@/styles/themes.sass';

const setupCalendar = (Vue, options) => {
  // Add an event bus for component communication
  // Sorry, can't assume we are using Vuex
  Vue.prototype.$vcBus = new Vue({
    data: {
      activeRefs: {},
    },
  });
  // Merge user and locale defaults with built-in defaults
  const locale = options
    ? options.locale
    : new Intl.DateTimeFormat().resolvedOptions().locale;
  const mergedDefaults = mergeDefaults(
    defaults,
    getLocaleDefaults(locale),
    options,
  );
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
