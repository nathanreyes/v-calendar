import { isFunction } from '../_';

export const slotMixin = {
  methods: {
    safeSlot(name, args, def = null) {
      return isFunction(this.$slots[name]) ? this.$slots[name](args) : def;
    },
  },
};
