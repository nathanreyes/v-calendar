import { getMonthDates, getWeekdayDates } from './helpers';

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

// Month and day names are derived from Intl.DateTimeFormat
const getMonthNames = (locale, length) => {
  const dtf = new Intl.DateTimeFormat(locale, {
    month: length,
    timezome: 'UTC',
  });
  return getMonthDates().map(d => dtf.format(d));
};
const getDayNames = (locale, length) => {
  const dtf = new Intl.DateTimeFormat(locale, {
    weekday: length,
    timeZone: 'UTC',
  });
  return getWeekdayDates({ utc: true }).map(d => dtf.format(d));
};

/* eslint-disable no-bitwise */
const DoFn = d =>
  `${d}${[null, 'st', 'nd', 'rd'][((d % 100) >> 3) ^ 1 && d % 10] || 'th'}`;

export default locale => {
  const detectedLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
  const searchLocales = [
    locale,
    locale && locale.substring(0, 2),
    detectedLocale,
  ];
  const resolvedLocale =
    searchLocales.find(l => locales[l]) || locale || detectedLocale;
  const localeExtra = {
    dow: 1,
    L: 'DD/MM/YYYY',
    ...locales[resolvedLocale],
  };
  const dayNames = getDayNames(resolvedLocale, 'long');
  const dayNamesShort = getDayNames(resolvedLocale, 'short');
  const dayNamesShorter = dayNamesShort.map(s => s.substring(0, 2));
  const dayNamesNarrow = getDayNames(resolvedLocale, 'narrow');
  const monthNames = getMonthNames(resolvedLocale, 'long');
  const monthNamesShort = getMonthNames(resolvedLocale, 'short');
  return {
    locale: resolvedLocale,
    firstDayOfWeek: localeExtra.dow,
    masks: { L: localeExtra.L },
    dayNames,
    dayNamesShort,
    dayNamesShorter,
    dayNamesNarrow,
    monthNames,
    monthNamesShort,
    DoFn,
  };
};
