import { App as Application } from 'vue';
import PopoverRow from './PopoverRow.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, PopoverRow);
  },
};

export default Plugin;

export { PopoverRow };
