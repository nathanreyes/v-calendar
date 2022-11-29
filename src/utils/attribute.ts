import { Placement } from '@popperjs/core';
import { DateRange, DateRangeSource, DateRangeOptions } from './date/range';
import { arrayHasItems, createGuid } from './helpers';
import { getDateParts, addDays } from './date/helpers';
import { PopoverVisibility } from './popovers';
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

export interface AttributeConfig {
  key: string | number;
  hashcode: string;
  content: ContentConfig;
  highlight: HighlightConfig;
  dot: DotConfig;
  bar: BarConfig;
  popover: PopoverConfig;
  event: EventConfig;
  dates: DateRangeSource[];
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
  ranges: DateRange[];
  hasRanges = false;
  order = 0;
  pinPage = false;
  dateOpts: Partial<DateRangeOptions>;
  maxRepeatSpan = 0;

  constructor(config: Partial<AttributeConfig>, theme: Theme, locale: Locale) {
    const { order, dates } = Object.assign(
      this,
      { hashcode: '', order: 0, pinPage: false },
      config,
    );
    if (!this.key) this.key = createGuid();
    this.dateOpts = { order, firstDayOfWeek: locale.firstDayOfWeek };
    // Normalize attribute
    theme.normalizeGlyphs(this);
    // Assign dates
    this.ranges = locale.getDateRanges(dates ?? [], this.dateOpts);
    this.hasRanges = !!arrayHasItems(this.ranges);
    this.maxRepeatSpan = this.ranges
      .filter(r => r.hasRepeat)
      .map(r => r.daySpan)
      .reduce((res, curr) => Math.max(res, curr), 0);
  }

  intersectsRange({ start, end }: DateRange) {
    if (start == null || end == null) return false;
    const simpleRanges = this.ranges.filter(r => !r.hasRepeat);
    for (const range of simpleRanges) {
      if (range.intersectsRange(start.dayIndex, end.dayIndex)) {
        return true;
      }
    }
    const repeatRanges = this.ranges.filter(r => r.hasRepeat);
    if (!repeatRanges.length) return false;
    const { timezone, firstDayOfWeek } = repeatRanges[0];
    let day = start;
    if (this.maxRepeatSpan > 1) {
      day = getDateParts(
        addDays(day.date, -this.maxRepeatSpan),
        firstDayOfWeek,
        timezone,
      );
    }
    while (day.dayIndex <= end.dayIndex) {
      for (const range of repeatRanges) {
        if (range.startsOnDay(day)) return true;
      }
      day = getDateParts(addDays(day.date, 1), firstDayOfWeek, timezone);
    }
    return false;
  }
}
