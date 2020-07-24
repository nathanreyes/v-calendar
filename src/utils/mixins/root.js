import { addDays } from 'date-fns';
import Theme from '../theme';
import Locale from '../locale';
import { isObject, isArray, isDate } from '../_';
import { defaultsMixin } from '../defaults';
import { setupScreens } from '../screens';
import Attribute from '../attribute';

export const rootMixin = {
  mixins: [defaultsMixin],
  props: {
    color: String,
    isDark: Boolean,
    firstDayOfWeek: Number,
    masks: Object,
    locale: [String, Object],
    timezone: String,
    minDate: null,
    maxDate: null,
    disabledDates: null,
    availableDates: null,
    theme: null,
  },
  computed: {
    $theme() {
      // Return the theme prop if it is an instance of the Theme class
      if (this.theme instanceof Theme) return this.theme;
      // Create the theme
      return new Theme({
        color: this.passedProp('color', 'blue'),
        isDark: this.passedProp('isDark', false),
      });
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
      const minDate = this.normalizeDate(this.minDate);
      const maxDate = this.normalizeDate(this.maxDate);
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
  methods: {
    formatDate(date, mask) {
      return this.$locale ? this.$locale.format(date, mask) : '';
    },
    parseDate(text, mask) {
      if (!this.$locale) return null;
      const value = this.$locale.parse(text, mask);
      return isDate(value) ? value : null;
    },
    normalizeDate(date, config) {
      return this.$locale ? this.$locale.normalizeDate(date, config) : date;
    },
  },
};
