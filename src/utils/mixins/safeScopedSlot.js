import { isFunction } from '@/utils/_';

export const safeScopedSlotMixin = {
  methods: {
    safeScopedSlot(name, args, def = null) {
      return isFunction(this.$scopedSlots[name])
        ? this.$scopedSlots[name](args)
        : def;
    },
  },
};
