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

interface DateInfoDate extends Partial<DateOptions> {
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
  | DateSource
  | Partial<DateInfoConfig<DateSource | DateInfoDate>>;

export interface DateInfoOptions {
  order: number;
  isAllDay: boolean;
  firstDayOfWeek: DayOfWeek;
}

export default class DateInfo {
  order: number;
  isAllDay: boolean;
  firstDayOfWeek: DayOfWeek;
  start: DateParts | null = null;
  end: DateParts | null = null;
  recurrence: DateRecurrence | null = null;

  static toDateInfoDate(
    source: DateInfoDate | DateSource | null | undefined,
  ): DateInfoDate | null {
    if (!source) return null;
    if ((source as DateInfoDate).date != null) return source as DateInfoDate;
    return {
      date: source as DateSource,
    };
  }

  static from(source: DateInfoSource, opts: Partial<DateInfoOptions> = {}) {
    if (source instanceof DateInfo) return source;
    opts.isAllDay = opts.isAllDay === false ? false : true;
    const config: Partial<DateInfoConfig<DateInfoDate>> = {
      start: null,
      end: null,
    };
    if (source != null) {
      const start = isDateSource(source)
        ? (source as DateSource)
        : (source as DateInfoConfig<DateSource>).start;
      const end = isDateSource(source)
        ? (source as DateSource)
        : (source as DateInfoConfig<DateSource>).end;
      config.start = this.toDateInfoDate(start);
      config.end = this.toDateInfoDate(end);
    }
    return new DateInfo(config, opts);
  }

  private constructor(
    config: Partial<DateInfoConfig<DateInfoDate>>,
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
      if (isAllDay) config.start.time = '00:00:00';
      const date = normalizeDate(config.start.date, config.start);
      this.start = getDateParts(date, firstDayOfWeek, config.start.timezone);
    }

    if (config.end) {
      if (isAllDay) config.end.time = '23:59:59.999';
      const date = normalizeDate(config.end.date, config.end);
      this.end = getDateParts(date, firstDayOfWeek, config.end.timezone);
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

  // Build the 'compare to other' function
  // compare(other: DateInfo) {
  //   if (this.order !== other.order) return this.order - other.order;
  //   if (this.isDate !== other.isDate) return this.isDate ? 1 : -1;
  //   if (this.isDate) return 0;
  //   const diff = this.start - other.start;
  //   return diff !== 0 ? diff : this.end - other.end;
  // }
}
