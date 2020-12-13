import lodash from 'lodash';
import dayData from '../util/dayData.json';
import Locale from '../../../src/utils/locale';
import locales from '../../../src/utils/defaults/locales';

function matchLocaleWithConfig(locale, config) {
  expect(locale.id).toEqual(config.id);
  expect(locale.firstDayOfWeek).toEqual(config.firstDayOfWeek);
  expect(locale.masks).toEqual(config.masks);
}

function testLocaleKeys(locale) {
  const keys = [
    'id',
    'firstDayOfWeek',
    'masks',
    'dayNames',
    'dayNamesShort',
    'dayNamesShorter',
    'dayNamesNarrow',
    'monthNames',
    'monthNamesShort',
    'monthData',
    'getMonthComps',
    'parse',
    'format',
  ];
  expect(keys.every(k => lodash.has(locale, k))).toEqual(true);
}

describe('Locale', () => {
  it('should initialize with undefined config', () => {
    testLocaleKeys(new Locale());
  });
  it('should initialize with string config', () => {
    const config = 'en-ZA';
    const locale = new Locale(config);
    matchLocaleWithConfig(locale, {
      id: 'en-ZA',
      firstDayOfWeek: 1,
      masks: { L: 'YYYY/MM/DD' },
    });
  });
  it('should initialize with lower-cased string config', () => {
    const config = 'en-za';
    const locale = new Locale(config);
    matchLocaleWithConfig(locale, {
      id: 'en-ZA',
      firstDayOfWeek: 1,
      masks: { L: 'YYYY/MM/DD' },
    });
  });
  it('should initialize with empty string config', () => {
    const config = '';
    testLocaleKeys(new Locale(config));
  });
  it('should initialize with undefined config data', () => {
    const config = {
      id: undefined,
      firstDayOfWeek: undefined,
      masks: undefined,
    };
    testLocaleKeys(new Locale(config));
  });
  it('should initialize with default configs', () => {
    lodash.toPairs(locales).forEach(([id, config]) => {
      const locale = new Locale(id);
      matchLocaleWithConfig(locale, config);
    });
  });

  it('should initialize with partial config data', () => {
    const config = {
      id: 'en',
      firstDayOfWeek: undefined,
      masks: undefined,
    };
    const locale = new Locale(config);
    matchLocaleWithConfig(locale, {
      id: 'en',
      firstDayOfWeek: 1,
      masks: { L: 'MM/DD/YYYY' },
    });
  });
  it('should initialize with overriding config data', () => {
    const config = {
      id: 'en',
      firstDayOfWeek: 3,
      masks: { L: 'DD-MM-YYYY' },
    };
    const locale = new Locale(config);
    matchLocaleWithConfig(locale, config);
  });
  it('should calculate day components correctly', () => {
    const testComponent = c => {
      const locale = new Locale(undefined, { timezone: c.timezone });
      const day = locale.getDateParts(new Date(c.date));
      const omitKeys = ['date', 'timezone'];
      return Object.keys(c)
        .filter(k => !omitKeys.includes(k))
        .every(k => {
          return c[k] === day[k];
        });
    };
    dayData.forEach(c => expect(testComponent(c)).toEqual(true));
  });
});
