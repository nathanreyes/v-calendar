import { reactive, Ref } from 'vue';
import { Attribute, DayAttribute } from '../utils/attribute';
import { DarkModeConfig, useDarkMode } from 'vue-screen-utils';
import {
  GlyphRenderer,
  Glyph,
  ContentRenderer,
  HighlightRenderer,
  DotRenderer,
  BarRenderer,
} from '../utils/glyph';

export type Glyphs = Record<string, Glyph[]>;

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
      if (attr.hasOwnProperty(type) && attr[type] != null) {
        // @ts-ignore
        attr[type] = renderer.normalizeConfig(color.value, attr[type]);
      }
    });
  }

  function prepareRender(glyphs: Glyphs = {}) {
    renderers.forEach(renderer => {
      renderer.prepareRender(glyphs);
    });
    return glyphs;
  }

  function render(attr: DayAttribute, glyphs: Glyphs) {
    renderers.forEach(renderer => {
      renderer.render(attr, glyphs);
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
