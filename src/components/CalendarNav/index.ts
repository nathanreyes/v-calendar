import { App as Application } from 'vue';
import CalendarNav from './CalendarNav.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, CalendarNav, defaults);
  },
};

export default Plugin;

export { CalendarNav };
