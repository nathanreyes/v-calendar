<template>
  <v-date-picker
    class="w-full"
    mode="range"
    v-model="eventDates"
    :masks="masks"
  ></v-date-picker>
</template>

<script>
export default {
  githubTitle: `Typed dates are not being parsed correctly`,
  data() {
    return {
      eventDates: null,
      masks: {
        input: ['YYYY-MM-DD'],
        data: ['YYYY-MM-DD'],
      },
    };
  },
};
</script>
