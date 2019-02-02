import DateInfo, { addDays, getDayFromDate } from '@/utils/dateInfo';
import dayData from '../util/dayData.json';

describe('addDays', () => {
  it('should add days correctly', () => {
    const origin = new Date(2018, 0, 1);
    expect(addDays(origin, 1).valueOf()).toEqual((new Date(2018, 0, 2)).valueOf());
    expect(addDays(origin, 30).valueOf()).toEqual((new Date(2018, 0, 31)).valueOf());
    expect(addDays(origin, -1).valueOf()).toEqual((new Date(2017, 11, 31)).valueOf());
  });
});

describe('getDayFromDate', () => {
  it('should calculate day components correctly', () => {
    const testComponent = (c) => {
      const day = getDayFromDate(new Date(c.date));
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

describe('DateInfo simple date', () => {
  const date = DateInfo(new Date(2018, 0, 1));
  it('should include simple date', () => {
    expect(date.includesDate(new Date(2018, 0, 1))).toEqual(true);
  });
  it('should not include simple dates', () => {
    expect(date.includesDate(new Date(2017, 11, 31))).toEqual(false);
    expect(date.includesDate(new Date(2018, 0, 2))).toEqual(false);
  });
  it('should include date range', () => {
    expect(date.includesDate(DateInfo({
      start: new Date(2018, 0, 1),
      end: new Date(2018, 0, 1),
    }))).toEqual(true);
  });
  it('should not include date ranges', () => {
    const ranges = [
      { start: new Date(2017, 11, 1), end: new Date(2017, 11, 31) },
      { start: new Date(2017, 11, 31), end: new Date(2018, 0, 1) },
      { start: new Date(2018, 0, 1), end: new Date(2018, 0, 2) },
      { start: new Date(2018, 0, 2), end: new Date(2018, 0, 31) },
      { start: new Date(2017, 11, 1), end: new Date(2018, 0, 31) },
    ];
    ranges.forEach(r => expect(date.includesDate(DateInfo(r))).toEqual(false));
  });
});

describe('DateInfo date range', () => {
  const date = DateInfo({ start: new Date(2018, 0, 1), end: new Date(2018, 0, 15) });
  it('should include simple dates', () => {
    const dates = [new Date(2018, 0, 1), new Date(2018, 0, 10), new Date(2018, 0, 15)];
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
