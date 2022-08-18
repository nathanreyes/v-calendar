import DefaultTheme from 'vitepress/theme';
import VCalendar from '@/../../src';
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
    app.use(VCalendar, {
      isDark: {},
    });
    components.forEach(component => {
      app.component(component.name, component);
    });
  },
};
