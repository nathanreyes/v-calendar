import { App as Application } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, SvgIcon, defaults);
  },
};

export default Plugin;

export { SvgIcon };
