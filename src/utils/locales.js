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

// Month and day names are derived from Intl.DateTimeFormat
const getMonthNames = (locale, length) => {
  const dtf = new Intl.DateTimeFormat(locale, { month: length });
  return getMonthDates().map(d => dtf.format(d));
};
const getDayNames = (locale, length) => {
  const dtf = new Intl.DateTimeFormat(locale, { weekday: length });
  return getWeekdayDates().map(d => dtf.format(d));
};

export default (locale, defaults) => {
  locale = locale || new Intl.DateTimeFormat().resolvedOptions().locale;
  const searchLocales = [locale.toLowerCase(), locale.toLowerCase().substring(0, 2), 'en-us'];
  const matchKey = searchLocales.find(l => locales[l]);
  const matchValue = locales[matchKey];
  defaults.locale = matchKey;
  defaults.firstDayOfWeek = matchValue.dow || 1;
  defaults.dayNames = getDayNames(matchKey, 'long');
  defaults.dayNamesShort = getDayNames(matchKey, 'short');
  defaults.dayNamesShorter = defaults.dayNamesShort.map(s => s.substring(0, 2));
  defaults.dayNamesNarrow = getDayNames(matchKey, 'narrow');
  defaults.monthNames = getMonthNames(matchKey, 'long');
  defaults.monthNamesShort = getMonthNames(matchKey, 'short');
  defaults.masks = { L: matchValue.L };
};
