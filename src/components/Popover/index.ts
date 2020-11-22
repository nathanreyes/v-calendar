import { App as Application } from 'vue';
import Popover from './Popover.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, Popover, defaults);
  },
};

export default Plugin;

export { Popover };
