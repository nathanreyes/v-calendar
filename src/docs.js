import Vue from 'vue';
import Buefy from 'buefy';
import App from './App';
import router from './router';
import './styles/app.scss';

Vue.use(Buefy, {
  defaultIconPack: 'fa',
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
