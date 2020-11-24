import { createApp } from 'vue';
import App from './App.vue';

const defaults = {
  componentPrefix: '',
  titlePosition: 'left',
};

// declare const window: any;
// window.__vcalendar__ = defaults;

// Method 1
// import VCalendar from './index';
// createApp(App)
//   .use(VCalendar, defaults)
//   .mount('#app');

// Method 2
import { SetupCalendar, Calendar, DatePicker } from './index';
createApp(App)
  .use(SetupCalendar, defaults)
  .component('Calendar', Calendar)
  .component('DatePicker', DatePicker)
  .mount('#app');
