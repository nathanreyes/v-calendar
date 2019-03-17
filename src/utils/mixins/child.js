export const childMixin = {
  inject: ['sharedState'],
  computed: {
    defaults() {
      return this.$vc.defaults;
    },
    masks() {
      return this.sharedState.masks;
    },
    theme() {
      return this.sharedState.theme;
    },
    locale() {
      return this.sharedState.locale;
    },
    dayPopoverId() {
      return this.sharedState.dayPopoverId;
    },
  },
  methods: {
    format(date, mask) {
      return this.locale.format(date, mask);
    },
  },
};
