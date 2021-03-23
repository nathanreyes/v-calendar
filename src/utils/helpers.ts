import { isArray, isObject, isFunction, isDate } from './_';

export interface Page {
  month: number;
  year: number;
}

export const pad = (val: string, len: number, char = '0') => {
  val = val !== null && val !== undefined ? String(val) : '';
  len = len || 2;
  while (val.length < len) {
    val = `${char}${val}`;
  }
  return val;
};

export const evalFn = (fn: Function, args: any) =>
  isFunction(fn) ? fn(args) : fn;

export const mergeEvents = (...args: Array<any>) => {
  const result: any = {};
  args.forEach(e =>
    Object.entries(e).forEach(([key, value]) => {
      if (!result[key]) {
        result[key] = value;
      } else if (isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    }),
  );
  return result;
};

export const pageIsValid = (page: Page | null): boolean =>
  !!(page && page.month && page.year);

export const pageIsBeforePage = (page: Page, comparePage: Page): boolean => {
  if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
  if (page.year === comparePage.year) return page.month < comparePage.month;
  return page.year < comparePage.year;
};

export const pageIsAfterPage = (page: Page, comparePage: Page): boolean => {
  if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
  if (page.year === comparePage.year) return page.month > comparePage.month;
  return page.year > comparePage.year;
};

export const pageIsBetweenPages = (
  page: Page,
  fromPage: Page,
  toPage: Page,
): boolean =>
  (page || false) &&
  !pageIsBeforePage(page, fromPage) &&
  !pageIsAfterPage(page, toPage);

export const pageIsEqualToPage = (aPage: Page, bPage: Page): boolean => {
  if (!aPage && bPage) return false;
  if (aPage && !bPage) return false;
  if (!aPage && !bPage) return true;
  return aPage.month === bPage.month && aPage.year === bPage.year;
};

export const addPages = ({ month, year }: Page, count: number): Page => {
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

export const pageRangeToArray = (from: Page, to: Page) => {
  if (!pageIsValid(from) || !pageIsValid(to)) return [];
  const result = [];
  while (!pageIsAfterPage(from, to)) {
    result.push(from);
    from = addPages(from, 1);
  }
  return result;
};

export function datesAreEqual(a: any, b: any): boolean {
  const aIsDate = isDate(a);
  const bIsDate = isDate(b);
  if (!aIsDate && !bIsDate) return true;
  if (aIsDate !== bIsDate) return false;
  return a.getTime() === b.getTime();
}

export const arrayHasItems = (array: Array<any>): boolean =>
  isArray(array) && array.length > 0;

export interface ElementPosition {
  top: number;
  left: number;
}

export const mixinOptionalProps = (source: any, target: any, props: [any]) => {
  const assigned: Array<string> = [];
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

export const on = (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  opts: boolean | AddEventListenerOptions | undefined,
) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, opts);
  }
};

export const off = (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  opts: boolean | EventListenerOptions | undefined,
) => {
  if (element && event) {
    element.removeEventListener(event, handler, opts);
  }
};

export const elementContains = (element: Element, child: Element) =>
  !!element && !!child && (element === child || element.contains(child));

export const onSpaceOrEnter = (
  event: KeyboardEvent,
  handler: EventHandlerNonNull,
) => {
  if (event.key === ' ' || event.key === 'Enter') {
    handler(event);
    event.preventDefault();
  }
};

/* eslint-disable no-bitwise */

export const createGuid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export function hash(str: string): number {
  let hashcode = 0;
  let i = 0;
  let chr;
  if (str.length === 0) return hashcode;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hashcode = (hashcode << 5) - hashcode + chr;
    hashcode |= 0; // Convert to 32bit integer
  }
  return hashcode;
}

/* eslint-enable no-bitwise */
