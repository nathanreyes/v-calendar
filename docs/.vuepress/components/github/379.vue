<template>
  <v-date-picker
    v-model="value"
    mode="range"
    :attributes="attrs"
    :disabled-dates="disabledDates"
  />
</template>

<script>
export default {
  githubTitle: 'Popover should still activate on disabled dates',
  data() {
    return {
      attrs: [
        {
          dates: new Date(),
          dot: true,
          popover: {
            label: 'This is a test',
          },
        },
      ],
      disabledDates: [new Date()],
      value: null,
    };
  },
};
</script>
