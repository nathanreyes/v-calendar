import { ComponentPublicInstance } from 'vue';
import { isArray, isFunction, isString } from './_';

export interface PageAddress {
  day?: number;
  week?: number;
  month: number;
  year: number;
}

export const pad = (val: string | number, len: number, char = '0') => {
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

export const roundTenth = (n: number) => {
  return Math.round(n * 100) / 100;
};

export const pageIsValid = (page: PageAddress | null | undefined): boolean =>
  !!(page && page.month && page.year);

export const pageIsBeforePage = (
  page: PageAddress | null | undefined,
  comparePage: PageAddress | null | undefined,
): boolean => {
  if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
  page = page as PageAddress;
  comparePage = comparePage as PageAddress;
  if (page.year !== comparePage.year) return page.year < comparePage.year;
  if (page.month && comparePage.month && page.month !== comparePage.month)
    return page.month < comparePage.month;
  if (page.week && comparePage.week && page.week !== comparePage.week) {
    return page.week < comparePage.week;
  }
  if (page.day && comparePage.day && page.day !== comparePage.day) {
    return page.day < comparePage.day;
  }
  return false;
};

export const pageIsAfterPage = (
  page: PageAddress | null | undefined,
  comparePage: PageAddress | null | undefined,
): boolean => {
  if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
  page = page as PageAddress;
  comparePage = comparePage as PageAddress;
  if (page.year !== comparePage.year) return page.year > comparePage.year;
  if (page.month && comparePage.month && page.month !== comparePage.month) {
    return page.month > comparePage.month;
  }
  if (page.week && comparePage.week && page.week !== comparePage.week) {
    return page.week > comparePage.week;
  }
  if (page.day && comparePage.day && page.day !== comparePage.day) {
    return page.day > comparePage.day;
  }
  return false;
};

export const pageIsBetweenPages = (
  page: PageAddress | null | undefined,
  fromPage: PageAddress | null | undefined,
  toPage: PageAddress | null | undefined,
): boolean =>
  (page || false) &&
  !pageIsBeforePage(page, fromPage) &&
  !pageIsAfterPage(page, toPage);

export const pageIsEqualToPage = (
  aPage: PageAddress | null | undefined,
  bPage: PageAddress | null | undefined,
): boolean => {
  if (!aPage && bPage) return false;
  if (aPage && !bPage) return false;
  if (!aPage && !bPage) return true;
  aPage = aPage as PageAddress;
  bPage = bPage as PageAddress;
  return (
    aPage.year === bPage.year &&
    aPage.month === bPage.month &&
    aPage.week === bPage.week &&
    aPage.day === bPage.day
  );
};

export const arrayHasItems = (array: any): boolean =>
  isArray(array) && array.length > 0;

export const resolveEl = (
  target: Element | ComponentPublicInstance | string | null,
): Element | null => {
  if (target == null) return target;
  if (document && isString(target)) return document.querySelector(target);
  return (target as ComponentPublicInstance).$el ?? target;
};

export interface ElementPosition {
  top: number;
  left: number;
}

interface CustomElement {
  addEventListener: Function;
  removeEventListener: Function;
  dispatchEvent: Function;
}

export const off = (
  element: CustomElement,
  event: string,
  handler: (e: any) => void,
  opts: boolean | EventListenerOptions | undefined = undefined,
) => {
  element.removeEventListener(event, handler, opts);
};

export const on = (
  element: CustomElement,
  event: string,
  handler: (e: any) => void,
  opts: boolean | AddEventListenerOptions | undefined = undefined,
) => {
  element.addEventListener(event, handler, opts);
  return () => off(element, event, handler, opts);
};

export const elementContains = (element: Node, child: Node) =>
  !!element && !!child && (element === child || element.contains(child));

export const onSpaceOrEnter = (
  event: KeyboardEvent,
  handler: (e: KeyboardEvent) => void,
) => {
  if (event.key === ' ' || event.key === 'Enter') {
    handler(event);
    event.preventDefault();
  }
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
