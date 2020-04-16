<template>
  <v-calendar :locale="calendarEnv" />
</template>

<script>
export default {
  githubTitle: 'How to use the monthNames in locale?',
  data() {
    return {
      calendarEnv: {
        masks: {
          title: 'YYYY-MM',
        },
        monthNames: [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
        ],
      },
    };
  },
};
</script>