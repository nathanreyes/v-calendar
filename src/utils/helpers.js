import defaults from './defaults';
import {
  isNumber,
  isString,
  isDate,
  isArray,
  isObject,
  isFunction,
} from './typeCheckers';
import { parse } from './fecha';

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

export const evalFn = (fn, args) => (isFunction(fn) ? fn(args) : fn);

export const getMonthDates = (year = 2000) => {
  const dates = [];
  for (let i = 0; i < 12; i++) {
    dates.push(new Date(year, i, 15));
  }
  return dates;
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

function comparePages(firstPage, secondPage) {
  if (!firstPage || !secondPage) return 0;
  if (firstPage.year === secondPage.year) {
    if (firstPage.month === secondPage.month) return 0;
    return firstPage.month < secondPage.month ? -1 : 1;
  }
  return firstPage.year < secondPage.year ? -1 : 1;
}

export const pageIsEqualToPage = (page, otherPage) =>
  comparePages(page, otherPage) === 0;

export const pageIsBeforePage = (page, beforePage) =>
  comparePages(page, beforePage) === -1;

export const pageIsAfterPage = (page, afterPage) =>
  comparePages(page, afterPage) === 1;

export const pageIsBetweenPages = (page, fromPage, toPage) =>
  (page || false) &&
  !pageIsBeforePage(page, fromPage) &&
  !pageIsAfterPage(page, toPage);

export const getMinPage = (...args) =>
  args.reduce((prev, curr) => {
    if (!prev) return curr;
    if (!curr) return prev;
    return comparePages(prev, curr) === -1 ? prev : curr;
  });

export const getMaxPage = (...args) =>
  args.reduce((prev, curr) => {
    if (!prev) return curr;
    if (!curr) return prev;
    return comparePages(prev, curr) === 1 ? prev : curr;
  });

export const getPrevPage = page => {
  if (!page) return undefined;
  const prevComps = getPrevMonthComps(page.month, page.year);
  return {
    month: prevComps.month,
    year: prevComps.year,
  };
};

export const getNextPage = page => {
  if (!page) return undefined;
  const nextComps = getNextMonthComps(page.month, page.year);
  return {
    month: nextComps.month,
    year: nextComps.year,
  };
};

// Return page if it lies between the from and to pages
export const getPageBetweenPages = (page, fromPage, toPage) => {
  if (!page) return undefined;
  if (fromPage && comparePages(page, fromPage) === -1) return undefined;
  if (toPage && comparePages(page, toPage) === 1) return undefined;
  return page;
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
  if (fn(el)) return el;
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
