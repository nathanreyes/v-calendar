import Calendar from './components/Calendar';
import DatePicker from './components/DatePicker';
import Popover from './components/Popover';

const componentPrefix = 'v';

const components = {
  Calendar,
  DatePicker,
  Popover,
};

const VCalendar = {
  ...components,
  install: Vue => Object
    .keys(components)
    .forEach(k => Vue.component(`${componentPrefix}${k}`, components[k])),
};

export default VCalendar;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VCalendar);
}
