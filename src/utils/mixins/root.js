import Theme from '@/utils/theme';
import Locale from '@/utils/locale';
import { isObject, isArray, defaultsDeep } from '@/utils/_';
import { defaultsMixin } from '@/utils/defaults';
import { popoversMixin } from '@/utils/popovers';
import { setupScreens } from '@/utils/screens';
import { addDays } from 'date-fns';
import Attribute from '@/utils/attribute';

export const rootMixin = {
  mixins: [defaultsMixin, popoversMixin],
  props: {
    color: String,
    isDark: Boolean,
    theme: Object,
    firstDayOfWeek: Number,
    masks: Object,
    locale: [String, Object],
    minDate: null,
    maxDate: null,
    disabledDates: null,
    availableDates: null,
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
    disabledAttribute() {
      // Build up a complete list of disabled dates
      let dates = [];
      // Initialize with disabled dates prop, if any
      if (this.disabledDates) {
        dates = isArray(this.disabledDates)
          ? this.disabledDates
          : [this.disabledDates];
      }
      // Add disabled dates for minDate and maxDate props
      const minDate = this.$locale.toDate(this.minDate);
      const maxDate = this.$locale.toDate(this.maxDate);
      if (minDate) {
        dates.push({ start: null, end: addDays(minDate, -1) });
      }
      if (maxDate) {
        dates.push({ start: addDays(maxDate, 1), end: null });
      }
      // Return the new disabled attribute
      return new Attribute(
        {
          key: 'disabled',
          dates,
          excludeDates: this.availableDates,
          excludeMode: 'includes',
          order: 100,
        },
        this.$theme,
        this.$locale,
      );
    },
  },
  created() {
    setupScreens(this.$defaults.screens);
  },
};
