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
    value: { type: Date, default: null },
    selectHighlight: { type: Object, required: true },
    highlights: Array,
  },
  computed: {
    hasValue() {
      return this.value && typeof this.value.getTime === 'function';
    },
    valueTime() {
      return this.hasValue ? this.value.getTime() : null;
    },
    selectHighlight_() {
      return { ...this.selectHighlight, dates: [this.value] };
    },
    highlights_() {
      if (!this.hasValue) return this.highlights;
      return this.highlights ? [...this.highlights, this.selectHighlight_] : [this.selectHighlight_];
    },
  },
  methods: {
    selectDay(day) {
      this.$emit('input', (day.date === this.value) ? null : day.date);
      // Forward the event
      this.$emit('dayClick', day);
    },
  },
};
</script>
