<template>
  <v-date-picker
    v-model="range"
    :min-date="new Date()"
    :disabled-dates="disabledDates"
    is-range
  />
</template>

<script>
export default {
  githubTitle: 'Disabled dates not working or ?',
  data() {
    return {
      range: null,
      disabledDates: [
        { start: new Date(2021, 1, 9), end: new Date(2021, 1, 19) },
      ],
    };
  },
};
</script>
