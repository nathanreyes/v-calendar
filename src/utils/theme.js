import defaultThemeConfig from './defaults/theme.json';
import {
  isBoolean,
  isObject,
  isString,
  has,
  hasAny,
  get,
  set,
  toPairs,
  defaults,
} from './_';

const targetProps = ['base', 'start', 'end', 'startEnd'];
const displayProps = ['class', 'style', 'color', 'fillMode'];

export const generateTheme = ({ color, isDark, config }) => {
  const themeConfig = defaults(
    {
      color: color || defaultThemeConfig.color,
      isDark: isBoolean(isDark) ? isDark : defaultThemeConfig.isDark,
    },
    config,
    defaultThemeConfig,
  );

  const { color: themeColor, isDark: themeIsDark } = themeConfig;
  const getConfig = (
    prop,
    { color: propColor = themeColor, isDark: propIsDark = themeIsDark } = {},
  ) => {
    if (!has(themeConfig, prop)) return undefined;
    let propVal = get(themeConfig, prop);
    if (isObject(propVal) && hasAny(propVal, ['light', 'dark'])) {
      propVal = propIsDark ? propVal.dark : propVal.light;
    }
    if (isString(propVal)) {
      return propVal.replace(/{color}/g, propColor);
    }
    return propVal;
  };

  const theme = {
    color: themeColor,
    isDark: themeIsDark,
    getConfig,
  };

  toPairs(themeConfig).forEach(([prop]) => {
    Object.defineProperty(theme, prop, {
      get() {
        return getConfig(prop, {});
      },
    });
  });

  return theme;
};

// Normalizes attribute config to the structure defined by the properties
function normalizeAttr({ config, type, targetProps, displayProps, theme }) {
  let root = {};
  let rootColor = theme.color;
  // Assign default attribute for booleans or strings
  if (config === true || isString(config)) {
    rootColor = isString(config) ? config : rootColor;
    root = { ...theme[type] };
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
      if (!has(root, displayPath) && has(theme[type], displayPath)) {
        set(root, displayPath, get(theme[type], displayPath));
      }
    });
    // Set the theme color if it is missing
    if (!has(root, `${targetType}.color`)) {
      set(root, `${targetType}.color`, targetColor);
    }
  });
  return root;
}

export const normalizeHighlight = (config, theme) => {
  const highlight = normalizeAttr({
    config,
    type: 'highlight',
    targetProps,
    displayProps,
    theme,
  });
  toPairs(highlight).map(([_, targetConfig]) => {
    const themeConfig = {
      isDark: theme.isDark,
      color: targetConfig.color || theme.color,
    };
    let bgClass, contentClass;
    switch (targetConfig.fillMode) {
      case 'light':
        bgClass = theme.getConfig('highlightFillLightBg', themeConfig);
        contentClass = theme.getConfig(
          'highlightFillLightContent',
          themeConfig,
        );
        break;
      case 'solid':
        bgClass = theme.getConfig('highlightFillSolidBg', themeConfig);
        contentClass = theme.getConfig(
          'highlightFillSolidContent',
          themeConfig,
        );
        break;
    }
    targetConfig.class = `${targetConfig.class} ${bgClass}`;
    targetConfig.contentClass = `${targetConfig.contentClass} ${contentClass}`;
  });
  return highlight;
};

export default generateTheme;
