<template>
  <div>
    <button @click="showRange">Show range</button>
    <v-calendar ref="calendar" :attributes="attributes"> </v-calendar>
  </div>
</template>

<script>
export default {
  githubTitle: 'showPageRange method not working yet?',
  data() {
    return {
      attributes: [],
    };
  },
  methods: {
    showRange() {
      const calendar = this.$refs.calendar;
      const date = new Date(2020, 0, 1); // January, 2020
      const page = { month: 2, year: 2020 }; // February, 2020
      // calendar.showPageRange(date);
      // calendar.showPageRange(page);
      // calendar.showPageRange({ from: date });
      // calendar.showPageRange({ from: page });
      // calendar.showPageRange({ to: date });
      // calendar.showPageRange({ to: page });
      calendar.showPageRange({ from: date, to: page });
    },
  },
};
</script>
