<template>
  <v-date-picker
    mode="range"
    v-model="date"
    :available-dates="availableDates"
    popover-visibility="visible"
  ></v-date-picker>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      availableDates: [
        { start: new Date(2018, 0, 1), end: new Date(2018, 0, 15) },
        { start: new Date(2018, 0, 16), end: new Date(2018, 0, 20) },
      ],
    };
  },
};
</script>

