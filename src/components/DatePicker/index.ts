import { App as Application } from 'vue';
import DatePicker from './DatePicker.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, DatePicker);
  },
};

export default Plugin;

export { DatePicker };
