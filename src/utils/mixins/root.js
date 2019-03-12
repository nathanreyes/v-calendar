import Theme from '@/utils/theme';
import Locale from '@/utils/locale';
import { isObject, defaultsDeep, has, get } from '@/utils/_';

export const rootMixin = {
  computed: {
    formats_() {
      return {
        ...this.$vc.formats,
        ...this.formats,
      };
    },
    theme_() {
      // Return the theme prop if it is an instance of the Theme class
      if (this.theme instanceof Theme) return this.theme;
      // Merge the default theme with the provided theme
      const config = defaultsDeep(this.theme, this.$vc.theme);
      // Merge in the color and isDark props if they were specifically provided
      config.color = this.passedProp('color', config.color);
      config.isDark = this.passedProp('isDark', config.isDark);
      // Create the theme
      return new Theme(config);
    },
    locale_() {
      // Return the locale prop if it is an instance of the Locale class
      if (this.locale instanceof Locale) return this.locale;
      // Let the $vc instance create the locale as they are shared when possible
      return this.$vc.getLocale(this.locale);
    },
  },
  methods: {
    propOrDefault(prop, defaultPath, strategy) {
      return this.passedProp(
        prop,
        get(this.$vc.defaults, defaultPath),
        strategy,
      );
    },
    passedProp(prop, fallback, strategy) {
      if (has(this.$options.propsData, prop)) {
        console.log('has', prop, this[prop]);
        const propValue = this[prop];
        if (isObject(propValue) && strategy === 'merge') {
          return defaultsDeep(propValue, fallback);
        }
        return propValue;
      }
      return fallback;
    },
  },
};
