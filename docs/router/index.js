import Vue from 'vue';
import Router from 'vue-router';

const PageHome = () => import('../components/home/pages/PageHome');
const PageDatePicker = () => import('../components/date-picker/pages/PageDatePicker');
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
      path: '/datepicker',
      component: PageDatePicker,
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
