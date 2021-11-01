import { App } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Home from '@/pages/Home.vue';
import Blank from '@/pages/Blank.vue';
import Grid from '@/pages/calendar/Grid.vue';
import DatepickerDate from '@/pages/datepicker/Date.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'calendar/grid',
        component: Grid,
      },
      {
        path: 'calendar/blank',
        component: Blank,
      },
      {
        path: 'datepicker/date',
        component: DatepickerDate,
      },
    ],
  },
];

export default function installRouter(app: App, options: any) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  app.use(router);
}
