import {
  default as DateInfo,
  DateInfoSource,
  DateInfoOptions,
} from './dateInfo';
import { arrayHasItems, createGuid } from './helpers';
import { PopoverVisibility } from './popovers';
import { isUndefined } from './_';
import Theme from './theme';
import Locale from './locale';

export type HighlightFillMode = 'solid' | 'light' | 'outline';
export type HighlightConfig =
  | boolean
  | string
  | Partial<{
      color: string;
      class: string;
      style: Record<string, any>;
      fillMode: HighlightFillMode;
      contentClass: string;
      contentStyle: Record<string, any>;
    }>;

export type ContentConfig =
  | boolean
  | string
  | Partial<{
      color: string;
      class: string;
      style: Record<string, any>;
    }>;

export type DotConfig =
  | boolean
  | string
  | Partial<{
      color: string;
      class: string;
      style: Record<string, any>;
    }>;

export type BarConfig =
  | boolean
  | string
  | Partial<{
      color: string;
      class: string;
      style: Record<string, any>;
    }>;

export type PopoverConfig = Partial<{
  label: string;
  visibility: PopoverVisibility;
  hideIndicator: boolean;
}>;

export type EventConfig = Partial<{
  label: string;
}>;

export type ExcludeMode = 'intersects' | 'includes';

export interface AttributeConfig {
  key: string | number;
  hashcode: string;
  highlight: HighlightConfig;
  content: ContentConfig;
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

export default class Attribute {
  key: string | number = '';
  hashcode = '';
  highlight: HighlightConfig | null = null;
  content: ContentConfig | null = null;
  dot: DotConfig | null = null;
  bar: BarConfig | null = null;
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
  dateOpts: DateInfoOptions;

  constructor(
    {
      key,
      hashcode,
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
      order,
      pinPage,
    }: AttributeConfig,
    theme: Theme,
    locale: Locale,
  ) {
    this.key = isUndefined(key) ? createGuid() : key;
    this.hashcode = hashcode;
    this.customData = customData;
    this.event = event;
    this.order = order || 0;
    this.dateOpts = { order, locale };
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
  intersectsDay(day) {
    return (
      !this.excludesDay(day) &&
      (this.dates.find(d => d.intersectsDay(day)) || false)
    );
  }

  excludesDay(day) {
    return (
      this.hasExcludeDates &&
      this.excludeDates.find(ed => ed.intersectsDay(day))
    );
  }
}
