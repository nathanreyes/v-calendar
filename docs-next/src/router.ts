import { App } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Home from '@/pages/Home.vue';
import Blank from '@/pages/Blank.vue';
import BasicCalendar from '@/pages/calendar/Basic.vue';
import GridCalendar from '@/pages/calendar/Grid.vue';
import DatepickerDate from '@/pages/datepicker/Date.vue';
import Time from '@/pages/datepicker/Time.vue';
import TimeRange from '@/pages/datepicker/TimeRange.vue';

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
        path: 'calendar/basic',
        component: BasicCalendar,
      },
      {
        path: 'calendar/grid',
        component: GridCalendar,
      },
      {
        path: 'calendar/blank',
        component: Blank,
      },
      {
        path: 'datepicker/date',
        component: DatepickerDate,
      },
      {
        path: 'datepicker/time',
        component: Time,
      },
      {
        path: 'datepicker/time-range',
        component: TimeRange,
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
