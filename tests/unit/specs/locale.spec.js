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
    'toDate',
  ];
  expect(keys.every(k => lodash.has(locale, k))).toEqual(true);
}

describe('Locale', () => {
  it('should initialize with undefined config', () => {
    testLocaleKeys(new Locale());
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
      const locale = new Locale();
      const day = locale.getDayFromDate(new Date(c.date));
      if (c.day !== day.day) return false;
      if (c.dayFromEnd !== day.dayFromEnd) return false;
      if (c.weekday !== day.weekday) return false;
      if (c.weekdayOrdinal !== day.weekdayOrdinal) return false;
      if (c.weekdayOrdinalFromEnd !== day.weekdayOrdinalFromEnd) return false;
      if (c.week !== day.week) return false;
      if (c.weekFromEnd !== day.weekFromEnd) return false;
      if (c.month !== day.month) return false;
      if (c.year !== day.year) return false;
      return true;
    };
    dayData.forEach(c => expect(testComponent(c)).toEqual(true));
  });
});
