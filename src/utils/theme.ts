import { isObject, isString, has, hasAny, set, toPairs, defaults } from './_';
import {
  GlyphConfig,
  HighlightConfig,
  HighlightProfile,
  Glyph,
  GlyphProfile,
} from './attribute';
type ThemeAttributeType = 'highlight' | 'dot' | 'bar' | 'content';
type GlyphTarget = 'base' | 'start' | 'end' | 'startEnd';
type ThemeProp =
  | 'class'
  | 'contentClass'
  | 'style'
  | 'contentStyle'
  | 'color'
  | 'fillMode';

const targetProps: GlyphTarget[] = ['base', 'start', 'end', 'startEnd'];
const displayProps: ThemeProp[] = [
  'class',
  'contentClass',
  'style',
  'contentStyle',
  'color',
  'fillMode',
];

export default class Theme {
  color = '';
  isDark = false;
  highlight: Glyph<Partial<HighlightProfile>> = {
    base: { fillMode: 'light' },
    start: { fillMode: 'solid' },
    end: { fillMode: 'solid' },
  };
  dot: Glyph<Partial<GlyphProfile>> = {
    base: {},
    start: {},
    end: {},
  };
  bar: Glyph<Partial<GlyphProfile>> = {
    base: {},
    start: {},
    end: {},
  };
  content: Glyph<Partial<GlyphProfile>> = {
    base: {},
    start: {},
    end: {},
  };

  constructor(config: any) {
    Object.assign(this, config);
  }

  normalizeHighlight(config: HighlightConfig) {
    const highlight = this.normalizeGlyph<HighlightProfile>(
      'highlight',
      config,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toPairs(highlight).forEach(([_, targetConfig]) => {
      const c = defaults(targetConfig, {
        isDark: this.isDark,
        color: this.color,
        fillMode: '',
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

  getHighlightBgStyle({
    fillMode,
    color,
    isDark,
  }: {
    fillMode: string;
    color: string;
    isDark: boolean;
  }) {
    switch (fillMode) {
      case 'outline':
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
        return {
          borderRadius: 'var(--rounded-full)',
        };
    }
  }

  getHighlightContentStyle({
    fillMode,
    color,
    isDark,
  }: {
    fillMode: string;
    color: string;
    isDark: boolean;
  }) {
    switch (fillMode) {
      case 'outline':
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

  bgAccentHigh({ color, isDark }: { color: string; isDark: boolean }) {
    return {
      backgroundColor: isDark ? `var(--${color}-500)` : `var(--${color}-600)`,
    };
  }

  contentAccent({ color, isDark }: { color: string; isDark: boolean }) {
    if (!color) return null;
    return {
      fontWeight: 'var(--font-bold)',
      color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`,
    };
  }

  normalizeDot(config: GlyphConfig) {
    return this.normalizeGlyph('dot', config, this.bgAccentHigh);
  }

  normalizeBar(config: GlyphConfig) {
    return this.normalizeGlyph('bar', config, this.bgAccentHigh);
  }

  normalizeContent(config: GlyphConfig) {
    return this.normalizeGlyph('content', config, this.contentAccent);
  }

  normalizeGlyph<T extends GlyphProfile>(
    type: ThemeAttributeType,
    config: GlyphConfig,
    styleFn: Function | undefined = undefined,
  ): Glyph<T> {
    let rootColor = this.color;
    let root: any = {};
    // Get the normalized root config
    const normAttr = this[type];
    if (config === true || isString(config)) {
      // Assign default color for booleans or strings
      rootColor = isString(config) ? config : rootColor;
      // Set the default root
      root = { ...normAttr };
    } else if (isObject(config)) {
      if (hasAny(config as Record<string, any>, targetProps)) {
        // Mixin target configs
        root = { ...config };
      } else {
        // Mixin display configs
        root = {
          base: { ...(config as Record<string, any>) },
          start: { ...(config as Record<string, any>) },
          end: { ...(config as Record<string, any>) },
        };
      }
    }
    const result = root as Glyph<T>;
    // Fill in missing targets
    defaults(result, { start: root.startEnd, end: root.startEnd }, normAttr);
    // Normalize each target
    toPairs(result).forEach(([targetType, targetConfig]) => {
      let targetColor = rootColor;
      if (targetConfig === true || isString(targetConfig)) {
        targetColor = isString(targetConfig) ? targetConfig : targetColor;
        // @ts-ignore
        result[targetType as GlyphTarget] = { color: targetColor };
      } else if (isObject(targetConfig)) {
        if (hasAny(targetConfig, displayProps)) {
          // @ts-ignore
          result[targetType] = { ...targetConfig };
        } else {
          // @ts-ignore
          result[targetType] = {};
        }
      }
      // Set the theme color if it is missing
      if (!has(result, `${targetType}.color`)) {
        set(result, `${targetType}.color`, targetColor);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toPairs(result).forEach(([_, targetConfig]) => {
      defaults(targetConfig, { isDark: this.isDark, color: this.color });
      targetConfig.style = {
        ...(styleFn && styleFn(targetConfig)),
        ...targetConfig.style,
      };
    });
    return result;
  }
}
