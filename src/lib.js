import Calendar from './components/Calendar';
import DatePicker from './components/DatePicker';
import Popover from './components/Popover';
import defaults, { mergeDefaults } from './utils/defaults';

const components = {
  Calendar,
  DatePicker,
  Popover,
};

const VCalendar = {
  ...components,
  install: (Vue, options) => {
    mergeDefaults(options);
    Object
      .keys(components)
      .forEach(k => Vue.component(`${defaults.componentPrefix}${k}`, components[k]));
  },
};

export default VCalendar;

// Use automatically when global Vue instance detected
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VCalendar);
}
