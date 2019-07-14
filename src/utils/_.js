import _isBoolean from 'lodash/isBoolean';
import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';
import _isDate from 'lodash/isDate';
import _isArrayLikeObject from 'lodash/isArrayLikeObject';
import _isFunction from 'lodash/isFunction';
import _isUndefined from 'lodash/isUndefined';
import _isNil from 'lodash/isNil';

import _clamp from 'lodash/clamp';

import _kebabCase from 'lodash/kebabCase';
import _capitalize from 'lodash/capitalize';
import _upperFirst from 'lodash/upperFirst';

import _get from 'lodash/get';
import _set from 'lodash/set';
import _mapValues from 'lodash/mapValues';
import _toPairs from 'lodash/toPairs';
import _has from 'lodash/has';
import _defaults from 'lodash/defaults';
import _defaultsDeep from 'lodash/defaultsDeep';
import _pick from 'lodash/pick';
import _omit from 'lodash/omit';

import _map from 'lodash/map';
import _some from 'lodash/some';
import _head from 'lodash/head';
import _last from 'lodash/last';
import _uniq from 'lodash/uniq';

// Type checkers
export const getType = value =>
  Object.prototype.toString.call(value).slice(8, -1);
export const isBoolean = _isBoolean;
export const isNumber = _isNumber;
export const isString = _isString;
export const isDate = value => _isDate(value) && !isNaN(value.getTime());
export const isArray = _isArrayLikeObject;
export const isObject = value => getType(value) === 'Object';
export const isFunction = _isFunction;
export const isUndefined = _isUndefined;
export const isNil = _isNil;
// Lodash number utilities
export const clamp = _clamp;
// Lodash string utilities
export const kebabCase = _kebabCase;
export const capitalize = _capitalize;
export const upperFirst = _upperFirst;
// Lodash object utilities
export const get = _get;
export const set = _set;
export const mapValues = _mapValues;
export const toPairs = _toPairs;
export const has = _has;
export const hasAny = (obj, props) => _some(props, p => _has(obj, p));
export const defaults = _defaults;
export const defaultsDeep = _defaultsDeep;
export const pick = _pick;
export const omit = _omit;
// Lodash collection utilities
export const map = _map;
export const some = _some;
export const head = _head;
export const last = _last;
export const uniq = _uniq;
