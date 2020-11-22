import { App as Application } from 'vue';
import CalendarDay from './CalendarDay.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, CalendarDay, defaults);
  },
};

export default Plugin;

export { CalendarDay };
