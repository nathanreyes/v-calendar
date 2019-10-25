<template>
  <v-date-picker v-model="selectedDate" />
</template>

<script>
export default {
  githubTitle: '',
  data() {
    return {
      selectedDate: '2019-09-03',
      // selectedDate: {
      //   start: '2019-09-03',
      //   end: '2019-09-14',
      // },
    };
  },
};
</script>