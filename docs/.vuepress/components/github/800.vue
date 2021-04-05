<template>
  <v-date-picker v-model="range" :disabled-dates="disabledDates" is-range />
</template>
<script>
export default {
  githubTitle: 'Dynamically add disabled-dates to date picker',
  data() {
    return {
      range: null,
      disabledDates: [new Date(2021, 3, 1)],
    };
  },
  created() {
    this.getDisabledDatesFromApi().then(dates => {
      // All of these methods should work in Vue 2
      this.disabledDates = dates;
      // this.disabledDates = this.disabledDates.concat(dates);
      // this.disabledDates.push(...dates);

      // This won't work in Vue 2
      // this.disabledDates[0] = dates[0];
    });
  },
  methods: {
    getDisabledDatesFromApi() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([new Date(2021, 3, 15)]);
        }, 100);
      });
    },
  },
};
</script>
