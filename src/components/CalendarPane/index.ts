import { App as Application } from 'vue';
import CalendarPane from './CalendarPane.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, CalendarPane);
  },
};

export default Plugin;

export { CalendarPane };
