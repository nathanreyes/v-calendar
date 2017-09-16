<template>
  <v-calendar
    :indicators='indicators'
    is-double-paned>
  </v-calendar>
</template>

<script>
import { getExampleMonthComps } from './utils';

export default {
  data() {
    const { thisMonth, thisMonthYear, nextMonth, nextMonthYear } = getExampleMonthComps();
    return {
      indicators: [
        {
          // Red
          backgroundColor: '#ff3333',
          // Only dates allowed
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 22),
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 16),
          ],
        },
        {
          // Blue
          backgroundColor: '#0040ff',
          dates: [
            new Date(thisMonthYear, thisMonth, 4),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 15),
            new Date(nextMonthYear, nextMonth, 1),
            new Date(nextMonthYear, nextMonth, 12),
            new Date(nextMonthYear, nextMonth, 24),
            new Date(nextMonthYear, nextMonth, 25),
          ],
        },
        {
          // Orange
          backgroundColor: '#ff8000',
          dates: [
            new Date(thisMonthYear, thisMonth, 12),
            new Date(thisMonthYear, thisMonth, 26),
            new Date(thisMonthYear, thisMonth, 15),
            new Date(nextMonthYear, nextMonth, 9),
            new Date(nextMonthYear, nextMonth, 5),
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 20),
            new Date(nextMonthYear, nextMonth, 25),
          ],
        },
      ],
    };
  },
};
</script>
