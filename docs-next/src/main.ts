import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { SetupCalendar, Calendar, DatePicker } from '../../src/index';
import './assets/styles/tailwind.css';

createApp(App)
  .use(SetupCalendar, {})
  .component('Calendar', Calendar)
  .component('DatePicker', DatePicker)
  .use(router)
  .mount('#app');
