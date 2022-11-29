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
  }

  existsOnDay(dayIndex: number, ctx: AttributeContext) {
    return ctx.cellExists(this.key, dayIndex);
  }

  render(ctx: AttributeContext) {
    this.ranges.forEach(range => {
      ctx.render(this, range);
    });
  }
}

export class AttributeContext extends DateRangeContext<Attribute> {}

export type AttributeCell = DateRangeCell<Attribute>;
