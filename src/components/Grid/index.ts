import { App as Application } from 'vue';
import Grid from './Grid.vue';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(vue: Application) {
    registerComponent(vue, Grid);
  },
};

export default Plugin;

export { Grid };
