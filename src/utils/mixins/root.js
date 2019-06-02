import Theme from '@/utils/theme';
import Locale from '@/utils/locale';
import { isString, isObject, has, defaultsDeep } from '@/utils/_';

export const rootMixin = {
  props: {
    color: String,
    isDark: Boolean,
    theme: Object,
    firstDayOfWeek: Number,
    masks: Object,
    locale: [String, Object],
  },
  computed: {
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
      // Get the default locales
      const locales = this.$vc.locales;
      // Get the detected locale string
      const detLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
      let config = this.locale;
      // Resolve the locale id
      let id = isString(config)
        ? config
        : has(config, 'id')
        ? config.id
        : detLocale;
      id = [id, id.substring(0, 2)].find(i => has(locales, i)) || detLocale;
      // Spread the default locale to prevent repetitive update loops
      const defLocale = { ...locales[id] };
      // Let props override locale settings
      defLocale.firstDayOfWeek = this.passedProp(
        'firstDayOfWeek',
        defLocale.firstDayOfWeek,
      );
      defLocale.masks = defaultsDeep(this.masks, defLocale.masks);
      // Assign or merge defaults with provided config
      config = isObject(config) ? defaultsDeep(config, defLocale) : defLocale;
      // Create a new locale
      return new Locale(id, config);
    },
    format() {
      return (date, mask) =>
        this.locale_ ? this.locale_.format(date, mask) : '';
    },
  },
};
