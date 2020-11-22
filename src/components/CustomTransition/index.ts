import { App as Application } from 'vue';
import CustomTransition from './CustomTransition.vue';

import { registerComponent } from '../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, CustomTransition);
  },
};

export default Plugin;

export { CustomTransition };
