<template>
  <calendar
    :highlights='highlights'
    is-double-paned>
  </calendar>
</template>

<script>
import Calendar from './lib/Calendar';

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

export default {
  components: {
    Calendar,
  },
  data() {
    return {
      highlights: [
        {
          // Light red background
          backgroundColor: '#bd9999',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#ae8484',
          color: 'white',
          // Use date ranges
          dates: [
            {
              start: new Date(year, month, 1),
              end: new Date(year, month, 4),
            },
          ],
        },
        {
          // Light purple background
          backgroundColor: '#9999bd',
          borderWidth: '2px',
          borderColor: '#8484ae',
          color: 'white',
          // Use multiple dates
          dates: [
            new Date(year, month, 1),
            new Date(year, month, 10),
            new Date(year, month, 22),
          ],
        },
        {
          // Light tan background
          backgroundColor: '#bdb499',
          borderWidth: '2px',
          borderColor: '#aea484',
          borderRadius: '5px',
          color: 'white',
          // Mix dates with date ranges
          dates: [
            new Date(year, month, 14),
            {
              start: new Date(year, month, 24),
              end: new Date(year, month, 25),
            },
            new Date(year, month, 28),
            new Date(year, month + 1, 4),
          ],
        },
      ],
    };
  },
};
</script>
