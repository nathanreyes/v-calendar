import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/tailwind.css';

import { SetupCalendar, Calendar, DatePicker } from '../../src/index.ts';
import '../../src/styles/main.css';
// import {
//   SetupCalendar,
//   Calendar,
//   DatePicker,
// } from '../../dist/v-calendar.es.js';
// import '../../dist/style.css';

const defaults = {
  // titlePosition: 'right',
};
createApp(App)
  .use(SetupCalendar, defaults)
  .component('Calendar', Calendar)
  .component('DatePicker', DatePicker)
  .use(router)
  .mount('#app');
