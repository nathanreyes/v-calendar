import Theme from '@/utils/theme';
import Locale from '@/utils/locale';
import { isString, defaultsDeep } from '@/utils/_';

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
      // Set default locale id if needed
      let config =
        this.locale || new Intl.DateTimeFormat().resolvedOptions().locale;
      // Configure with locale id
      if (isString(config)) {
        // Load settings provided by default locales
        const { locales } = this.$vc.defaults;
        console.log(this.$vc.defaults);
        const { firstDayOfWeek, dow, masks, L } =
          locales[config] || locales[config.substring(0, 2)] || {};
        console.log(firstDayOfWeek, dow, masks, L);
        config = {
          id: config,
          firstDayOfWeek: firstDayOfWeek || dow,
          masks: masks || { L },
        };
        // Configure with object and locale id
      } else if (isObject(config)) {
        defaultsDeep(config, this.$vc.defaults.locales[config.id]);
      }
      // Merge in the firstDayOfWeek prop if it was specifically provided
      config.firstDayOfWeek = this.passedProp(
        'firstDayOfWeek',
        config.firstDayOfWeek,
      );
      // Let the $vc instance create the locale as they are shared when possible
      return this.$vc.getLocale(config);
    },
  },
};
