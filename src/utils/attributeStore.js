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
        .map(attribute => ({ attribute, dateInfo: attribute.includesDay(dayInfo) }))
        .filter(a => a.dateInfo)
        .sort((a, b) => a.dateInfo.compare(b.dateInfo));
    },
  };
};

export default AttributeStore;
