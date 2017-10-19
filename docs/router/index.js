import Vue from 'vue';
import Router from 'vue-router';

const PageHome = () => import('../components/pages/PageHome');
const PageSetup = () => import('../components/pages/PageSetup');
const PageApi = () => import('../components/pages/PageApi');

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      component: PageHome,
    },
    {
      path: '/setup',
      component: PageSetup,
    },
    {
      path: '/api',
      component: PageApi,
    },
  ],
});
