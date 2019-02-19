import {
  isObject,
  isString,
  isArray,
  capitalize,
  kebabCase,
  get,
  has,
  hasAny,
  toPairs,
  set,
} from './_';

const cssProps = ['bg', 'text'];
const colors = ['blue', 'red', 'orange'];
const colorSuffixes = [
  'L5',
  'L4',
  'L3',
  'L2',
  'L1',
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
];

const targetProps = ['base', 'start', 'end', 'startEnd'];
const displayProps = ['class', 'style', 'color', 'fillMode'];

export const defaultThemeConfig = {
  color: 'blue',
  highlight: {
    base: {
      fillMode: 'light',
    },
  },
};

// Creates all the css classes needed for the theme
function mixinCssClasses(target) {
  cssProps.forEach(prop => {
    colors.forEach(color => {
      colorSuffixes.forEach(colorSuffix => {
        const key = `${prop}${capitalize(color)}${colorSuffix}`;
        target[key] = kebabCase(key);
      });
    });
  });
  return target;
}

// Normalizes attribute config to the structure defined by the properties
function normalizeAttr({
  config,
  type,
  targetProps,
  displayProps,
  themeConfig,
}) {
  let root = {};
  // Assign default attribute for 'true'
  if (config === true) {
    root = themeConfig[type] || defaultThemeConfig[type];
  // Assign strings to base color
  } else if (isString(config)) {
    root.base = { color: config };
  // Mixin objects at top level
  } else if (isObject(config)) {
    root = { ...config };
  } else {
    return null;
  }
  // Move non-target properties to base target
  if (!hasAny(root, targetProps)) {
    root = { base: { ...root } };
  }
  // Normalize each target
  toPairs(root).forEach(([targetType, targetConfig]) => {
    if (targetConfig === true) {
      root[targetType] = { color: themeConfig.color }
    } else if (isString(targetConfig)) {
      root[targetType] = { color: targetConfig };
    } else if (isObject(targetConfig)) {
      root[targetType] = { ...targetConfig };
    }

    if (!hasAny(root[targetType], displayProps)) {
      root[targetType] = { style: { ...root[targetType] } }
    }

    displayProps.forEach(displayType => {
      const displayPath = `${targetType}.${displayType}`;
      if (!has(root, displayPath) && has(themeConfig[type], displayPath)) {
        set(root, displayPath, get(themeConfig[type], displayPath));
      }
    })
    if (!has(root, `${targetType}.color`)) {
      set(root, `${targetType}.color`, themeConfig.color);
    }
  });

  return root;
}

export const normalizeHighlight = (
  config,
  themeConfig = defaultThemeConfig,
) => {
  let highlight = normalizeAttr({
    config,
    type: 'highlight',
    targetProps,
    displayProps,
    themeConfig,
  });
  return highlight;
};

const getStartEndBackgroundLayer = ({ class: className, style, theme }) => {
  return {
    wrapperClass: '',
    class: 'vc-highlight',
  };
};

const createTheme = Vue => {
  const theme = {
    classes: mixinCssClasses({}),
    getHighlightBackgrounds({ key, targetDate, highlight }, themeConfig) {
      const backgrounds = [];
      if (!highlight) return backgrounds;

      highlight = normalizeHighlight(highlight);
      const { isDate, isComplex, startTime, endTime } = targetDate;

      if (isDate || isComplex) {
        backgrounds.push({});
      }
    },
  };
  Vue.prototype.$theme = theme;
};

export default createTheme;
