import { App as Application } from 'vue';
import CalendarNav from './CalendarNav.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, CalendarNav);
  },
};

export default Plugin;

export { CalendarNav };
