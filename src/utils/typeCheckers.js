
export const getType = value => Object.prototype.toString.call(value).slice(8, -1);
export const isNumber = value => getType(value) === 'Number';
export const isDate = value => getType(value) === 'Date';
export const isString = value => getType(value) === 'String';
export const isArray = value => getType(value) === 'Array';
export const isObject = value => getType(value) === 'Object';
export const isFunction = value => getType(value) === 'Function';
