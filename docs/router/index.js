import Vue from 'vue';
import Router from 'vue-router';

const PageHome = () => import('../components/home/pages/PageHome');
const PageTheming = () => import('../components/theming/pages/PageTheming');
const PageApi = () => import('../components/api/pages/PageApi');
const PageGallery = () => import('../components/gallery/pages/PageGallery');
const PageSetup = () => import('../components/setup/pages/PageSetup');

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
      path: '/theming',
      component: PageTheming,
    },
    {
      path: '/api',
      component: PageApi,
    },
    {
      path: '/gallery',
      component: PageGallery,
    },
    {
      path: '/setup',
      component: PageSetup,
    },
  ],
});
