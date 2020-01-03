<template>
  <div class="example">
    <v-calendar :from-date="fromDate" :attributes="attrs"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromDate: new Date(2018, 0, 1),
      attrs: [
        {
          highlight: true,
          dates: {
            start: new Date(2018, 0, 1), // Jan 1st, 2018
            end: new Date(2019, 0, 1), // Jan 1st, 2019
            weekdays: [1, 7], // ...on Sundays and Saturdays
          },
        },
      ],
    };
  },
};
</script>