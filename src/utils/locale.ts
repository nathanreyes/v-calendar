import {
  type PageConfig,
  type CachedPage,
  getPageKey,
  getCachedPage,
  getPage,
} from './page';
import {
  type DateSource,
  type DateOptions,
  type DayOfWeek,
  type MonthParts,
  type MonthInYear,
  type SimpleDateParts,
  type TimeNames,
  DatePatchKeys,
  applyRulesForDateParts,
  daysInWeek,
  formatDate,
  parseDate,
  getDateParts,
  getDateFromParts,
  getDayNames,
  getMonthNames,
  getMonthParts,
  getMonthPartsKey,
  getHourDates,
  getRelativeTimeNames,
  isDateParts,
} from './date/helpers';
import Cache from './cache';
import { type DateRangeSource, DateRange } from './date/range';
import { defaultLocales } from './defaults';
import {
  isString,
  isNumber,
  isDate,
  isObject,
  has,
  pick,
  clamp,
  defaultsDeep,
} from './helpers';

export interface LocaleConfig {
  id: string;
  firstDayOfWeek: number;
  masks: any;
  monthCacheSize: number;
  pageCacheSize: number;
}

const DEFAULT_MONTH_CACHE_SIZE = 12;
const DEFAULT_PAGE_CACHE_SIZE = 5;

export function resolveConfig(
  config: string | Partial<LocaleConfig> | undefined,
  locales: any,
) {
  // Get the detected locale string
  const detLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
  // Resolve the locale id
  let id;
  if (isString(config)) {
    id = config;
  } else if (has(config, 'id')) {
    id = config!.id;
  }
  id = (id || detLocale).toLowerCase();
  const localeKeys = Object.keys(locales);
  const validKey = (k: string) => localeKeys.find(lk => lk.toLowerCase() === k);
  id = validKey(id) || validKey(id.substring(0, 2)) || detLocale;
  // Add fallback and spread default locale to prevent repetitive update loops
  const defLocale: LocaleConfig = {
    ...locales['en-IE'],
    ...locales[id],
    id,
    monthCacheSize: DEFAULT_MONTH_CACHE_SIZE,
    pageCacheSize: DEFAULT_PAGE_CACHE_SIZE,
  };
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
  firstDayOfWeek: DayOfWeek;
  masks: any;
  timezone: string | undefined;
  hourLabels: string[];
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesShorter: string[];
  dayNamesNarrow: string[];
  monthNames: string[];
  monthNamesShort: string[];
  relativeTimeNames: TimeNames;
  amPm: [string, string] = ['am', 'pm'];
  monthCache: Cache<MonthParts>;
  pageCache: Cache<CachedPage>;

  constructor(
    config: Partial<LocaleConfig> | string | undefined = undefined,
    timezone?: string,
  ) {
    const { id, firstDayOfWeek, masks, monthCacheSize, pageCacheSize } =
      resolveConfig(config, defaultLocales.value);
    this.monthCache = new Cache(
      monthCacheSize,
      getMonthPartsKey,
      getMonthParts,
    );
    this.pageCache = new Cache(pageCacheSize, getPageKey, getCachedPage);
    this.id = id;
    this.daysInWeek = daysInWeek;
    this.firstDayOfWeek = clamp(firstDayOfWeek, 1, daysInWeek) as DayOfWeek;
    this.masks = masks;
    this.timezone = timezone || undefined;
    this.hourLabels = this.getHourLabels();
    this.dayNames = getDayNames('long', this.id);
    this.dayNamesShort = getDayNames('short', this.id);
    this.dayNamesShorter = this.dayNamesShort.map(s => s.substring(0, 2));
    this.dayNamesNarrow = getDayNames('narrow', this.id);
    this.monthNames = getMonthNames('long', this.id);
    this.monthNamesShort = getMonthNames('short', this.id);
    this.relativeTimeNames = getRelativeTimeNames(this.id);
  }

  formatDate(date: Date, masks: string | string[]) {
    return formatDate(date, masks, this);
  }

  parseDate(dateString: string, mask: string | string[]) {
    return parseDate(dateString, mask, this);
  }

  toDate(
    d: DateSource | Partial<SimpleDateParts>,
    opts: Partial<DateOptions> = {},
  ): Date {
    const nullDate = new Date(NaN);
    let result = nullDate;
    const { fillDate, mask, patch, rules } = opts;
    if (isNumber(d)) {
      opts.type = 'number';
      result = new Date(+d);
    } else if (isString(d)) {
      opts.type = 'string';
      result = d ? parseDate(d, mask || 'iso', this) : nullDate;
    } else if (isDate(d)) {
      opts.type = 'date';
      result = new Date(d.getTime());
    } else if (isDateParts(d)) {
      opts.type = 'object';
      result = this.getDateFromParts(d);
    }
    // Patch parts or apply rules if needed
    if (result && (patch || rules)) {
      let parts = this.getDateParts(result);
      // Patch date parts
      if (patch && fillDate != null) {
        const fillParts = this.getDateParts(this.toDate(fillDate));
        parts = this.getDateParts(
          this.toDate({ ...fillParts, ...pick(parts, DatePatchKeys[patch]) }),
        );
      }
      // Apply date part rules
      if (rules) {
        parts = applyRulesForDateParts(parts, rules);
      }
      result = this.getDateFromParts(parts);
    }
    return result || nullDate;
  }

  toDateOrNull(
    d: DateSource | Partial<SimpleDateParts>,
    opts: Partial<DateOptions> = {},
  ): Date | null {
    const dte = this.toDate(d, opts);
    return isNaN(dte.getTime()) ? null : dte;
  }

  fromDate(date: Date, { type, mask }: Partial<DateOptions> = {}) {
    switch (type) {
      case 'number':
        return date ? date.getTime() : NaN;
      case 'string':
        return date ? this.formatDate(date, mask || 'iso') : '';
      case 'object':
        return date ? this.getDateParts(date) : null;
      default:
        return date ? new Date(date) : null;
    }
  }

  range(source: DateRangeSource) {
    return DateRange.from(source, this);
  }

  ranges(ranges: DateRangeSource | DateRangeSource[]) {
    return DateRange.fromMany(ranges, this);
  }

  getDateParts(date: Date) {
    return getDateParts(date, this);
  }

  getDateFromParts(parts: Partial<SimpleDateParts>) {
    return getDateFromParts(parts, this.timezone);
  }

  getDateFromParams(
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ) {
    return this.getDateFromParts({
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      milliseconds,
    });
  }

  getPage(config: PageConfig) {
    const cachedPage = this.pageCache.getOrSet(config, this);
    return getPage(config, cachedPage);
  }

  getMonthParts(month: number, year: number) {
    const { firstDayOfWeek } = this;
    return this.monthCache.getOrSet(month, year, firstDayOfWeek);
  }

  getThisMonthParts() {
    const date = new Date();
    return this.getMonthParts(
      <MonthInYear>(date.getMonth() + 1),
      date.getFullYear(),
    );
  }

  getPrevMonthParts(month: number, year: number) {
    if (month === 1) return this.getMonthParts(12, year - 1);
    return this.getMonthParts(month - 1, year);
  }

  getNextMonthParts(month: number, year: number) {
    if (month === 12) return this.getMonthParts(1, year + 1);
    return this.getMonthParts(month + 1, year);
  }

  getHourLabels() {
    return getHourDates().map(d => {
      return this.formatDate(d, this.masks.hours);
    });
  }

  getDayId(date: Date) {
    return this.formatDate(date, 'YYYY-MM-DD');
  }
}
