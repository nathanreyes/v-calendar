import { createApp } from 'vue';
import App from './App.vue';

const defaults = {
  titlePosition: 'left',
};

declare const window: any;
window.__vcalendar__ = defaults;

const app = createApp(App);

import VCalendar from './index';
app.use(VCalendar, defaults)

// import { setupCalendar, Calendar, DatePicker } from './index';
// setupCalendar(app, defaults);
// app.use(Calendar);
// app.use(DatePicker);

app.mount('#app');