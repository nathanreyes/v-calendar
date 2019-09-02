import { setupCalendar } from '@/utils/setup';

const Calendar = () =>
  import(
    /* webpackChunkName: "v-calendar" */
    '@/components/Calendar'
  );
const DatePicker = () =>
  import(
    /* webpackChunkName: "v-date-picker" */
    '@/components/DatePicker'
  );
const Popover = () =>
  import(
    /* webpackChunkName: "v-popover" */
    '@/components/Popover'
  );
const PopoverRef = () =>
  import(
    /* webpackMode: "eager" */
    /* webpackChunkName: "v-popover-ref" */
    '@/components/PopoverRef'
  );
const PopoverRow = () =>
  import(
    /* webpackMode: "eager" */
    /* webpackChunkName: "v-popover-row" */ '@/components/PopoverRow'
  );

import '@/styles/tailwind-lib.css';

// Export components individually
export { setupCalendar, Calendar, DatePicker, Popover, PopoverRef, PopoverRow };

// Installs the library as a plugin
const components = {
  Calendar,
  DatePicker,
  Popover,
  PopoverRef,
  PopoverRow,
};

// Declare install function executed by Vue.use()
export default function install(Vue, opts) {
  // Don't install more than once
  if (install.installed) return;
  install.installed = true;
  // Setup plugin with options
  const $vc = setupCalendar(Vue, opts);
  Object.keys(components).forEach(k =>
    Vue.component(`${$vc.defaults.componentPrefix}${k}`, components[k]),
  );
}

// Create module definition for Vue.use()
const plugin = {
  install,
};

// Use automatically when global Vue instance detected
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}
