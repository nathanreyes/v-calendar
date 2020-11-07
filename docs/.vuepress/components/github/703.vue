<template>
  <div>
    <v-calendar :max-date="maxDate" :rows="2" ref="calendar" />
    <button @click="moveToDate">Move</button>
  </div>
</template>

<script>
export default {
  githubTitle: 'focusDate, move not working even with force',
  data() {
    return {
      maxDate: new Date(),
      moveDate: new Date(2019, 0, 1),
    };
  },
  methods: {
    moveToDate() {
      this.$refs.calendar.focusDate(this.moveDate, { force: true });
    },
  },
};
</script>