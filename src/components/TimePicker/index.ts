import { App as Application } from 'vue';
import TimePicker from './TimePicker.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, TimePicker);
  },
};

export default Plugin;

export { TimePicker };
