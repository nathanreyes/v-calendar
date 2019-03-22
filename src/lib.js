import Calendar from '@/components/Calendar';
import DatePicker from '@/components/DatePicker';
import Popover from '@/components/Popover';
import PopoverRef from '@/components/PopoverRef';
import { setupCalendar } from '@/utils/setup';

// Export components individually
export { setupCalendar, Calendar, DatePicker, Popover, PopoverRef };

// Installs the library as a plugin
const components = {
  Calendar,
  DatePicker,
  Popover,
  PopoverRef,
  PopoverRow: () => import('@/components/PopoverRow'),
};
const VCalendar = {
  install: (Vue, opts) => {
    // Setup plugin with options
    const $vc = setupCalendar(Vue, opts);
    Object.keys(components).forEach(k =>
      Vue.component(`${$vc.defaults.componentPrefix}${k}`, components[k]),
    );
  },
};
export default VCalendar;

// Use automatically when global Vue instance detected
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VCalendar);
}
