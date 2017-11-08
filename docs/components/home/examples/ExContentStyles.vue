<template>
  <v-calendar
    :attributes='attributes'
    is-double-paned>
  </v-calendar>
</template>

<script>
import { getExampleMonthComps } from '@/utils/helpers';

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
          contentStyle: {
            color: '#ff4d4d', // Red
            fontWeight: 600,
            fontSize: '1em',
          },
          dates: [
            {
              start: new Date(thisMonthYear, thisMonth, 1),
              end: new Date(thisMonthYear, thisMonth, 4),
            },
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 23),
          ],
        },
        {
          contentStyle: {
            color: '#398fac', // Turquoise
            fontWeight: 600,
            fontStyle: 'italic',
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
          contentStyle: {
            color: '#794dff', // Purple
            fontWeight: 600,
          },
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
