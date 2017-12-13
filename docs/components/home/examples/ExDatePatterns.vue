<template>
  <v-calendar
    :attributes='attributes'
    is-double-paned>
  </v-calendar>
</template>

<script>
import { getExampleMonthComps } from '@/utils/helpers';

const {
  thisMonth,
  thisMonthYear,
  } = getExampleMonthComps();

export default {
  props: {
    patterns: {
      type: Object,
      default: () => ({
        weeklyInterval: 2,
        weekdays: 6,
      }),
    },
  },
  computed: {
    attributes() {
      if (!this.patterns || Object.keys(this.patterns).length === 0) return [];
      return [
        {
          highlight: {
            backgroundColor: '#ff8080', // Red
            borderColor: '#ff6666',
            borderWidth: '2px',
            borderStyle: 'solid',
          },
          contentStyle: {
            color: 'white',
          },
          dates: [
            {
              start: new Date(thisMonthYear, thisMonth, 1),
              ...this.patterns,
            },
          ],
        },
      ];
    },
  },
};
</script>
