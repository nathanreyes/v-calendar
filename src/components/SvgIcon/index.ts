import { App as Application } from 'vue';
import SvgIcon from './SvgIcon.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, SvgIcon);
  },
};

export default Plugin;

export { SvgIcon };
