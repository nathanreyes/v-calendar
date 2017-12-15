import Attribute from './attribute';

const AttributeStore = (attrs) => {
  let list = [];
  if (attrs && attrs.length) {
    list = attrs
      .filter(a => a && a.dates)
      .map((a, i) => Attribute({
        key: a.key || i.toString(),
        order: a.order || 0,
        ...a,
      }));
  }
  return {
    // Return a sorted array of objects consisting of
    // ...the attribute
    // ...and the first matching date info
    find(dayInfo) {
      return list
        .map(attribute => ({
          ...attribute,
          targetDate: attribute.includesDay(dayInfo),
        }))
        .filter(a => a.targetDate)
        .sort((a, b) => a.targetDate.compare(b.targetDate));
    },
  };
};

export default AttributeStore;
