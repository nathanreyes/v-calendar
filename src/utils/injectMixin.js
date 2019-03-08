export default {
  inject: ['sharedState'],
  computed: {
    defaults() {
      return this.$vc.defaults;
    },
    formats() {
      return this.sharedState.formats;
    },
    theme() {
      return this.sharedState.theme;
    },
    dayPopoverId() {
      return this.sharedState.dayPopoverId;
    },
  },
};
