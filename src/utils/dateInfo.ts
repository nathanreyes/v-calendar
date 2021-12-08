import { addDays } from 'date-fns';
import { isObject } from './_';
import Locale, { DateSource, CalendarDay } from './locale';
import { DateRecurrence, DateRecurrenceConfig } from './dateRecurrence';
import { DateParts, getDateParts } from './dates';

interface DateConfig {
  date: DateSource;
  dateTime: DateSource;
  timeZone?: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

interface DateInfoConfig {
  start: DateSource | null;
  end: DateSource | null;
  startOn: DateSource | null;
  endOn: DateSource | null;
  span: number;
  recurrence: DateRecurrenceConfig;
}

export type DateInfoSource = DateInfo | Partial<DateInfoConfig> | DateSource;

export interface DateInfoOptions {
  order: number;
  locale: Locale;
  isFullDay: boolean;
}

export default class DateInfo {
  isDateInfo = true;
  locale: Locale;
  order: number;
  firstDayOfWeek: number;
  isFullDay: boolean;

  start: Date | null;
  startTime: number;
  end: Date | null;
  endTime: number;

  recurrence: DateRecurrence | null = null;

  private constructor(
    config: DateInfoConfig,
    { order = 0, locale, isFullDay }: DateInfoOptions,
  ) {
    this.order = order;
    this.locale = locale;
    this.firstDayOfWeek = this.locale.firstDayOfWeek;
    this.isFullDay = isFullDay;

    let start = null;
    let end = null;
    if (config.start) {
      start = this.locale.normalizeDate(config.start, {
        ...this.opts,
        time: '00:00:00',
      });
    } else if (config.startOn) {
      start = this.locale.normalizeDate(config.startOn);
    }
    if (config.end) {
      end = this.locale.normalizeDate(config.end, {
        ...this.opts,
        time: '24:00:00',
      });
    } else if (config.endOn) {
      end = this.locale.normalizeDate(config.endOn);
    }

    // Reconfigure start and end dates if needed
    if (start && end && start > end) {
      const temp = start;
      start = end;
      end = temp;
    } else if (start && config.span && config.span >= 1) {
      end = addDays(start, config.span - 1);
    }

    // Assign start and end dates
    this.start = start;
    this.startTime = start ? start.getTime() : NaN;
    this.end = end;
    this.endTime = end ? end.getTime() : NaN;

    // Assign recurrence if needed
    if (config.recurrence) {
      this.recurrence = new DateRecurrence({
        // start: this.start,
        // until: this.end,
        ...config.recurrence,
        startOfWeek: this.locale.firstDayOfWeek,
      });
    }
  }

  static from(source: DateInfoSource, opts: Partial<DateInfoOptions> = {}) {
    if (source instanceof DateInfo) return source;

    const order = opts.order || 0;
    const locale =
      opts.locale instanceof Locale ? opts.locale : new Locale(opts.locale);
    const isFullDay = opts.isFullDay === false ? false : true;
    let config: Partial<DateRange> = {};
    if (isObject(source)) {
      config = source;
    } else {
      const date = locale.normalizeDate(source as DateSource);

      if (isFullDay) {
        config = {
          start: date,
          end: date,
        };
      } else {
        config = {
          startOn: date,
          endOn: date,
        };
      }
    }
    return new DateInfo(config, {
      order,
      locale,
      isFullDay,
    });
  }

  from(date: DateInfoSource) {
    return DateInfo.from(date, this.opts);
  }

  get opts() {
    return {
      order: this.order,
      locale: this.locale,
    };
  }

  get isDate() {
    return this.startTime && this.startTime === this.endTime;
  }

  get isRange() {
    return !this.isDate;
  }

  get hasRecurrence() {
    return !!this.recurrence;
  }

  startOfWeek(date: Date) {
    const day = date.getDay() + 1;
    const daysToAdd =
      day >= this.firstDayOfWeek
        ? this.firstDayOfWeek - day
        : -(7 - (this.firstDayOfWeek - day));
    return addDays(date, daysToAdd);
  }

  iterateDatesInRange({ start, end }, fn) {
    if (!start || !end || !fn) return null;
    start = this.locale.normalizeDate(start, {
      ...this.opts,
      time: '00:00:00',
    });
    const state = {
      i: 0,
      date: start,
      day: getDateParts(start, this.locale.timezone),
      finished: false,
    };
    let result = null;
    for (; !state.finished && state.date <= end; state.i++) {
      result = fn(state);
      state.date = addDays(state.date, 1);
      state.day = getDateParts(state.date, this.locale.timezone);
    }
    return result;
  }

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
    const range = this.rangeShallowIntersectingRange(this, date);
    let result = false;
    this.iterateDatesInRange(range, state => {
      if (this.matchesDay(state.day)) {
        result = result || date.matchesDay(state.day);
        state.finished = result;
      }
    });
    return result;
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
        ? date1.startTime === date2.startTime
        : this.dateShallowIncludesDate(date2, date1);
    }
    if (date2.isDate) {
      return this.dateShallowIncludesDate(date1, date2);
    }
    // Both ranges
    if (date1.start && date2.end && date1.start > date2.end) {
      return false;
    }
    if (date1.end && date2.start && date1.end < date2.start) {
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
    if (!this.recurrence) {
      return true;
    }
    const range = this.rangeShallowIntersectingRange(this, date);
    let result = true;
    this.iterateDatesInRange(range, state => {
      if (this.matchesDay(state.day)) {
        result = result && date.matchesDay(state.day);
        state.finished = !result;
      }
    });
    return result;
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
        return date1.startTime === date2.startTime;
      }
      if (!date2.startTime || !date2.endTime) {
        return false;
      }
      return (
        date1.startTime === date2.startTime && date1.startTime === date2.endTime
      );
    }
    // Second date is simple date and first is date range
    if (date2.isDate) {
      if (date1.start && date2.start! < date1.start) {
        return false;
      }
      if (date1.end && date2.start! > date1.end) {
        return false;
      }
      return true;
    }
    // Both dates are date ranges
    if (date1.start && (!date2.start || date2.start < date1.start)) {
      return false;
    }
    if (date1.end && (!date2.end || date2.end > date1.end)) {
      return false;
    }
    return true;
  }

  intersectsDay(day: CalendarDay) {
    // Date is outside general range - return null
    if (!this.shallowIntersectsDate(day.range)) return null;
    // Return this date if patterns match
    return this.matchesDay(day) ? this : null;
  }

  matchesDay(day: DateParts | CalendarDay) {
    // No patterns to test
    if (!this.recurrence) return true;
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
