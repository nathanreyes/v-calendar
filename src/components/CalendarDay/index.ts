import { App as Application } from 'vue';
import CalendarDay from './CalendarDay.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, CalendarDay);
  },
};

export default Plugin;

export { CalendarDay };
