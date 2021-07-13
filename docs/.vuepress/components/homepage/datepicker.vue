<template>
  <div class="section text-center">
    <h2 class="h2">Date Picker</h2>
    <h4>Single Dates</h4>
    <div class="flex flex-col items-center mb-6">
      <v-date-picker v-model="date" />
    </div>
    <h4>Date Ranges</h4>
    <div class="flex flex-col items-center mb-6">
      <v-date-picker v-model="range" is-range />
    </div>
    <h4>Time Selection &amp; Timezones</h4>
    <div class="flex flex-col items-center mb-6">
      <v-date-picker mode="dateTime" v-model="range2" is-range />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    return {
      date,
      dates: [
        new Date(year, month, 3),
        new Date(year, month, 15),
        new Date(year, month, 25),
      ],
      range: {
        start: new Date(year, month, 6),
        end: new Date(year, month, 23),
      },
      range2: {
        start: new Date(year, month, 6),
        end: new Date(year, month, 23),
      },
    };
  },
};
</script>
