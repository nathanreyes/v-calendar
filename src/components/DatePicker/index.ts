import { App as Application } from 'vue';
import DatePicker from './DatePicker.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, DatePicker, defaults);
  },
};

export default Plugin;

export { DatePicker };
