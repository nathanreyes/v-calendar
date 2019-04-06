export const createVC = (Vue, defaults) =>
  new Vue({
    data() {
      return {
        defaults,
        activeRefs: {},
      };
    },
    computed: {
      masks() {
        return this.defaults.masks;
      },
      theme() {
        return this.defaults.theme;
      },
      locales() {
        return this.defaults.locales;
      },
    },
  });
