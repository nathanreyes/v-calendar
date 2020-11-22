import { App as Application } from 'vue';
import TimeSelect from './TimeSelect.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, TimeSelect);
  },
};

export default Plugin;

export { TimeSelect };
