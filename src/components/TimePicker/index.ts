import { App as Application } from 'vue';
import TimePicker from './TimePicker.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, TimePicker, defaults);
  },
};

export default Plugin;

export { TimePicker };
