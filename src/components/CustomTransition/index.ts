import { App as Application } from 'vue';
import CustomTransition from './CustomTransition.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from '../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, CustomTransition, defaults);
  },
};

export default Plugin;

export { CustomTransition };
