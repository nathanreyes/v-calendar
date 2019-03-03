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
const displayProps = ['class', 'color', 'fillMode'];

function getFills(type, theme) {
  const base = theme[`${type}BaseFill`];
  const startEnd = theme[`${type}StartEndFill`] || base;
  const start = theme[`${type}StartFill`] || startEnd;
  const end = theme[`${type}EndFill`] || start;
  return {
    base,
    startEnd,
    start,
    end,
  };
}

// Normalizes attribute config to the structure defined by the properties
function normalizeAttr({ config, type, theme }) {
  let rootColor = theme.color;
  const fills = getFills(type, theme);
  let root = {
    base: { fillMode: fills.base },
    start: { fillMode: fills.start },
    end: { fillMode: fills.end },
  };
  // Assign default attribute for booleans or strings
  if (config === true || isString(config)) {
    rootColor = isString(config) ? config : rootColor;
  } else if (isObject(config)) {
    // Mixin target configs
    if (hasAny(config, targetProps)) {
      root = { ...config };
      // Mixin display configs
    } else if (hasAny(config, displayProps)) {
      root = {
        base: { ...displayProps },
        start: { ...displayProps },
        end: { ...displayProps },
      };
    }
  }
  // Normalize each target
  toPairs(root).forEach(([targetType, targetConfig]) => {
    let targetColor = rootColor;
    if (targetConfig === true || isString(targetConfig)) {
      targetColor = isString(targetConfig) ? targetConfig : targetColor;
      root[targetType] = { color: targetColor };
    } else if (isObject(targetConfig)) {
      if (hasAny(targetConfig, displayProps)) {
        root[targetType] = { ...targetConfig };
      } else {
        root[targetType] = {};
      }
    }
    // Set the fill if it is missing
    if (!has(root, `${targetType}.fillMode`)) {
      set(root, `${targetType}.fillMode`, fills[targetType]);
    }
    // Set the theme color if it is missing
    if (!has(root, `${targetType}.color`)) {
      set(root, `${targetType}.color`, targetColor);
    }
  });
  if (!root.start) {
    root.start = root.startEnd || root.base;
  }
  if (!root.end) {
    root.end = root.startEnd || root.base;
  }
  return root;
}

function concatString(toString, appendString) {
  if (!toString) return appendString;
  return `${toString} ${appendString}`;
}

export const normalizeHighlight = (config, theme) => {
  const highlight = normalizeAttr({
    config,
    type: 'highlight',
    theme,
  });
  toPairs(highlight).map(([_, targetConfig]) => {
    defaults(targetConfig, { isDark: theme.isDark, color: theme.color });
    let bgClass, contentClass;
    switch (targetConfig.fillMode) {
      case 'none':
        bgClass = theme.getConfig('fillNone', targetConfig);
        contentClass = theme.getConfig('fillNoneContent', targetConfig);
        break;
      case 'light':
        bgClass = theme.getConfig('fillLight', targetConfig);
        contentClass = theme.getConfig('fillLightContent', targetConfig);
        break;
      // Solid by default
      default:
        bgClass = theme.getConfig('fillSolid', targetConfig);
        contentClass = theme.getConfig('fillSolidContent', targetConfig);
        break;
    }
    targetConfig.class = concatString(targetConfig.class, bgClass);
    targetConfig.contentClass = concatString(
      targetConfig.contentClass,
      contentClass,
    );
  });
  return highlight;
};

// export const normalizeContent = (config, theme) => {
//   const content = normalizeAttr({
//     config,
//     type: 'content',
//     theme,
//   });
// }

export const normalizeDot = (config, theme) => {
  const dot = normalizeAttr({
    config,
    type: 'dot',
    theme,
  });
  toPairs(dot).map(([_, targetConfig]) => {
    defaults(targetConfig, { isDark: theme.isDark, color: theme.color });
    let bgClass;
    switch (targetConfig.fillMode) {
      case 'none':
        bgClass = theme.getConfig('fillNone', targetConfig);
        break;
      case 'light':
        bgClass = theme.getConfig('fillLight', targetConfig);
        break;
      // Solid by default
      default:
        bgClass = theme.getConfig('fillSolid', targetConfig);
        break;
    }
    targetConfig.class = concatString(targetConfig.class, bgClass);
  });
  return dot;
};

export const normalizeBar = (config, theme) => {
  const bar = normalizeAttr({
    config,
    type: 'bar',
    theme,
  });
  toPairs(bar).map(([_, targetConfig]) => {
    defaults(targetConfig, { isDark: theme.isDark, color: theme.color });
    let bgClass;
    switch (targetConfig.fillMode) {
      case 'none':
        bgClass = theme.getConfig('fillNone', targetConfig);
        break;
      case 'light':
        bgClass = theme.getConfig('fillLight', targetConfig);
        break;
      // Solid by default
      default:
        bgClass = theme.getConfig('fillSolid', targetConfig);
        break;
    }
    targetConfig.class = concatString(targetConfig.class, bgClass);
  });
  return bar;
};

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
    normalizeHighlight: config => normalizeHighlight(config, theme),
    normalizeDot: config => normalizeDot(config, theme),
    normalizeBar: config => normalizeBar(config, theme),
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

export default generateTheme;
