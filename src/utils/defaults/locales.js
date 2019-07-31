import { toPairs } from '@/utils/_';

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
  'zh-TW': { dow: 1, L: 'YYYY/MM/DD' },
  // Croatian
  hr: { dow: 2, L: 'DD.MM.YYYY' },
  // Czech
  cs: { dow: 2, L: 'DD.MM.YYYY' },
  // Danish
  da: { dow: 2, L: 'DD.MM.YYYY' },
  // Dutch
  nl: { dow: 2, L: 'DD.MM.YYYY' },
  // English (US)
  'en-US': { dow: 1, L: 'MM/DD/YYYY' },
  // English (Australia)
  'en-AU': { dow: 2, L: 'DD/MM/YYYY' },
  // English (Canada)
  'en-CA': { dow: 1, L: 'YYYY-MM-DD' },
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
  'fr-CA': { dow: 1, L: 'YYYY-MM-DD' },
  // French (Switzerland)
  'fr-CH': { dow: 2, L: 'DD.MM.YYYY' },
  // German
  de: { dow: 2, L: 'DD.MM.YYYY' },
  // Indonesian
  id: { dow: 2, L: 'DD/MM/YYYY' },
  // Italian
  it: { dow: 2, L: 'DD/MM/YYYY' },
  // Japanese
  ja: { dow: 1, L: 'YYYY年M月D日' },
  // Korean
  ko: { dow: 1, L: 'YYYY.MM.DD' },
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
  th: { dow: 1, L: 'DD/MM/YYYY' },
  // Turkish
  tr: { dow: 2, L: 'DD.MM.YYYY' },
  // Ukrainian
  uk: { dow: 2, L: 'DD.MM.YYYY' },
};
locales.en = locales['en-US'];
locales.zh = locales['zh-CN'];

// Remap from abbr. to intuitive property names
toPairs(locales).forEach(([id, { dow, L }]) => {
  locales[id] = {
    id,
    firstDayOfWeek: dow,
    masks: { L },
  };
});

export default locales;
