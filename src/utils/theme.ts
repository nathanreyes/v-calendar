import { Attribute } from './attribute';
import type { DateRangeCell } from '@/utils/date/range';
import {
  type Bar,
  type Content,
  type Dot,
  type GlyphRenderer,
  type Glyph,
  type Highlight,
  ContentRenderer,
  HighlightRenderer,
  DotRenderer,
  BarRenderer,
} from './glyph';

export interface Glyphs {
  highlights: Highlight[];
  dots: Dot[];
  bars: Bar[];
  content: Content[];
}

export class Theme {
  color: string;
  renderers: GlyphRenderer<Glyph>[] = [
    new ContentRenderer(),
    new HighlightRenderer(),
    new DotRenderer(),
    new BarRenderer(),
  ];

  constructor(color: string) {
    this.color = color;
  }

  normalizeGlyphs(attr: Attribute) {
    this.renderers.forEach(renderer => {
      const type = renderer.type as keyof Attribute;
      if (attr[type] != null) {
        // @ts-ignore
        attr[type] = renderer.normalizeConfig(this.color, attr[type]);
      }
    });
  }

  prepareRender(glyphs: Partial<Glyphs> = {}) {
    this.renderers.forEach(renderer => {
      renderer.prepareRender(glyphs);
    });
    return glyphs;
  }

  render(cell: DateRangeCell<Attribute>, glyphs: Partial<Glyphs>) {
    this.renderers.forEach(renderer => {
      renderer.render(cell, glyphs);
    });
  }
}
