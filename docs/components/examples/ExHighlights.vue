<template>
  <v-calendar
    :pane-style='paneStyle'
    :header-style='headerStyle'
    :weekday-style='weekdayStyle'
    :attributes='attributes'
    is-double-paned>
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
      paneStyle: {
        padding: '0 0 10px 0',
        border: '0',
      },
      headerStyle: {
        color: '#fafafa',
        backgroundColor: '#4a5867',
        padding: '15px 5px 0px 5px',
      },
      weekdayStyle: {
        backgroundColor: '#4a5867',
        padding: '15px 0',
      },
      weeksStyle: {
        border: '1px solid #dadada',
      },
      attributes: [
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
            backgroundColor: '#9f80ff', // Purple
            borderColor: '#8c66ff',
            borderWidth: '2px',
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
            backgroundColor: '#66b3cc', // Orange
            borderColor: '#53a9c6',
            borderWidth: '2px',
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
