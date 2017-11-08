import Vue from 'vue';
import Router from 'vue-router';

const PageHome = () => import('../components/home/pages/PageHome');
const PageSetup = () => import('../components/setup/pages/PageSetup');
const PageTheming = () => import('../components/theming/pages/PageTheming');
const PageApi = () => import('../components/api/pages/PageApi');

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
      path: '/theming',
      component: PageTheming,
    },
    {
      path: '/api',
      component: PageApi,
    },
  ],
});
