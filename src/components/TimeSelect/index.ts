import { App as Application } from 'vue';
import TimeSelect from './TimeSelect.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, TimeSelect, defaults);
  },
};

export default Plugin;

export { TimeSelect };
