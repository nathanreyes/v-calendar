import {
  isObject,
  isString,
  isUndefined,
  has,
  hasAny,
  get,
  set,
  toPairs,
  defaults,
  defaultsDeep,
  upperFirst,
} from './_';
import defConfig from './defaults/theme';

const targetProps = ['base', 'start', 'end', 'startEnd'];
const displayProps = ['class', 'color', 'fillMode'];

export default class Theme {
  constructor(config) {
    this._config = defaults(config, defConfig);
    // Make properties of config appear as properties of theme
    toPairs(this._config).forEach(([prop]) => {
      Object.defineProperty(this, prop, {
        enumerable: true,
        get() {
          return this.getConfig(prop, {});
        },
      });
    });
    // Build and cache normalized attributes
    this.buildNormalizedAttrs();
  }

  buildNormalizedAttrs() {
    this.normalizedAttrs = {
      highlight: {
        opts: ['fillMode', 'class', 'contentClass'],
      },
      dot: { opts: ['class'] },
      bar: { opts: ['class'] },
      content: { opts: ['class'] },
    };
    toPairs(this.normalizedAttrs).forEach(([type, config]) => {
      const attr = { base: {}, start: {}, end: {} };
      config.opts.forEach(opt => {
        const prefix = type;
        const suffix = upperFirst(opt);
        const base = this[`${prefix}Base${suffix}`];
        const startEnd = this[`${prefix}StartEnd${suffix}`] || base;
        const start = this[`${prefix}Start${suffix}`] || startEnd;
        const end = this[`${prefix}End${suffix}`] || start;
        if (!isUndefined(base)) {
          attr.base[opt] = base;
        }
        if (!isUndefined(start)) {
          attr.start[opt] = start;
        }
        if (!isUndefined(end)) {
          attr.end[opt] = end;
        }
      });
      config.attr = attr;
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

  mergeTargets(to, from) {
    const config = {};
    defaultsDeep(config, to, from);
    // Combine target classes together
    if (to.class && from.class && !to.class.includes(from.class)) {
      config.class = `${to.class} ${from.class}`;
    }
    return config;
  }

  // Normalizes attribute config to the structure defined by the properties
  normalizeAttr({ config, type }) {
    let rootColor = this.color;
    let root = {};
    // Get the normalized root config
    const normAttr = this.normalizedAttrs[type].attr;
    if (config === true || isString(config)) {
      // Assign default color for booleans or strings
      rootColor = isString(config) ? config : rootColor;
      // Set the default root
      root = { ...normAttr };
    } else if (isObject(config)) {
      if (hasAny(config, targetProps)) {
        // Mixin target configs
        root = { ...config };
      } else {
        // Mixin display configs
        root = {
          base: { ...config },
          start: { ...config },
          end: { ...config },
        };
      }
    } else {
      return null;
    }
    // Fill in missing targets
    defaults(root, { start: root.startEnd, end: root.startEnd }, normAttr);
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
      // Fill in missing options
      root[targetType] = this.mergeTargets(
        root[targetType],
        normAttr[targetType],
      );
      // Set the theme color if it is missing
      if (!has(root, `${targetType}.color`)) {
        set(root, `${targetType}.color`, targetColor);
      }
    });
    return root;
  }

  normalizeHighlight(config) {
    const highlight = this.normalizeAttr({
      config,
      type: 'highlight',
    });
    toPairs(highlight).forEach(([_, targetConfig]) => {
      const c = defaults(targetConfig, {
        isDark: this.isDark,
        color: this.color,
      });
      if (!c.class) {
        targetConfig.style = this.getHighlightBgStyle(c);
      }
      if (!c.contentClass) {
        targetConfig.contentStyle = this.getHighlightContentStyle(c);
      }
    });
    return highlight;
  }

  getHighlightBgStyle({ fillMode, color, isDark }) {
    switch (fillMode) {
      case 'none':
        return {
          backgroundColor: isDark ? 'var(--gray-900)' : 'var(--white)',
          border: '2px solid',
          borderColor: isDark ? `var(--${color}-200)` : `var(--${color}-700)`,
          borderRadius: 'var(--rounded-full)',
        };
      case 'light':
        return {
          backgroundColor: isDark
            ? `var(--${color}-800`
            : `var(--${color}-200)`,
          opacity: isDark ? 0.75 : 1,
          borderRadius: 'var(--rounded-full)',
        };
      case 'solid':
        return {
          backgroundColor: isDark
            ? `var(--${color}-500)`
            : `var(--${color}-600)`,
          borderRadius: 'var(--rounded-full)',
        };
      default:
        return null;
    }
  }

  getHighlightContentStyle({ fillMode, color, isDark }) {
    switch (fillMode) {
      case 'none':
        return {
          fontWeight: 'var(--font-bold)',
          color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`,
        };
      case 'light':
        return {
          fontWeight: 'var(--font-bold)',
          color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`,
        };
      case 'solid':
        return {
          fontWeight: 'var(--font-bold)',
          color: 'var(--white)',
        };
      default:
        return '';
    }
  }

  bgAccentHigh({ color, isDark }) {
    return {
      backgroundColor: isDark ? `var(--${color}-500)` : `var(--${color}-600)`,
    };
  }

  contentAccent({ color, isDark }) {
    return {
      fontWeight: 'var(--font-bold)',
      color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`,
    };
  }

  normalizeDot(config) {
    return this.normalizeNonHighlight('dot', config, this.bgAccentHigh);
  }

  normalizeBar(config) {
    return this.normalizeNonHighlight('bar', config, this.bgAccentHigh);
  }

  normalizeContent(config) {
    return this.normalizeNonHighlight('content', config, this.contentAccent);
  }

  normalizeNonHighlight(type, config, styleFn) {
    const attr = this.normalizeAttr({ type, config });
    toPairs(attr).forEach(([_, targetConfig]) => {
      defaults(targetConfig, { isDark: this.isDark, color: this.color });
      if (!targetConfig.class) {
        targetConfig.style = styleFn(targetConfig);
      }
    });
    return attr;
  }
}
