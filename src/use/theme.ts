import { reactive, Ref } from 'vue';
import { Attribute } from '../utils/attribute';
import { DarkModeConfig, useDarkMode } from 'vue-screen-utils';
import { DateRangeCell } from '@/utils/date/range';
import {
  GlyphRenderer,
  Glyph,
  ContentRenderer,
  HighlightRenderer,
  DotRenderer,
  BarRenderer,
  Highlight,
  Dot,
  Bar,
  Content,
} from '../utils/glyph';

export interface Glyphs {
  highlights: Highlight[];
  dots: Dot[];
  bars: Bar[];
  content: Content[];
}

export type Theme = ReturnType<typeof useTheme>;

export function useTheme(color: Ref<string>, isDark: Ref<DarkModeConfig>) {
  const { displayMode } = useDarkMode(isDark);

  const renderers: GlyphRenderer<Glyph>[] = [
    new ContentRenderer(),
    new HighlightRenderer(),
    new DotRenderer(),
    new BarRenderer(),
  ];

  function normalizeGlyphs(attr: Attribute) {
    renderers.forEach(renderer => {
      const type = renderer.type as keyof Attribute;
      if (attr[type] != null) {
        // @ts-ignore
        attr[type] = renderer.normalizeConfig(color.value, attr[type]);
      }
    });
  }

  function prepareRender(glyphs: Partial<Glyphs> = {}) {
    renderers.forEach(renderer => {
      renderer.prepareRender(glyphs);
    });
    return glyphs;
  }

  function render(cell: DateRangeCell<Attribute>, glyphs: Partial<Glyphs>) {
    renderers.forEach(renderer => {
      renderer.render(cell, glyphs);
    });
  }

  return reactive({
    color,
    displayMode,
    normalizeGlyphs,
    prepareRender,
    render,
  });
}
