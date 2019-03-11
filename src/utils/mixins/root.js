import Theme from '@/utils/theme';
import Locale from '@/utils/locale';
import { defaultsDeep, has } from '@/utils/_';

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
      const props = this.$options.propsData;
      if (has(props, 'color')) {
        config.color = this.color;
      }
      if (has(props, 'isDark')) {
        config.isDark = this.isDark;
      }
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
};
