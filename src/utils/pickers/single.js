import { pageForDate, datesAreEqual, dateTimesAreEqual } from '@/utils/helpers';
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

  getLastDate(picker) {
    return picker.value_;
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
      // Set value to selected date and current time
      const selectedDateTime = picker.value_ ? picker.combineDateAndTime(day.date, picker.value_) : day.date;
      picker.value_ = selectedDateTime;
    }
  }

  handleDayMouseEnter() {
    // Don't do anything here
  }

  handleTimeChange(time, type, picker) {
    if(!picker.lastDate) return;
    // Copy date
    const currentTime = new Date(picker.lastDate.valueOf());
    // Set time to date
    switch (type) {
      case 'hour':
        currentTime.setHours(time);
        break;
      case 'minute':
        currentTime.setMinutes(time);
        break;
      case 'second':
        currentTime.setSeconds(time);
        break;
      default:
        break;
    }

    // Check if date time was changed
    if (!dateTimesAreEqual(picker.lastDate, currentTime)) {
      // Set value to current time
      picker.value_ = currentTime;
    }
  }
}
