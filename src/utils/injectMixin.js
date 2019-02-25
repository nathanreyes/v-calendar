export default {
  inject: ['sharedState'],
  computed: {
    theme() {
      return this.sharedState.theme;
    },
    dayPopoverId() {
      return this.sharedState.dayPopoverId;
    },
  },
};
