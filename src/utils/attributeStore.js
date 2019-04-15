import Attribute from './attribute';
import { arrayHasItems, hash } from './helpers';
import { isFunction } from './_';

export default class AttributeStore {
  constructor(attrs, theme, locale) {
    const list = [];
    let key = 1;
    let pinAttr = null;
    if (arrayHasItems(attrs)) {
      attrs.forEach(attr => {
        if (!attr || !attr.dates) return;
        const newAttr =
          attr instanceof Attribute
            ? attr
            : new Attribute(
                {
                  key: attr.key || key.toString(),
                  order: attr.order || 0,
                  ...attr,
                },
                theme,
                locale,
              );
        if (newAttr.pinPage) {
          pinAttr = newAttr;
        }
        list.push(newAttr);
        key++;
      });
    }
    this.list = list;
    this.length = list.length;
    this.pinAttr = pinAttr;
  }

  reset(attrs) {
    const map = {};
    const list = [];
    const newList = [];

    attrs.forEach((attr, i) => {
      if (!attr || !attr.dates) return;
      const key = attr.key || i.toString();
      const order = attr.order || 0;
      const hashcode = hash(JSON.toString(attr));
      let newAttr = null;
      let exAttr = this.map[key];
      if (!exAttr || exAttr.hashcode !== hashcode) {
        exAttr = new Attribute(
          {
            key,
            order,
            ...attr,
          },
          this.theme,
          this.locale,
        );
      }
    });
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
