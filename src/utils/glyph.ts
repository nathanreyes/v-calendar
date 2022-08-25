import { Attribute } from './attribute';
import { DateInfoDayContext } from './dateInfo';
import { isObject, isString, hasAny, toPairs, defaults } from './_';

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

export interface Glyph {
  key: string | number;
  color: string;
  class: string | any[];
  style: Record<string, any>;
}

export interface GlyphProfile<G extends Partial<Glyph>> {
  start: G;
  base: G;
  end: G;
  startEnd?: G;
}

// Highlights
export type HighlightFillMode = 'solid' | 'light' | 'outline';
export interface Highlight extends Glyph {
  fillMode: HighlightFillMode;
  contentClass: string;
  contentStyle: Record<string, any>;
}
export type HighlightProfile = GlyphProfile<Highlight>;
export type HighlightConfig =
  | boolean
  | string
  | Partial<Highlight | HighlightProfile>;

// Dots
export type Dot = Glyph;
export type DotProfile = GlyphProfile<Dot>;
export type DotConfig = boolean | string | Partial<Dot | DotProfile>;

// Bars
export type Bar = Glyph;
export type BarProfile = GlyphProfile<Bar>;
export type BarConfig = boolean | string | Partial<Bar | BarProfile>;

// Content
export type Content = Glyph;
export type ContentProfile = GlyphProfile<Content>;
export type ContentConfig = string | Partial<Content | ContentProfile>;

const _defaultProfile = { base: {}, start: {}, end: {} };

function normalizeConfig<G>(
  color: string,
  config: any,
  defaultProfile: any = _defaultProfile,
): GlyphProfile<G> {
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
  const result = root as GlyphProfile<G>;
  // Fill in missing targets
  defaults(
    result,
    { start: root.startEnd, end: root.startEnd },
    defaultProfile,
  );
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
    // @ts-ignore
    defaults(result[targetType], { color: targetColor });
  });
  return result;
}

export interface GlyphRenderer<P> {
  type: string;
  normalizeConfig(color: string, config: any): GlyphProfile<P>;
  prepareRender(glyphs: Record<string, Glyph[]>): void;
  render(
    attr: Attribute,
    ctx: DateInfoDayContext,
    glyphs: Record<string, Glyph[]>,
  ): void;
}

export class HighlightRenderer implements GlyphRenderer<Highlight> {
  type = 'highlight';

  normalizeConfig(color: string, config: any) {
    return normalizeConfig(color, config, {
      base: { fillMode: 'light' },
      start: { fillMode: 'solid' },
      end: { fillMode: 'solid' },
    }) as HighlightProfile;
  }

  prepareRender(glyphs: Record<string, Glyph[]>) {
    glyphs.highlights = [];
    if (!glyphs.content) glyphs.content = [];
  }

  render(
    attr: Attribute,
    {
      isDate,
      hasRecurrence,
      onStart,
      onEnd,
      onStartAndEnd,
    }: DateInfoDayContext,
    glyphs: Record<string, Glyph[]>,
  ) {
    const { key, highlight } = attr;
    if (!highlight) return;
    const { highlights, content } = glyphs;
    const { base, start, end } = highlight;
    if (isDate || onStartAndEnd || hasRecurrence) {
      highlights.push({
        key,
        color: start.color,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${start.color}`,
        class: [`vc-highlight vc-highlight-bg-${start.fillMode}`, start.class],
        style: start.style,
      });
      content.push({
        key: `${key}-content`,
        color: start.color,
        class: [
          `vc-attr vc-highlight-content-${start.fillMode} vc-${start.color}`,
          start.contentClass,
        ],
        style: start.contentStyle,
      });
    } else if (onStart) {
      highlights.push({
        key: `${key}-base`,
        color: base.color,
        wrapperClass: `vc-day-layer vc-day-box-right-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-start vc-highlight-bg-${base.fillMode}`,
          base.class,
        ],
        style: base.style,
      });
      highlights.push({
        key,
        color: start.color,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${start.color}`,
        class: [`vc-highlight vc-highlight-bg-${start.fillMode}`, start.class],
        style: start.style,
      });
      content.push({
        key: `${key}-content`,
        color: start.color,
        class: [
          `vc-attr vc-highlight-content-${start.fillMode} vc-${start.color}`,
          start.contentClass,
        ],
        style: start.contentStyle,
      });
    } else if (onEnd) {
      highlights.push({
        key: `${key}-base`,
        wrapperClass: `vc-day-layer vc-day-box-left-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-end vc-highlight-bg-${base.fillMode}`,
          base.class,
        ],
        style: base.style,
      });
      highlights.push({
        key,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${end.color}`,
        class: [`vc-highlight vc-highlight-bg-${end.fillMode}`, end.class],
        style: end.style,
      });
      content.push({
        key: `${key}-content`,
        color: end.color,
        class: [
          `vc-attr vc-highlight-content-${end.fillMode} vc-${end.color}`,
          end.contentClass,
        ],
        style: end.contentStyle,
      });
    } else {
      highlights.push({
        key: `${key}-middle`,
        color: base.color,
        wrapperClass: `vc-day-layer vc-day-box-center-center vc-attr vc-${base.color}`,
        class: [
          `vc-highlight vc-highlight-base-middle vc-highlight-bg-${base.fillMode}`,
          base.class,
        ],
        style: base.style,
      });
      content.push({
        key: `${key}-content`,
        color: base.color,
        class: [
          `vc-attr vc-highlight-content-${base.fillMode} vc-${base.color}`,
          base.contentClass,
        ],
        style: base.contentStyle,
      });
    }
  }
}

export class BaseRenderer<T> implements GlyphRenderer<T> {
  type = '';
  collectionType = '';

  constructor(type: string, collectionType: string) {
    this.type = type;
    this.collectionType = collectionType;
  }

  normalizeConfig(color: string, config: any) {
    return normalizeConfig(color, config) as GlyphProfile<T>;
  }

  prepareRender(glyphs: Record<string, Glyph[]>) {
    glyphs[this.collectionType] = [];
  }

  render(
    attr: Attribute,
    { isDate, onStart, onEnd }: DateInfoDayContext,
    glyphs: Record<string, Glyph[]>,
  ) {
    const { key } = attr;
    const item = attr[this.type as keyof Attribute];
    if (!key || !item) return;
    const collection = glyphs[this.collectionType];
    const { base, start, end } = item;
    if (isDate || onStart) {
      collection.push({
        key,
        color: start.color,
        class: [
          `vc-${this.type} vc-${this.type}-start vc-${start.color} vc-attr`,
          start.class,
        ],
        style: start.style,
      });
    } else if (onEnd) {
      collection.push({
        key,
        color: end.color,
        class: [
          `vc-${this.type} vc-${this.type}-end vc-${end.color} vc-attr`,
          end.class,
        ],
        style: end.style,
      });
    } else {
      collection.push({
        key,
        color: base.color,
        class: [
          `vc-${this.type} vc-${this.type}-base vc-${base.color} vc-attr`,
          base.class,
        ],
        style: base.style,
      });
    }
  }
}

export class ContentRenderer extends BaseRenderer<Content> {
  constructor() {
    super('content', 'content');
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
