import { Placement } from '@popperjs/core';
import DateInfo, { DateInfoSource, DateInfoOptions } from './dateInfo';
import { arrayHasItems, createGuid, extend } from './helpers';
import { PopoverVisibility } from './popovers';
import { CalendarDay } from './page';
import { Theme } from '../use/theme';
import Locale from './locale';

import {
  ContentConfig,
  HighlightConfig,
  DotConfig,
  BarConfig,
  ContentProfile,
  HighlightProfile,
  DotProfile,
  BarProfile,
} from './glyph';

export interface GlyphProfile {
  color: string;
  class: string;
  style: Record<string, any>;
}

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

export type DayAttribute = ReturnType<typeof createDayAttribute>;

export function createDayAttribute(
  day: CalendarDay,
  dayDate: DateInfo,
  attribute: Attribute,
) {
  const dayContext = dayDate.getDayContext(day);
  return extend(attribute, { dayId: day.id, dayDate, dayContext });
}

export interface AttributeConfig {
  key: string | number;
  hashcode: string;
  content: ContentConfig;
  highlight: HighlightConfig;
  dot: DotConfig;
  bar: BarConfig;
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
  highlight: HighlightProfile | null = null;
  content: ContentProfile | null = null;
  dot: DotProfile | null = null;
  bar: BarProfile | null = null;
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

  constructor(config: Partial<AttributeConfig>, theme: Theme, locale: Locale) {
    const { order, dates, excludeDates, excludeMode } = Object.assign(
      this,
      { hashcode: '', order: 0, pinPage: false },
      config,
    );
    if (!this.key) this.key = createGuid();
    this.dateOpts = { order, firstDayOfWeek: locale.firstDayOfWeek };
    // Normalize attribute
    theme.normalizeGlyphs(this);
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
