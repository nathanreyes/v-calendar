<template>
  <calendar
    :indicators='indicators'>
  </calendar>
</template>

<script>
import Calendar from './Calendar';

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
          // Light purple background
          backgroundColor: '#8b5b5b',
          // Use multiple dates
          dates: [
            new Date(year, month, 1),
            new Date(year, month, 10),
            new Date(year, month, 22),
          ],
        },
        {
          // Light purple background
          backgroundColor: '#7b6751',
          // Use multiple dates
          dates: [
            new Date(year, month, 4),
            new Date(year, month, 10),
            new Date(year, month, 15),
          ],
        },
      ],
    };
  },
};
</script>
