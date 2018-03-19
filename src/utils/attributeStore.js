import Attribute from './attribute';
import { arrayHasItems } from './helpers';

const AttributeStore = attrs => {
  const list =
    (arrayHasItems(attrs) &&
      attrs.filter(a => a && a.dates).map((a, i) =>
        Attribute({
          key: a.key || i.toString(),
          order: a.order || 0,
          ...a,
        }),
      )) ||
    [];
  return {
    length: list.length,
    // Return a sorted array of objects consisting of
    // ...the attribute
    // ...and the first matching date info
    find(day) {
      return list
        .map(attribute => ({
          ...attribute,
          targetDate: attribute.includesDay(day),
        }))
        .filter(a => a.targetDate)
        .sort((a, b) => a.targetDate.compare(b.targetDate));
    },
  };
};

export default AttributeStore;
