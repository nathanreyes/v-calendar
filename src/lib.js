import Calendar from './components/Calendar';
import DatePicker from './components/DatePicker';
import Popover from './components/Popover';

const componentPrefix = 'v';

const components = {
  Calendar,
  DatePicker,
  Popover,
};

export default (Vue) => {
  Object
    .keys(components)
    .forEach(k => Vue.component(`${componentPrefix}${k}`, components[k]));
};
