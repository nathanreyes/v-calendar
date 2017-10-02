<template>
  <v-calendar
    :attributes='attributes'
    is-double-paned
    wrap>
  </v-calendar>
</template>

<script>
import { getExampleMonthComps } from '../utils';

export default {
  data() {
    const {
      thisMonth,
      thisMonthYear,
      nextMonth,
      nextMonthYear } = getExampleMonthComps();
    return {
      attributes: [
        {
          highlight: {
            backgroundColor: '#bd9999', // Red
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#ae8484',
          },
          contentStyle: {
            color: 'white',
          },
          dates: [
            // Use date ranges
            {
              start: new Date(thisMonthYear, thisMonth, 1),
              end: new Date(thisMonthYear, thisMonth, 4),
            },
            // Or single dates
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 23),
          ],
        },
        {
          highlight: {
            backgroundColor: '#9999bd', // Purple
            borderWidth: '2px',
            borderColor: '#8484ae',
          },
          contentStyle: {
            color: 'white',
          },
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 12),
            {
              start: new Date(nextMonthYear, nextMonth, 22),
              end: new Date(nextMonthYear, nextMonth, 26),
            },
          ],
        },
        {
          highlight: {
            backgroundColor: '#bdb499', // Tan
            borderWidth: '2px',
            borderColor: '#aea484',
            borderRadius: '5px',
          },
          contentStyle: {
            color: 'white',
          },
          dates: [
            new Date(thisMonthYear, thisMonth, 14),
            {
              start: new Date(thisMonthYear, thisMonth, 24),
              end: new Date(thisMonthYear, thisMonth, 25),
            },
            new Date(thisMonthYear, thisMonth, 28),
            new Date(nextMonthYear, nextMonth, 4),
            {
              start: new Date(nextMonthYear, nextMonth, 16),
              end: new Date(nextMonthYear, nextMonth, 17),
            },
          ],
        },
      ],
    };
  },
};
</script>
