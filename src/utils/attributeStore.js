import Attribute from './attribute';
import { arrayHasItems } from './helpers';
import { isFunction } from './_';

export default class AttributeStore {
  constructor(attrs, theme, locale) {
    const list = [];
    let key = 1,
      pinAttr = null;
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
