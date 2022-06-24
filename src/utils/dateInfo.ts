import { CalendarDay } from './locale';
import { DateRecurrence, DateRecurrenceConfig } from './dateRecurrence';
import {
  DateSource,
  DateParts,
  DayOfWeek,
  getDateParts,
  isDateSource,
  normalizeDate,
} from './dates';

type DateInfoDate = {
  date?: DateSource;
  dateTime?: DateSource;
  timezone?: string;
};

interface DateInfoConfig {
  start: DateSource | DateInfoDate | null;
  end: DateSource | DateInfoDate | null;
  span: number;
  isAllDay: boolean;
  recurrence: DateRecurrenceConfig;
}

export type DateInfoSource = DateInfo | DateSource | Partial<DateInfoConfig>;

export interface DateInfoOptions {
  order: number;
  firstDayOfWeek: DayOfWeek;
  timezone: string;
}

export default class DateInfo {
  order: number;
  firstDayOfWeek: DayOfWeek;
  timezone: string | undefined = undefined;
  start: DateParts | null = null;
  end: DateParts | null = null;
  recurrence: DateRecurrence | null = null;

  static from(source: DateInfoSource, opts: Partial<DateInfoOptions> = {}) {
    if (source instanceof DateInfo) return source;
    const config: Partial<DateInfoConfig> = {
      start: null,
      end: null,
    };
    if (isDateSource(source)) {
      config.start = source as DateSource;
      config.end = source as DateSource;
    } else if (source != null) {
      Object.assign(config, source);
    }
    return new DateInfo(config, opts);
  }

  static partsFromDateInfoSource(
    source: DateSource | DateInfoDate,
    isAllDay: boolean | undefined,
    isStart: boolean,
    opts: Partial<DateInfoOptions>,
  ) {
    let date = new Date();
    const time = isStart ? '00:00:00' : '23:59:59.999';
    if (isDateSource(source)) {
      date = normalizeDate(source as DateSource, {
        ...opts,
        time: isAllDay != null && !isAllDay ? undefined : time,
      });
    } else {
      const di = source as DateInfoDate;
      date = normalizeDate((di.dateTime || di.date)!, {
        ...opts,
        timezone: di.timezone ?? opts.timezone,
        time: isAllDay != null && isAllDay ? time : undefined,
      });
    }
    return getDateParts(date, opts.firstDayOfWeek!, opts.timezone);
  }

  private constructor(
    config: Partial<DateInfoConfig>,
    {
      order = 0,
      firstDayOfWeek = 1,
      timezone = undefined,
    }: Partial<DateInfoOptions>,
  ) {
    this.order = order;
    this.firstDayOfWeek = firstDayOfWeek;
    this.timezone = timezone;

    if (config.start) {
      this.start = DateInfo.partsFromDateInfoSource(
        config.start,
        config.isAllDay,
        true,
        this.opts,
      );
    }

    if (config.end) {
      this.end = DateInfo.partsFromDateInfoSource(
        config.end,
        config.isAllDay,
        false,
        this.opts,
      );
    }

    // Assign recurrence if needed
    if (config.recurrence) {
      this.recurrence = new DateRecurrence({
        // start: this.start,
        // until: this.end,
        ...config.recurrence,
        startOfWeek: this.firstDayOfWeek,
      });
    }
  }

  from(date: DateInfoSource) {
    return DateInfo.from(date, this.opts);
  }

  get opts() {
    const { order, firstDayOfWeek, timezone } = this;
    return { order, firstDayOfWeek, timezone };
  }

  get isDate() {
    return (
      !!this.start && !!this.end && this.start.dateTime === this.end.dateTime
    );
  }

  get isRange() {
    return !this.isDate;
  }

  get hasRecurrence() {
    return !!this.recurrence;
  }

  get isAllDay() {
    const { start, end } = this;
    if (start != null) {
      const { hours, minutes, seconds, milliseconds } = start;
      if (hours > 0 || minutes > 0 || seconds > 0 || milliseconds > 0)
        return false;
    }
    if (end != null) {
      const { hours, minutes, seconds, milliseconds } = end;
      if (hours < 23 || minutes < 59 || seconds < 59 || milliseconds < 999)
        return false;
    }
    return true;
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

  // iterateDatesInRange({ start, end }, fn) {
  //   if (!start || !end || !fn) return null;
  //   start = this.locale.normalizeDate(start, {
  //     ...this.opts,
  //     time: '00:00:00',
  //   });
  //   const state = {
  //     i: 0,
  //     date: start,
  //     day: getDateParts(start, this.locale.timezone),
  //     finished: false,
  //   };
  //   let result = null;
  //   for (; !state.finished && state.date <= end; state.i++) {
  //     result = fn(state);
  //     state.date = addDays(state.date, 1);
  //     state.day = getDateParts(state.date, this.locale.timezone);
  //   }
  //   return result;
  // }

  shallowIntersectingRange(other: DateInfoSource) {
    return this.rangeShallowIntersectingRange(this, this.from(other));
  }

  // Returns a date range that intersects two DateInfo objects
  // NOTE: This is a shallow calculation (does not take patterns into account),
  //   so this method should only really be called for special conditions
  //   where absolute accuracy is not necessarily needed
  rangeShallowIntersectingRange(date1: DateInfo, date2: DateInfo) {
    if (!this.dateShallowIntersectsDate(date1, date2)) {
      return null;
    }
    const start1 = date1.start?.date;
    const end1 = date1.end?.date;
    const start2 = date2.start?.date;
    const end2 = date2.end?.date;

    // Start with infinite start and end dates
    let start = null;
    let end = null;
    // This start date exists
    if (start1) {
      // Use this definite start date if other start date is infinite
      if (!start2) {
        start = start1;
      } else {
        // Otherwise, use the latest start date
        start = start1 > start2 ? start1 : start2;
      }
      // Other start date exists
    } else if (start2) {
      // Use other definite start date as this one is infinite
      start = start2;
    }
    // This end date exists
    if (end1) {
      // Use this definite end date if other end date is infinite
      if (!end2) {
        end = end1;
      } else {
        // Otherwise, use the earliest end date
        end = end1 < end2 ? end1 : end2;
      }
      // Other end date exists
    } else if (end2) {
      // Use other definite end date as this one is infinite
      end = end2;
    }
    // Return calculated range
    return { start, end };
  }

  // ========================================================
  // Determines if this date partially intersects another date
  // NOTE: This is a deep test (patterns tested)
  intersectsDate(other: DateInfo | DateSource) {
    const date = this.from(other);
    if (!this.shallowIntersectsDate(date)) return null;
    if (!this.recurrence) return this;
    // const range = this.rangeShallowIntersectingRange(this, date);
    // let result = false;
    // this.iterateDatesInRange(range, state => {
    //   if (this.matchesDay(state.day)) {
    //     result = result || date.matchesDay(state.day);
    //     state.finished = result;
    //   }
    // });
    // return result;
  }

  // ========================================================
  // Determines if this date partially intersects another date
  // NOTE: This is a shallow test (no patterns tested)
  shallowIntersectsDate(other: DateInfo) {
    return this.dateShallowIntersectsDate(this, this.from(other));
  }

  // ========================================================
  // Determines if first date partially intersects second date
  // NOTE: This is a shallow test (no patterns tested)
  dateShallowIntersectsDate(date1: DateInfo, date2: DateInfo) {
    if (date1.isDate) {
      return date2.isDate
        ? date1.start!.dateTime === date2.start!.dateTime
        : this.dateShallowIncludesDate(date2, date1);
    }
    if (date2.isDate) {
      return this.dateShallowIncludesDate(date1, date2);
    }
    // Both ranges
    if (
      date1.start &&
      date2.end &&
      date1.start.dateTime >= date2.end.dateTime
    ) {
      return false;
    }
    if (
      date1.end &&
      date2.start &&
      date1.end.dateTime <= date2.start.dateTime
    ) {
      return false;
    }
    return true;
  }

  // ========================================================
  // Determines if this date completely includes another date
  // NOTE: This is a deep test (patterns tested)
  includesDate(other: DateInfo | DateSource) {
    const date = this.from(other);
    if (!this.shallowIncludesDate(date)) {
      return false;
    }
    if (!this.recurrence) return true;
    // const range = this.rangeShallowIntersectingRange(this, date);
    // let result = true;
    // this.iterateDatesInRange(range, state => {
    //   if (this.matchesDay(state.day)) {
    //     result = result && date.matchesDay(state.day);
    //     state.finished = !result;
    //   }
    // });
    // return result;
  }

  // ========================================================
  // Determines if this date completely includes another date
  // NOTE: This is a shallow test (no patterns tested)
  shallowIncludesDate(other: DateInfo | DateSource) {
    return this.dateShallowIncludesDate(this, this.from(other));
  }

  // ========================================================
  // Determines if first date completely includes second date
  // NOTE: This is a shallow test (no patterns tested)
  dateShallowIncludesDate(date1: DateInfo, date2: DateInfo) {
    // First date is simple date
    if (date1.isDate) {
      if (date2.isDate) {
        return date1.start!.dateTime === date2.start!.dateTime;
      }
      if (!date2.start!.dateTime || !date2.end!.dateTime) {
        return false;
      }
      return (
        date1.start!.dateTime === date2.start!.dateTime &&
        date1.start!.dateTime === date2.end!.dateTime
      );
    }
    // Second date is simple date and first is date range
    if (date2.isDate) {
      if (date1.start && date2.start!.dateTime < date1.start!.dateTime) {
        return false;
      }
      if (date1.end && date2.start!.dateTime > date1.end!.dateTime) {
        return false;
      }
      return true;
    }
    // Both dates are date ranges
    if (
      date1.start &&
      (!date2.start || date2.start!.dateTime < date1.start!.dateTime)
    ) {
      return false;
    }
    if (
      date1.end &&
      (!date2.end || date2.end!.dateTime > date1.end!.dateTime)
    ) {
      return false;
    }
    return true;
  }

  intersectsDay(day: CalendarDay) {
    // Date is outside general range - return null
    if (!this.shallowIntersectsDate(this.from(day.range))) return null;
    // Return this date if patterns match
    return this.matchesDay(day) ? this : null;
  }

  matchesDay(day: DateParts | CalendarDay) {
    // No patterns to test
    if (!this.recurrence) return true;
    console.log('do something with', day);
    // // Fail if 'and' condition fails
    // if (
    //   this.recurrence.and &&
    //   !DateInfo.testConfig(this.recurrence.and, day, this)
    // ) {
    //   return false;
    // }
    // // Fail if every 'or' condition fails
    // if (
    //   this.on.or &&
    //   !this.on.or.some(or => DateInfo.testConfig(or, day, this))
    // ) {
    //   return false;
    // }
    // Patterns match
    return true;
  }

  // Build the 'compare to other' function
  // compare(other: DateInfo) {
  //   if (this.order !== other.order) return this.order - other.order;
  //   if (this.isDate !== other.isDate) return this.isDate ? 1 : -1;
  //   if (this.isDate) return 0;
  //   const diff = this.start - other.start;
  //   return diff !== 0 ? diff : this.end - other.end;
  // }
}
