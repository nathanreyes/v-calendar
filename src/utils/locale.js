import { format, parse } from '@/utils/fecha';
import { isDate, isNumber, isString, isObject } from '@/utils/_';

const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Infer first day of week === 1 if not listed (dow)
const locales = {
  // Arabic
  ar: { dow: 7, L: 'D/\u200FM/\u200FYYYY' },
  // Bulgarian
  bg: { dow: 2, L: 'D.MM.YYYY' },
  // Catalan
  ca: { dow: 2, L: 'DD/MM/YYYY' },
  // Chinese (China)
  'zh-CN': { dow: 2, L: 'YYYY/MM/DD' },
  // Chinese (Taiwan)
  'zh-TW': { L: 'YYYY/MM/DD' },
  // Croatian
  hr: { dow: 2, L: 'DD.MM.YYYY' },
  // Czech
  cs: { dow: 2, L: 'DD.MM.YYYY' },
  // Danish
  da: { dow: 2, L: 'DD.MM.YYYY' },
  // Dutch
  nl: { dow: 2, L: 'DD.MM.YYYY' },
  // English (US)
  'en-US': { L: 'MM/DD/YYYY' },
  // English (Australia)
  'en-AU': { dow: 2, L: 'DD/MM/YYYY' },
  // English (Canada)
  'en-CA': { L: 'YYYY-MM-DD' },
  // English (Great Britain)
  'en-GB': { dow: 2, L: 'DD/MM/YYYY' },
  // English (Ireland)
  'en-IE': { dow: 2, L: 'DD-MM-YYYY' },
  // English (New Zealand)
  'en-NZ': { dow: 2, L: 'DD/MM/YYYY' },
  // Esperanto
  eo: { dow: 2, L: 'YYYY-MM-DD' },
  // Finnish
  fi: { dow: 2, L: 'Do MMMM[ta] YYYY' },
  // French
  fr: { dow: 2, L: 'DD/MM/YYYY' },
  // French (Canada)
  'fr-CA': { L: 'YYYY-MM-DD' },
  // French (Switzerland)
  'fr-CH': { dow: 2, L: 'DD.MM.YYYY' },
  // German
  de: { dow: 2, L: 'DD.MM.YYYY' },
  // Indonesian
  id: { dow: 2, L: 'DD/MM/YYYY' },
  // Italian
  it: { dow: 2, L: 'DD/MM/YYYY' },
  // Japanese
  ja: { L: 'YYYY年M月D日' },
  // Korean
  ko: { L: 'YYYY.MM.DD' },
  // Macedonian
  mk: { dow: 2, L: 'D.MM.YYYY' },
  // Polish
  pl: { dow: 2, L: 'DD.MM.YYYY' },
  // Portuguese
  pt: { dow: 2, L: 'DD/MM/YYYY' },
  // Romanian
  ro: { dow: 2, L: 'DD.MM.YYYY' },
  // Russian
  ru: { dow: 2, L: 'DD.MM.YYYY' },
  // Slovak
  sk: { dow: 2, L: 'DD.MM.YYYY' },
  // Spanish
  es: { dow: 1, L: 'DD/MM/YYYY' },
  // Swedish
  sv: { dow: 2, L: 'YYYY-MM-DD' },
  // Thai
  th: { L: 'DD/MM/YYYY' },
  // Turkish
  tr: { dow: 2, L: 'DD.MM.YYYY' },
  // Ukrainian
  uk: { dow: 2, L: 'DD.MM.YYYY' },
};
locales.en = locales['en-US'];
locales.zh = locales['zh-CN'];

export default class Locale {
  constructor(locale) {
    const detectedLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
    const searchLocales = [
      locale,
      locale && locale.substring(0, 2),
      detectedLocale,
    ];
    this.locale =
      searchLocales.find(l => locales[l]) || locale || detectedLocale;
    const localeData = locales[this.locale] || {};
    this.firstDayOfWeek = localeData.dow || 1;
    this.masks = { L: localeData.L || 'DD/MM/YYYY' };
    this.dayNames = this.getDayNames('long');
    this.dayNamesShort = this.getDayNames('short');
    this.dayNamesShorter = this.dayNamesShort.map(s => s.substring(0, 2));
    this.dayNamesNarrow = this.getDayNames('narrow');
    this.monthNames = this.getMonthNames('long');
    this.monthNamesShort = this.getMonthNames('short');
    this.monthData = {};
  }

  parse(dateStr, mask) {
    return parse(dateStr, mask || this.masks[L], this);
  }

  format(date, mask) {
    return format(date, mask || this.masks[L], this);
  }

  toDate(d, format) {
    if (isDate(d)) {
      return new Date(d.getTime());
    }
    if (isNumber(d)) {
      return new Date(d);
    }
    if (isString(d)) {
      return this.parse(d, format);
    }
    if (isObject(d)) {
      const date = new Date();
      return new Date(
        d.year || date.getFullYear(),
        d.month || date.getMonth(),
        d.day || date.getDate(),
      );
    }
    return d;
  }

  getMonthDates(year = 2000) {
    const dates = [];
    for (let i = 0; i < 12; i++) {
      dates.push(new Date(year, i, 15));
    }
    return dates;
  }

  getMonthNames(length) {
    const dtf = new Intl.DateTimeFormat(this.locale, {
      month: length,
      timezome: 'UTC',
    });
    return this.getMonthDates().map(d => dtf.format(d));
  }

  getWeekdayDates({ year = 2000, utc = false }) {
    const dates = [];
    for (let i = 1, j = 0; j < 7; i++) {
      const d = utc ? new Date(Date.UTC(year, 0, i)) : new Date(year, 0, i);
      const day = utc ? d.getUTCDay() : d.getDay();
      if (day === this.firstDayOfWeek - 1 || j > 0) {
        dates.push(d);
        j++;
      }
    }
    return dates;
  }

  getDayNames(length) {
    const dtf = new Intl.DateTimeFormat(this.locale, {
      weekday: length,
      timeZone: 'UTC',
    });
    return this.getWeekdayDates({ utc: true }).map(d => dtf.format(d));
  }

  // Days/month/year components for a given month and year
  getMonthComps(month, year) {
    const key = `${month}.${year}`;
    let comps = this.monthData[key];
    if (!comps) {
      const inLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const firstWeekday = new Date(year, month - 1, 1).getDay() + 1;
      const days = month === 2 && inLeapYear ? 29 : daysInMonths[month - 1];
      const weeks = Math.ceil(
        (days + Math.abs(firstWeekday - this.firstDayOfWeek)) / 7,
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
}
