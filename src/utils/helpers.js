import { isArray, isObject, isFunction, isDate } from './_';

export const evalFn = (fn, args) => (isFunction(fn) ? fn(args) : fn);

export const pageIsValid = page => !!(page && page.month && page.year);

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

export const pageForDate = date => {
  if (!date) return null;
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

export const addPages = ({ month, year }, count) => {
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

export const pageForThisMonth = () => pageForDate(new Date());

export const pageForNextMonth = () => addPages(pageForThisMonth(), 1);

export const pageForPrevMonth = () => addPages(pageForThisMonth(), -1);

export const getMaxPage = (...args) =>
  args.reduce((prev, curr) => {
    if (!prev) return curr;
    if (!curr) return prev;
    return pageIsAfterPage(curr, prev) ? curr : prev;
  });

export function datesAreEqual(a, b) {
  const aIsDate = isDate(a);
  const bIsDate = isDate(b);
  if (!aIsDate && !bIsDate) return true;
  if (aIsDate !== bIsDate) return false;
  // Remove time value for date compare
  const dateOnlyA = new Date(a.valueOf());
  dateOnlyA.setHours(0, 0, 0, 0);
  const dateOnlyB = new Date(b.valueOf());
  dateOnlyB.setHours(0, 0, 0, 0);
  return dateOnlyA.getTime() === dateOnlyB.getTime();
}

export function dateTimesAreEqual(a, b) {
  if (!datesAreEqual(a, b)) return false;
  return a.getTime() === b.getTime();
}

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
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export const on = (element, event, handler) => {
  if (element && event && handler) {
    document.addEventListener
      ? element.addEventListener(event, handler, false)
      : element.attachEvent(`on${event}`, handler);
  }
};

export const off = (element, event, handler) => {
  if (element && event) {
    document.removeEventListener
      ? element.removeEventListener(event, handler, false)
      : element.detachEvent(`on${event}`, handler);
  }
};

export const elementContains = (element, child) =>
  element === child || element.contains(child);
