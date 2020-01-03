import { pageForDate, datesAreEqual } from '@/utils/helpers';
import { isDate } from '@/utils/_';

export default class SinglePicker {
  constructor({ format, parse }) {
    this._format = format;
    this._parse = parse;
  }

  hasValue(value) {
    return isDate(value);
  }

  format(value) {
    return this.hasValue(value) ? this._format(value) : '';
  }

  parse(text) {
    const value = this._parse(text);
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
      if (!picker.isRequired) {
        picker.value_ = null;
      }
    } else {
      picker.doFormatInput = true;
      picker.doHidePopover = true;
      // Set value to selected date
      picker.value_ = day.date;
    }
  }

  handleDayMouseEnter() {
    // Don't do anything here
  }
}
