import DefaultTheme from 'vitepress/theme';
import { Calendar, CalendarGrid, DatePicker } from '../../../src/index';
import AlertInfo from '../../components/alerts/AlertInfo.vue';
import './index.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Calendar', Calendar);
    app.component('CalendarGrid', CalendarGrid);
    app.component('DatePicker', DatePicker);
    app.component('AlertInfo', AlertInfo);
  },
};
