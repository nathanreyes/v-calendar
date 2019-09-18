import Theme from '@/utils/theme';
import Locale from '@/utils/locale';
import { isObject, defaultsDeep } from '@/utils/_';
import { defaultsMixin } from '@/utils/defaults';
import { popoversMixin } from '@/utils/popovers';
import { setupScreens } from '@/utils/screens';

export const rootMixin = {
  mixins: [defaultsMixin, popoversMixin],
  props: {
    color: String,
    isDark: Boolean,
    theme: Object,
    firstDayOfWeek: Number,
    masks: Object,
    locale: [String, Object],
  },
  computed: {
    $theme() {
      // Return the theme prop if it is an instance of the Theme class
      if (this.theme instanceof Theme) return this.theme;
      // Merge the default theme with the provided theme
      const config = defaultsDeep(this.theme, this.$defaults.theme);
      // Merge in the color and isDark props if they were specifically provided
      config.color = this.passedProp('color', config.color);
      config.isDark = this.passedProp('isDark', config.isDark);
      // Create the theme
      return new Theme(config);
    },
    $locale() {
      // Return the locale prop if it is an instance of the Locale class
      if (this.locale instanceof Locale) return this.locale;
      // Build up a base config from component props
      const config = isObject(this.locale)
        ? this.locale
        : {
            id: this.locale,
            firstDayOfWeek: this.firstDayOfWeek,
            masks: this.masks,
          };
      // Return new locale
      return new Locale(config, this.$locales);
    },
    format() {
      return (date, mask) =>
        this.$locale ? this.$locale.format(date, mask) : '';
    },
  },
  created() {
    setupScreens(this.$defaults.screens);
  },
};
