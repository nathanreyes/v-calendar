import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import {
  SetupCalendar,
  Calendar,
  DatePicker,
  popoverDirective,
} from '../../src/index';
import './assets/styles/tailwind.css';

createApp(App)
  .use(SetupCalendar, {})
  .component('Calendar', Calendar)
  .component('DatePicker', DatePicker)
  .directive('popover', popoverDirective)
  .use(router)
  .mount('#app');
