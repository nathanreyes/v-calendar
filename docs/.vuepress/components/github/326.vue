<template>
  <div>
    <v-date-picker
      mode="range"
      v-model="value"
      :available-dates="availableDates"
      @dayclick="dayClick"
    />
  </div>
</template>

<script>
export default {
  githubTitle: 'Available-dates is not grayed out',
  data() {
    return {
      value: null,
      availableDates: {},
    };
  },
  methods: {
    dayClick() {
      this.availableDates = { end: new Date(2019, 5, 20) };
    },
  },
};
</script>
