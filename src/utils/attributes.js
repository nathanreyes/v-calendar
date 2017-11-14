// This file is left over as a working concept for having a centralized data store

import {
  getHighlight,
  dot,
  bar,
} from './defaults';

import {
  DateInfo,
  getMonthComps,
} from './helpers';

export default class Attributes {
  constructor(attributes) {
    this.map = {};
    this.list = [];
    if (!attributes || !attributes.length) return;

    this.list = attributes.map((a, i) => {
      const newAttribute = {
        key: a.key || i.toString(),
        dates: a.dates.map(d => (d instanceof DateInfo ? d : new DateInfo(d, a.order))),
        order: a.order || 0,
      };
      if (a.highlight) {
        newAttribute.highlight = getHighlight(a.highlight);
      }
      if (a.dot) {
        newAttribute.dot = {
          ...dot,
          ...a.dot,
        };
      }
      if (a.bar) {
        newAttribute.bar = {
          ...bar,
          ...a.bar,
        };
      }
      if (a.contentStyle) {
        newAttribute.contentStyle = {
          ...a.contentStyle,
        };
      }
      if (a.contentHoverStyle) {
        newAttribute.contentHoverStyle = {
          ...a.contentHoverStyle,
        };
      }
      return newAttribute;
    });
  }

  find(year, month, day) {
    if (!year || !month) return undefined;
    let yearData = this.map[year];
    if (!yearData) {
      yearData = {};
      this.map[year] = yearData;
    }
    let monthData = yearData[month];
    if (!monthData) {
      const comps = getMonthComps(month, year);
      const range = new DateInfo({
        start: new Date(comps.year, comps.month - 1, 1),
        end: new Date(comps.year, comps.month, comps.days),
      });
      const list = this.list.filter(a => a.dates.find(d => d.intersects(range)));
      monthData = {
        range,
        list,
      };
      for (let d = 1; d <= comps.days; d++) {
        const date = new Date(year, month - 1, d);
        monthData[d] = list
          .map((a) => {
            const na = {
              ...a,
              dateInfo: a.dates.find(ad => ad.containsDate(date)),
            };
            delete na.dates;
            return na;
          })
          .filter(a => a.dateInfo)
          .sort((a, b) => a.dateInfo.compare(b.dateInfo));
      }
      yearData[month] = monthData;
    }
    if (day) return monthData[day];
    return monthData.list;
  }
}
