import DateInfo, { addDays } from '@/utils/dateInfo';
import Locale from '../../../src/utils/locale';

describe('addDays', () => {
  it('should add days correctly', () => {
    const origin = new Date(2018, 0, 1);
    expect(addDays(origin, 1).valueOf()).toEqual(
      new Date(2018, 0, 2).valueOf(),
    );
    expect(addDays(origin, 30).valueOf()).toEqual(
      new Date(2018, 0, 31).valueOf(),
    );
    expect(addDays(origin, -1).valueOf()).toEqual(
      new Date(2017, 11, 31).valueOf(),
    );
  });
});

describe('DateInfo simple date', () => {
  const locale = new Locale();
  const date = new DateInfo(new Date(2018, 0, 1), locale);
  it('should include simple date', () => {
    expect(date.includesDate(new Date(2018, 0, 1))).toEqual(true);
  });
  it('should not include simple dates', () => {
    expect(date.includesDate(new Date(2017, 11, 31))).toEqual(false);
    expect(date.includesDate(new Date(2018, 0, 2))).toEqual(false);
  });
  it('should include date range', () => {
    expect(
      date.includesDate(
        new DateInfo({
          start: new Date(2018, 0, 1),
          end: new Date(2018, 0, 1),
        }),
      ),
    ).toEqual(true);
  });
  it('should not include date ranges', () => {
    const ranges = [
      { start: new Date(2017, 11, 1), end: new Date(2017, 11, 31) },
      { start: new Date(2017, 11, 31), end: new Date(2018, 0, 1) },
      { start: new Date(2018, 0, 1), end: new Date(2018, 0, 2) },
      { start: new Date(2018, 0, 2), end: new Date(2018, 0, 31) },
      { start: new Date(2017, 11, 1), end: new Date(2018, 0, 31) },
    ];
    ranges.forEach(r =>
      expect(date.includesDate(new DateInfo(r))).toEqual(false),
    );
  });
});

describe('DateInfo date range', () => {
  const date = new DateInfo({
    start: new Date(2018, 0, 1),
    end: new Date(2018, 0, 15),
  });
  it('should include simple dates', () => {
    const dates = [
      new Date(2018, 0, 1),
      new Date(2018, 0, 10),
      new Date(2018, 0, 15),
    ];
    dates.forEach(d => expect(date.includesDate(d)).toEqual(true));
  });
  it('should not include simple dates', () => {
    const dates = [new Date(2017, 11, 31), new Date(2018, 0, 16)];
    dates.forEach(d => expect(date.includesDate(d)).toEqual(false));
  });
  it('should include date ranges', () => {
    const dates = [
      { start: new Date(2018, 0, 1), end: new Date(2018, 0, 1) },
      { start: new Date(2018, 0, 1), end: new Date(2018, 0, 2) },
      { start: new Date(2018, 0, 2), end: new Date(2018, 0, 14) },
      { start: new Date(2018, 0, 14), end: new Date(2018, 0, 15) },
      { start: new Date(2018, 0, 15), end: new Date(2018, 0, 15) },
    ];
    dates.forEach(d => expect(date.includesDate(d)).toEqual(true));
  });
  it('should not include date ranges', () => {
    const dates = [
      { start: new Date(2017, 11, 1), end: new Date(2017, 11, 31) },
      { start: new Date(2017, 11, 31), end: new Date(2018, 0, 1) },
      { start: new Date(2018, 0, 15), end: new Date(2018, 0, 16) },
      { start: new Date(2018, 0, 16), end: new Date(2018, 0, 31) },
      { start: new Date(2017, 11, 31), end: new Date(2018, 0, 16) },
    ];
    dates.forEach(d => expect(date.includesDate(d)).toEqual(false));
  });
});
