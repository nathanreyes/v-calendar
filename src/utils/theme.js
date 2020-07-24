import { isObject, isString, has, hasAny, set, toPairs, defaults } from './_';

const targetProps = ['base', 'start', 'end', 'startEnd'];
const displayProps = ['class', 'style', 'color', 'fillMode'];
const defConfig = {
  color: 'blue',
  isDark: false,
  highlight: {
    base: { fillMode: 'light' },
    start: { fillMode: 'solid' },
    end: { fillMode: 'solid' },
  },
  dot: {
    base: { fillMode: 'solid' },
    start: { fillMode: 'solid' },
    end: { fillMode: 'solid' },
  },
  bar: {
    base: { fillMode: 'solid' },
    start: { fillMode: 'solid' },
    end: { fillMode: 'solid' },
  },
  content: {
    base: {},
    start: {},
    end: {},
  },
};

export default class Theme {
  constructor(config) {
    Object.assign(this, defConfig, config);
  }

  // Normalizes attribute config to the structure defined by the properties
  normalizeAttr({ config, type }) {
    let rootColor = this.color;
    let root = {};
    // Get the normalized root config
    const normAttr = this[type];
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
      targetConfig.style = {
        ...this.getHighlightBgStyle(c),
        ...targetConfig.style,
      };
      targetConfig.contentStyle = {
        ...this.getHighlightContentStyle(c),
        ...targetConfig.contentStyle,
      };
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
            ? `var(--${color}-800)`
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
      targetConfig.style = {
        ...styleFn(targetConfig),
        ...targetConfig.style,
      };
    });
    return attr;
  }
}
