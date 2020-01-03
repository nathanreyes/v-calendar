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
import defConfig from '@/utils/defaults/theme';

const targetProps = ['base', 'start', 'end', 'startEnd'];
const displayProps = ['class', 'color', 'fillMode'];

function concatClass(obj, prop, className) {
  if (!obj || !prop || !className) return;
  obj[prop] = `${obj[prop] ? `${obj[prop]} ` : ''}${className}`;
}

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

  getHighlightBgClass(fillMode, config = this._config) {
    switch (fillMode) {
      case 'none':
        return this.getConfig('bgLow', config);
      case 'light':
        return this.getConfig('bgAccentLow', config);
      case 'solid':
        return this.getConfig('bgAccentHigh', config);
      default:
        return '';
    }
  }

  getHighlightContentClass(fillMode, config = this._config) {
    switch (fillMode) {
      case 'none':
        return this.getConfig('contentAccent', config);
      case 'light':
        return this.getConfig('contentAccent', config);
      case 'solid':
        return this.getConfig('contentAccentContrast', config);
      default:
        return '';
    }
  }

  normalizeHighlight(config) {
    const highlight = this.normalizeAttr({
      config,
      type: 'highlight',
    });
    toPairs(highlight).forEach(([_, targetConfig]) => {
      const { fillMode } = defaults(targetConfig, {
        isDark: this.isDark,
        color: this.color,
      });
      concatClass(
        targetConfig,
        'class',
        this.getHighlightBgClass(fillMode, targetConfig),
      );
      concatClass(
        targetConfig,
        'contentClass',
        this.getHighlightContentClass(fillMode, targetConfig),
      );
    });
    return highlight;
  }

  normalizeDot(config) {
    const dot = this.normalizeAttr({
      config,
      type: 'dot',
    });
    toPairs(dot).forEach(([_, targetConfig]) => {
      defaults(targetConfig, { isDark: this.isDark, color: this.color });
      concatClass(
        targetConfig,
        'class',
        this.getConfig('bgAccentHigh', targetConfig),
      );
    });
    return dot;
  }

  normalizeBar(config) {
    const bar = this.normalizeAttr({
      config,
      type: 'bar',
    });
    toPairs(bar).forEach(([_, targetConfig]) => {
      defaults(targetConfig, { isDark: this.isDark, color: this.color });
      concatClass(
        targetConfig,
        'class',
        this.getConfig('bgAccentHigh', targetConfig),
      );
    });
    return bar;
  }

  normalizeContent(config) {
    const content = this.normalizeAttr({
      config,
      type: 'content',
    });
    toPairs(content).forEach(([_, targetConfig]) => {
      defaults(targetConfig, { isDark: this.isDark, color: this.color });
      concatClass(
        targetConfig,
        'class',
        this.getConfig('contentAccent', targetConfig),
      );
    });
    return content;
  }
}
