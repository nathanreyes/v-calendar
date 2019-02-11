import defaults from './defaults';
import { parse } from './fecha';
import { isNumber, isString, isDate, isArray, isObject, isFunction } from './_';

const monthComps = {};

// Calendar data
export const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const today = new Date();
export const todayComps = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
};

export const toDate = d => {
  if (!d) return null;
  if (isDate(d)) return new Date(d.getTime());
  if (isNumber(d)) return new Date(d);
  if (isString(d)) return parse(d, ['L', 'YYYY-MM-DD', 'YYYY/MM/DD']);
  if (isObject(d))
    return new Date(
      d.year || today.getFullYear(),
      d.month || today.getMonth(),
      d.day || today.getDate(),
    );
  return new Date(d);
};

export const getPageForDate = date => {
  const d = toDate(date);
  return (
    d && {
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    }
  );
};

export const getPageForToday = () => {
  const today = new Date();
  return {
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  };
};

export const evalFn = (fn, args) => (isFunction(fn) ? fn(args) : fn);

export const getMonthDates = (year = 2000) => {
  const dates = [];
  for (let i = 0; i < 12; i++) {
    dates.push(new Date(year, i, 15));
  }
  return dates;
};

export const addMonthsToDate = (months, date) => {
  const d = toDate(date);
  if (!d) return date;
  d.setMonth(d.getMonth() + months);
  return d;
};

export const getWeekdayDates = ({
  firstDayOfWeek = 1,
  year = 2000,
  utc = false,
}) => {
  const dates = [];
  for (let i = 1, j = 0; j < 7; i++) {
    const d = utc ? new Date(Date.UTC(year, 0, i)) : new Date(year, 0, i);
    const day = utc ? d.getUTCDay() : d.getDay();
    if (day === firstDayOfWeek - 1 || j > 0) {
      dates.push(d);
      j++;
    }
  }
  return dates;
};

// Days/month/year components for a given month and year
export const getMonthComps = (month, year) => {
  const key = `${month}.${year}`;
  let comps = monthComps[key];
  if (!comps) {
    const firstDayOfWeek = defaults.firstDayOfWeek;
    const inLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const firstWeekday = new Date(year, month - 1, 1).getDay() + 1;
    const days = month === 2 && inLeapYear ? 29 : daysInMonths[month - 1];
    const weeks = Math.ceil(
      (days + Math.abs(firstWeekday - firstDayOfWeek)) / 7,
    );
    comps = {
      firstDayOfWeek,
      inLeapYear,
      firstWeekday,
      days,
      weeks,
      month,
      year,
    };
    monthComps[key] = comps;
  }
  return comps;
};

// Days/month/year components for a given date
export const getDateComps = date => {
  if (!date || !date.getTime) return undefined;
  return getMonthComps(date.getMonth() + 1, date.getFullYear());
};

// Days/month/year components for today's month
export const getThisMonthComps = () =>
  getMonthComps(todayComps.month, todayComps.year);

// Day/month/year components for previous month
export const getPrevMonthComps = (month, year) => {
  if (month === 1) return getMonthComps(12, year - 1);
  return getMonthComps(month - 1, year);
};

// Day/month/year components for next month
export const getNextMonthComps = (month, year) => {
  if (month === 12) return getMonthComps(1, year + 1);
  return getMonthComps(month + 1, year);
};

export const getExampleMonthComps = () => {
  const thisMonthComps = getThisMonthComps();
  const nextMonthComps = getNextMonthComps(
    thisMonthComps.month,
    thisMonthComps.year,
  );

  return {
    thisMonth: thisMonthComps.month - 1,
    thisMonthYear: thisMonthComps.year,
    nextMonth: nextMonthComps.month - 1,
    nextMonthYear: nextMonthComps.year,
  };
};

export const pageIsValid = page => !!(page && page.month && page.year);

export const pageIsEqualToPage = (page, otherPage) =>
  pageIsValid(page) &&
  pageIsValid(comparePage) &&
  page.year === otherPage.year &&
  page.month === otherPage.month;

export const pageIsBeforePage = (page, comparePage) => {
  if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
  if (page.year === comparePage.year) return page.month < comparePage.month;
  return page.year < comparePage.year;
};

export const pageIsAfterPage = (page, comparePage) => {
  if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
  if (page.year === comparePage.year) return page.month > comparePage.month;
  return page.year > comparePage.year;
};

export const pageIsBetweenPages = (page, fromPage, toPage) =>
  (page || false) &&
  !pageIsBeforePage(page, fromPage) &&
  !pageIsAfterPage(page, toPage);

export const getMaxPage = (...args) =>
  args.reduce((prev, curr) => {
    if (!prev) return curr;
    if (!curr) return prev;
    return pageIsAfterPage(curr, prev) ? curr : prev;
  });

export const addPages = (page, count) => {
  let { month, year } = page || getPageForToday();
  const incr = count > 0 ? 1 : -1;
  for (let i = 0; i < Math.abs(count); i++) {
    month += incr;
    if (month > 12) {
      month = 1;
      year++;
    } else if (month < 1) {
      month = 12;
      year--;
    }
  }
  return {
    month,
    year,
  };
};

export const getFirstValidPage = (...args) => args.find(p => !!p);

export const getFirstArrayItem = (array, fallbackValue) => {
  if (!array) return fallbackValue;
  return array.length ? array[0] : fallbackValue;
};

export const getLastArrayItem = (array, fallbackValue) => {
  if (!array) return fallbackValue;
  return array.length ? array[array.length - 1] : fallbackValue;
};

export const arrayHasItems = array => isArray(array) && array.length;

export const findAncestor = (el, fn) => {
  if (!el) return null;
  if (fn && fn(el)) return el;
  return findAncestor(el.parentElement, fn);
};

export const elementHasAncestor = (el, ancestor) =>
  !!findAncestor(el, e => e === ancestor);

export const elementPositionInAncestor = (el, ancestor) => {
  let top = 0;
  let left = 0;
  do {
    top += el.offsetTop || 0;
    left += el.offsetLeft || 0;
    el = el.offsetParent;
  } while (el && el !== ancestor);
  return {
    top,
    left,
  };
};

export const objectFromArray = (array, keyProp = 'key') => {
  if (!array || !array.length) return {};
  return array.reduce((obj, curr) => {
    obj[curr[keyProp]] = curr;
    return obj;
  }, {});
};

export const mixinOptionalProps = (source, target, props) => {
  const assigned = [];
  props.forEach(p => {
    const name = p.name || p.toString();
    const mixin = p.mixin;
    const validate = p.validate;
    if (Object.prototype.hasOwnProperty.call(source, name)) {
      const value = validate ? validate(source[name]) : source[name];
      target[name] = mixin && isObject(value) ? { ...mixin, ...value } : value;
      assigned.push(name);
    }
  });
  return {
    target,
    assigned: assigned.length ? assigned : null,
  };
};

export const createGuid = () => {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
};

export const on = (element, event, handler) => {
  if (element && event && handler) {
    document.addEventListener
      ? element.addEventListener(event, handler, false)
      : element.attachEvent('on' + event, handler);
  }
};

export const off = (element, event, handler) => {
  if (element && event) {
    document.removeEventListener
      ? element.removeEventListener(event, handler, false)
      : element.detachEvent('on' + event, handler);
  }
};
