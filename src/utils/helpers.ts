import _has from 'lodash/has';
import _isDate from 'lodash/isDate';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import _some from 'lodash/some';
import type { ComponentPublicInstance } from 'vue';

export { isFunction, isString };
export { default as isBoolean } from 'lodash/isBoolean';
export { default as isNumber } from 'lodash/isNumber';
export { default as isUndefined } from 'lodash/isUndefined';
export { default as get } from 'lodash/get';
export { default as set } from 'lodash/set';
export { default as mapValues } from 'lodash/mapValues';
export { default as defaults } from 'lodash/defaults';
export { default as defaultsDeep } from 'lodash/defaultsDeep';
export { default as map } from 'lodash/map';
export { default as head } from 'lodash/head';
export { default as last } from 'lodash/last';

// Type checkers
export const getType = (value: any) =>
  Object.prototype.toString.call(value).slice(8, -1);
export const isDate = (value: unknown): value is Date =>
  _isDate(value) && !isNaN(value.getTime());
export const isObject = (value: unknown): value is Object =>
  getType(value) === 'Object';

// Object utils
export const has = _has;
export const hasAny = (obj: object, props: string[]) =>
  _some(props, p => _has(obj, p));

// Collection utils
export const some = _some;

export const pad = (val: string | number, len: number, char = '0') => {
  val = val !== null && val !== undefined ? String(val) : '';
  len = len || 2;
  while (val.length < len) {
    val = `${char}${val}`;
  }
  return val;
};

export const roundTenth = (n: number) => {
  return Math.round(n * 100) / 100;
};

export const isArray = (val: any): val is any[] => Array.isArray(val);

export const arrayHasItems = (array: any): boolean =>
  isArray(array) && array.length > 0;

export const resolveEl = (target: unknown): Node | null => {
  if (target == null) return null;
  if (document && isString(target)) return document.querySelector(target);
  return (target as ComponentPublicInstance).$el ?? target;
};

export interface ElementPosition {
  top: number;
  left: number;
}

export interface CustomElement {
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

export const omit = <T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  ...keys: K
) => {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};

export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const ret: any = {};
  keys.forEach(key => {
    if (key in obj) ret[key] = obj[key];
  });
  return ret;
};

export function extend<T extends object, E extends object>(
  value: T,
  ext: E,
): T & E {
  const handler = {
    get(target: T, prop: keyof (T | E)) {
      if ((prop as string) in target) {
        return target[prop];
      }
      return ext[prop];
    },
  };
  // @ts-ignore
  return new Proxy(value, handler) as T & E;
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

/* eslint-disable no-bitwise */

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
