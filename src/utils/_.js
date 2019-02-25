import _isBoolean from 'lodash/isBoolean';
import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';
import _isDate from 'lodash/isDate';
import _isArrayLikeObject from 'lodash/isArrayLikeObject';
import _isFunction from 'lodash/isFunction';
import _isUndefined from 'lodash/isUndefined';

import _kebabCase from 'lodash/kebabCase';
import _capitalize from 'lodash/capitalize';

import _get from 'lodash/get';
import _set from 'lodash/set';
import _mapValues from 'lodash/mapValues';
import _toPairs from 'lodash/toPairs';
import _has from 'lodash/has';
import _defaults from 'lodash/defaults';

import _map from 'lodash/map';
import _some from 'lodash/some';
import _last from 'lodash/last';

// Type checkers
export const getType = value =>
  Object.prototype.toString.call(value).slice(8, -1);
export const isBoolean = _isBoolean;
export const isNumber = _isNumber;
export const isString = _isString;
export const isDate = _isDate;
export const isArray = _isArrayLikeObject;
export const isObject = value => getType(value) === 'Object';
export const isFunction = _isFunction;
export const isUndefined = _isUndefined;
// Lodash string utilities
export const kebabCase = _kebabCase;
export const capitalize = _capitalize;
// Lodash object utilities
export const get = _get;
export const set = _set;
export const mapValues = _mapValues;
export const toPairs = _toPairs;
export const has = _has;
export const hasAny = (obj, props) => _some(props, p => _has(obj, p));
export const defaults = _defaults;
// Lodash collection utilities
export const map = _map;
export const some = _some;
export const last = _last;
