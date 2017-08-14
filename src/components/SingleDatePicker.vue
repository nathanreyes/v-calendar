<template>
<calendar
  :configureDayData='configureDayData'
  @dayClick='selectDay'>
</calendar>
</template>

<script>
import Calendar from './Calendar';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Date, default: null },
  },
  computed: {
    hasValue() {
      return this.value && typeof this.value.getTime === 'function';
    },
    valueTime() {
      return this.hasValue ? this.value.getTime() : null;
    },
    configureDayData() {
      return (day) => {
        day.selectMode = 'single';
        day.isSelected = day.date.getTime() === this.valueTime;
      };
    },
  },
  methods: {
    selectDay(day) {
      this.$emit('input', day.isSelected ? null : day.date);
    },
  },
};
</script>
