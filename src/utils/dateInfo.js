import {
  isDate,
  isString,
  isNumber,
  isObject,
  isArray,
  isFunction,
} from './typeCheckers';
import defaults from './defaults';
import { mixinOptionalProps, getMonthComps } from './helpers';

const millisecondsPerDay = 24 * 60 * 60 * 1000;

// Returns a date range that intersects two date info objects
// NOTE: This is a shallow calculation (does not take patterns into account),
//   so this method should only really be called for special conditions
//   where absolute accuracy is not necessarily needed
function findShallowIntersectingRange(date1, date2) {
  const thisRange = date1.toRange();
  const otherRange = date2.toRange();
  // Start with infinite start and end dates
  let start = null;
  let end = null;
  // This start date exists
  if (thisRange.start) {
    // Use this definite start date if other start date is infinite
    if (!otherRange.start) start = thisRange.start;
    // Otherwise, use the earliest start date
    else start = thisRange.start < otherRange.start ? thisRange.start : otherRange.start;
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

// ========================================================
// Determines if first date completely includes second date
// NOTE: This is a shallow test (no patterns tested)
function dateShallowIncludesDate(date1, date2) {
  // First date is simple date
  if (date1.isDate) {
    if (date2.isDate) return date1.dateTime === date2.dateTime;
    if (!date2.startTime || !date2.endTime) return false;
    return date1.dateTime === date2.startTime && date1.dateTime === date2.endTime;
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
// ========================================================
// Determines if first date partially intersects second date
// NOTE: This is a shallow test (no patterns tested)
function dateShallowIntersectsDate(date1, date2) {
  if (date1.isDate) return date2.isDate ? date1.dateTime === date2.dateTime : dateShallowIncludesDate(date2, date1);
  if (date2.isDate) return dateShallowIncludesDate(date1, date2);
  // Both ranges
  if (date1.start && date2.end && date1.start > date2.end) return false;
  if (date1.end && date2.start && date1.end < date2.start) return false;
  return true;
}

export function getDayInfoFromDate(date) {
  if (!date) return null;
  const month = date.getMonth() + 1;
  const year = date.getUTCFullYear();
  const comps = getMonthComps(month, year);
  const day = date.getDate();
  const dayFromEnd = (comps.days - day) + 1;
  const weekday = date.getDay() + 1;
  const weekdayOrdinal = Math.floor(((day - 1) / 7) + 1);
  const weekdayOrdinalFromEnd = Math.floor(((comps.days - day) / 7) + 1);
  const week = Math.ceil((day + Math.abs(comps.firstWeekday - comps.firstDayOfWeek)) / 7);
  const weekFromEnd = (comps.weeks - week) + 1;
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

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function iterateDatesInRange({ start, end }, func) {
  if (!start || !end || !isFunction(func)) return null;
  const state = {
    i: 0,
    date: start,
    day: getDayInfoFromDate(start),
    finished: false,
  };
  let result = null;
  for (; !state.finished && state.date <= end; state.i++) {
    result = func(state);
    state.date = addDays(state.date, 1);
    state.day = getDayInfoFromDate(state.date);
  }
  return result;
}

function startOfWeek(date) {
  const day = date.getDay() + 1;
  const { firstDayOfWeek } = defaults;
  const daysToAdd = day >= firstDayOfWeek ? firstDayOfWeek - day : -(7 - (firstDayOfWeek - day));
  return addDays(date, daysToAdd);
}

function diffInDays(d1, d2) {
  return Math.round((d2 - d1) / millisecondsPerDay);
}

function diffInWeeks(d1, d2) {
  return diffInDays(startOfWeek(d1), startOfWeek(d2));
}

function diffInYears(d1, d2) {
  return d2.getUTCFullYear() - d1.getUTCFullYear();
}

function diffInMonths(d1, d2) {
  return (diffInYears(d1, d2) * 12) + (d2.getMonth() - d1.getMonth());
}

const _patterns = {
  dailyInterval: {
    test: (dayInfo, interval, { start }) => diffInDays(start || new Date(), dayInfo.date) % interval === 0,
  },
  weeklyInterval: {
    test: (dayInfo, interval, { start }) => diffInWeeks(start || new Date(), dayInfo.date) % interval === 0,
  },
  monthlyInterval: {
    test: (dayInfo, interval, { start }) => diffInMonths(start || new Date(), dayInfo.date) % interval === 0,
  },
  yearlyInterval: {
    test: () => (dayInfo, interval, { start }) => diffInYears(start || new Date(), dayInfo.date) % interval === 0,
  },
  days: {
    validate: days => (isArray(days) ? days : [parseInt(days, 10)]),
    test: (dayInfo, days) => days.includes(dayInfo.day) || days.includes(-dayInfo.dayFromEnd),
  },
  weekdays: {
    validate: weekdays => (isArray(weekdays) ? weekdays : [parseInt(weekdays, 10)]),
    test: (dayInfo, weekdays) => weekdays.includes(dayInfo.weekday),
  },
  ordinalWeekdays: {
    validate: ordinalWeekdays =>
      Object.keys(ordinalWeekdays)
        .reduce((obj, ck) => {
          const weekdays = ordinalWeekdays[ck];
          if (!weekdays) return obj;
          obj[ck] = isArray(weekdays) ? weekdays : [parseInt(weekdays, 10)];
          return obj;
        }, {}),
    test: (dayInfo, ordinalWeekdays) =>
      Object.keys(ordinalWeekdays)
        .map(k => parseInt(k, 10))
        .find(k =>
          ordinalWeekdays[k].includes(dayInfo.weekday) &&
          (k === dayInfo.weekdayOrdinal || k === -dayInfo.weekdayOrdinalFromEnd)),
  },
  weekends: {
    validate: config => config,
    test: dayInfo => dayInfo.weekday === 1 || dayInfo.weekday === 7,
  },
  workweek: {
    validate: config => config,
    test: dayInfo => dayInfo.weekday >= 2 && dayInfo.weekday <= 6,
  },
  weeks: {
    validate: weeks => (isArray(weeks) ? weeks : [parseInt(weeks, 10)]),
    test: (dayInfo, weeks) => weeks.includes(dayInfo.week) || weeks.includes(-dayInfo.weekFromEnd),
  },
  months: {
    validate: months => (isArray(months) ? months : [parseInt(months, 10)]),
    test: (dayInfo, months) => months.includes(dayInfo.month),
  },
  years: {
    validate: years => (isArray(years) ? years : [parseInt(years, 10)]),
    test: (dayInfo, years) => years.includes(dayInfo.year),
  },
};
const _patternProps = Object.keys(_patterns).map(k => ({ name: k, validate: _patterns[k].validate }));
const testConfig = (config, dayInfo, info) => {
  if (isFunction(config)) return config(dayInfo);
  if (isObject(config)) {
    return Object.keys(config).every(k => _patterns[k].test(dayInfo, config[k], info));
  }
  return null;
};

const DateInfo = (config, order) => {
  if (!config) return null;
  const info = {
    isDateInfo: true,
    isDate: isDate(config) || isString(config) || isNumber(config),
    isRange: isObject(config) || isFunction(config),
    order: order || 0,
  };
  // Process date
  if (info.isDate) {
    info.type = 'date';
    // Initialize date from config
    const date = new Date(config);
    // Can't accept invalid dates
    if (isNaN(date)) return null;
    // Strip date time
    date.setHours(0, 0, 0, 0);
    // Assign date
    info.date = date;
    info.dateTime = date.getTime();
  }
  // Process date range
  if (info.isRange) {
    info.type = 'range';
    // Date config is a function
    if (isFunction(config)) {
      info.on = { and: config };
    // Date config is an object
    } else {
      // Initialize start and end dates (null means infinity)
      let start = config.start && new Date(config.start);
      let end = config.end && new Date(config.end);
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
        if (isNaN(start.getTime())) start = null;
        else start.setHours(0, 0, 0, 0);
      }
      if (end) {
        if (isNaN(end.getTime())) end = null;
        else end.setHours(0, 0, 0, 0);
      }
      // Assign start and end dates
      info.start = start;
      info.end = end;
      info.startTime = start && start.getTime();
      info.endTime = end && end.getTime();
      // Assign span info
      if (start && end) {
        info.daySpan = diffInDays(start, end);
        info.weekSpan = diffInWeeks(start, end);
        info.monthSpan = diffInMonths(start, end);
        info.yearSpan = diffInYears(start, end);
      }
      // Assign 'and' condition
      const andOpt = mixinOptionalProps(config, {}, _patternProps);
      if (andOpt.assigned) {
        info.on = { and: andOpt.target };
      }
      // Assign 'or' conditions
      if (config.on) {
        const or =
          (isArray(config.on) ? config.on : [config.on])
          .map((o) => {
            if (isFunction(o)) return o;
            const opt = mixinOptionalProps(o, {}, _patternProps);
            return opt.assigned ? opt.target : null;
          })
          .filter(o => o);
        if (or.length) info.on = { ...info.on, or };
      }
    }
    // Assign flag if date info is complex
    info.isComplex = !!info.on;
  }
  // ========================================================
  // Determines if this date partially intersects another date
  // This is a shallow test (no patterns tested)
  info.shallowIntersectsDate = other => dateShallowIntersectsDate(info, other.isDate ? other : DateInfo(other));
  // ========================================================
  info.intersectsDate = (other) => {
    const date = other.isDateInfo ? other : DateInfo(other);
    if (!info.shallowIntersectsDate(date)) return null;
    if (!info.on) return info;
    const range = findShallowIntersectingRange(info, date);
    let result = false;
    iterateDatesInRange(range, (state) => {
      if (info.matchesDay(state.day)) {
        result = result || date.matchesDay(state.day);
        state.finished = result;
      }
    });
    return result;
  };
  // ========================================================
  // Determines if this date completely includes another date
  // This is a shallow test (no patterns tested)
  info.shallowIncludesDate = other => dateShallowIncludesDate(info, other.isDate ? other : DateInfo(other));
  // ========================================================
  info.includesDate = (other) => {
    const date = other.isDateInfo ? other : DateInfo(other);
    if (!info.shallowIncludesDate(date)) return false;
    if (!info.on) return true;
    const range = findShallowIntersectingRange(info, date);
    let result = true;
    iterateDatesInRange(range, (state) => {
      if (info.matchesDay(state.day)) {
        result = result && date.matchesDay(state.day);
        state.finished = !result;
      }
    });
    return result;
  };
  // ========================================================
  info.includesDay = (dayInfo) => {
    const date = DateInfo(dayInfo.date);
    // Date is outside general range - return null
    if (!info.shallowIncludesDate(date)) return null;
    // Return this date if patterns match
    return info.matchesDay(dayInfo) ? info : null;
  };
  // ========================================================
  info.matchesDay = (dayInfo) => {
    // No patterns to test
    if (!info.on) return true;
    // Fail if 'and' condition fails
    if (info.on.and && !testConfig(info.on.and, dayInfo, info)) return false;
    // Fail if every 'or' condition fails
    if (info.on.or && !info.on.or.find(or => testConfig(or, dayInfo, info))) return false;
    // Patterns match
    return true;
  };
  info.toRange = () => {
    if (info.isDate) {
      return DateInfo({
        start: info.date,
        end: info.date,
      });
    }
    return DateInfo({
      start: info.start,
      end: info.end,
    });
  };
  // Build the 'compare to other' function
  info.compare = (other) => {
    if (info.order !== other.order) return info.order - other.order;
    if (info.type !== other.type) return info.isDate ? 1 : -1;
    if (info.isDate) return 0;
    const diff = info.start - other.start;
    return diff !== 0 ? diff : info.end - other.end;
  };
  // Return fully configured date info object
  return info;
};

export default DateInfo;
