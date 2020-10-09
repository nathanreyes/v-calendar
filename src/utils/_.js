// Type utils
export { default as isBoolean } from 'lodash/isBoolean';
export { default as isNumber } from 'lodash/isNumber';
export { default as isString } from 'lodash/isString';
export { default as isArray } from 'lodash/isArrayLikeObject';
export { default as isFunction } from 'lodash/isFunction';
export { default as isUndefined } from 'lodash/isUndefined';
import _isDate from 'lodash/isDate';

// Number utils
export { default as clamp } from 'lodash/clamp';

// Object utils
export { default as get } from 'lodash/get';
export { default as set } from 'lodash/set';
export { default as mapValues } from 'lodash/mapValues';
export { default as toPairs } from 'lodash/toPairs';
export { default as defaults } from 'lodash/defaults';
export { default as defaultsDeep } from 'lodash/defaultsDeep';
export { default as pick } from 'lodash/pick';
export { default as omit } from 'lodash/omit';
import _has from 'lodash/has';

// Collection utils
export { default as map } from 'lodash/map';
export { default as head } from 'lodash/head';
export { default as last } from 'lodash/last';
import _some from 'lodash/some';

// Type checkers
export const getType = value =>
  Object.prototype.toString.call(value).slice(8, -1);
export const isDate = value => _isDate(value) && !isNaN(value.getTime());
export const isObject = value => getType(value) === 'Object';
// Object utils
export const has = _has;
export const hasAny = (obj, props) => _some(props, p => _has(obj, p));
// Collection utils
export const some = _some;
