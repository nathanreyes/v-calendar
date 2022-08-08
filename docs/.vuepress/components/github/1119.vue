<template>
  <div>
    <!-- <v-calendar :min-date="minDate" :max-date="maxDate" :columns="2" /> -->
    <v-calendar :min-page="minPage" :max-page="maxPage" :columns="2" />
  </div>
</template>

<script>
export default {
  githubTitle: 'Disable month in CalandarNav when column >= 2 problem',
  data() {
    return {
      minDate: '2022-03-01',
      maxDate: '2022-04-30',
      minPage: {
        year: 2022,
        month: 3,
      },
      maxPage: {
        year: 2022,
        month: 4,
      },
    };
  },
};
</script>
