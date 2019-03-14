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
      if (!picker.isRequired) picker.$emit('input', null);
    } else {
      // Set value to selected date and current time
      const selectedDateTime = picker.combineDateAndTime(day.date, picker.value_);
      picker.value_ = selectedDateTime;
    }
  }

  handleDayMouseEnter() {
    // Don't do anything here
  }

  handleHourChange(hour, picker) {
    // Copy date
    const currentTime = new Date(picker.value_.valueOf());
    // Set hour value to date
    currentTime.setHours(hour);

    // Check if date was changed
    if (!this.valuesAreEqual(picker.value_, currentTime)) {
      // Set value to current time
      picker.value_ = currentTime;
    }
  }

  handleMinuteChange(minute, picker) {
    // Copy date
    const currentTime = new Date(picker.value_.valueOf());
    // Set minute value to date
    currentTime.setMinutes(minute);

    // Check if date was changed
    if (!this.valuesAreEqual(picker.value_, currentTime)) {
      // Set value to current time
      picker.value_ = currentTime;
    }
  }

  handleSecondChange(second, picker) {
    // Copy date
    const currentTime = new Date(picker.value_.valueOf());
    // Set second value to date
    currentTime.setSeconds(second);

    // Check if date was changed
    if (!this.valuesAreEqual(picker.value_, currentTime)) {
      // Set value to current time
      picker.value_ = currentTime;
    }
  }
}
