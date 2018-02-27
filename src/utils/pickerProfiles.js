import { isDate } from './typeCheckers';
import { getDateComps, getNextPage, getMaxPage, getLastArrayItem, arrayHasItems } from './helpers';
import DateInfo from './dateInfo';

// #region Single Date Picker

export const singleHasValue = value => isDate(value) && !isNaN(value.getTime());
export const singleFormatter = (value, formatter) => (singleHasValue(value) ? formatter(value) : '');
export const singleParser = (text, parser) => {
  const value = parser(text.trim());
  return singleHasValue(value) ? value : null;
};
export const singleNormalizer = value => value && new Date(value);
export const singleFilterDisabled = ({ value, isRequired, disabled, fallbackValue }) => {
  if (!singleHasValue(value) && isRequired) return fallbackValue;
  if (singleHasValue(value) && disabled && disabled.intersectsDate(value)) return null;
  return value;
};
export const singleValuesAreEqual = (a, b) => {
  if (!singleHasValue(a) && !singleHasValue(b)) return true;
  if (!singleHasValue(a) || !singleHasValue(b)) return false;
  return a.getTime() === b.getTime();
};
export const singleGetPageRange = (value) => {
  if (!singleHasValue(value)) return null;
  const from = getDateComps(value);
  const to = from;
  return { from, to };
};
export const SinglePickerProfile = (formatter, parser) => ({
  componentName: 'single-date-picker',
  hasValue: singleHasValue,
  formatValue: value => singleFormatter(value, formatter),
  parseValue: text => singleParser(text, parser),
  normalizeValue: value => singleNormalizer(value),
  filterDisabled: singleFilterDisabled,
  valuesAreEqual: singleValuesAreEqual,
  getPageRange: singleGetPageRange,
});

// #endregion

// #region Multiple Date Picker

export const multipleHasValue = value => arrayHasItems(value);
export const multipleFormatter = (value, formatter) => (multipleHasValue(value) ? value.map(d => formatter(d)).join(', ') : '');
export const multipleParser = (text, parser) => {
  const value = text && text.split(',').map(s => singleParser(s, parser)).filter(d => singleHasValue(d));
  return (!value || !value.length) ? null : value;
};
export const multipleNormalizer = (value) => {
  if (!value || !value.length) return null;
  const times = {};
  return value
    // Filter out duplicate dates
    .filter((d) => {
      const t = d.getTime();
      if (Object.prototype.hasOwnProperty.call(times, t)) return false;
      return (times[t] = true);
    })
    // Sort the dates
    .sort((a, b) => a.getTime() - b.getTime());
};
export const multipleFilterDisabled = ({ value, isRequired, disabled, fallbackValue }) => {
  const newValue = value && value.filter(d => !disabled || !disabled.intersectsDate(d));
  if (!multipleHasValue(newValue) && isRequired) return fallbackValue;
  return newValue;
};
export const multipleValuesAreEqual = (a, b) => {
  const aHasItems = arrayHasItems(a);
  const bHasItems = arrayHasItems(b);
  if (!aHasItems && !bHasItems) return true;
  if (!aHasItems || !bHasItems || aHasItems !== bHasItems) return false;
  return a.every(d => b.includes(d));
};
export const multipleGetPageRange = (value) => {
  if (!multipleHasValue(value)) return null;
  const from = getDateComps(value[0]);
  const to = getMaxPage(getDateComps(getLastArrayItem(value)), getNextPage(from));
  return { from, to };
};
export const MultiplePickerProfile = (formatter, parser) => ({
  componentName: 'multiple-date-picker',
  hasValue: multipleHasValue,
  formatValue: value => multipleFormatter(value, formatter),
  parseValue: value => multipleParser(value, parser),
  normalizeValue: value => multipleNormalizer(value),
  filterDisabled: multipleFilterDisabled,
  valuesAreEqual: multipleValuesAreEqual,
  getPageRange: multipleGetPageRange,
});

// #endregion

// #region Date Range Picker

export const rangeHasValue = value => value && value.start && value.end;
export const rangeFormatter = (value, dragValue, formatter) => {
  let startText;
  let endText;
  if (dragValue) {
    startText = singleFormatter(dragValue.start, formatter);
    endText = singleFormatter(dragValue.end, formatter);
  } else if (value) {
    startText = singleFormatter(value.start, formatter);
    endText = singleFormatter(value.end, formatter);
  }
  if (!startText && !endText) return '';
  if (!endText) return startText;
  return `${startText} - ${endText}`;
};
export const rangeParser = (text, parser) => {
  const dateTexts = text.split('-').map(s => s.trim());
  if (dateTexts.length >= 2) {
    const { start, end } = DateInfo({
      start: singleParser(dateTexts[0], parser),
      end: singleParser(dateTexts[1], parser),
    });
    return start && end && { start, end };
  }
  return null;
};
export const rangeNormalizer = (value) => {
  if (!value || !value.start || !value.end) return null;
  const { start, end } = new DateInfo({
    start: new Date(value.start),
    end: new Date(value.end),
  });
  return { start, end };
};
export const rangeFilterDisabled = ({ value, isRequired, disabled, fallbackValue }) => {
  if (!rangeHasValue(value) && isRequired) return fallbackValue;
  if (rangeHasValue(value) && disabled && disabled.intersectsDate(value)) return null;
  return value;
};
export const rangeValuesAreEqual = (a, b) => {
  if (!rangeHasValue(a) && !rangeHasValue(b)) return true;
  if (!rangeHasValue(a) || !rangeHasValue(b)) return false;
  return singleValuesAreEqual(a.start, b.start) && singleValuesAreEqual(a.end, b.end);
};
export const rangeGetPageRange = (value) => {
  if (!rangeHasValue(value)) return null;
  const from = getDateComps(value.start);
  const to = getMaxPage(getDateComps(value.end), getNextPage(from));
  return { from, to };
};
export const RangePickerProfile = (formatter, parser) => ({
  componentName: 'date-range-picker',
  hasValue: rangeHasValue,
  formatValue: (value, dragValue) => rangeFormatter(value, dragValue, formatter),
  normalizeValue: value => rangeNormalizer(value),
  parseValue: text => rangeParser(text, parser),
  filterDisabled: rangeFilterDisabled,
  valuesAreEqual: rangeValuesAreEqual,
  getPageRange: rangeGetPageRange,
});

// #endregion

export default (mode, formatter, parser) => {
  switch (mode) {
    case 'single': return SinglePickerProfile(formatter, parser);
    case 'multiple': return MultiplePickerProfile(formatter, parser);
    case 'range': return RangePickerProfile(formatter, parser);
    default: return null;
  }
};
