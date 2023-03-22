import { describe, expect, it } from 'vitest';
import Locale from '@/utils/locale';
import { DateParts, addDays } from '@/utils/date/helpers';
import { DateRange, DateRangeContext } from '@/utils/date/range';
import ranges from '../../util/ranges.json';

function datePartsMatch(dp1: DateParts | null, dp2: DateParts | null) {
  if (dp1 == null || dp2 == null) return dp1 == null && dp2 == null;
  Object.keys(dp1).forEach(key => {
    if (dp1[key as keyof DateParts] !== dp2[key as keyof DateParts])
      return false;
  });
  return true;
}

describe('DateRange', () => {
  const locale = new Locale();
  it('should initialize with date', () => {
    const date = new Date(2023, 0, 1);
    const dateParts = locale.getDateParts(date);
    const { start, end } = locale.range(date);
    expect(datePartsMatch(dateParts, start)).toEqual(true);
    expect(datePartsMatch(dateParts, end)).toEqual(true);
  });
  it('should initialize with date-like date', () => {
    const strDate = '2023-01-03T10:00:00.123Z';
    const date = new Date(strDate);
    const { start, end } = locale.range(strDate);
    expect(datePartsMatch(locale.getDateParts(date), start)).toEqual(true);
    expect(datePartsMatch(locale.getDateParts(date), end)).toEqual(true);
  });
  it('should initialize with dates array', () => {
    const d1 = new Date(2023, 0, 1);
    const d2 = new Date(2023, 1, 1);
    const d1Parts = locale.getDateParts(d1);
    const d2Parts = locale.getDateParts(d2);
    const { start, end } = locale.range([d1, d2]);
    expect(datePartsMatch(d1Parts, start)).toEqual(true);
    expect(datePartsMatch(d2Parts, end)).toEqual(true);
  });
  it('should initialize with object start and end dates', () => {
    const config = {
      start: new Date(2023, 0, 1),
      end: new Date(2023, 1, 1),
    };
    const { start, end } = locale.range(config);
    expect(datePartsMatch(locale.getDateParts(config.start), start)).toEqual(
      true,
    );
    expect(datePartsMatch(locale.getDateParts(config.end), end)).toEqual(true);
  });
  it('should initialize with object start and end date-like dates', () => {
    const config = {
      start: '2023-01-01T10:00:00',
      end: '2023-01-03T10:00:00.123Z',
    };
    const { start, end } = locale.range(config);
    expect(
      datePartsMatch(locale.getDateParts(new Date(config.start)), start),
    ).toEqual(true);
    expect(
      datePartsMatch(locale.getDateParts(new Date(config.end)), end),
    ).toEqual(true);
  });
  it('should initialize with object start date and span', () => {
    const config = {
      start: new Date(2023, 0, 1),
      span: 3,
    };
    const { start, end } = locale.range(config);
    expect(datePartsMatch(locale.getDateParts(config.start), start)).toEqual(
      true,
    );
    expect(
      datePartsMatch(locale.getDateParts(new Date(2023, 0, 3)), end),
    ).toEqual(true);
  });
});

function daysInRange({ start, end, locale }: DateRange) {
  if (start == null || end == null) {
    throw new Error('Start or end date must be a non-null value');
  }
  let day = start;
  const result = [day];
  while (day.dayIndex <= end.dayIndex) {
    day = locale.getDateParts(addDays(day.date, 1));
    result.push(day);
  }
  return result;
}

describe('DateRangeContext', () => {
  const locale = new Locale();
  const ctxRange = locale.range({
    start: new Date(2023, 0, 1),
    end: new Date(2024, 0, 1),
  });
  const days = daysInRange(ctxRange);
  const ctx = new DateRangeContext();
  ranges.forEach(({ summary, range, includes, excludes }, i) => {
    it(`should render ${summary}`, () => {
      ctx.render({ key: i }, locale.range(range), days);
      includes.forEach(strDate => {
        const day = locale.getDateParts(new Date(strDate));
        expect(ctx.cellExists(i, day.dayIndex)).toEqual(true);
      });
      excludes.forEach(strDate => {
        const day = locale.getDateParts(new Date(strDate));
        expect(ctx.cellExists(i, day.dayIndex)).toEqual(false);
      });
    });
  });
});
