import DefaultTheme from 'vitepress/theme';
import { ComponentOptions } from 'vue';
import VCalendar from 'v-calendar';
import './styles/index.css';

// Autoregister components
const modules = import.meta.glob('../components/**/*.vue', {
  eager: true,
  import: 'default',
});
const components: any[] = [];
for (const path in modules) {
  const pathParts = path.split('/');
  const defName = pathParts[pathParts.length - 1].split('.')[0];
  const component = modules[path] as ComponentOptions;
  component.name ||= defName;
  components.push(component);
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(VCalendar, {
      isDark: {},
    });
    components.forEach(component => {
      app.component(component.name, component);
    });
  },
};
