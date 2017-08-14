<template>
<calendar
  :configureDay='configureDay'
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
    value: { type: Array, default: [] },
  },
  computed: {
    hasValues() {
      return Array.isArray(this.value) && this.value.length > 0;
    },
    valueTimes() {
      if (!this.hasValues) return [];
      return this.value.map(v => v.getTime());
    },
    configureDay() {
      return (day) => {
        day.selectMode = 'multiple';
        day.isSelected = this.dayIsSelected(day);
      };
    },
  },
  methods: {
    dayIsSelected(day) {
      if (!this.hasValues) return false;
      const t = day.date.getTime();
      return !!this.valueTimes.find(vt => vt === t);
    },
    selectDay(day) {
      if (!day.isSelected) {
        this.$emit('input', this.hasValues ? [...this.value, day.date] : [day.date]);
      } else {
        this.$emit('input', this.value.filter(v => v.getTime() !== day.date.getTime()));
      }
    },
  },
};
</script>
