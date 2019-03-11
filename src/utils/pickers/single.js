import { pageForDate, datesAreEqual } from '@/utils/helpers';
import { isDate } from '@/utils/_';

export default class SinglePicker {
  constructor({ format, parse }) {
    this.format = format;
    this.parse = parse;
  }

  hasValue(value) {
    return isDate(value);
  }

  format(value) {
    console.log('format single', value);
    return this.hasValue(value) ? this.format(value) : '';
  }

  parse(text) {
    const value = this.parse(text);
    return isDate(value) ? value : null;
  }

  normalize(value) {
    return value && new Date(value);
  }

  filterDisabled({ value, isRequired, disabled, fallbackValue }) {
    if (!this.hasValue(value) && isRequired) {
      return fallbackValue;
    }
    if (this.hasValue(value) && disabled && disabled.intersectsDate(value)) {
      return null;
    }
    return value;
  }

  valuesAreEqual(a, b) {
    return datesAreEqual(a, b);
  }

  getPageRange(value) {
    if (!this.hasValue(value)) {
      return null;
    }
    const from = pageForDate(value);
    return { from, to: from };
  }

  handleDayClick(day, picker) {
    // Done if day selection is invalid
    if (!picker.dateIsValid(day.date)) {
      return;
    }
    // Check if selected date was reselected
    if (this.valuesAreEqual(day.date, picker.value_)) {
      // Reset value to null if allowed
      if (!picker.isRequired) picker.$emit('input', null);
    } else {
      // Set value to selected date
      picker.value_ = day.date;
    }
  }

  handleDayMouseEnter() {
    // Don't do anything here
  }
}
