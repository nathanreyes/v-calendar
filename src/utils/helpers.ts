import { ComponentPublicInstance } from 'vue';
import { isArray, isFunction, isString } from './_';

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

export const omit = <T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  ...keys: K
) => {
  const ret = {} as {
    [K in keyof typeof obj]: typeof obj[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
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
