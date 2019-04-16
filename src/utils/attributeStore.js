import Attribute from './attribute';
import { arrayHasItems, hash } from './helpers';
import { isFunction } from './_';

export default class AttributeStore {
  constructor(theme, locale) {
    this.theme = theme;
    this.locale = locale;
    this.map = {};
    this.list = [];

    this.cnt = 0;
  }

  refresh(attrs) {
    const map = {};
    const list = [];
    const newList = [];
    let pinAttr = null;
    if (arrayHasItems(attrs)) {
      attrs.forEach((attr, i) => {
        if (!attr || !attr.dates) return;
        const key = attr.key || i.toString();
        const order = attr.order || 0;
        const hashcode = hash(JSON.stringify(attr.dates));
        let exAttr = this.map[key];
        if (!exAttr || exAttr.hashcode !== hashcode) {
          exAttr = new Attribute(
            {
              key,
              order,
              hashcode,
              ...attr,
            },
            this.theme,
            this.locale,
          );
          newList.push(exAttr);
        }
        if (exAttr.pinPage) {
          pinAttr = exAttr;
        }
        map[key] = exAttr;
        list.push(exAttr);
      });
    }
    this.map = map;
    this.list = list;
    this.pinAttr = pinAttr;
    return newList;
  }

  atIndex(idx) {
    return idx < this.length ? this.list[idx] : null;
  }

  find(match) {
    if (!isFunction(match)) return null;
    return this.list.find(attr => match(attr));
  }

  // Return a sorted array of objects consisting of
  // ...the attribute
  // ...and the first matching date info
  onDay(day) {
    return this.list
      .map(attr => ({
        ...attr,
        targetDate: attr.includesDay(day),
      }))
      .filter(a => a.targetDate)
      .sort((a, b) => a.targetDate.compare(b.targetDate));
  }
}
