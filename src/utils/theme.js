import defaultThemeConfig from './defaultTheme.json';
import {
  isObject,
  isString,
  capitalize,
  kebabCase,
  get,
  has,
  hasAny,
  toPairs,
  set,
  defaults,
  mapValues,
} from './_';
import { isBoolean } from 'util';

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
  let rootColor = themeConfig.color || defaultThemeConfig.color;
  // Assign default attribute for booleans or strings
  if (config === true || isString(config)) {
    rootColor = isString(config) ? config : rootColor;
    root = { ...(themeConfig[type] || defaultThemeConfig[type]) };
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
    let targetColor = rootColor;
    if (targetConfig === true || isString(targetConfig)) {
      targetColor = isString(targetConfig) ? targetConfig : targetColor;
      root[targetType] = { color: targetColor };
    } else if (isObject(targetConfig)) {
      root[targetType] = { ...targetConfig };
    }

    if (!hasAny(root[targetType], displayProps)) {
      root[targetType] = { style: { ...root[targetType] } };
    }

    displayProps.forEach(displayType => {
      const displayPath = `${targetType}.${displayType}`;
      if (!has(root, displayPath) && has(themeConfig[type], displayPath)) {
        set(root, displayPath, get(themeConfig[type], displayPath));
      }
    });
    // Set the theme color if it is missing
    if (!has(root, `${targetType}.color`)) {
      set(root, `${targetType}.color`, targetColor);
    }
  });
  return root;
}

export const normalizeHighlight = (
  config,
  themeConfig = defaultThemeConfig,
) => {
  const highlight = normalizeAttr({
    config,
    type: 'highlight',
    targetProps,
    displayProps,
    themeConfig,
  });
  toPairs(highlight).map(([targetType, targetConfig]) => {
    const isDark = themeConfig.isDark;
    const color = targetConfig.color || themeConfig.color;
    let bgClass, contentClass;
    switch (targetConfig.fillMode) {
      case 'light':
        bgClass = `bg-${color}-${isDark ? 'd5' : 'l5'}`;
        contentClass = `text-${isDark ? 'white' : color}${isDark ? '' : '-d4'}`;
        break;
      case 'solid':
        bgClass = `bg-${color}-${isDark ? 'l1' : 'd1'}`;
        contentClass = `text-white`;
        break;
    }
    targetConfig.class = `${targetConfig.class} ${bgClass}`;
    targetConfig.contentClass = `${targetConfig.contentClass} ${contentClass}`;
  });
  return highlight;
};

export const generateTheme = ({ color, isDark, config }) => {
  let theme = defaults(
    {
      color: color || defaultThemeConfig.color,
      isDark: isBoolean(isDark) ? isDark : defaultThemeConfig.isDark,
    },
    config,
    defaultThemeConfig,
  );
  theme = mapValues(theme, val => {
    if (isObject(val) && hasAny(val, ['light', 'dark'])) {
      return isDark ? val.dark : val.light;
    }
    return val;
  });
  theme = mapValues(theme, val => {
    if (isString(val)) {
      val = val.replace('{color}', theme.color);
    }
  });
  console.log(theme);
  return theme;
};

const createTheme = Vue => {
  const theme = {
    classes: mixinCssClasses({}),
  };
  Vue.prototype.$theme = theme;
};

export default createTheme;
