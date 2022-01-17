import {
  default as DateInfo,
  DateInfoSource,
  DateInfoOptions,
} from './dateInfo';
import { arrayHasItems, createGuid } from './helpers';
import { PopoverVisibility } from './popovers';
import { isUndefined } from './_';
import Theme from './theme';
import Locale, { CalendarDay } from './locale';
import { Placement } from '@popperjs/core';

export type HighlightFillMode = 'solid' | 'light' | 'outline';

export interface Glyph<T> {
  start: T;
  base: T;
  end: T;
  startEnd?: T;
}

export interface GlyphProfile {
  color: string;
  class: string;
  style: Record<string, any>;
}

export interface HighlightProfile extends GlyphProfile {
  fillMode: HighlightFillMode;
  contentClass: string;
  contentStyle: Record<string, any>;
}

export type Highlight = Glyph<HighlightProfile>;

export type HighlightConfig =
  | boolean
  | string
  | Partial<HighlightProfile | Glyph<HighlightProfile>>;

export type GlyphConfig =
  | boolean
  | string
  | Partial<GlyphProfile | Glyph<GlyphProfile>>;

export type Content = Glyph<GlyphProfile>;
export type Dot = Glyph<GlyphProfile>;
export type Bar = Glyph<GlyphProfile>;

export type PopoverConfig = Partial<{
  label: string;
  customData: any;
  visibility: PopoverVisibility;
  placement: Placement;
  hideIndicator: boolean;
  isInteractive: boolean;
}>;

export type EventConfig = Partial<{
  label: string;
}>;

export type ExcludeMode = 'intersects' | 'includes';

export interface DayAttribute extends Partial<Attribute> {
  dayId: string;
  dayDates: DateInfo[];
}

export interface AttributeConfig {
  key: string | number;
  hashcode: string;
  highlight: HighlightConfig;
  content: GlyphConfig;
  dot: GlyphConfig;
  bar: GlyphConfig;
  popover: PopoverConfig;
  event: EventConfig;
  dates: DateInfo[];
  excludeDates: DateInfo[];
  excludeMode: ExcludeMode;
  customData: any;
  order: number;
  pinPage: boolean;
}

export class Attribute {
  key: string | number = '';
  hashcode = '';
  highlight: Highlight | null = null;
  content: Content | null = null;
  dot: Dot | null = null;
  bar: Bar | null = null;
  event: EventConfig | null = null;
  popover: PopoverConfig | null = null;
  customData: any = null;
  dates: DateInfo[];
  hasDates = false;
  excludeDates: DateInfo[];
  hasExcludeDates = false;
  excludeMode: ExcludeMode = 'intersects';
  order = 0;
  pinPage = false;
  dateOpts: Partial<DateInfoOptions>;

  constructor(
    {
      key,
      hashcode = '',
      highlight,
      content,
      dot,
      bar,
      popover,
      event,
      dates,
      excludeDates,
      excludeMode,
      customData,
      order = 0,
      pinPage = false,
    }: Partial<AttributeConfig>,
    theme: Theme,
    locale: Locale,
  ) {
    this.key = isUndefined(key) ? createGuid() : key;
    this.hashcode = hashcode;
    this.customData = customData;
    this.order = order || 0;
    this.dateOpts = { order, firstDayOfWeek: locale.firstDayOfWeek };
    this.pinPage = pinPage;
    // Normalize attribute types
    if (highlight) {
      this.highlight = theme.normalizeHighlight(highlight);
    }
    if (content) {
      this.content = theme.normalizeContent(content);
    }
    if (dot) {
      this.dot = theme.normalizeDot(dot);
    }
    if (bar) {
      this.bar = theme.normalizeBar(bar);
    }
    if (event) {
      this.event = event;
    }
    if (popover) {
      this.popover = popover;
    }
    // Assign dates
    this.dates = locale.normalizeDates(dates, this.dateOpts);
    this.hasDates = !!arrayHasItems(this.dates);
    // Assign exclude dates
    this.excludeDates = locale.normalizeDates(excludeDates, this.dateOpts);
    this.hasExcludeDates = !!arrayHasItems(this.excludeDates);
    if (excludeMode) this.excludeMode = excludeMode;
    // Add infinite date range if excluded dates exist
    if (this.hasExcludeDates && !this.hasDates) {
      this.dates.push(DateInfo.from({}, this.dateOpts));
      this.hasDates = true;
    }
  }

  // Accepts: Date or date range object
  // Returns: First date that partially intersects the given date
  intersectsDate(date: DateInfoSource) {
    const dateInfo = DateInfo.from(date, this.dateOpts);
    return (
      !this.excludesDate(dateInfo) &&
      (this.dates.find(d => d.intersectsDate(dateInfo)) || false)
    );
  }

  // Accepts: Date or date range object
  // Returns: First date that completely includes the given date
  includesDate(date: DateInfoSource) {
    const dateInfo = DateInfo.from(date, this.dateOpts);
    return (
      !this.excludesDate(dateInfo) &&
      (this.dates.find(d => d.includesDate(dateInfo)) || false)
    );
  }

  excludesDate(date: DateInfoSource) {
    const dateInfo = DateInfo.from(date, this.dateOpts);
    return (
      this.hasExcludeDates &&
      this.excludeDates.find(
        ed =>
          (this.excludeMode === 'intersects' && ed.intersectsDate(dateInfo)) ||
          (this.excludeMode === 'includes' && ed.includesDate(dateInfo)),
      )
    );
  }

  // Accepts: Day object
  // Returns: First attribute date info that occurs on given day.
  intersectsDay(day: CalendarDay) {
    return (
      !this.excludesDay(day) &&
      (this.dates.find(d => d.intersectsDay(day)) || false)
    );
  }

  getDayDates(day: CalendarDay) {
    if (this.excludesDay(day)) return [];
    return this.dates.filter(d => d.intersectsDay(day));
  }

  excludesDay(day: CalendarDay) {
    return (
      this.hasExcludeDates &&
      this.excludeDates.find(ed => ed.intersectsDay(day))
    );
  }
}
