import { get, has, isObject, defaultsDeep } from '@/utils/_';

export const propOrDefaultMixin = {
  methods: {
    propOrDefault(prop, defaultPath, strategy) {
      return this.passedProp(prop, get(this.$defaults, defaultPath), strategy);
    },
    passedProp(prop, fallback, strategy) {
      if (has(this.$options.propsData, prop)) {
        const propValue = this[prop];
        if (isObject(propValue) && strategy === 'merge') {
          return defaultsDeep(propValue, fallback);
        }
        return propValue;
      }
      return fallback;
    },
  },
};
