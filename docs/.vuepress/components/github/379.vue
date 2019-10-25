<template>
  <v-date-picker
    v-model="value"
    mode="range"
    :attributes="attrs"
    :disabled-dates="disabledDates"
    is-inline
  />
</template>

<script>
export default {
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
