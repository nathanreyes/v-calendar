import { DateRepeat, DateRepeatConfig } from './repeat';
import {
  DateParts,
  DayParts,
  DayOfWeek,
  getDateParts,
  addDays,
  MS_PER_DAY,
} from './helpers';
import { isDate, isArray } from '../helpers';

type DateRangeDate = Date | null;

interface DateRangeConfig {
  start: DateRangeDate;
  end: DateRangeDate;
  span: number;
  repeat: Partial<DateRepeatConfig>;
}

export type DateRangeSource =
  | DateRange
  | DateRangeDate
  | [DateRangeDate, DateRangeDate]
  | Partial<DateRangeConfig>;

export interface DateRangeOptions {
  order: number;
  firstDayOfWeek: DayOfWeek;
  timezone: string;
}

export interface SimpleDateRange {
  start: Date;
  end: Date;
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
    if (isDate(source)) {
      config.start = source;
      config.end = source;
    } else if (isArray(source)) {
      config.start = source[0] ?? null;
      config.end = source[1] ?? null;
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

    if (isDate(start)) {
      this.start = getDateParts(start, this.firstDayOfWeek, this.timezone);
    }

    if (isDate(end)) {
      this.end = getDateParts(end, this.firstDayOfWeek, this.timezone);
    } else if (this.start != null && span) {
      this.end = getDateParts(
        addDays(this.start.date, span - 1),
        this.firstDayOfWeek,
        this.timezone,
      );
    }

    if (repeat) {
      this.repeat = new DateRepeat(
        {
          from: this.start?.date,
          ...repeat,
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
    if (this.start == null || this.end == null) {
      if (this.hasRepeat) return 1;
      return Infinity;
    }
    return this.end.dayIndex - this.start.dayIndex;
  }

  startsOnDay(dayParts: DayParts) {
    return (
      this.start?.dayIndex === dayParts.dayIndex ||
      !!this.repeat?.passes(dayParts)
    );
  }

  intersectsDay(dayIndex: number) {
    return this.intersectsDayRange(dayIndex, dayIndex);
  }

  intersectsDayRange(startDayIndex: number, endDayIndex: number) {
    if (this.start && this.start.dayIndex > endDayIndex) return false;
    if (this.end && this.end.dayIndex < startDayIndex) return false;
    return true;
  }

  intersectsRange(range: DateRange) {
    return this.intersectsDayRange(
      range.start?.dayIndex ?? -Infinity,
      range.end?.dayIndex ?? Infinity,
    );
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

interface DataRanges {
  ranges: DataRange[];
  data: RangeData;
}

export interface DateRangeCell<T extends RangeData> extends DataRange {
  data: T;
  onStart: boolean;
  onEnd: boolean;
  dayStartTime: number;
  dayEndTime: number;
  order: number;
}

export class DateRangeContext {
  private records: Record<string, DataRanges> = {};

  render(data: RangeData, range: DateRange, days: DayParts[]) {
    let result = null;
    const startDayIndex = days[0].dayIndex;
    const endDayIndex = days[days.length - 1].dayIndex;
    if (range.hasRepeat) {
      days.forEach(day => {
        if (range.startsOnDay(day)) {
          const span = range.daySpan < Infinity ? range.daySpan : 1;
          result = {
            startDay: day.dayIndex,
            startTime: range.start?.time ?? 0,
            endDay: day.dayIndex + span - 1,
            endTime: range.end?.time ?? MS_PER_DAY,
          };
          this.getRangeRecords(data).push(result);
        }
      });
    } else if (range.intersectsDayRange(startDayIndex, endDayIndex)) {
      result = {
        startDay: range.start?.dayIndex ?? -Infinity,
        startTime: range.start?.time ?? -Infinity,
        endDay: range.end?.dayIndex ?? Infinity,
        endTime: range.end?.time ?? Infinity,
      };
      this.getRangeRecords(data).push(result);
    }
    return result;
  }

  private getRangeRecords(data: RangeData) {
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
    const result = cells.find(cell => cell.data.key === key);
    return result;
  }

  cellExists(key: string | number, dayIndex: number) {
    return !!this.getCell(key, dayIndex);
  }

  getCells(dayIndex: number) {
    const records = Object.values(this.records);
    const result: DateRangeCell<any>[] = [];
    records.forEach(({ data, ranges }) => {
      ranges
        .filter(r => r.startDay <= dayIndex && r.endDay >= dayIndex)
        .forEach(range => {
          const onStart = dayIndex === range.startDay;
          const onEnd = dayIndex === range.endDay;
          const dayStartTime = onStart ? range.startTime : 0;
          const dayEndTime = onEnd ? range.endTime : MS_PER_DAY;
          const order = data.order || 0;
          result.push({
            ...range,
            data,
            onStart,
            onEnd,
            dayStartTime,
            dayEndTime,
            order,
          });
        });
    });
    result.sort((a, b) => a.order - b.order);
    return result;
  }
}
