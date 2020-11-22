import { App as Application } from 'vue';
import Popover from './Popover.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, Popover);
  },
};

export default Plugin;

export { Popover };
