import {
  isDate,
  isString,
  isNumber,
  isObject,
  isArray,
  isFunction,
} from './typeCheckers';
import defaults from './defaults';
import { mixinOptionalProps } from './helpers';

const millisecondsPerDay = 24 * 60 * 60 * 1000;

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
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
  // Determines if any part of this date intersects any part of the other date
  info.intersectsDate = (other) => {
    if (!other.isDateInfo) other = new DateInfo(other);
    if (info.isDate) return other.isDate ? info.dateTime === other.dateTime : other.includesDate(info.date);
    if (other.isDate) return info.includesDate(other.date);
    // Both ranges
    if (info.start && other.end && info.start > other.end) return false;
    if (info.end && other.start && info.end < other.start) return false;
    return true;
  };
  // Determines if this date completely includes all of the other date
  info.includesDate = (other) => {
    if (!other.isDateInfo) other = new DateInfo(other);
    // I am date
    if (info.isDate) {
      if (other.isDate) return info.dateTime === other.dateTime;
      if (!other.startTime || !other.endTime) return false;
      return info.dateTime === other.startTime && info.dateTime === other.endTime;
    }
    // Other is date and I am range
    if (other.isDate) {
      if (info.start && other.date < info.start) return false;
      if (info.end && other.date > info.end) return false;
      return true;
    }
    // Both ranges
    if (info.start && (!other.start || other.start < info.start)) return false;
    if (info.end && (!other.end || other.end > info.end)) return false;
    return true;
  };
  // Finds the first match for the given day
  info.includesDay = (dayInfo) => {
    const date = dayInfo.date;
    // Date is outside general range - return null
    if (!info.includesDate(date)) return null;
    if (!info.on) return info;
    // Fail if 'and' condition fails
    if (info.on.and && !testConfig(info.on.and, dayInfo, info)) return null;
    // Fail if every 'or' condition fails
    if (info.on.or && !info.on.or.find(or => testConfig(or, dayInfo, info))) return null;
    // Return date info for day date
    return DateInfo(dayInfo.date);
  };
  info.toRange = () => {
    if (info.isDate) {
      return {
        start: new Date(info.dateTime),
        startTime: info.dateTime,
        end: new Date(info.dateTime),
        endTime: info.dateTime,
      };
    }
    return {
      start: new Date(info.startTime),
      startTime: info.startTime,
      end: new Date(info.endTime),
      endTime: info.endTime,
    };
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
