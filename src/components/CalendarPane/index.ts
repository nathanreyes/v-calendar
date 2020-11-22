import { App as Application } from 'vue';
import CalendarPane from './CalendarPane.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, CalendarPane, defaults);
  },
};

export default Plugin;

export { CalendarPane };
