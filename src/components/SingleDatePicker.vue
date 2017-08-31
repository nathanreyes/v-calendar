<template>
<calendar
  :highlights='highlights'
  v-bind='$attrs'
  v-on='$listeners'
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
    highlights() {
      return this.hasValue ? [
        {
          dates: [this.value],
          backgroundColor: '#686864',
          color: '#fafafa',
        },
      ] :
      [];
    },
  },
  methods: {
    selectDay(day) {
      this.$emit('input', (day.date === this.value) ? null : day.date);
    },
  },
};
</script>
