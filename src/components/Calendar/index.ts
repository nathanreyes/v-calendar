import { App as Application } from 'vue';
import Calendar from './Calendar.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, Calendar);
  },
};

export default Plugin;

export { Calendar };
