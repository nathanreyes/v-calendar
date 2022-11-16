import { DateRecurrence, DateRecurrenceConfig } from './dateRecurrence';
import {
  DateSource,
  DateParts,
  DayParts,
  DayOfWeek,
  getDateParts,
  isDateSource,
  normalizeDate,
  addDays,
} from './dates';

type DateRangeDate = {
  date?: DateSource;
  dateTime?: DateSource;
  timezone?: string;
};

interface DateRangeConfig {
  start: DateSource | DateRangeDate | null;
  end: DateSource | DateRangeDate | null;
  span: number;
  repeats: Partial<DateRecurrenceConfig>;
}

export type DateRangeSource = DateRange | DateSource | Partial<DateRangeConfig>;

export interface DateRangeOptions {
  order: number;
  firstDayOfWeek: DayOfWeek;
  timezone: string;
}

function getPartsFromDateRangeSource(
  source: DateSource | DateRangeDate,
  opts: Partial<DateRangeOptions>,
) {
  let date = new Date();
  if (isDateSource(source)) {
    date = normalizeDate(source as DateSource, {
      ...opts,
      timezone: opts.timezone,
    });
  } else {
    const di = source as DateRangeDate;
    date = normalizeDate((di.dateTime || di.date)!, {
      ...opts,
      timezone: di.timezone ?? opts.timezone,
    });
  }
  return getDateParts(date, opts.firstDayOfWeek!, opts.timezone);
}

export default class DateRange {
  order: number;
  firstDayOfWeek: DayOfWeek;
  timezone: string | undefined = undefined;
  start: DateParts | null = null;
  end: DateParts | null = null;
  recurrence: DateRecurrence | null = null;

  static from(source: DateRangeSource, opts: Partial<DateRangeOptions> = {}) {
    if (source instanceof DateRange) return source;
    const config: Partial<DateRangeConfig> = {
      start: null,
      end: null,
    };
    if (isDateSource(source)) {
      config.start = source as DateSource;
      config.end = source as DateSource;
    } else if (source != null) {
      Object.assign(config, source);
    }
    return new DateRange(config, opts);
  }

  private constructor(
    config: Partial<DateRangeConfig>,
    {
      order = 0,
      firstDayOfWeek = 1,
      timezone = undefined,
    }: Partial<DateRangeOptions>,
  ) {
    this.order = order;
    this.firstDayOfWeek = firstDayOfWeek;
    this.timezone = timezone;

    const { start, end, span, repeats } = config;

    if (start) {
      this.start = getPartsFromDateRangeSource(start, this.opts);
    }

    if (end) {
      this.end = getPartsFromDateRangeSource(end, this.opts);
    } else if (this.start && span) {
      this.end = getPartsFromDateRangeSource(
        addDays(this.start.date, span),
        this.opts,
      );
    }

    if (repeats) {
      this.recurrence = new DateRecurrence({
        fromDate: this.start?.date,
        ...repeats,
        firstDayOfWeek: this.firstDayOfWeek,
      });
    }
  }

  from(date: DateRangeSource) {
    return DateRange.from(date, this.opts);
  }

  get opts() {
    const { order, firstDayOfWeek, timezone } = this;
    return { order, firstDayOfWeek, timezone };
  }

  get hasRecurrence() {
    return !!this.recurrence;
  }

  get isSingleDay() {
    const { start, end } = this;
    return (
      start &&
      end &&
      start.year === end.year &&
      start.month === end.month &&
      start.day === end.day
    );
  }

  get isMultiDay() {
    return !this.isSingleDay;
  }

  get daySpan() {
    if (this.start == null || this.end == null) return Infinity;
  }

  startsOnDay(dayParts: DayParts) {
    return (
      this.start?.dayIndex === dayParts.dayIndex ||
      !!this.recurrence?.passes(dayParts)
    );
  }

  intersectsDay(dayIndex: number) {
    if (this.start && this.start.dayIndex > dayIndex) return false;
    if (this.end && this.end.dayIndex < dayIndex) return false;
    return true;
  }
}
