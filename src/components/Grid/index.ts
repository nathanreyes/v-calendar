import { App as Application } from 'vue';
import Grid from './Grid.vue';
import { Defaults } from '../../utils/defaults';

import { registerComponent } from './../../utils/plugins/index';

const Plugin = {
  install(app: Application, defaults: Defaults) {
    registerComponent(app, Grid, defaults);
  },
};

export default Plugin;

export { Grid };
