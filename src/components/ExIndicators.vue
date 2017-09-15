<template>
  <calendar
    :indicators='indicators'
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
      indicators: [
        {
          // Red
          backgroundColor: '#ff3333',
          // Only dates allowed
          dates: [
            new Date(year, month, 1),
            new Date(year, month, 10),
            new Date(year, month, 22),
          ],
        },
        {
          // Blue
          backgroundColor: '#0040ff',
          dates: [
            new Date(year, month, 4),
            new Date(year, month, 10),
            new Date(year, month, 15),
          ],
        },
        {
          // Orange
          backgroundColor: '#ff8000',
          dates: [
            new Date(year, month, 12),
            new Date(year, month, 26),
            new Date(year, month, 15),
          ],
        },
      ],
    };
  },
};
</script>
