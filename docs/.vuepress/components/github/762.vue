<template>
  <div class="example">
    <button @click="move">Move</button>
    <v-calendar
      :min-date="minDate"
      :max-date="maxDate"
      ref="calendar"
      :rows="2"
    />
  </div>
</template>

<script>
export default {
  githubTitle: `Can't use the popover navigation correctly when set "min-date" or "max-date"`,
  data() {
    return {
      // minDate: null,
      // maxDate: null,
      minDate: new Date(2019, 10, 10), // Nov 10, 2019
      maxDate: new Date(2021, 2, 20), // Apr 20, 2020
    };
  },
  methods: {
    move() {
      this.$refs.calendar.move(
        { month: 2, year: 2020 },
        { force: false, position: 1 },
      );
    },
  },
};
</script>
