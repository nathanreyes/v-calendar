import { CalendarDay } from './locale';
import { DateRecurrence, DateRecurrenceConfig } from './dateRecurrence';
import {
  DateSource,
  DateOptions,
  DateParts,
  DayOfWeek,
  getDateParts,
  isDateSource,
  normalizeDate,
} from './dates';

interface DateConfig extends Partial<DateOptions> {
  date: DateSource;
}

interface DateInfoConfig<DateType> {
  start: DateType | null;
  end: DateType | null;
  span: number;
  recurrence: DateRecurrenceConfig;
}

export type DateInfoSource =
  | DateInfo
  | Partial<DateInfoConfig<DateSource | DateConfig>>
  | DateSource;

export interface DateInfoOptions {
  order: number;
  isAllDay: boolean;
  firstDayOfWeek: DayOfWeek;
}

export default class DateInfo {
  order: number;
  isAllDay: boolean;
  firstDayOfWeek: DayOfWeek;

  start: {
    date: Date;
    dateTime: number;
    parts: DateParts;
  } | null = null;

  end: {
    date: Date;
    dateTime: number;
    parts: DateParts;
  } | null = null;

  recurrence: DateRecurrence | null = null;

  static toDateConfig(source: DateConfig | DateSource | null): DateConfig {
    if ((source as DateConfig).date != null) return source as DateConfig;
    return {
      date: source as DateSource,
    };
  }

  static from(source: DateInfoSource, opts: Partial<DateInfoOptions> = {}) {
    if (source instanceof DateInfo) return source;
    opts.isAllDay = opts.isAllDay === false ? false : true;
    const config: Partial<DateInfoConfig<DateConfig>> = {
      start: null,
      end: null,
    };
    if (source != null) {
      if (isDateSource(source)) {
        config.start = {
          date: source as DateSource,
        };
        config.end = {
          date: source as DateSource,
        };
      } else {
        Object.assign(config, source);
      }
      if (config.start) config.start = this.toDateConfig(config.start);
      if (config.end) config.end = this.toDateConfig(config.end);
    }
    return new DateInfo(config, opts);
  }

  private constructor(
    config: Partial<DateInfoConfig<DateConfig>>,
    {
      order = 0,
      isAllDay = true,
      firstDayOfWeek = 1,
    }: Partial<DateInfoOptions>,
  ) {
    this.order = order;
    this.isAllDay = isAllDay;
    this.firstDayOfWeek = firstDayOfWeek;

    if (config.start) {
      const date = normalizeDate(config.start.date, config.start);
      const dateTime = date.getTime();
      const parts = getDateParts(date, firstDayOfWeek, config.start.timezone);
      this.start = {
        date,
        parts,
        dateTime,
      };
    }

    if (config.end) {
      const date = normalizeDate(config.end.date, config.end);
      const dateTime = date.getTime();
      const parts = getDateParts(date, firstDayOfWeek, config.end.timezone);
      this.end = {
        date,
        dateTime,
        parts,
      };
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
    const { order, isAllDay, firstDayOfWeek } = this;
    return { order, isAllDay, firstDayOfWeek };
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

  shallowIntersectingRange(other: DateInfo) {
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
    const thisRange = date1.toRange();
    const otherRange = date2.toRange();
    // Start with infinite start and end dates
    let start = null;
    let end = null;
    // This start date exists
    if (thisRange.start) {
      // Use this definite start date if other start date is infinite
      if (!otherRange.start) {
        start = thisRange.start;
      } else {
        // Otherwise, use the latest start date
        start =
          thisRange.start > otherRange.start
            ? thisRange.start
            : otherRange.start;
      }
      // Other start date exists
    } else if (otherRange.start) {
      // Use other definite start date as this one is infinite
      start = otherRange.start;
    }
    // This end date exists
    if (thisRange.end) {
      // Use this definite end date if other end date is infinite
      if (!otherRange.end) {
        end = thisRange.end;
      } else {
        // Otherwise, use the earliest end date
        end = thisRange.end < otherRange.end ? thisRange.end : otherRange.end;
      }
      // Other end date exists
    } else if (otherRange.end) {
      // Use other definite end date as this one is infinite
      end = otherRange.end;
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
    if (date1.start && date2.end && date1.start.dateTime > date2.end.dateTime) {
      return false;
    }
    if (date1.end && date2.start && date1.end.dateTime < date2.start.dateTime) {
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

  toRange() {
    return this.from({
      start: this.start,
      end: this.end,
    });
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
