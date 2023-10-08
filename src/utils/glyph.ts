import { Attribute } from './attribute';
import type { DateRangeCell } from './date/range';
import { defaultsDeep, hasAny, isObject, isString } from './helpers';

type GlyphTarget = 'base' | 'start' | 'end' | 'startEnd';
type ThemeProp =
  | 'class'
  | 'wrapperClass'
  | 'contentClass'
  | 'style'
  | 'contentStyle'
  | 'color'
  | 'fillMode';

const targetProps: GlyphTarget[] = ['base', 'start', 'end', 'startEnd'];
const displayProps: ThemeProp[] = [
  'class',
  'wrapperClass',
  'contentClass',
  'style',
  'contentStyle',
  'color',
  'fillMode',
];

export interface Glyph {
  key: string | number;
  color: string;
  class: string | any[];
  style: Record<string, any>;
}

export interface Profile<T> {
  start: T;
  base: T;
  end: T;
  startEnd?: T;
}

// Highlights
export type HighlightFillMode = 'solid' | 'light' | 'outline';
export interface Highlight extends Glyph {
  fillMode: HighlightFillMode;
  wrapperClass: string | any[];
  contentClass: string | any[];
  contentStyle: Record<string, any>;
}
export type HighlightConfig =
  | boolean
  | string
  | Partial<Highlight | Profile<Partial<Highlight>>>;

// Dots
export type Dot = Glyph;
export type DotConfig = boolean | string | Partial<Dot | Profile<Partial<Dot>>>;

// Bars
export type Bar = Glyph;
export type BarConfig = boolean | string | Partial<Bar | Profile<Partial<Bar>>>;

// Content
export type Content = Glyph;
export type ContentConfig =
  | string
  | Partial<Content | Profile<Partial<Content>>>;

const _defaultProfile = { base: {}, start: {}, end: {} };

function normalizeConfig(
  color: string,
  config: any,
  defaultProfile: any = _defaultProfile,
): Profile<Glyph> {
  let rootColor = color;
  let root: any = {};
  // Get the normalized root config
  if (config === true || isString(config)) {
    // Assign default color for booleans or strings
    rootColor = isString(config) ? config : rootColor;
    // Set the default root
    root = { ...defaultProfile };
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
  // Fill in missing targets
  const result = defaultsDeep(
    root,
    { start: root.startEnd, end: root.startEnd },
    defaultProfile,
  ) as Profile<any>;
  // Normalize each target
  Object.entries(result).forEach(([targetType, targetConfig]) => {
    let targetColor = rootColor;
    if (targetConfig === true || isString(targetConfig)) {
      targetColor = isString(targetConfig) ? targetConfig : targetColor;
      // @ts-ignore
      result[targetType] = { color: targetColor };
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
    // @ts-ignore
    defaultsDeep(result[targetType], { color: targetColor });
  });
  return result;
}

export interface GlyphRenderer<P extends Partial<Glyph>> {
  type: string;
  normalizeConfig(color: string, config: any): Profile<P>;
  prepareRender(glyphs: Record<string, P[]>): void;
  render(attr: DateRangeCell<Attribute>, glyphs: Record<string, P[]>): void;
}

export class HighlightRenderer implements GlyphRenderer<Highlight> {
  type = 'highlight';

  normalizeConfig(color: string, config: any) {
    return normalizeConfig(color, config, {
      base: { fillMode: 'light' },
      start: { fillMode: 'solid' },
      end: { fillMode: 'solid' },
    }) as Profile<Highlight>;
  }

  prepareRender(glyphs: Record<string, Glyph[]>) {
    glyphs.highlights = [];
    if (!glyphs.content) glyphs.content = [];
  }

  render(
    { data, onStart, onEnd }: DateRangeCell<Attribute>,
    glyphs: Record<string, Highlight[]>,
  ) {
    const { key, highlight } = data;
    if (!highlight) return;
    const { highlights } = glyphs;
    const { base, start, end } = highlight;
    if (onStart && onEnd) {
      highlights.push({
        ...start,
        key,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${start.color}`,
        class: [`vc-highlight vc-highlight-bg-${start.fillMode}`, start.class],
        contentClass: [
          `vc-attr vc-highlight-content-${start.fillMode} vc-${start.color}`,
          start.contentClass,
        ],
      });
    } else if (onStart) {
      highlights.push({
        ...base,
        key: `${key}-base`,
        wrapperClass: `vc-day-layer vc-day-box-right-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-start vc-highlight-bg-${base.fillMode}`,
          base.class,
        ],
      });
      highlights.push({
        ...start,
        key,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${start.color}`,
        class: [`vc-highlight vc-highlight-bg-${start.fillMode}`, start.class],
        contentClass: [
          `vc-attr vc-highlight-content-${start.fillMode} vc-${start.color}`,
          start.contentClass,
        ],
      });
    } else if (onEnd) {
      highlights.push({
        ...base,
        key: `${key}-base`,
        wrapperClass: `vc-day-layer vc-day-box-left-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-end vc-highlight-bg-${base.fillMode}`,
          base.class,
        ],
      });
      highlights.push({
        ...end,
        key,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${end.color}`,
        class: [`vc-highlight vc-highlight-bg-${end.fillMode}`, end.class],
        contentClass: [
          `vc-attr vc-highlight-content-${end.fillMode} vc-${end.color}`,
          end.contentClass,
        ],
      });
    } else {
      highlights.push({
        ...base,
        key: `${key}-middle`,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-middle vc-highlight-bg-${base.fillMode}`,
          base.class,
        ],
        contentClass: [
          `vc-attr vc-highlight-content-${base.fillMode} vc-${base.color}`,
          base.contentClass,
        ],
      });
    }
  }
}

export class BaseRenderer<T extends Partial<Glyph>>
  implements GlyphRenderer<T>
{
  type = '';
  collectionType = '';

  constructor(type: string, collectionType: string) {
    this.type = type;
    this.collectionType = collectionType;
  }

  normalizeConfig(color: string, config: any) {
    return normalizeConfig(color, config) as Profile<T>;
  }

  prepareRender(glyphs: Record<string, T[]>) {
    glyphs[this.collectionType] = [];
  }

  render(
    { data, onStart, onEnd }: DateRangeCell<Attribute>,
    glyphs: Record<string, T[]>,
  ) {
    const { key } = data;
    const item = data[this.type as keyof Attribute];
    if (!key || !item) {
      return;
    }
    const collection = glyphs[this.collectionType];
    const { base, start, end } = item;
    if (onStart) {
      collection.push({
        ...start,
        key,
        class: [
          `vc-${this.type} vc-${this.type}-start vc-${start.color} vc-attr`,
          start.class,
        ],
      });
    } else if (onEnd) {
      collection.push({
        ...end,
        key,
        class: [
          `vc-${this.type} vc-${this.type}-end vc-${end.color} vc-attr`,
          end.class,
        ],
      });
    } else {
      collection.push({
        ...base,
        key,
        class: [
          `vc-${this.type} vc-${this.type}-base vc-${base.color} vc-attr`,
          base.class,
        ],
      });
    }
  }
}

export class ContentRenderer extends BaseRenderer<Content> {
  constructor() {
    super('content', 'content');
  }

  normalizeConfig(_: string, config: any) {
    return normalizeConfig('base', config) as Profile<Content>;
  }
}

export class DotRenderer extends BaseRenderer<Dot> {
  constructor() {
    super('dot', 'dots');
  }
}

export class BarRenderer extends BaseRenderer<Dot> {
  constructor() {
    super('bar', 'bars');
  }
}
