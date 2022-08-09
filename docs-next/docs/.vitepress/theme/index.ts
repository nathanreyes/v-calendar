import DefaultTheme from 'vitepress/theme';
import { Calendar, CalendarGrid, DatePicker } from '@/../../src';
import './index.css';

// Autoregister components
const modules = import.meta.globEager('../components/**/*.vue');
const components: any[] = [];
for (const path in modules) {
  const pathParts = path.split('/');
  const defName = pathParts[pathParts.length - 1].split('.')[0];
  const component = modules[path].default;
  component.name ||= defName;
  components.push(component);
}

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Calendar', Calendar);
    app.component('CalendarGrid', CalendarGrid);
    app.component('DatePicker', DatePicker);
    components.forEach(component => {
      app.component(component.name, component);
    });
  },
};
