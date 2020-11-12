<template>
  <div>
    <v-calendar :max-date="maxDate" :rows="2" ref="calendar" />
    <v-date-picker :max-date="maxDate" v-model="date" ref="picker" />
    <button @click="moveToDate">Move</button>
  </div>
</template>

<script>
export default {
  githubTitle: 'focusDate, move not working even with force',
  data() {
    return {
      date: new Date(),
      maxDate: new Date(),
      moveDate: new Date(2021, 0, 1),
    };
  },
  methods: {
    async moveToDate() {
      // this.$refs.calendar.focusDate(this.moveDate, { force: true });
      this.$refs.calendar.move(this.moveDate, { force: true });
      await this.$refs.picker.move(this.moveDate, { force: false });
    },
  },
};
</script>
