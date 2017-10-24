import Vue from 'vue';
import Router from 'vue-router';

const PageHome = () => import('../components/pages/PageHome');
const PageSetup = () => import('../components/pages/PageSetup');
const PageStyling = () => import('../components/pages/PageStyling');
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
      path: '/styling',
      component: PageStyling,
    },
    {
      path: '/api',
      component: PageApi,
    },
  ],
});
