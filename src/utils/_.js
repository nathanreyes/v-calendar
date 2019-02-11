import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';
import _isDate from 'lodash/isDate';
import _isArrayLikeObject from 'lodash/isArrayLikeObject';
import _isFunction from 'lodash/isFunction';
import _isUndefined from 'lodash/isUndefined';
import _mapValues from 'lodash/mapValues';
import _toPairs from 'lodash/toPairs';
import _has from 'lodash/has';
import _get from 'lodash/get';
import _map from 'lodash/map';

// Type checkers
export const getType = value =>
  Object.prototype.toString.call(value).slice(8, -1);
export const isNumber = _isNumber;
export const isString = _isString;
export const isDate = _isDate;
export const isArray = _isArrayLikeObject;
export const isObject = value => getType(value) === 'Object';
export const isFunction = _isFunction;
export const isUndefined = _isUndefined;
// Lodash object utilities
export const mapValues = _mapValues;
export const toPairs = _toPairs;
export const has = _has;
export const get = _get;
export const map = _map;
