import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/tailwind.css';

const defaults = {
  // componentPrefix: '',
  titlePosition: 'left',
};

// // declare const window: any;
// // window.__vcalendar__ = defaults;

// Method 1
// import VCalendar from '../../src/index';
// createApp(App).use(VCalendar, defaults).use(router).mount('#app');

// // Method 2
import { SetupCalendar, Calendar, DatePicker } from '../../src/index';
createApp(App)
  .use(SetupCalendar, defaults)
  .component('Calendar', Calendar)
  .component('DatePicker', DatePicker)
  .use(router)
  .mount('#app');
