import { mapValues, defaults as _defaults } from '@/utils/_';

export const createVC = (Vue, defaults) =>
  new Vue({
    data() {
      return {
        defaults,
        activeRefs: {},
      };
    },
    computed: {
      theme() {
        return this.defaults.theme;
      },
      locales() {
        return mapValues(this.defaults.locales, v => {
          v.masks = _defaults(v.masks, this.defaults.masks);
          return v;
        });
      },
    },
  });
