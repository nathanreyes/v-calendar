/* eslint-disable no-bitwise, no-multi-assign */
import { reactive } from 'vue';
import toDate from 'date-fns-tz/toDate';
import getISOWeek from 'date-fns/getISOWeek';
import getWeek from 'date-fns/getWeek';
import getWeeksInMonth from 'date-fns/getWeeksInMonth';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import DateInfo from './dateInfo';
import defaultLocales from './defaults/locales';
import {
  pad,
  arrayHasItems,
  PageAddress,
  pageIsAfterPage,
  pageIsValid,
} from './helpers';
import {
  isDate,
  isNumber,
  isString,
  isObject,
  isArray,
  has,
  defaultsDeep,
  clamp,
  pick,
} from './_';

export const PATCH = {
  DATE_TIME: 1,
  DATE: 2,
  TIME: 3,
};

const PATCH_KEYS = {
  1: ['year', 'month', 'day', 'hours', 'minutes', 'seconds', 'milliseconds'],
  2: ['year', 'month', 'day'],
  3: ['hours', 'minutes', 'seconds', 'milliseconds'],
};

export type PageView = 'daily' | 'weekly' | 'monthly';

interface PageOptions {
  view: PageView;
  trimWeeks: boolean;
  position: number;
}

export interface Page extends PageAddress {
  key: string;
  day?: number;
  week?: number;
  month: number;
  year: number;
  view: PageView;
  position: number;
  weeksCount: number;
  title: string;
  shortMonthLabel: string;
  monthLabel: string;
  shortYearLabel: string;
  yearLabel: string;
  monthComps: any;
  prevMonthComps: any;
  nextMonthComps: any;
  days: CalendarDay[];
  weeks: CalendarWeek[];
}

type DayNameLength = 'narrow' | 'short' | 'long';
type MonthNameLength = 'short' | 'long';

interface DateParts {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  day: number;
  dayFromEnd: number;
  weekday: number;
  weekdayOrdinal: number;
  weekdayOrdinalFromEnd: number;
  week: number;
  weekFromEnd: number;
  month: number;
  year: number;
  date: Date;
  isValid: boolean;
  timezoneOffset: number;
  isPm?: boolean;
}

interface CalendarDay {
  id: string;
  label: string;
  ariaLabel: string;
  day: number;
  dayFromEnd: number;
  weekday: number;
  weekdayPosition: number;
  weekdayPositionFromEnd: number;
  weekdayOrdinal: number;
  weekdayOrdinalFromEnd: number;
  week: number;
  weekFromEnd: number;
  weekPosition: number;
  weeknumber: number;
  isoWeeknumber: number;
  month: number;
  year: number;
  date: Date;
  range: {
    start: Date;
    end: Date;
  };
  isToday: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
  inMonth: boolean;
  inPrevMonth: boolean;
  inNextMonth: boolean;
  onTop: boolean;
  onBottom: boolean;
  onLeft: boolean;
  onRight: boolean;
  dateFromTime: (
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ) => Date;
}

interface CalendarWeek {
  id: string;
  week: number;
  weekPosition: number;
  weeknumber: number;
  isoWeeknumber: number;
  days: CalendarDay[];
  title: string;
}

interface DateObject {
  year: number;
  month: number;
  day: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds: number;
}

type DateSource = Date | string | number | DateObject;

interface DateConfig {
  type?: string;
  fillDate?: DateSource;
  mask?: string;
  patch?: 1 | 2 | 3;
  time?: string;
}

type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
interface LocaleConfig {
  id: string;
  firstDayOfWeek: DayOfWeek;
  masks: any;
}

const token = /d{1,2}|W{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|Z{1,4}|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
const twoDigits = /\d\d?/;
const threeDigits = /\d{3}/;
const fourDigits = /\d{4}/;
const word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
const literal = /\[([^]*?)\]/gm;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const monthUpdate = (arrName: string) => (d, v, l: any) => {
  const index = l[arrName].indexOf(
    v.charAt(0).toUpperCase() + v.substr(1).toLowerCase(),
  );
  if (~index) {
    d.month = index;
  }
};
const maskMacros = ['L', 'iso'];

const daysInWeek = 7;
const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const formatFlags: any = {
  D(d: DateParts) {
    return d.day;
  },
  DD(d: DateParts) {
    return pad(d.day, 2);
  },
  Do(d: DateParts, l: Locale) {
    return l.DoFn(d.day);
  },
  d(d: DateParts) {
    return d.weekday - 1;
  },
  dd(d: DateParts) {
    return pad(d.weekday - 1, 2);
  },
  W(d: DateParts, l: Locale) {
    return l.dayNamesNarrow[d.weekday - 1];
  },
  WW(d: DateParts, l: Locale) {
    return l.dayNamesShorter[d.weekday - 1];
  },
  WWW(d: DateParts, l: Locale) {
    return l.dayNamesShort[d.weekday - 1];
  },
  WWWW(d: DateParts, l: Locale) {
    return l.dayNames[d.weekday - 1];
  },
  M(d: DateParts) {
    return d.month;
  },
  MM(d: DateParts) {
    return pad(d.month, 2);
  },
  MMM(d: DateParts, l: Locale) {
    return l.monthNamesShort[d.month - 1];
  },
  MMMM(d: DateParts, l: Locale) {
    return l.monthNames[d.month - 1];
  },
  YY(d: DateParts) {
    return String(d.year).substr(2);
  },
  YYYY(d: DateParts) {
    return pad(d.year, 4);
  },
  h(d: DateParts) {
    return d.hours % 12 || 12;
  },
  hh(d: DateParts) {
    return pad(d.hours % 12 || 12, 2);
  },
  H(d: DateParts) {
    return d.hours;
  },
  HH(d: DateParts) {
    return pad(d.hours, 2);
  },
  m(d: DateParts) {
    return d.minutes;
  },
  mm(d: DateParts) {
    return pad(d.minutes, 2);
  },
  s(d: DateParts) {
    return d.seconds;
  },
  ss(d: DateParts) {
    return pad(d.seconds, 2);
  },
  S(d: DateParts) {
    return Math.round(d.milliseconds / 100);
  },
  SS(d: DateParts) {
    return pad(Math.round(d.milliseconds / 10), 2);
  },
  SSS(d: DateParts) {
    return pad(d.milliseconds, 3);
  },
  a(d: DateParts, l: Locale) {
    return d.hours < 12 ? l.amPm[0] : l.amPm[1];
  },
  A(d: DateParts, l: Locale) {
    return d.hours < 12 ? l.amPm[0].toUpperCase() : l.amPm[1].toUpperCase();
  },
  Z() {
    return 'Z';
  },
  ZZ(d: DateParts) {
    const o = d.timezoneOffset;
    return `${o > 0 ? '-' : '+'}${pad(Math.floor(Math.abs(o) / 60), 2)}`;
  },
  ZZZ(d: DateParts) {
    const o = d.timezoneOffset;
    return `${o > 0 ? '-' : '+'}${pad(
      Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60),
      4,
    )}`;
  },
  ZZZZ(d: DateParts) {
    const o = d.timezoneOffset;
    return `${o > 0 ? '-' : '+'}${pad(Math.floor(Math.abs(o) / 60), 2)}:${pad(
      Math.abs(o) % 60,
      2,
    )}`;
  },
};
const parseFlags: any = {
  D: [
    twoDigits,
    (d: DateParts, v: number) => {
      d.day = v;
    },
  ],
  Do: [
    new RegExp(twoDigits.source + word.source),
    (d: DateParts, v: string) => {
      d.day = parseInt(v, 10);
    },
  ],
  d: [twoDigits, noop],
  W: [word, noop],
  M: [
    twoDigits,
    (d: DateParts, v: number) => {
      d.month = v - 1;
    },
  ],
  MMM: [word, monthUpdate('monthNamesShort')],
  MMMM: [word, monthUpdate('monthNames')],
  YY: [
    twoDigits,
    (d: DateParts, v: number) => {
      const da = new Date();
      const cent = +da
        .getFullYear()
        .toString()
        .substr(0, 2);
      d.year = +`${v > 68 ? cent - 1 : cent}${v}`;
    },
  ],
  YYYY: [
    fourDigits,
    (d: DateParts, v: number) => {
      d.year = v;
    },
  ],
  S: [
    /\d/,
    (d: DateParts, v: number) => {
      d.milliseconds = v * 100;
    },
  ],
  SS: [
    /\d{2}/,
    (d: DateParts, v: number) => {
      d.milliseconds = v * 10;
    },
  ],
  SSS: [
    threeDigits,
    (d: DateParts, v: number) => {
      d.milliseconds = v;
    },
  ],
  h: [
    twoDigits,
    (d: DateParts, v: number) => {
      d.hours = v;
    },
  ],
  m: [
    twoDigits,
    (d: DateParts, v: number) => {
      d.minutes = v;
    },
  ],
  s: [
    twoDigits,
    (d: DateParts, v: number) => {
      d.seconds = v;
    },
  ],
  a: [
    word,
    (d: DateParts, v: string, l: Locale) => {
      const val = v.toLowerCase();
      if (val === l.amPm[0]) {
        d.isPm = false;
      } else if (val === l.amPm[1]) {
        d.isPm = true;
      }
    },
  ],
  Z: [
    /[^\s]*?[+-]\d\d:?\d\d|[^\s]*?Z?/,
    (d: DateParts, v: string) => {
      if (v === 'Z') v = '+00:00';
      const parts = `${v}`.match(/([+-]|\d\d)/gi);
      if (parts) {
        const minutes = +parts[1] * 60 + parseInt(parts[2], 10);
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
parseFlags.ZZZZ = parseFlags.ZZZ = parseFlags.ZZ = parseFlags.Z;

export function resolveConfig(config: string | LocaleConfig, locales: any) {
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
  const validKey = (k: string) => localeKeys.find(lk => lk.toLowerCase() === k);
  id = validKey(id) || validKey(id.substring(0, 2)) || detLocale;
  // Add fallback and spread default locale to prevent repetitive update loops
  const defLocale = { ...locales['en-IE'], ...locales[id], id };
  // Assign or merge defaults with provided config
  const result: LocaleConfig = isObject(config)
    ? defaultsDeep(config, defLocale)
    : defLocale;
  // Return resolved config
  return result;
}

export default class Locale {
  id: any;
  daysInWeek: number;
  firstDayOfWeek: number;
  masks: any;
  timezone: string | undefined;
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesShorter: string[];
  dayNamesNarrow: string[];
  monthNames: string[];
  monthNamesShort: string[];
  amPm: [string, string];
  monthCache: any;
  pageCache: any;

  constructor(
    config: any,
    { locales = defaultLocales, timezone = undefined } = {},
  ) {
    const { id, firstDayOfWeek, masks } = resolveConfig(config, locales);
    this.id = id;
    this.daysInWeek = daysInWeek;
    this.firstDayOfWeek = clamp(firstDayOfWeek, 1, daysInWeek);
    this.masks = masks;
    this.timezone = timezone || undefined;
    this.dayNames = this.getDayNames('long');
    this.dayNamesShort = this.getDayNames('short');
    this.dayNamesShorter = this.dayNamesShort.map(s => s.substring(0, 2));
    this.dayNamesNarrow = this.getDayNames('narrow');
    this.monthNames = this.getMonthNames('long');
    this.monthNamesShort = this.getMonthNames('short');
    this.amPm = ['am', 'pm'];
    this.monthCache = {};
    this.pageCache = {};
    // Bind methods
    this.getMonthComps = this.getMonthComps.bind(this);
    this.parse = this.parse.bind(this);
    this.format = this.format.bind(this);
    this.toPage = this.toPage.bind(this);
  }

  format(date: Date, masks: string | string[]) {
    date = this.normalizeDate(date)!;
    if (!date) return '';
    let mask = this.normalizeMasks(masks)[0];
    const literals: string[] = [];
    // Make literals inactive by replacing them with ??
    mask = mask.replace(literal, ($0, $1: string) => {
      literals.push($1);
      return '??';
    });
    const timezone = /Z$/.test(mask) ? 'utc' : this.timezone;
    const dateParts = this.getDateParts(date, timezone);
    // Apply formatting rules
    mask = mask.replace(token, $0 =>
      $0 in formatFlags
        ? formatFlags[$0](dateParts, this)
        : $0.slice(1, $0.length - 1),
    );
    // Inline literal values back into the formatted value
    return mask.replace(/\?\?/g, () => literals.shift()!);
  }

  parse(dateString: string, mask: string | string[]) {
    const masks = this.normalizeMasks(mask);
    return (
      masks
        .map(m => {
          if (typeof m !== 'string') {
            throw new Error('Invalid mask');
          }
          // Reset string value
          let str = dateString;
          // Avoid regular expression denial of service, fail early for really long strings
          // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
          if (str.length > 1000) {
            return false;
          }

          let isValid = true;
          const dp: Partial<DateParts> = {};
          m.replace(token, $0 => {
            if (parseFlags[$0]) {
              const info = parseFlags[$0];
              const index = str.search(info[0]);
              if (!~index) {
                isValid = false;
              } else {
                str.replace(info[0], result => {
                  info[1](dp, result, this);
                  str = str.substr(index + result.length);
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
          if (dp.hours != null) {
            if (dp.isPm === true && +dp.hours !== 12) {
              dp.hours = +dp.hours + 12;
            } else if (dp.isPm === false && +dp.hours === 12) {
              dp.hours = 0;
            }
          }

          let date;
          if (dp.timezoneOffset != null) {
            dp.minutes = +(dp.minutes || 0) - +dp.timezoneOffset;
            date = new Date(
              Date.UTC(
                dp.year || today.getFullYear(),
                dp.month || 0,
                dp.day || 1,
                dp.hours || 0,
                dp.minutes || 0,
                dp.seconds || 0,
                dp.milliseconds || 0,
              ),
            );
          } else {
            date = this.getDateFromParts({
              year: dp.year || today.getFullYear(),
              month: (dp.month || 0) + 1,
              day: dp.day || 1,
              hours: dp.hours || 0,
              minutes: dp.minutes || 0,
              seconds: dp.seconds || 0,
              milliseconds: dp.milliseconds || 0,
            });
          }
          return date;
        })
        .find(d => d) || new Date(dateString)
    );
  }

  // Normalizes mask(s) as an array with replaced mask macros
  normalizeMasks(masks: string | string[]): string[] {
    return (((arrayHasItems(masks) && masks) || [
      (isString(masks) && masks) || 'YYYY-MM-DD',
    ]) as string[]).map(m =>
      maskMacros.reduce(
        (prev, curr) => prev.replace(curr, this.masks[curr] || ''),
        m,
      ),
    );
  }

  normalizeDate(d: DateSource, config: DateConfig = {}) {
    const nullDate = new Date(NaN);
    let result = nullDate;
    let { type } = config;
    const { mask, patch, time } = config;
    const auto = type === 'auto' || !type;
    if (isNumber(d)) {
      type = 'number';
      result = new Date(+d);
    } else if (isString(d)) {
      type = 'string';
      result = d ? this.parse(d, mask || 'iso') : nullDate;
    } else if (isObject(d)) {
      type = 'object';
      result = this.getDateFromParts(d as Partial<DateParts>);
    } else {
      type = 'date';
      result = isDate(d) ? new Date((d as Date).getTime()) : nullDate;
    }

    if (result && patch) {
      const parts = {
        ...this.getDateParts(this.normalizeDate(config.fillDate || new Date())),
        ...pick(this.getDateParts(result), PATCH_KEYS[patch]),
      };
      result = this.getDateFromParts(parts);
    }
    if (auto) config.type = type;
    if (result && !isNaN(result.getTime())) {
      if (time) {
        result = this.adjustTimeForDate(result, {
          timeAdjust: time,
        });
      }
      return result;
    }
    return nullDate;
  }

  denormalizeDate(date: Date, { type = '', mask = '' } = {}) {
    switch (type) {
      case 'number':
        return date ? date.getTime() : NaN;
      case 'string':
        return date ? this.format(date, mask || 'iso') : '';
      default:
        return date ? new Date(date) : null;
    }
  }

  adjustTimeForDate(date: Date, { timeAdjust = '' }) {
    if (timeAdjust) {
      const dateParts = this.getDateParts(date);
      if (timeAdjust === 'now') {
        const timeParts = this.getDateParts(new Date());
        dateParts.hours = timeParts.hours;
        dateParts.minutes = timeParts.minutes;
        dateParts.seconds = timeParts.seconds;
        dateParts.milliseconds = timeParts.milliseconds;
      } else {
        const d = new Date(`2000-01-01T${timeAdjust}Z`);
        dateParts.hours = d.getUTCHours();
        dateParts.minutes = d.getUTCMinutes();
        dateParts.seconds = d.getUTCSeconds();
        dateParts.milliseconds = d.getUTCMilliseconds();
      }
      date = this.getDateFromParts(dateParts);
    }
    return date;
  }

  normalizeDates(dates: any, opts: any) {
    opts = opts || {};
    opts.locale = this;
    // Assign dates
    return (isArray(dates) ? dates : [dates])
      .map((d: any) => d && (d instanceof DateInfo ? d : new DateInfo(d, opts)))
      .filter((d: any) => d);
  }

  getDateParts(date: Date, timezone = this.timezone): DateParts {
    if (!date) {
      debugger;
    }
    let tzDate = date;
    if (timezone) {
      const normDate = new Date(
        date.toLocaleString('en-US', { timeZone: timezone }),
      );
      normDate.setMilliseconds(date.getMilliseconds());
      const diff = normDate.getTime() - date.getTime();
      tzDate = new Date(date.getTime() + diff);
    }
    const milliseconds = tzDate.getMilliseconds();
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
    const parts: DateParts = {
      milliseconds,
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
      timezoneOffset: 0,
      isValid: true,
    };
    parts.timezoneOffset = this.getTimezoneOffset(parts);
    return parts;
  }

  getDateFromParts(parts: Partial<DateParts>) {
    const d = new Date();
    const {
      year = d.getFullYear(),
      month = d.getMonth() + 1,
      day = d.getDate(),
      hours: hrs = 0,
      minutes: min = 0,
      seconds: sec = 0,
      milliseconds: ms = 0,
    } = parts;

    if (this.timezone) {
      const dateString = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(
        hrs,
        2,
      )}:${pad(min, 2)}:${pad(sec, 2)}.${pad(ms, 3)}`;
      return toDate(dateString, { timeZone: this.timezone });
    }
    return new Date(year, month - 1, day, hrs, min, sec, ms);
  }

  getTimezoneOffset(parts: Partial<DateParts>) {
    const {
      year: y = 0,
      month: m = 0,
      day: d = 0,
      hours: hrs = 0,
      minutes: min = 0,
      seconds: sec = 0,
      milliseconds: ms = 0,
    } = parts;
    let date;
    const utcDate = new Date(Date.UTC(y, m - 1, d, hrs, min, sec, ms));
    if (this.timezone) {
      const dateString = `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}T${pad(
        hrs,
        2,
      )}:${pad(min, 2)}:${pad(sec, 2)}.${pad(ms, 3)}`;
      date = toDate(dateString, { timeZone: this.timezone });
    } else {
      date = new Date(y, m - 1, d, hrs, min, sec, ms);
    }
    return (date.getTime() - utcDate.getTime()) / 60000;
  }

  toPage(arg: any, fromPage: Page) {
    if (isNumber(arg)) {
      return this.addPages(fromPage, arg);
    }
    if (isString(arg)) {
      return this.getDateParts(this.normalizeDate(arg));
    }
    if (isDate(arg)) {
      return this.getDateParts(arg as Date);
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

  getMonthNames(length: MonthNameLength) {
    const dtf = new Intl.DateTimeFormat(this.id, {
      month: length,
      timeZone: 'UTC',
    });
    return this.getMonthDates().map(d => dtf.format(d));
  }

  getWeekdayDates(firstDayOfWeek = this.firstDayOfWeek) {
    const dates = [];
    const year = 2020;
    const month = 1;
    const day = 5 + firstDayOfWeek - 1;
    for (let i = 0; i < daysInWeek; i++) {
      dates.push(
        this.getDateFromParts({
          year,
          month,
          day: day + i,
          hours: 12,
        }),
      );
    }
    return dates;
  }

  getDayNames(length: DayNameLength) {
    const dtf = new Intl.DateTimeFormat(this.id, {
      weekday: length,
      timeZone: this.timezone,
    });
    return this.getWeekdayDates(1).map(d => dtf.format(d));
  }

  addPages(
    { day, week, month, year }: PageAddress,
    count: number,
  ): PageAddress {
    if (day) {
      const date = new Date(year, month - 1, day);
      const newDate = addDays(date, count);
      return {
        day: newDate.getDate(),
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
      };
    } else if (week) {
      const comps = this.getMonthComps(month, year);
      const date = comps.firstDayOfMonth;
      const newDate = addDays(date, (week - 1 + count) * 7);
      const parts = this.getDateParts(newDate);
      return {
        week: parts.week,
        month: parts.month,
        year: parts.year,
      };
    } else {
      const date = new Date(year, month - 1, 1);
      const newDate = addMonths(date, count);
      return {
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
      };
    }
  }

  pageRangeToArray(from: PageAddress, to: PageAddress) {
    if (!pageIsValid(from) || !pageIsValid(to)) return [];
    const result = [];
    while (!pageIsAfterPage(from, to)) {
      result.push(from);
      from = this.addPages(from, 1);
    }
    return result;
  }

  // Days/month/year components for a given month and year
  getMonthComps(month: number, year: number) {
    const key = `${month}-${year}`;
    let comps = this.monthCache[key];
    if (!comps) {
      const inLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const firstWeekday = firstDayOfMonth.getDay() + 1;
      const days = month === 2 && inLeapYear ? 29 : daysInMonths[month - 1];
      const weekStartsOn = this.firstDayOfWeek - 1;
      const weeks = getWeeksInMonth(firstDayOfMonth, {
        weekStartsOn,
      });
      const weeknumbers = [];
      const isoWeeknumbers = [];
      for (let i = 0; i < weeks; i++) {
        const date = addDays(firstDayOfMonth, i * 7);
        weeknumbers.push(getWeek(date, { weekStartsOn }));
        isoWeeknumbers.push(getISOWeek(date));
      }
      comps = {
        firstDayOfWeek: this.firstDayOfWeek,
        firstDayOfMonth,
        inLeapYear,
        firstWeekday,
        days,
        weeks,
        month,
        year,
        weeknumbers,
        isoWeeknumbers,
      };
      this.monthCache[key] = comps;
    }
    return comps;
  }

  // Days/month/year components for today's month
  getThisMonthComps() {
    const { month, year } = this.getDateParts(new Date());
    return this.getMonthComps(month, year);
  }

  // Day/month/year components for previous month
  getPrevMonthComps(month: number, year: number) {
    if (month === 1) return this.getMonthComps(12, year - 1);
    return this.getMonthComps(month - 1, year);
  }

  // Day/month/year components for next month
  getNextMonthComps(month: number, year: number) {
    if (month === 12) return this.getMonthComps(1, year + 1);
    return this.getMonthComps(month + 1, year);
  }

  getDayId(date: Date) {
    return this.format(date, 'YYYY-MM-DD');
  }

  getPage(
    { day, week, month, year }: PageAddress,
    { trimWeeks, view, position }: PageOptions,
  ) {
    const keyComps = [year, month, week, day].filter(c => c! > 0);
    const key = keyComps.join('-');
    let page: Page = this.pageCache[key];
    if (!page) {
      const date = new Date(year, month - 1, 15);
      const monthComps = this.getMonthComps(month, year);
      const prevMonthComps = this.getPrevMonthComps(month, year);
      const nextMonthComps = this.getNextMonthComps(month, year);
      page = {
        key,
        month,
        year,
        view,
        position,
        weeksCount: trimWeeks ? monthComps.weeks : 6,
        title: this.format(date, this.masks.title),
        shortMonthLabel: this.format(date, 'MMM'),
        monthLabel: this.format(date, 'MMMM'),
        shortYearLabel: year.toString().substring(2),
        yearLabel: year.toString(),
        monthComps,
        prevMonthComps,
        nextMonthComps,
        days: [],
        weeks: [],
      };
      page.days = this.getDays(page);
      page.weeks = this.getWeeks(page);
      this.pageCache[key] = page;
    }
    const result: Page = { ...page };
    if (view === 'daily') {
      if (day) {
        result.day = day;
        const dayObj = result.days.find(d => d.day === day && d.inMonth)!;
        result.weeks = [result.weeks[dayObj.week - 1]];
        result.weeks[0].days = [dayObj];
        result.days = [dayObj];
      } else if (week) {
        const dayObj = result.weeks[week - 1].days[0];
        result.weeks = [result.weeks[week - 1]];
        result.weeks[0].days = [dayObj];
        result.days = [dayObj];
      } else {
        result.day = 1;
        const dayObj = result.weeks[0].days.find(d => d.inMonth)!;
        result.weeks = [result.weeks[0]];
        result.weeks[0].days = [dayObj];
        result.days = [dayObj];
      }
      result.title = result.days[0].ariaLabel;
    } else if (view === 'weekly') {
      result.week = week || 1;
      result.weeks = [result.weeks[result.week - 1]];
      result.days = result.weeks[0].days;
      result.title = result.weeks[0].title;
    }
    return result;
  }

  // Builds day components for a given page
  getDays(pg: Page): CalendarDay[] {
    const days: CalendarDay[] = [];
    const { weeksCount, monthComps, prevMonthComps, nextMonthComps } = pg;
    const {
      firstDayOfWeek,
      firstWeekday,
      isoWeeknumbers,
      weeknumbers,
    } = monthComps;
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
    const dft = (y: number, m: number, d: number) => (
      hours: number,
      minutes: number,
      seconds: number,
      milliseconds: number,
    ) =>
      this.normalizeDate({
        year: y,
        month: m,
        day: d,
        hours,
        minutes,
        seconds,
        milliseconds,
      });
    // Cycle through 6 weeks (max in month)
    for (let w = 1; w <= weeksCount; w++) {
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
        const range = {
          start: dateFromTime(0, 0, 0, 0),
          end: dateFromTime(23, 59, 59, 999),
        };
        const date = range.start;
        const id = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
        const weekdayPosition = i;
        const weekdayPositionFromEnd = daysInWeek - i;
        const weeknumber = weeknumbers[w - 1];
        const isoWeeknumber = isoWeeknumbers[w - 1];
        const isToday =
          day === todayDay && month === todayMonth && year === todayYear;
        const isFirstDay = thisMonth && day === 1;
        const isLastDay = thisMonth && day === monthComps.days;
        const onTop = w === 1;
        const onBottom = w === weeksCount;
        const onLeft = i === 1;
        const onRight = i === daysInWeek;
        days.push(
          reactive({
            id,
            label: day.toString(),
            ariaLabel: formatter.format(new Date(year, month - 1, day)),
            day,
            dayFromEnd,
            weekday,
            weekdayPosition,
            weekdayPositionFromEnd,
            weekdayOrdinal,
            weekdayOrdinalFromEnd,
            week,
            weekFromEnd,
            weekPosition: w,
            weeknumber,
            isoWeeknumber,
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
          }),
        );
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

  getWeeks(page: Page): CalendarWeek[] {
    const result = page.days.reduce(
      (result: CalendarWeek[], day: CalendarDay, i) => {
        const weekIndex = Math.floor(i / 7);
        let week = result[weekIndex];
        if (!week) {
          week = {
            id: `week-${weekIndex + 1}`,
            title: '',
            week: day.week,
            weekPosition: day.weekPosition,
            weeknumber: day.weeknumber,
            isoWeeknumber: day.isoWeeknumber,
            days: [],
          };
          result[weekIndex] = week;
        }
        week.days.push(day);
        return result;
      },
      Array(page.weeksCount),
    );
    result.forEach(week => {
      const fromDay = week.days[0];
      const toDay = week.days[week.days.length - 1];
      if (fromDay.month === toDay.month) {
        week.title = this.format(fromDay.date, 'MMMM YYYY');
      } else if (fromDay.year === toDay.year) {
        week.title = `${this.format(fromDay.date, 'MMM')} - ${this.format(
          toDay.date,
          'MMM',
        )} ${fromDay.year}`;
      } else {
        week.title = `${this.format(fromDay.date, 'MMM YYYY')} - ${this.format(
          toDay.date,
          'MMM YYYY',
        )}`;
      }
    });
    return result;
  }
}
