import Attribute from './attribute';
import { arrayHasItems, hash } from './helpers';

export default class AttributeStore {
  constructor(theme, locale, attrs) {
    this.theme = theme;
    this.locale = locale;
    this.map = {};
    this.refresh(attrs, true);
  }

  destroy() {
    this.theme = null;
    this.locale = null;
    this.map = {};
    this.list = [];
    this.pinAttr = null;
  }

  refresh(attrs, reset) {
    const map = {};
    const list = [];
    let pinAttr = null;
    // Keep record of added and deleted attributes
    const adds = [];
    const deletes = reset ? new Set() : new Set(Object.keys(this.map));
    if (arrayHasItems(attrs)) {
      attrs.forEach((attr, i) => {
        if (!attr || !attr.dates) return;
        const key = attr.key ? attr.key.toString() : i.toString();
        const order = attr.order || 0;
        const hashcode = hash(JSON.stringify(attr));
        let exAttr = this.map[key];
        // If just tracking delta changes and attribute hash hasn't changed
        if (!reset && exAttr && exAttr.hashcode === hashcode) {
          // ...don't need to replace the attribute
          deletes.delete(key);
        } else {
          // Otherwise, create attribute and add to the list of adds
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
          adds.push(exAttr);
        }
        // Keep track of attribute to pin for initial page
        if (exAttr && exAttr.pinPage) {
          pinAttr = exAttr;
        }
        // Add attribute to map and list
        map[key] = exAttr;
        list.push(exAttr);
      });
    }
    this.map = map;
    this.list = list;
    this.pinAttr = pinAttr;
    return { adds, deletes: Array.from(deletes) };
  }
}
