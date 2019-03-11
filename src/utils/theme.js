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

function concatString(toString, appendString) {
  if (!toString) return appendString;
  return `${toString} ${appendString}`;
}

export default class Theme {
  constructor({ color, isDark, config }) {
    this._config = defaults(
      {
        color: color || defaultThemeConfig.color,
        isDark: isBoolean(isDark) ? isDark : defaultThemeConfig.isDark,
      },
      config,
      defaultThemeConfig,
    );
    // Make properties of config appear as properties of theme
    toPairs(this._config).forEach(([prop]) => {
      Object.defineProperty(this, prop, {
        enumerable: true,
        get() {
          return this.getConfig(prop, {});
        },
      });
    });
  }

  getConfig(
    prop,
    { color = this._config.color, isDark = this._config.isDark },
  ) {
    if (!has(this._config, prop)) return undefined;
    let propVal = get(this._config, prop);
    if (isObject(propVal) && hasAny(propVal, ['light', 'dark'])) {
      propVal = isDark ? propVal.dark : propVal.light;
    }
    if (isString(propVal)) {
      return propVal.replace(/{color}/g, color);
    }
    return propVal;
  }

  getFills(type) {
    const base = this[`${type}BaseFill`];
    const startEnd = this[`${type}StartEndFill`] || base;
    const start = this[`${type}StartFill`] || startEnd;
    const end = this[`${type}EndFill`] || start;
    return {
      base,
      startEnd,
      start,
      end,
    };
  }

  // Normalizes attribute config to the structure defined by the properties
  normalizeAttr({ config, type }) {
    let rootColor = this.color;
    const fills = this.getFills(type);
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
          base: { ...config },
          start: { ...config },
          end: { ...config },
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

  normalizeHighlight(config) {
    const highlight = this.normalizeAttr({
      config,
      type: 'highlight',
    });
    toPairs(highlight).map(([_, targetConfig]) => {
      defaults(targetConfig, { isDark: this.isDark, color: this.color });
      let bgClass, contentClass;
      switch (targetConfig.fillMode) {
        case 'none':
          bgClass = this.getConfig('fillNone', targetConfig);
          contentClass = this.getConfig('fillNoneContent', targetConfig);
          break;
        case 'light':
          bgClass = this.getConfig('fillLight', targetConfig);
          contentClass = this.getConfig('fillLightContent', targetConfig);
          break;
        // Solid by default
        default:
          bgClass = this.getConfig('fillSolid', targetConfig);
          contentClass = this.getConfig('fillSolidContent', targetConfig);
          break;
      }
      targetConfig.class = concatString(targetConfig.class, bgClass);
      targetConfig.contentClass = concatString(
        targetConfig.contentClass,
        contentClass,
      );
    });
    return highlight;
  }

  normalizeDot(config) {
    const dot = this.normalizeAttr({
      config,
      type: 'dot',
    });
    toPairs(dot).map(([_, targetConfig]) => {
      defaults(targetConfig, { isDark: this.isDark, color: this.color });
      let bgClass;
      switch (targetConfig.fillMode) {
        case 'none':
          bgClass = this.getConfig('fillNone', targetConfig);
          break;
        case 'light':
          bgClass = this.getConfig('fillLight', targetConfig);
          break;
        // Solid by default
        default:
          bgClass = this.getConfig('fillSolid', targetConfig);
          break;
      }
      targetConfig.class = concatString(targetConfig.class, bgClass);
    });
    return dot;
  }

  normalizeBar(config) {
    const bar = this.normalizeAttr({
      config,
      type: 'bar',
    });
    toPairs(bar).map(([_, targetConfig]) => {
      defaults(targetConfig, { isDark: this.isDark, color: this.color });
      let bgClass;
      switch (targetConfig.fillMode) {
        case 'none':
          bgClass = this.getConfig('fillNone', targetConfig);
          break;
        case 'light':
          bgClass = this.getConfig('fillLight', targetConfig);
          break;
        // Solid by default
        default:
          bgClass = this.getConfig('fillSolid', targetConfig);
          break;
      }
      targetConfig.class = concatString(targetConfig.class, bgClass);
    });
    return bar;
  }

  // normalizeContent(config, theme) {
  //   const content = normalizeAttr({
  //     config,
  //     type: 'content',
  //     theme,
  //   });
  // }
}
