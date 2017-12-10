import { isDate } from './typeCheckers';
import { getDateComps, getNextPage, getMaxPage, getLastArrayItem, arrayHasItems } from './helpers';

// #region Single Date Picker

export const singleHasValue = value => isDate(value) && !isNaN(value.getTime());
export const singleFormatter = (value, formatter) => (singleHasValue(value) ? formatter(value) : '');
export const singleParser = (text, parser) => {
  const value = parser(text.trim());
  return singleHasValue(value) ? value : null;
};
export const singleFilterDisabled = (value, attr) => {
  if (!singleHasValue(value) || !attr) return value;
  return attr.intersectsDate(value) ? null : value;
};
export const singleValuesAreEqual = (a, b) => {
  if (!singleHasValue(a) && !singleHasValue(b)) return true;
  if (!singleHasValue(a) || !singleHasValue(b)) return false;
  return a.getTime() === b.getTime();
};
export const singleGetPageRange = (value) => {
  if (!singleHasValue(value)) return null;
  const from = getDateComps(value);
  const to = getNextPage(from);
  return { from, to };
};

export const SinglePickerProfile = (formatter, parser) => ({
  componentName: 'single-date-picker',
  inputPlaceholder: 'Enter Date',
  hasValue: singleHasValue,
  formatValue: value => singleFormatter(value, formatter),
  parseValue: text => singleParser(text, parser),
  filterDisabled: singleFilterDisabled,
  valuesAreEqual: singleValuesAreEqual,
  getPageRange: singleGetPageRange,
});

// #endregion

// #region Multiple Date Picker

export const multipleHasValue = value => arrayHasItems(value);
export const multipleFormatter = (value, formatter) => (multipleHasValue(value) ? value.map(d => formatter(d)).join(', ') : '');
export const multipleParser = (text, parser) => text.split(',').map(s => singleParser(s, parser)).filter(d => singleHasValue(d));
export const multipleFilterDisabled = (value, attr) => {
  if (!multipleHasValue(value) || !attr) return value;
  return value.filter(d => !attr.intersectsDate(d));
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
  const to = getMaxPage(getDateComps(getLastArrayItem(this.value)), getNextPage(this.fromPage_));
  return { from, to };
};
export const MultiplePickerProfile = (formatter, parser) => ({
  componentName: 'multiple-date-picker',
  inputPlaceholder: 'Date 1, Date 2, ...',
  hasValue: multipleHasValue,
  formatValue: value => multipleFormatter(value, formatter),
  parseValue: value => multipleParser(value, parser),
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
  const start = dateTexts[0] ? singleParser(dateTexts[0], parser) : null;
  const end = dateTexts[1] ? singleParser(dateTexts[1], parser) : null;
  return { start, end };
};
export const rangeFilterDisabled = (value, attr) => {
  if (!rangeHasValue(value) || !attr) return value;
  return attr.intersectsDate(value) ? null : value;
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
  inputPlaceholder: 'Start Date - End Date',
  hasValue: rangeHasValue,
  formatValue: (value, dragValue) => rangeFormatter(value, dragValue, formatter),
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
