import { App as Application } from 'vue';
import PopoverRow from './PopoverRow.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, PopoverRow, defaults);
  },
};

export default Plugin;

export { PopoverRow };
