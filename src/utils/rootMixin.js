import { has } from '@/utils/_';

export default {
  methods: {
    resolveDefault(prop) {
      const { propsData } = this.$options;
      if (has(propsData, prop)) {
        return propsData[prop];
      }
      return this.$vc.defaults[prop];
    },
  },
};
