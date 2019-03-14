import {
  pageForDate,
  getMaxPage,
  addPages,
  datesAreEqual,
  dateTimesAreEqual,
} from '@/utils/helpers';
import DateInfo from '@/utils/dateInfo';
import { isDate, isObject } from '@/utils/_';

export default class RangePicker {
  constructor({ locale, format, parse }) {
    this._locale = locale;
    this._format = format;
    this._parse = parse;
  }

  hasValue(value) {
    return isObject(value) && isDate(value.start) && isDate(value.end);
  }

  normalize(value) {
    if (!this.hasValue(value)) return null;
    const { start, end } = new DateInfo(
      {
        start: new Date(value.start),
        end: new Date(value.end),
      },
      { locale: this._locale },
    );
    return { start, end };
  }

  format(value) {
    const nValue = this.normalize(value);
    if (!nValue) return '';
    const { start, end } = nValue;
    const startText = this._format(start);
    const endText = this._format(end);
    if (!startText || !endText) return '';
    return `${startText} - ${endText}`;
  }

  parse(text) {
    let start,
end;
    const dateTexts = text.split('-').map(s => s.trim());
    if (dateTexts.length >= 2) {
      start = this._parse(dateTexts[0]);
      end = this._parse(dateTexts[1]);
    }
    return start && end ? this.normalize({ start, end }) : null;
  }

  filterDisabled({ value, isRequired, disabled, fallbackValue }) {
    let newValue = isRequired ? fallbackValue : null;
    if (
      this.hasValue(value)
      && (!disabled || !disabled.intersectsDate(value))
    ) {
      newValue = value;
    }
    return newValue;
  }

  valuesAreEqual(a, b) {
    const aHasValue = this.hasValue(a);
    const bHasValue = this.hasValue(b);
    if (!aHasValue && !bHasValue) return true;
    if (aHasValue !== bHasValue) return false;
    return datesAreEqual(a.start, b.start) && datesAreEqual(a.end, b.end);
  }

  getPageRange(value) {
    if (!this.hasValue(value)) return null;
    const from = pageForDate(value.start);
    const to = getMaxPage(pageForDate(value.end), addPages(from, 1));
    return { from, to };
  }

  getLastDate(picker) {
    const { value_, dragValue } = picker;
    // Get start drag date time if draging
    if(picker.dragValue) return picker.dragValue.start;
    // Get end value if not dragging
    if(!picker.value_) return null;
    return picker.value_.end;
  }

  handleDayClick(day, picker) {
    const { dateTime } = day;
    // Start new drag selection if not dragging
    if (!picker.dragValue) {
      // Update drag value if it is valid
      const newDragValue = {
        start: new Date(dateTime),
        end: new Date(dateTime),
      };
      // Assign drag value if it is valid
      if (picker.dateIsValid(newDragValue)) {
        picker.dragValue = newDragValue;
      }
    } else {
      // Update selected value if it is valid
      const newValue = this.normalize({
        start: new Date(picker.dragValue.start.getTime()),
        end: new Date(dateTime),
      });
      // Assign new value if it is valid
      if (picker.dateIsValid(newValue)) {
        // Clear drag selection
        picker.dragValue = null;
        picker.value_ = newValue;
      }
    }
  }

  handleDayMouseEnter(day, picker) {
    const { dateTime } = day;
    // Make sure drag has been initialized
    if (picker.dragValue) {
      // Calculate the new dragged value
      const newDragValue = {
        start: new Date(picker.dragValue.start.getTime()),
        end: new Date(dateTime),
      };
      // Assign drag value if it is valid
      if (picker.dateIsValid(newDragValue)) {
        picker.dragValue = newDragValue;
      }
    }
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
      if (picker.dragValue) {
        // Set start drag value if dragging
        const newDragValue = {
          start: currentTime,
          end: new Date(picker.dragValue.end.valueOf()),
        };
        // Assign drag value if it is valid
        if (picker.dateIsValid(newDragValue)) {
          picker.dragValue = newDragValue;
        }
        return;
      }
      // set end value if not dragging
      const newValue = this.normalize({
        start: new Date(picker.value_.start.valueOf()),
        end: currentTime,
      });
      // Assign new value if it is valid
      if (picker.dateIsValid(newValue)) {
        picker.value_ = newValue;
      }
    }
  }
}
