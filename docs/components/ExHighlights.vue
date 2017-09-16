<template>
  <v-calendar
    :highlights='highlights'
    is-double-paned>
  </v-calendar>
</template>

<script>
import { getExampleMonthComps } from './utils';

export default {
  data() {
    const { thisMonth, thisMonthYear, nextMonth, nextMonthYear } = getExampleMonthComps();
    return {
      highlights: [
        {
          // Light red background
          backgroundColor: '#bd9999',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#ae8484',
          color: 'white',
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
          // Light purple background
          backgroundColor: '#9999bd',
          borderWidth: '2px',
          borderColor: '#8484ae',
          color: 'white',
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 22),
            {
              start: new Date(nextMonthYear, nextMonth, 22),
              end: new Date(nextMonthYear, nextMonth, 26),
            },
          ],
        },
        {
          // Light tan background
          backgroundColor: '#bdb499',
          borderWidth: '2px',
          borderColor: '#aea484',
          borderRadius: '5px',
          color: 'white',
          dates: [
            new Date(thisMonthYear, thisMonth, 14),
            {
              start: new Date(thisMonthYear, thisMonth, 24),
              end: new Date(thisMonthYear, thisMonth, 25),
            },
            new Date(thisMonthYear, thisMonth, 28),
            new Date(thisMonthYear, thisMonth + 1, 4),
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
