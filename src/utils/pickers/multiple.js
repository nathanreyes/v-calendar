import {
  pageForDate,
  getMaxPage,
  addPages,
  arrayHasItems,
  datesAreEqual,
  dateTimesAreEqual,
} from '@/utils/helpers';
import { isString, isDate, last, uniq } from '@/utils/_';

export default class MultiplePicker {
  constructor({ format, parse }) {
    this._format = format;
    this._parse = parse;
  }

  hasValue(value) {
    return arrayHasItems(value);
  }

  format(value) {
    if (this.hasValue(value)) {
      return value.map(d => this._format(d)).join(', ');
    }
    return '';
  }

  parse(text) {
    if (!isString(text)) return [];
    return text
      .split(',')
      .map(s => this._parse(s))
      .filter(d => isDate(d));
  }

  normalize(value) {
    if (!this.hasValue(value)) return [];
    return uniq(value).sort((a, b) => a.getTime() - b.getTime());
  }

  filterDisabled({ value, isRequired, disabled, fallbackValue }) {
    if (!this.hasValue(value)) return [];
    if (!disabled) return value;
    const newValue = value.filter(d => !disabled.intersectsDate(d));
    if (!this.hasValue(newValue) && isRequired) return fallbackValue;
    return newValue;
  }

  valuesAreEqual(a, b) {
    const aHasItems = this.hasValue(a);
    const bHasItems = this.hasValue(b);
    if (!aHasItems && !bHasItems) return true;
    if (aHasItems !== bHasItems || a.length !== b.length) return false;
    return a.some(d => !b.includes(d));
  }

  getPageRange(value) {
    if (!this.hasValue(value)) return null;
    const from = pageForDate(value[0]);
    const to = getMaxPage(pageForDate(last(value)), addPages(from, 1));
    return { from, to };
  }

  getLastDate(picker) {
    return last(picker.value_);
  }

  handleDayClick(day, picker) {
    // Done if day selection is invalid
    if (!picker.dateIsValid(day.date)) {
      return;
    }
    let value = [];
    // Check if no values exist
    if (!this.hasValue(picker.value_)) {
      value = [day.date];
      // Check if value contains the selected date
    } else if (picker.value_.some(d => datesAreEqual(d, day.date))) {
      // Calculate the new dates array
      value = picker.value_.filter(v => !datesAreEqual(v, day.date));
      // Re-select the date if it is required
      if (!this.hasValue(value) && picker.isRequired) {
        value = [day.date];
      }
    } else {
      // Append selected date
      value = [...picker.value_, day.date];
    }
    picker.value_ = this.normalize(value);
  }

  handleDayMouseEnter() {
    // Don't do anything here
  }

  handleTimeChange(time, type, picker) {
    if (!picker.lastDate) return;
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
      let value = [];
      value = [...picker.value_.slice(0, -1), currentTime];
      picker.value_ = this.normalize(value);
    }
  }
}
