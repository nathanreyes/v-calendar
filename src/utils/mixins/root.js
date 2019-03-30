import Theme from '@/utils/theme';
import Locale from '@/utils/locale';
import { isString, isObject, has, defaultsDeep } from '@/utils/_';

export const rootMixin = {
  computed: {
    masks_() {
      return {
        ...this.$vc.masks,
        ...this.masks,
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
      // Get the default locales
      const { locales } = this.$vc.defaults;
      // Get the detected locale
      const detLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
      let config = this.locale || detLocale;
      let id = isString(config)
        ? config
        : isObject(config)
        ? config.id
        : detLocale;
      id = [id, id.substring(0, 2)].find(i => has(locales, i)) || detLocale;
      const defLocale = defaultsDeep(locales[id], { id });
      // Sanitize defaults
      defLocale.firstDayOfWeek = this.passedProp(
        'firstDayOfWeek',
        defLocale.firstDayOfWeek || defLocale.dow,
      );
      defLocale.masks = defLocale.masks || { L: defLocale.L };
      // Assign or merge defaults with provided config
      config = isObject(config) ? defaultsDeep(config, defLocale) : defLocale;
      // Let the $vc instance create the locale as they are shared when possible
      return this.$vc.getLocale(config);
    },
    format() {
      return (date, mask) =>
        this.locale_ ? this.locale_.format(date, mask) : '';
    },
  },
};
