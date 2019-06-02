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
