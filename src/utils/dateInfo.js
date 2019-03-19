import { mixinOptionalProps } from './helpers';
import { isDate, isObject, isArray, isFunction } from './_';

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default class DateInfo {
  constructor(config, { order = 0, locale, parseFormat }) {
    this.isDateInfo = true;
    this.isRange = isObject(config) || isFunction(config);
    this.isDate = !this.isRange;
    this.order = order;
    this.locale = locale;
    this.toDate = locale.toDate;
    this.getMonthComps = locale.getMonthComps;
    this.firstDayOfWeek = locale.firstDayOfWeek;
    this.opts = { order, locale, parseFormat };
    // Process date
    if (this.isDate) {
      this.type = 'date';
      // Initialize date from config
      let date = this.toDate(config, parseFormat);
      // Can't accept invalid dates
      date = isDate(date) ? date : new Date();
      // Strip date time
      // date.setHours(0, 0, 0, 0);
      // date.setUTCHours(0, 0, 0, 0);
      // Assign date
      this.date = date;
      this.dateTime = date.setHours(0, 0, 0, 0) && date.getTime();
    }
    // Process date range
    if (this.isRange) {
      this.type = 'range';
      // Date config is a function
      if (isFunction(config)) {
        this.on = { and: config };
        // Date config is an object
      } else {
        // Initialize start and end dates (null means infinity)
        let start = this.toDate(config.start);
        let end = this.toDate(config.end);
        // Reconfigure start and end dates if needed
        if (start && end && start > end) {
          const temp = start;
          start = end;
          end = temp;
        } else if (start && config.span >= 1) {
          end = addDays(start, config.span - 1);
        }
        // Reset invalid dates to null and strip times for valid dates
        if (start) {
          if (!isDate(start)) start = null;
          // else start.setHours(0, 0, 0, 0);
          // else start.setUTCHours(0, 0, 0, 0);
        }
        if (end) {
          if (!isDate(end)) end = null;
          // else end.setHours(0, 0, 0, 0);
          // else end.setUTCHours(0, 0, 0, 0);
        }
        // Assign start and end dates
        this.start = start;
        this.end = end;
        this.startTime = start && start.setHours(0, 0, 0, 0) && start.getTime();
        this.endTime = end && end.setHours(0, 0, 0, 0) && end.getTime();
        // Assign spans
        if (start && end) {
          this.daySpan = this.diffInDays(start, end);
          this.weekSpan = this.diffInWeeks(start, end);
          this.monthSpan = this.diffInMonths(start, end);
          this.yearSpan = this.diffInYears(start, end);
        }
        // Assign 'and' condition
        const andOpt = mixinOptionalProps(config, {}, DateInfo.patternProps);
        if (andOpt.assigned) {
          this.on = { and: andOpt.target };
        }
        // Assign 'or' conditions
        if (config.on) {
          const or = (isArray(config.on) ? config.on : [config.on])
            .map(o => {
              if (isFunction(o)) return o;
              const opt = mixinOptionalProps(o, {}, DateInfo.patternProps);
              return opt.assigned ? opt.target : null;
            })
            .filter(o => o);
          if (or.length) this.on = { ...this.on, or };
        }
      }
      // Assign flag if date is complex
      this.isComplex = !!this.on;
    }
  }

  // Returns a date range that intersects two DateInfo objects
  // NOTE: This is a shallow calculation (does not take patterns into account),
  //   so this method should only really be called for special conditions
  //   where absolute accuracy is not necessarily needed
  static findShallowIntersectingRange(date1, date2) {
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
        // Otherwise, use the earliest start date
        start = thisRange.start < otherRange.start
            ? thisRange.start
            : otherRange.start;
      }
      // Other start date exists
    } else if (otherRange.start) {
      // Use other definite start date as this one is infinite
      start = otherRange.start;
    }
    // Assign end date to this one if it is valid
    if (thisRange.end && (!start || thisRange.end >= start)) {
      end = thisRange.end;
    }
    // Assign end date to other one if it is valid and before this one
    if (otherRange.end && (!start || otherRange.end >= start)) {
      if (!end || otherRange.end < end) end = otherRange.end;
    }
    // Return calculated range
    return { start, end };
  }

  getDayFromDate(date) {
    if (!date) return null;
    const month = date.getMonth() + 1;
    const year = date.getUTCFullYear();
    const comps = this.getMonthComps(month, year);
    const day = date.getDate();
    const dayFromEnd = comps.days - day + 1;
    const weekday = date.getDay() + 1;
    const weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
    const weekdayOrdinalFromEnd = Math.floor((comps.days - day) / 7 + 1);
    const week = Math.ceil(
      (day + Math.abs(comps.firstWeekday - comps.firstDayOfWeek)) / 7,
    );
    const weekFromEnd = comps.weeks - week + 1;
    return {
      day,
      dayFromEnd,
      weekday,
      weekdayOrdinal,
      weekdayOrdinalFromEnd,
      week,
      weekFromEnd,
      month,
      year,
      date,
      dateTime: date.getTime(),
    };
  }

  startOfWeek(date) {
    const day = date.getDay() + 1;
    const daysToAdd = day >= this.firstDayOfWeek
        ? this.firstDayOfWeek - day
        : -(7 - (this.firstDayOfWeek - day));
    return addDays(date, daysToAdd);
  }

  diffInDays(d1, d2) {
    return Math.round((d2 - d1) / millisecondsPerDay);
  }

  diffInWeeks(d1, d2) {
    return this.diffInDays(this.startOfWeek(d1), this.startOfWeek(d2));
  }

  diffInYears(d1, d2) {
    return d2.getUTCFullYear() - d1.getUTCFullYear();
  }

  diffInMonths(d1, d2) {
    return this.diffInYears(d1, d2) * 12 + (d2.getMonth() - d1.getMonth());
  }

  static get patterns() {
    return {
      dailyInterval: {
        test: (day, interval, di) => di.diffInDays(di.start || new Date(), day.date) % interval === 0,
      },
      weeklyInterval: {
        test: (day, interval, di) => di.diffInWeeks(di.start || new Date(), day.date) % interval === 0,
      },
      monthlyInterval: {
        test: (day, interval, di) => di.diffInMonths(di.start || new Date(), day.date) % interval === 0,
      },
      yearlyInterval: {
        test: () => (day, interval, di) => di.diffInYears(di.start || new Date(), day.date) % interval === 0,
      },
      days: {
        validate: days => (isArray(days) ? days : [parseInt(days, 10)]),
        test: (day, days) => days.includes(day.day) || days.includes(-day.dayFromEnd),
      },
      weekdays: {
        validate: weekdays => isArray(weekdays) ? weekdays : [parseInt(weekdays, 10)],
        test: (day, weekdays) => weekdays.includes(day.weekday),
      },
      ordinalWeekdays: {
        validate: ordinalWeekdays => Object.keys(ordinalWeekdays).reduce((obj, ck) => {
            const weekdays = ordinalWeekdays[ck];
            if (!weekdays) return obj;
            obj[ck] = isArray(weekdays) ? weekdays : [parseInt(weekdays, 10)];
            return obj;
          }, {}),
        test: (day, ordinalWeekdays) => Object.keys(ordinalWeekdays)
            .map(k => parseInt(k, 10))
            .find(
              k => ordinalWeekdays[k].includes(day.weekday)
                && (k === day.weekdayOrdinal || k === -day.weekdayOrdinalFromEnd),
            ),
      },
      weekends: {
        validate: config => config,
        test: day => day.weekday === 1 || day.weekday === 7,
      },
      workweek: {
        validate: config => config,
        test: day => day.weekday >= 2 && day.weekday <= 6,
      },
      weeks: {
        validate: weeks => (isArray(weeks) ? weeks : [parseInt(weeks, 10)]),
        test: (day, weeks) => weeks.includes(day.week) || weeks.includes(-day.weekFromEnd),
      },
      months: {
        validate: months => (isArray(months) ? months : [parseInt(months, 10)]),
        test: (day, months) => months.includes(day.month),
      },
      years: {
        validate: years => (isArray(years) ? years : [parseInt(years, 10)]),
        test: (day, years) => years.includes(day.year),
      },
    };
  }

  static get patternProps() {
    return Object.keys(DateInfo.patterns).map(k => ({
      name: k,
      validate: DateInfo.patterns[k].validate,
    }));
  }

  static testConfig(config, day, dateInfo) {
    if (isFunction(config)) return config(day);
    if (isObject(config)) {
      return Object.keys(config).every(k => DateInfo.patterns[k].test(day, config[k], dateInfo),
      );
    }
    return null;
  }

  iterateDatesInRange({ start, end }, func) {
    if (!start || !end || !isFunction(func)) return null;
    const state = {
      i: 0,
      date: start,
      day: this.getDayFromDate(start),
      finished: false,
    };
    let result = null;
    for (; !state.finished && state.date <= end; state.i++) {
      result = func(state);
      state.date = addDays(state.date, 1);
      state.day = this.getDayFromDate(state.date);
    }
    return result;
  }

  // ========================================================
  // Determines if this date partially intersects another date
  // NOTE: This is a deep test (patterns tested)
  intersectsDate(other) {
    const date = other.isDateInfo ? other : new DateInfo(other, this.opts);
    if (!this.shallowIntersectsDate(date)) return null;
    if (!this.on) return this;
    const range = this.findShallowIntersectingRange(this, date);
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
  shallowIntersectsDate(other) {
    return dateShallowIntersectsDate(
      this,
      other.isDate ? other : new DateInfo(other, this.opts),
    );
  }

  // ========================================================
  // Determines if first date partially intersects second date
  // NOTE: This is a shallow test (no patterns tested)
  dateShallowIntersectsDate(date1, date2) {
    if (date1.isDate) return date2.isDate
        ? date1.dateTime === date2.dateTime
        : dateShallowIncludesDate(date2, date1);
    if (date2.isDate) return dateShallowIncludesDate(date1, date2);
    // Both ranges
    if (date1.start && date2.end && date1.start > date2.end) return false;
    if (date1.end && date2.start && date1.end < date2.start) return false;
    return true;
  }

  // ========================================================
  // Determines if this date completely includes another date
  // NOTE: This is a deep test (patterns tested)
  includesDate(other) {
    const date = other.isDateInfo ? other : new DateInfo(other, this.opts);
    if (!this.shallowIncludesDate(date)) return false;
    if (!this.on) return true;
    const range = this.findShallowIntersectingRange(this, date);
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
  shallowIncludesDate(other) {
    return this.dateShallowIncludesDate(
      this,
      other.isDate ? other : new DateInfo(other, this.opts),
    );
  }

  // ========================================================
  // Determines if first date completely includes second date
  // NOTE: This is a shallow test (no patterns tested)
  dateShallowIncludesDate(date1, date2) {
    // First date is simple date
    if (date1.isDate) {
      if (date2.isDate) return date1.dateTime === date2.dateTime;
      if (!date2.startTime || !date2.endTime) return false;
      return (
        date1.dateTime === date2.startTime && date1.dateTime === date2.endTime
      );
    }
    // Second date is simple date and first is date range
    if (date2.isDate) {
      if (date1.start && date2.date < date1.start) return false;
      if (date1.end && date2.date > date1.end) return false;
      return true;
    }
    // Both dates are date ranges
    if (date1.start && (!date2.start || date2.start < date1.start)) return false;
    if (date1.end && (!date2.end || date2.end > date1.end)) return false;
    return true;
  }

  includesDay(day) {
    // Date is outside general range - return null
    if (!this.shallowIncludesDate(day.date)) return null;
    // Return this date if patterns match
    return this.matchesDay(day) ? this : null;
  }

  matchesDay(day) {
    // No patterns to test
    if (!this.on) return true;
    // Fail if 'and' condition fails
    if (this.on.and && !DateInfo.testConfig(this.on.and, day, this)) return false;
    // Fail if every 'or' condition fails
    if (
      this.on.or
      && !this.on.or.some(or => DateInfo.testConfig(or, day, this))
    ) return false;
    // Patterns match
    return true;
  }

  toRange() {
    if (this.isDate) {
      return new DateInfo(
        {
          start: this.date,
          end: this.date,
        },
        this.opts,
      );
    }
    return DateInfo(
      {
        start: this.start,
        end: this.end,
      },
      this.opts,
    );
  }

  // Build the 'compare to other' function
  compare(other) {
    if (this.order !== other.order) return this.order - other.order;
    if (this.type !== other.type) return this.isDate ? 1 : -1;
    if (this.isDate) return 0;
    const diff = this.start - other.start;
    return diff !== 0 ? diff : this.end - other.end;
  }
}
