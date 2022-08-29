import { reactive, Ref } from 'vue';
import { DayAttribute } from '../utils/attribute';
import { DateInfoDayContext } from '../utils/dateInfo';
import {
  GlyphRenderer,
  Glyph,
  ContentRenderer,
  HighlightRenderer,
  DotRenderer,
  BarRenderer,
} from '../utils/glyph';
import { DarkModeConfig, useDarkMode } from './darkMode';

export interface ThemeConfig {
  color?: string;
  isDark?: DarkModeConfig;
}

export type Glyphs = Record<string, Glyph[]>;

export interface Theme {
  color: string;
  displayMode: string;
  normalizeGlyphs(attr: DayAttribute): void;
  prepareRender(glyphs: Glyphs): Glyphs;
  render(attr: DayAttribute, ctx: DateInfoDayContext, glyphs: Glyphs): void;
}

export function useTheme(
  color: Ref<string>,
  isDark: Ref<DarkModeConfig>,
): Theme {
  const { displayMode } = useDarkMode(isDark);

  const renderers: GlyphRenderer<Glyph>[] = [
    new ContentRenderer(),
    new HighlightRenderer(),
    new DotRenderer(),
    new BarRenderer(),
  ];

  function normalizeGlyphs(attr: DayAttribute) {
    renderers.forEach(renderer => {
      const type = renderer.type as keyof DayAttribute;
      if (attr.hasOwnProperty(type) && attr[type] != null) {
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

  function render(attr: DayAttribute, ctx: DateInfoDayContext, glyphs: Glyphs) {
    renderers.forEach(renderer => {
      renderer.render(attr, ctx, glyphs);
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
