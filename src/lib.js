import Calendar from './components/Calendar';
import DatePicker from './components/DatePicker';
import Popover from './components/Popover';
import getLocaleDefaults from './utils/locales';
import defaults, { mergeDefaults } from './utils/defaults';

const components = {
  Calendar,
  DatePicker,
  Popover,
};

const setupCalendar = userDefaults => {
  // Merge user and locale defaults with built-in defaults
  const locale = userDefaults
    ? userDefaults.locale
    : new Intl.DateTimeFormat().resolvedOptions().locale;
  return mergeDefaults(defaults, getLocaleDefaults(locale), userDefaults);
};

const VCalendar = {
  ...components,
  install: (Vue, options) => {
    // Setup plugin with options
    const resolvedDefaults = setupCalendar(options);
    Object.keys(components).forEach(k =>
      Vue.component(`${resolvedDefaults.componentPrefix}${k}`, components[k]),
    );
  },
};

export default VCalendar;

export { setupCalendar, Calendar, DatePicker, Popover };

// Use automatically when global Vue instance detected
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VCalendar);
}
