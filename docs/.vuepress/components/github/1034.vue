<template>
  <v-date-picker v-model="range" is-range />
</template>

<script>
import { DateInfo } from '../../../../src/lib';

export default {
  githubTitle: 'Interact with individual dates of a date-range object',
  data() {
    return {
      range: null,
    };
  },
  computed: {
    datesInRange() {
      const result = [];
      if (!this.range) return result;
      new DateInfo(this.range).iterateDatesInRange(this.range, ({ date }) => {
        result.push(date);
      });
      return result;
    },
  },
  watch: {
    datesInRange(val) {
      console.log('dates', val);
    },
  },
};
</script>
