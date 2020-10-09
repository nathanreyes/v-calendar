/* eslint-disable no-bitwise, no-multi-assign */
import defaultLocales from './defaults/locales';
import { pad, addPages, pageForDate, arrayHasItems } from './helpers';
import {
  isDate,
  isNumber,
  isString,
  isObject,
  has,
  defaultsDeep,
  clamp,
} from './_';

const token = /d{1,2}|W{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|X{1,3}|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
const twoDigits = /\d\d?/;
const threeDigits = /\d{3}/;
const fourDigits = /\d{4}/;
const word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
const literal = /\[([^]*?)\]/gm;
const noop = () => {};
const monthUpdate = arrName => (d, v, l) => {
  const index = l[arrName].indexOf(
    v.charAt(0).toUpperCase() + v.substr(1).toLowerCase(),
  );
  if (~index) {
    d.month = index;
  }
};

const daysInWeek = 7;
const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const formatFlags = {
  D(d) {
    return d.day;
  },
  DD(d) {
    return pad(d.day);
  },
  Do(d, l) {
    return l.DoFn(d.day);
  },
  d(d) {
    return d.weekday - 1;
  },
  dd(d) {
    return pad(d.weekday - 1);
  },
  W(d, l) {
    return l.dayNamesNarrow[d.weekday - 1];
  },
  WW(d, l) {
    return l.dayNamesShorter[d.weekday - 1];
  },
  WWW(d, l) {
    return l.dayNamesShort[d.weekday - 1];
  },
  WWWW(d, l) {
    return l.dayNames[d.weekday - 1];
  },
  M(d) {
    return d.month;
  },
  MM(d) {
    return pad(d.month);
  },
  MMM(d, l) {
    return l.monthNamesShort[d.month - 1];
  },
  MMMM(d, l) {
    return l.monthNames[d.month - 1];
  },
  YY(d) {
    return String(d.year).substr(2);
  },
  YYYY(d) {
    return pad(d.year, 4);
  },
  h(d) {
    return d.hours % 12 || 12;
  },
  hh(d) {
    return pad(d.hours % 12 || 12);
  },
  H(d) {
    return d.hours;
  },
  HH(d) {
    return pad(d.hours);
  },
  m(d) {
    return d.minutes;
  },
  mm(d) {
    return pad(d.minutes);
  },
  s(d) {
    return d.seconds;
  },
  ss(d) {
    return pad(d.seconds);
  },
  S(d) {
    return Math.round(d.milliseconds / 100);
  },
  SS(d) {
    return pad(Math.round(d.milliseconds / 10), 2);
  },
  SSS(d) {
    return pad(d.milliseconds, 3);
  },
  a(d, l) {
    return d.hours < 12 ? l.amPm[0] : l.amPm[1];
  },
  A(d, l) {
    return d.hours < 12 ? l.amPm[0].toUpperCase() : l.amPm[1].toUpperCase();
  },
  X(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? '-' : '+'}${pad(Math.floor(Math.abs(o) / 60), 2)}`;
  },
  XX(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? '-' : '+'}${pad(
      Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60),
      4,
    )}`;
  },
  XXX(d) {
    const o = d.timezoneOffset;
    return `${o > 0 ? '-' : '+'}${pad(Math.floor(Math.abs(o) / 60), 2)}:${pad(
      Math.abs(o) % 60,
      2,
    )}`;
  },
};
const parseFlags = {
  D: [
    twoDigits,
    (d, v) => {
      d.day = v;
    },
  ],
  Do: [
    new RegExp(twoDigits.source + word.source),
    (d, v) => {
      d.day = parseInt(v, 10);
    },
  ],
  d: [twoDigits, noop],
  W: [word, noop],
  M: [
    twoDigits,
    (d, v) => {
      d.month = v - 1;
    },
  ],
  MMM: [word, monthUpdate('monthNamesShort')],
  MMMM: [word, monthUpdate('monthNames')],
  YY: [
    twoDigits,
    (d, v) => {
      const da = new Date();
      const cent = +da
        .getFullYear()
        .toString()
        .substr(0, 2);
      d.year = `${v > 68 ? cent - 1 : cent}${v}`;
    },
  ],
  YYYY: [
    fourDigits,
    (d, v) => {
      d.year = v;
    },
  ],
  S: [
    /\d/,
    (d, v) => {
      d.millisecond = v * 100;
    },
  ],
  SS: [
    /\d{2}/,
    (d, v) => {
      d.millisecond = v * 10;
    },
  ],
  SSS: [
    threeDigits,
    (d, v) => {
      d.millisecond = v;
    },
  ],
  h: [
    twoDigits,
    (d, v) => {
      d.hour = v;
    },
  ],
  m: [
    twoDigits,
    (d, v) => {
      d.minute = v;
    },
  ],
  s: [
    twoDigits,
    (d, v) => {
      d.second = v;
    },
  ],
  a: [
    word,
    (d, v, l) => {
      const val = v.toLowerCase();
      if (val === l.amPm[0]) {
        d.isPm = false;
      } else if (val === l.amPm[1]) {
        d.isPm = true;
      }
    },
  ],
  X: [
    /[^\s]*?[+-]\d\d:?\d\d|[^\s]*?Z?/,
    (d, v) => {
      if (v === 'Z') v = '+00:00';
      const parts = `${v}`.match(/([+-]|\d\d)/gi);
      if (parts) {
        const minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    },
  ],
};
parseFlags.DD = parseFlags.D;
parseFlags.dd = parseFlags.d;
parseFlags.WWWW = parseFlags.WWW = parseFlags.WW = parseFlags.W;
parseFlags.MM = parseFlags.M;
parseFlags.mm = parseFlags.m;
parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
parseFlags.ss = parseFlags.s;
parseFlags.A = parseFlags.a;
parseFlags.XXX = parseFlags.XX = parseFlags.X;

export function resolveConfig(config, locales) {
  // Get the detected locale string
  const detLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
  // Resolve the locale id
  let id;
  if (isString(config)) {
    id = config;
  } else if (has(config, 'id')) {
    id = config.id;
  }
  id = (id || detLocale).toLowerCase();
  const localeKeys = Object.keys(locales);
  const validKey = k => localeKeys.find(lk => lk.toLowerCase() === k);
  id = validKey(id) || validKey(id.substring(0, 2)) || detLocale;
  // Add fallback and spread default locale to prevent repetitive update loops
  const defLocale = { ...locales['en-IE'], ...locales[id], id };
  // Assign or merge defaults with provided config
  config = isObject(config) ? defaultsDeep(config, defLocale) : defLocale;
  // Return resolved config
  return config;
}

export default class Locale {
  constructor(config, locales = defaultLocales) {
    const { id, firstDayOfWeek, masks } = resolveConfig(config, locales);
    this.id = id;
    this.firstDayOfWeek = clamp(firstDayOfWeek, 1, daysInWeek);
    this.masks = masks;
    this.dayNames = this.getDayNames('long');
    this.dayNamesShort = this.getDayNames('short');
    this.dayNamesShorter = this.dayNamesShort.map(s => s.substring(0, 2));
    this.dayNamesNarrow = this.getDayNames('narrow');
    this.monthNames = this.getMonthNames('long');
    this.monthNamesShort = this.getMonthNames('short');
    this.amPm = ['am', 'pm'];
    this.monthData = {};
    // Bind methods
    this.getMonthComps = this.getMonthComps.bind(this);
    this.parse = this.parse.bind(this);
    this.format = this.format.bind(this);
    this.toPage = this.toPage.bind(this);
  }

  format(date, mask, timezone) {
    mask =
      (arrayHasItems(mask) && mask[0]) ||
      (isString(mask) && mask) ||
      'YYYY-MM-DD';
    date = this.getDateParts(this.normalizeDate(date), timezone);
    mask = this.masks[mask] || mask;
    const literals = [];
    // Make literals inactive by replacing them with ??
    mask = mask.replace(literal, ($0, $1) => {
      literals.push($1);
      return '??';
    });
    // Apply formatting rules
    mask = mask.replace(token, $0 =>
      $0 in formatFlags
        ? formatFlags[$0](date, this)
        : $0.slice(1, $0.length - 1),
    );
    // Inline literal values back into the formatted value
    return mask.replace(/\?\?/g, () => literals.shift());
  }

  parse(dateStr, mask, timezone) {
    const masks = (arrayHasItems(mask) && mask) || [
      (isString(mask) && mask) || 'YYYY-MM-DD',
    ];
    return (
      masks
        .map(m => {
          if (typeof m !== 'string') {
            throw new Error('Invalid mask in fecha.parse');
          }
          m = this.masks[m] || m;
          // Avoid regular expression denial of service, fail early for really long strings
          // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
          if (dateStr.length > 1000) {
            return false;
          }

          let isValid = true;
          const dateInfo = {};
          m.replace(token, $0 => {
            if (parseFlags[$0]) {
              const info = parseFlags[$0];
              const index = dateStr.search(info[0]);
              if (!~index) {
                isValid = false;
              } else {
                dateStr.replace(info[0], result => {
                  info[1](dateInfo, result, this);
                  dateStr = dateStr.substr(index + result.length);
                  return result;
                });
              }
            }

            return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
          });

          if (!isValid) {
            return false;
          }

          const today = new Date();
          if (
            dateInfo.isPm === true &&
            dateInfo.hour != null &&
            +dateInfo.hour !== 12
          ) {
            dateInfo.hour = +dateInfo.hour + 12;
          } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
            dateInfo.hour = 0;
          }

          let date;
          if (dateInfo.timezoneOffset != null) {
            dateInfo.minute =
              +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
            date = new Date(
              Date.UTC(
                dateInfo.year || today.getFullYear(),
                dateInfo.month || 0,
                dateInfo.day || 1,
                dateInfo.hour || 0,
                dateInfo.minute || 0,
                dateInfo.second || 0,
                dateInfo.millisecond || 0,
              ),
            );
          } else {
            date = this.getDateFromParts(
              {
                year: dateInfo.year || today.getFullYear(),
                month: (dateInfo.month || 0) + 1,
                day: dateInfo.day || 1,
                hours: dateInfo.hour || 0,
                minutes: dateInfo.minute || 0,
                seconds: dateInfo.second || 0,
                milliseconds: dateInfo.millisecond || 0,
              },
              timezone,
            );
          }
          return date;
        })
        .find(d => d) || new Date(dateStr)
    );
  }

  normalizeDate(d, config = {}) {
    let result = null;
    let type = config.type;
    const auto = type === 'auto' || !type;
    if (isNumber(d)) {
      type = 'number';
      result = new Date(+d);
    } else if (isString(d)) {
      type = 'string';
      const mask = config.mask || 'iso';
      result = d ? this.parse(d, mask, config.timezone) : null;
    } else if (isObject(d)) {
      type = 'object';
      result = this.getDateFromParts(d, config.timezone);
    } else {
      type = 'date';
      result = isDate(d) ? new Date(d.getTime()) : null;
    }
    if (auto) config.type = type;
    return result && !isNaN(result.getTime()) ? result : null;
  }

  denormalizeDate(date, { type, mask, timezone } = {}) {
    switch (type) {
      case 'number':
        return date ? date.getTime() : NaN;
      case 'string':
        return date ? this.format(date, mask || 'iso', timezone) : '';
      default:
        return date ? new Date(date) : null;
    }
  }

  adjustTimeForDate(date, { timeAdjust, timezone }) {
    if (timeAdjust) {
      const dateParts = this.getDateParts(date, timezone);
      if (timeAdjust === 'now') {
        const timeParts = this.getDateParts(new Date(), timezone);
        dateParts.hours = timeParts.hours;
        dateParts.minutes = timeParts.minutes;
        dateParts.seconds = timeParts.seconds;
      } else {
        const timeParts = timeAdjust.split(':');
        dateParts.hours = +timeParts[0];
        dateParts.minutes = +timeParts[1];
        dateParts.seconds = +timeParts[2];
      }
      date = this.getDateFromParts(dateParts, timezone);
    }
    return date;
  }

  getDateParts(date, timezone) {
    if (!date) return null;
    let tzDate = date;
    if (timezone) {
      const normDate = new Date(
        date.toLocaleString('en-US', { timeZone: timezone }),
      );
      const diff = normDate.getTime() - date.getTime();
      tzDate = new Date(date.getTime() + diff);
    }
    const seconds = tzDate.getSeconds();
    const minutes = tzDate.getMinutes();
    const hours = tzDate.getHours();
    const month = tzDate.getMonth() + 1;
    const year = tzDate.getFullYear();
    const comps = this.getMonthComps(month, year);
    const day = tzDate.getDate();
    const dayFromEnd = comps.days - day + 1;
    const weekday = tzDate.getDay() + 1;
    const weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
    const weekdayOrdinalFromEnd = Math.floor((comps.days - day) / 7 + 1);
    const week = Math.ceil(
      (day + Math.abs(comps.firstWeekday - comps.firstDayOfWeek)) / 7,
    );
    const weekFromEnd = comps.weeks - week + 1;
    const parts = {
      seconds,
      minutes,
      hours,
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
      isValid: true,
    };
    parts.timezoneOffset = this.getTimezoneOffset(parts, timezone) / 60000;
    return parts;
  }

  getDateFromParts(parts, timezone) {
    if (!parts) return null;
    const {
      year: y,
      month: m,
      day: d,
      hours: hrs,
      minutes: min,
      seconds: sec,
      milliseconds: ms,
    } = parts;
    if (y === undefined || m === undefined || d === undefined) return null;
    const utcDate = new Date(
      Date.UTC(y || 0, m - 1, d || 0, hrs || 0, min || 0, sec || 0, ms || 0),
    );
    const tzOffsetMs = this.getTimezoneOffset(parts, timezone);
    return new Date(utcDate.getTime() + tzOffsetMs);
  }

  getTimezoneOffset(parts, timezone) {
    const {
      year: y,
      month: m,
      day: d,
      minutes: min,
      seconds: sec,
      milliseconds: ms,
    } = parts;
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      hourCycle: 'h24',
      timeZone: timezone || undefined,
    });
    const utcNoon = new Date(
      Date.UTC(y || 0, m - 1, d || 0, 12, min || 0, sec || 0, ms || 0),
    );
    const tzHours = +formatter.format(utcNoon);
    const tzOffset = 12 - tzHours;
    const msInHour = 3600000;
    return tzOffset * msInHour;
  }

  toPage(arg, fromPage) {
    if (isNumber(arg)) {
      return addPages(fromPage, arg);
    }
    if (isString(arg)) {
      return pageForDate(this.normalizeDate(arg));
    }
    if (isDate(arg)) {
      return pageForDate(arg);
    }
    if (isObject(arg)) {
      return arg;
    }
    return null;
  }

  getMonthDates(year = 2000) {
    const dates = [];
    for (let i = 0; i < 12; i++) {
      dates.push(new Date(year, i, 15));
    }
    return dates;
  }

  getMonthNames(length) {
    const dtf = new Intl.DateTimeFormat(this.id, {
      month: length,
      timezome: 'UTC',
    });
    return this.getMonthDates().map(d => dtf.format(d));
  }

  getWeekdayDates({
    year = 2000,
    utc = false,
    firstDayOfWeek = this.firstDayOfWeek,
  } = {}) {
    const dates = [];
    for (let i = 1, j = 0; j < daysInWeek; i++) {
      const d = utc ? new Date(Date.UTC(year, 0, i)) : new Date(year, 0, i);
      const day = utc ? d.getUTCDay() : d.getDay();
      if (day === firstDayOfWeek - 1 || j > 0) {
        dates.push(d);
        j++;
      }
    }
    return dates;
  }

  getDayNames(length) {
    const dtf = new Intl.DateTimeFormat(this.id, {
      weekday: length,
      timeZone: 'UTC',
    });
    return this.getWeekdayDates({ firstDayOfWeek: 1, utc: true }).map(d =>
      dtf.format(d),
    );
  }

  // Days/month/year components for a given month and year
  getMonthComps(month, year) {
    const key = `${month}-${year}`;
    let comps = this.monthData[key];
    if (!comps) {
      const inLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const firstWeekday = new Date(year, month - 1, 1).getDay() + 1;
      const days = month === 2 && inLeapYear ? 29 : daysInMonths[month - 1];
      const weeks = Math.ceil(
        (days + Math.abs(firstWeekday - this.firstDayOfWeek)) / daysInWeek,
      );
      comps = {
        firstDayOfWeek: this.firstDayOfWeek,
        inLeapYear,
        firstWeekday,
        days,
        weeks,
        month,
        year,
      };
      this.monthData[key] = comps;
    }
    return comps;
  }

  // Days/month/year components for today's month
  getThisMonthComps() {
    const date = new Date();
    return this.getMonthComps(date.getMonth() + 1, date.getFullYear());
  }

  // Day/month/year components for previous month
  getPrevMonthComps(month, year) {
    if (month === 1) return this.getMonthComps(12, year - 1);
    return this.getMonthComps(month - 1, year);
  }

  // Day/month/year components for next month
  getNextMonthComps(month, year) {
    if (month === 12) return this.getMonthComps(1, year + 1);
    return this.getMonthComps(month + 1, year);
  }

  getDayId(date) {
    return this.format(date, 'YYYY-MM-DD');
  }

  // Builds day components for a given page
  getCalendarDays({ monthComps, prevMonthComps, nextMonthComps }, timezone) {
    const days = [];
    const { firstDayOfWeek, firstWeekday } = monthComps;
    const prevMonthDaysToShow =
      firstWeekday +
      (firstWeekday < firstDayOfWeek ? daysInWeek : 0) -
      firstDayOfWeek;
    let prevMonth = true;
    let thisMonth = false;
    let nextMonth = false;
    // Formatter for aria labels
    const formatter = new Intl.DateTimeFormat(this.id, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    // Init counters with previous month's data
    let day = prevMonthComps.days - prevMonthDaysToShow + 1;
    let dayFromEnd = prevMonthComps.days - day + 1;
    let weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
    let weekdayOrdinalFromEnd = 1;
    let week = prevMonthComps.weeks;
    let weekFromEnd = 1;
    let month = prevMonthComps.month;
    let year = prevMonthComps.year;
    // Store todays comps
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    const dft = (y, m, d) => (hours, minutes, seconds, milliseconds) =>
      this.normalizeDate(
        { year: y, month: m, day: d, hours, minutes, seconds, milliseconds },
        { timezone },
      );
    // Cycle through 6 weeks (max in month)
    for (let w = 1; w <= 6; w++) {
      // Cycle through days in week
      for (
        let i = 1, weekday = firstDayOfWeek;
        i <= daysInWeek;
        i++, weekday += weekday === daysInWeek ? 1 - daysInWeek : 1
      ) {
        // We need to know when to start counting actual month days
        if (prevMonth && weekday === firstWeekday) {
          // Reset counters for current month
          day = 1;
          dayFromEnd = monthComps.days;
          weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
          weekdayOrdinalFromEnd = Math.floor(
            (monthComps.days - day) / daysInWeek + 1,
          );
          week = 1;
          weekFromEnd = monthComps.weeks;
          month = monthComps.month;
          year = monthComps.year;
          // ...and flag we're tracking actual month days
          prevMonth = false;
          thisMonth = true;
        }
        // Append day info for the current week
        // Note: this might or might not be an actual month day
        //  We don't know how the UI wants to display various days,
        //  so we'll supply all the data we can
        const dateFromTime = dft(year, month, day);
        const date = dateFromTime(12, 0, 0, 0);
        const range = {
          start: dateFromTime(0, 0, 0),
          end: dateFromTime(23, 59, 59, 999),
        };
        const id = this.getDayId(date);
        const weekdayPosition = i;
        const weekdayPositionFromEnd = daysInWeek - i;
        const isToday =
          day === todayDay && month === todayMonth && year === todayYear;
        const isFirstDay = thisMonth && day === 1;
        const isLastDay = thisMonth && day === monthComps.days;
        const onTop = w === 1;
        const onBottom = w === 6;
        const onLeft = i === 1;
        const onRight = i === daysInWeek;
        days.push({
          id,
          label: day.toString(),
          ariaLabel: formatter.format(new Date(year, month, day)),
          day,
          dayFromEnd,
          weekday,
          weekdayPosition,
          weekdayPositionFromEnd,
          weekdayOrdinal,
          weekdayOrdinalFromEnd,
          week,
          weekFromEnd,
          month,
          year,
          dateFromTime,
          date,
          range,
          isToday,
          isFirstDay,
          isLastDay,
          inMonth: thisMonth,
          inPrevMonth: prevMonth,
          inNextMonth: nextMonth,
          onTop,
          onBottom,
          onLeft,
          onRight,
          classes: [
            `id-${id}`,
            `day-${day}`,
            `day-from-end-${dayFromEnd}`,
            `weekday-${weekday}`,
            `weekday-position-${weekdayPosition}`,
            `weekday-ordinal-${weekdayOrdinal}`,
            `weekday-ordinal-from-end-${weekdayOrdinalFromEnd}`,
            `week-${week}`,
            `week-from-end-${weekFromEnd}`,
            {
              'is-today': isToday,
              'is-first-day': isFirstDay,
              'is-last-day': isLastDay,
              'in-month': thisMonth,
              'in-prev-month': prevMonth,
              'in-next-month': nextMonth,
              'on-top': onTop,
              'on-bottom': onBottom,
              'on-left': onLeft,
              'on-right': onRight,
            },
          ],
        });
        // See if we've hit the last day of the month
        if (thisMonth && isLastDay) {
          thisMonth = false;
          nextMonth = true;
          // Reset counters to next month's data
          day = 1;
          dayFromEnd = nextMonthComps.days;
          weekdayOrdinal = 1;
          weekdayOrdinalFromEnd = Math.floor(
            (nextMonthComps.days - day) / daysInWeek + 1,
          );
          week = 1;
          weekFromEnd = nextMonthComps.weeks;
          month = nextMonthComps.month;
          year = nextMonthComps.year;
          // Still in the middle of the month (hasn't ended yet)
        } else {
          day++;
          dayFromEnd--;
          weekdayOrdinal = Math.floor((day - 1) / daysInWeek + 1);
          weekdayOrdinalFromEnd = Math.floor(
            (monthComps.days - day) / daysInWeek + 1,
          );
        }
      }
      // Append week days
      week++;
      weekFromEnd--;
    }
    return days;
  }
}
