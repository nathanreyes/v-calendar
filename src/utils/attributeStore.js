import Attribute from './attribute';
import { arrayHasItems } from './helpers';
import { isFunction } from './_';

const AttributeStore = (attrs, theme, locale) => {
  const list =
    (arrayHasItems(attrs) &&
      attrs
        .filter(a => a && a.dates)
        .map(
          (a, i) =>
            new Attribute(
              {
                key: a.key || i.toString(),
                order: a.order || 0,
                ...a,
              },
              theme,
              locale,
            ),
        )) ||
    [];
  return {
    length: list.length,
    atIndex: idx => {
      return idx < list.length ? list[idx] : null;
    },
    find: match => {
      if (!isFunction(match)) return null;
      return list.find(attr => match(attr));
    },
    // Return a sorted array of objects consisting of
    // ...the attribute
    // ...and the first matching date info
    onDay(day) {
      return list
        .map(attr => ({
          ...attr,
          targetDate: attr.includesDay(day),
        }))
        .filter(a => a.targetDate)
        .sort((a, b) => a.targetDate.compare(b.targetDate));
    },
  };
};

export default AttributeStore;
