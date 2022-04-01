import { reactive } from 'vue';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import DateInfo, { DateInfoOptions } from './dateInfo';
import {
  DateSource,
  DateOptions,
  DayOfWeek,
  TimeNames,
  daysInWeek,
  getDateParts,
  getDayNames,
  getMonthNames,
  getMonthParts,
  getThisMonthParts,
  getPrevMonthParts,
  getNextMonthParts,
  formatDate,
  parseDate,
  normalizeDate,
  denormalizeDate,
  getHourDates,
  getRelativeTimeNames,
} from './dates';
import defaultLocales from './defaults/locales';
import { pad, PageAddress, pageIsAfterPage, pageIsValid } from './helpers';
import {
  isDate,
  isNumber,
  isString,
  isObject,
  isArray,
  has,
  defaultsDeep,
  clamp,
} from './_';

export type PageView = 'daily' | 'weekly' | 'monthly';
export type TitlePosition = 'center' | 'left' | 'right';

export interface Page extends PageAddress {
  id: string;
  day?: number;
  week?: number;
  month: number;
  year: number;
  view: PageView;
  titlePosition: TitlePosition;
  trimWeeks: boolean;
  position: number;
  row: number;
  rowFromEnd: number;
  column: number;
  columnFromEnd: number;
  weeksCount: number;
  showWeeknumbers: boolean;
  showIsoWeeknumbers: boolean;
  weeknumberPosition: string;
  monthTitle: string;
  weekTitle: string;
  dayTitle: string;
  title: string;
  shortMonthLabel: string;
  monthLabel: string;
  shortYearLabel: string;
  yearLabel: string;
  weekdayLabels: string[];
  monthComps: any;
  prevMonthComps: any;
  nextMonthComps: any;
  days: CalendarDay[];
  weeks: CalendarWeek[];
  viewDays: CalendarDay[];
  viewWeeks: CalendarWeek[];
}

export interface CalendarDay {
  id: string;
  position: number;
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
  isDisabled: boolean;
  isFocusable: boolean;
  inMonth: boolean;
  inPrevMonth: boolean;
  inNextMonth: boolean;
  onTop: boolean;
  onBottom: boolean;
  onLeft: boolean;
  onRight: boolean;
  classes: Array<string | Object>;
  dateFromTime: (
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ) => Date;
  locale: Locale;
}

export interface CalendarWeek {
  id: string;
  week: number;
  weekPosition: number;
  weeknumber: number;
  isoWeeknumber: number;
  weeknumberDisplay?: number;
  days: CalendarDay[];
  title: string;
}

export interface LocaleConfig {
  id: string;
  firstDayOfWeek: DayOfWeek;
  masks: any;
}

interface LocaleOptions {
  locales?: any;
  timezone?: string | undefined;
}

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
  monthCache: any;
  pageCache: any;

  constructor(
    config: Partial<LocaleConfig> | string | undefined = undefined,
    { locales = defaultLocales, timezone }: LocaleOptions = {},
  ) {
    const { id, firstDayOfWeek, masks } = resolveConfig(config, locales);
    this.id = id;
    this.daysInWeek = daysInWeek;
    this.firstDayOfWeek = clamp(firstDayOfWeek, 1, daysInWeek) as DayOfWeek;
    this.masks = masks;
    this.timezone = timezone || undefined;
    this.hourLabels = this.getHourLabels();
    this.dayNames = getDayNames('long', this.id, this.timezone);
    this.dayNamesShort = getDayNames('short', this.id, this.timezone);
    this.dayNamesShorter = this.dayNamesShort.map(s => s.substring(0, 2));
    this.dayNamesNarrow = getDayNames('narrow', this.id, this.timezone);
    this.monthNames = getMonthNames('long', this.id);
    this.monthNamesShort = getMonthNames('short', this.id);
    this.relativeTimeNames = getRelativeTimeNames(this.id);
    this.monthCache = {};
    this.pageCache = {};
  }

  formatDate(date: DateSource, masks: string | string[]) {
    return formatDate(date, masks, {
      locale: this,
      timezone: this.timezone,
    });
  }

  parseDate(dateString: string, mask: string | string[]) {
    return parseDate(dateString, mask, {
      locale: this,
      timezone: this.timezone,
    });
  }

  normalizeDate(d: DateSource, options: Partial<DateOptions> = {}) {
    return normalizeDate(d, {
      ...options,
      locale: this,
      timezone: this.timezone,
    });
  }

  denormalizeDate(date: Date, options: Partial<DateOptions> = {}) {
    return denormalizeDate(date, {
      ...options,
      locale: this,
      timezone: this.timezone,
    });
  }

  normalizeDates(dates: any, opts: Partial<DateInfoOptions> = {}) {
    opts.firstDayOfWeek = this.firstDayOfWeek;
    // Assign dates
    return (isArray(dates) ? dates : [dates])
      .map((d: any) => d && DateInfo.from(d, opts))
      .filter((d: any) => d);
  }

  getDateParts(date: Date) {
    return getDateParts(date, this.firstDayOfWeek, this.timezone);
  }

  getMonthParts(month: number, year: number) {
    return getMonthParts(month, year, this.firstDayOfWeek);
  }

  getThisMonthParts() {
    return getThisMonthParts(this.firstDayOfWeek);
  }

  getPrevMonthParts(month: number, year: number) {
    return getPrevMonthParts(month, year, this.firstDayOfWeek);
  }

  getNextMonthParts(month: number, year: number) {
    return getNextMonthParts(month, year, this.firstDayOfWeek);
  }

  toPage(
    arg: number | string | Date | PageAddress,
    fromPage: Page | undefined,
    view: string,
  ) {
    if (isNumber(arg)) {
      return this.addPages(fromPage || this.getPageForThisMonth()!, arg, view);
    }
    if (isString(arg)) {
      return this.getDateParts(this.normalizeDate(arg));
    }
    if (isDate(arg)) {
      return this.getDateParts(arg as Date);
    }
    if (isObject(arg)) {
      return arg as PageAddress;
    }
    return null;
  }

  getHourLabels() {
    return getHourDates().map(d => {
      return this.formatDate(d, this.masks.hours);
    });
  }

  getWeekdayLabels(page: Page) {
    return page.weeks[0].days.map(d => {
      return this.formatDate(d.date, this.masks.weekdays);
    });
    // return this.locale
    //   .getWeekdayDates()
    //   .map(d => this.format(d, this.masks.weekdays));
  }

  addPages(
    { day, week, month, year }: PageAddress,
    count: number,
    view: string,
  ): PageAddress {
    if (view === 'daily' && day) {
      const date = new Date(year, month - 1, day);
      const newDate = addDays(date, count);
      return {
        day: newDate.getDate(),
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
      };
    } else if (view === 'weekly' && week) {
      const comps = getMonthParts(month, year, this.firstDayOfWeek);
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

  pageRangeToArray(from: PageAddress, to: PageAddress, view: string) {
    if (!pageIsValid(from) || !pageIsValid(to)) return [];
    const result = [];
    while (!pageIsAfterPage(from, to)) {
      result.push(from);
      from = this.addPages(from, 1, view);
    }
    return result;
  }

  getDayId(date: Date) {
    return this.formatDate(date, 'YYYY-MM-DD');
  }

  getPage({ day, week, month, year }: PageAddress, options: Partial<Page>) {
    let id = `${year}-${pad(month, 2)}`;
    if (week) id = `${id}-w${week}`;
    if (day) id = `${id}-${pad(day, 2)}`;
    let page: Page = this.pageCache[id];
    if (!page) {
      const date = new Date(year, month - 1, 15);
      const monthComps = getMonthParts(month, year, this.firstDayOfWeek);
      const prevMonthComps = this.getPrevMonthParts(month, year);
      const nextMonthComps = this.getNextMonthParts(month, year);
      page = {
        id,
        month,
        year,
        view: 'monthly',
        trimWeeks: false,
        position: 1,
        row: 1,
        rowFromEnd: 1,
        column: 1,
        columnFromEnd: 1,
        weeksCount: options.trimWeeks ? monthComps.weeks : 6,
        showWeeknumbers: false,
        showIsoWeeknumbers: false,
        weeknumberPosition: '',
        monthTitle: this.formatDate(date, this.masks.title),
        weekTitle: '',
        dayTitle: '',
        title: '',
        titlePosition: 'center',
        shortMonthLabel: this.formatDate(date, 'MMM'),
        monthLabel: this.formatDate(date, 'MMMM'),
        shortYearLabel: year.toString().substring(2),
        yearLabel: year.toString(),
        weekdayLabels: [],
        monthComps,
        prevMonthComps,
        nextMonthComps,
        days: [],
        weeks: [],
        viewDays: [],
        viewWeeks: [],
        ...options,
      };
      page.days = this.getDays(page);
      page.weeks = this.getWeeks(page);
      page.weekdayLabels = this.getWeekdayLabels(page);
      this.pageCache[id] = page;
    }
    const result: Page = { ...page };
    switch (options.view) {
      case 'daily': {
        let dayObj = result.days.find(d => d.inMonth)!;
        if (day) {
          dayObj = result.days.find(d => d.day === day && d.inMonth) || dayObj;
        } else if (week) {
          dayObj = result.days.find(d => d.week === week && d.inMonth)!;
        }
        const weekObj = result.weeks[dayObj.week - 1];
        result.viewWeeks = [weekObj];
        result.viewDays = [dayObj];
        result.week = dayObj.week;
        result.weekTitle = weekObj.title;
        result.day = dayObj.day;
        result.dayTitle = dayObj.ariaLabel;
        result.title = result.dayTitle;
        break;
      }
      case 'weekly': {
        result.week = week || 1;
        const weekObj = result.weeks[result.week - 1];
        result.viewWeeks = [weekObj];
        result.viewDays = weekObj.days;
        result.weekTitle = weekObj.title;
        result.title = result.weekTitle;
        break;
      }
      default: {
        result.title = result.monthTitle;
        result.viewWeeks = result.weeks;
        result.viewDays = result.days;
        break;
      }
    }
    return result;
  }

  getDays(pg: Page): CalendarDay[] {
    const days: CalendarDay[] = [];
    const { weeksCount, monthComps, prevMonthComps, nextMonthComps } = pg;
    const { firstDayOfWeek, firstWeekday, isoWeeknumbers, weeknumbers } =
      monthComps;
    const prevMonthDaysToShow =
      firstWeekday +
      (firstWeekday < firstDayOfWeek ? daysInWeek : 0) -
      firstDayOfWeek;
    let prevMonth = true;
    let thisMonth = false;
    let nextMonth = false;
    let position = 0;
    // Formatter for aria labels
    const formatter = new Intl.DateTimeFormat(this.id, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
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
    const dft =
      (y: number, m: number, d: number) =>
      (hours: number, minutes: number, seconds: number, milliseconds: number) =>
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
            locale: this,
            id,
            position: ++position,
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
            isDisabled: !thisMonth,
            isFocusable: !thisMonth,
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
        let weeknumberDisplay = undefined;
        if (page.showWeeknumbers) weeknumberDisplay = day.weeknumber;
        else if (page.showIsoWeeknumbers) weeknumberDisplay = day.isoWeeknumber;
        if (!week) {
          week = {
            id: `week-${weekIndex + 1}`,
            title: '',
            week: day.week,
            weekPosition: day.weekPosition,
            weeknumber: day.weeknumber,
            isoWeeknumber: day.isoWeeknumber,
            weeknumberDisplay,
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
        week.title = `${this.formatDate(fromDay.date, 'MMMM YYYY')}`;
      } else if (fromDay.year === toDay.year) {
        week.title = `${this.formatDate(
          fromDay.date,
          'MMM',
        )} - ${this.formatDate(toDay.date, 'MMM YYYY')}`;
      } else {
        week.title = `${this.formatDate(
          fromDay.date,
          'MMM YYYY',
        )} - ${this.formatDate(toDay.date, 'MMM YYYY')}`;
      }
    });
    return result;
  }

  getPageForDate(date: DateSource) {
    return this.getDateParts(this.normalizeDate(date));
  }

  getPageForThisMonth() {
    return this.getPageForDate(new Date());
  }
}
