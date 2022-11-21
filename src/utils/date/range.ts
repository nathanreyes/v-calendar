import { DateRepeat, DateRepeatConfig } from './repeat';
import {
  DateSource,
  DateParts,
  DayParts,
  DayOfWeek,
  getDateParts,
  isDateSource,
  normalizeDate,
  addDays,
  MS_PER_DAY,
} from './helpers';
import { isArray } from '../helpers';

type DateRangeDate = {
  date?: DateSource;
  dateTime?: DateSource;
  timezone?: string;
};

interface DateRangeConfig {
  start: DateSource | DateRangeDate | null;
  end: DateSource | DateRangeDate | null;
  span: number;
  repeat: Partial<DateRepeatConfig>;
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

export class DateRange {
  order: number;
  firstDayOfWeek: DayOfWeek;
  timezone: string | undefined = undefined;
  start: DateParts | null = null;
  end: DateParts | null = null;
  repeat: DateRepeat | null = null;

  static fromMany(
    ranges: DateRangeSource | DateRangeSource[],
    opts: Partial<DateRangeOptions> = {},
  ) {
    // Assign dates
    return (isArray(ranges) ? ranges : [ranges])
      .filter(d => d)
      .map(d => DateRange.from(d, opts));
  }

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

    const { start, end, span, repeat } = config;

    if (start) {
      this.start = getPartsFromDateRangeSource(start, this.opts);
    }

    if (end) {
      this.end = getPartsFromDateRangeSource(end, this.opts);
    } else if (this.start && span) {
      this.end = getPartsFromDateRangeSource(
        addDays(this.start.date, span - 1),
        this.opts,
      );
    }

    if (repeat) {
      this.repeat = new DateRepeat(
        {
          ...repeat,
          from: this.start?.date,
        },
        {
          firstDayOfWeek: this.firstDayOfWeek,
          timezone: this.timezone,
        },
      );
    }
  }

  from(date: DateRangeSource) {
    return DateRange.from(date, this.opts);
  }

  get opts() {
    const { order, firstDayOfWeek, timezone } = this;
    return { order, firstDayOfWeek, timezone };
  }

  get hasRepeat() {
    return !!this.repeat;
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
    return this.end.dayIndex - this.start.dayIndex;
  }

  startsOnDay(dayParts: DayParts) {
    return (
      this.start?.dayIndex === dayParts.dayIndex ||
      !!this.repeat?.passes(dayParts)
    );
  }

  intersectsDay(dayIndex: number) {
    if (this.start && this.start.dayIndex > dayIndex) return false;
    if (this.end && this.end.dayIndex < dayIndex) return false;
    return true;
  }

  intersectsRange(startDayIndex: number, endDayIndex: number) {
    return true;
  }
}

interface DataRange {
  startDay: number;
  startTime: number;
  endDay: number;
  endTime: number;
}

export interface RangeData {
  key: string | number;
  order?: number;
}

interface DataRanges<T> {
  ranges: DataRange[];
  data: T;
}

export interface DateRangeCell<T> {
  data: T;
  onStart: boolean;
  onEnd: boolean;
  startTime: number;
  endTime: number;
  order: number;
}

export class DateRangeContext<T extends RangeData> {
  private records: Record<string, DataRanges<T>> = {};
  days: DayParts[];
  startDayIndex: number;
  endDayIndex: number;

  constructor(days: DayParts[]) {
    this.days = days;
    this.startDayIndex = this.days[0].dayIndex;
    this.endDayIndex = this.days[this.days.length - 1].dayIndex;
  }

  render(data: T, range: DateRange) {
    if (range.hasRepeat) {
      this.days.forEach(day => {
        if (range.startsOnDay(day)) {
          const span = range.daySpan < Infinity ? range.daySpan : 0;
          this.getRangeRecords(data).push({
            startDay: day.dayIndex,
            startTime: range.start?.time ?? 0,
            endDay: day.dayIndex + span,
            endTime: range.end?.time ?? MS_PER_DAY,
          });
        }
      });
    } else if (range.intersectsRange(this.startDayIndex, this.endDayIndex)) {
      this.getRangeRecords(data).push({
        startDay: range.start?.dayIndex ?? -Infinity,
        startTime: range.start?.time ?? -Infinity,
        endDay: range.end?.dayIndex ?? Infinity,
        endTime: range.end?.time ?? Infinity,
      });
    }
  }

  private getRangeRecords(data: T) {
    let record = this.records[data.key];
    if (!record) {
      record = {
        ranges: [],
        data,
      };
      this.records[data.key] = record;
    }
    return record.ranges;
  }

  getCell(key: string | number, dayIndex: number) {
    const cells = this.getCells(dayIndex);
    return cells.find(cell => cell.data.key === key);
  }

  cellExists(key: string | number, dayIndex: number) {
    return !!this.getCell(key, dayIndex);
  }

  getCellKeys(dayIndex: number) {
    return this.getCells(dayIndex).map(cell => cell.data.key);
  }

  getCells(dayIndex: number) {
    const records = Object.values(this.records);
    const result: DateRangeCell<T>[] = [];
    records.forEach(({ data, ranges }) => {
      ranges
        .filter(r => r.startDay <= dayIndex && r.endDay >= dayIndex)
        .forEach(range => {
          const onStart = dayIndex === range.startDay;
          const onEnd = dayIndex === range.endDay;
          const startTime = onStart ? range.startTime : 0;
          const endTime = onEnd ? range.endTime : MS_PER_DAY;
          const order = data.order || 0;
          result.push({ data, onStart, onEnd, startTime, endTime, order });
        });
    });
    result.sort((a, b) => a.order - b.order);
    return result;
  }
}
