<template>
<calendar
  :highlights='highlights_'
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
    value: { type: Array, default: [] },
    selectHighlight: { type: Object, required: true },
    highlights: Array,
  },
  computed: {
    hasValues() {
      return Array.isArray(this.value) && this.value.length > 0;
    },
    valueTimes() {
      if (!this.hasValues) return [];
      return this.value.map(v => v.getTime());
    },
    selectHighlight_() {
      return { ...this.selectHighlight, dates: this.value };
    },
    highlights_() {
      if (!this.hasValues) return this.highlights;
      return this.highlights ? [...this.highlights, this.selectHighlight_] : [this.selectHighlight_];
    },
  },
  methods: {
    selectDay(day) {
      // Check if no values exist
      if (!this.hasValues) {
        this.$emit('input', [day.date]);
      // Check if value contains the selected date
      } else if (this.valueTimes.find(dt => dt === day.dateTime)) {
        this.$emit('input', this.value.filter(v => v.getTime() !== day.dateTime));
      // Value does not contain the selected date
      } else {
        this.$emit('input', [...this.value, day.date]);
      }
      // Forward the event
      this.$emit('dayClick', day);
    },
  },
};
</script>
