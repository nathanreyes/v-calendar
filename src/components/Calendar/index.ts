import { App as Application } from 'vue';
import Calendar from './Calendar.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, Calendar, defaults);
  },
};

export default Plugin;

export { Calendar };
