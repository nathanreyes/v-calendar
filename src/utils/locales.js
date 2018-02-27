import fecha from './fecha';
import { getMonthDates, getWeekdayDates } from './dateInfo';

// Month and day names are derived from Intl.DateTimeFormat
const getMonthNames = (locale, length) => {
  const dtf = new Intl.DateTimeFormat(locale, { month: length });
  return getMonthDates().map(d => dtf.format(d));
};
const getDayNames = (locale, length) => {
  const dtf = new Intl.DateTimeFormat(locale, { weekday: length });
  return getWeekdayDates().map(d => dtf.format(d));
};

// Infer first day of week === 1 if not listed (dow)
const locales = {
  // Arabic
  ar: { dow: 7, L: 'D/\u200FM/\u200FYYYY' },
  // Bulgarian
  bg: { dow: 2, L: 'D.MM.YYYY' },
  // Catalan
  ca: { dow: 2, L: 'DD/MM/YYYY' },
  // Chinese (China)
  'zh-cn': { dow: 2, L: 'YYYY/MM/DD' },
  // Chinese (Taiwan)
  'zh-tw': { L: 'YYYY/MM/DD' },
  // Croatian
  hr: { dow: 2, L: 'DD.MM.YYYY' },
  // Czech
  cs: { dow: 2, L: 'DD.MM.YYYY' },
  // Danish
  da: { dow: 2, L: 'DD.MM.YYYY' },
  // Dutch
  nl: { dow: 2, L: 'DD.MM.YYYY' },
  // English (US)
  'en-us': { L: 'MM/DD/YYYY' },
  // English (Australia)
  'en-au': { dow: 2, L: 'DD/MM/YYYY' },
  // English (Canada)
  'en-ca': { L: 'YYYY-MM-DD' },
  // English (Great Britain)
  'en-gb': { dow: 2, L: 'DD/MM/YYYY' },
  // English (Ireland)
  'en-ie': { dow: 2, L: 'DD-MM-YYYY' },
  // English (New Zealand)
  'en-nz': { dow: 2, L: 'DD/MM/YYYY' },
  // Esperanto
  eo: { dow: 2, L: 'YYYY-MM-DD' },
  // Finnish
  fi: { dow: 2, L: 'Do MMMM[ta] YYYY' },
  // French
  fr: { dow: 2, L: 'DD/MM/YYYY' },
  // French (Canada)
  'fr-ca': { L: 'YYYY-MM-DD' },
  // French (Switzerland)
  'fr-ch': { dow: 2, L: 'DD.MM.YYYY' },
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
  tk: { dow: 2, L: 'DD.MM.YYYY' },
};
locales.en = locales['en-us'];
locales.zh = locales['zh-cn'];

const setupLocale = (locale, defaults) => {
  const l = locale || new Intl.DateTimeFormat().resolvedOptions().locale;
  const lMatch = l && (locales[l.toLowerCase()] || locales[l.toLowerCase().substring(0, 1)]);
  fecha.i18n = {
    ...fecha.i18n,
    dayNames: getDayNames(locale, 'long'),
    dayNamesShort: getDayNames(locale, 'short'),
    dayNamesNarrow: getDayNames(locale, 'narrow'),
    monthNames: getMonthNames(locale, 'long'),
    monthNamesShort: getMonthNames(locale, 'short'),
  };
  if (lMatch) {
    fecha.masks = {
      L: lMatch.L,
    };
    defaults.firstDayOfWeek = lMatch.dow || 1;
  }
};

export default setupLocale;
