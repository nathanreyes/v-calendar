<template>
<calendar
  :attributes='attributes_'
  :monthLabels='monthLabels_'
  :weekdayLabels='weekdayLabels_'
  v-bind='$attrs'
  v-on='$listeners'
  @daySelect='selectDay'>
</calendar>
</template>

<script>
import Calendar from './Calendar';
import { validateMonths, validateWeekdays } from '../utils/helpers';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Array, default: () => [] },
    selectAttribute: { type: Object, required: true },
    attributes: Array,
    monthLabels: Array,
    weekdayLabels: Array,
    dateValidator: Function,
  },
  computed: {
    hasValues() {
      return Array.isArray(this.value) && this.value.length > 0;
    },
    valueTimes() {
      if (!this.hasValues) return [];
      return this.value.map(v => v.getTime());
    },
    selectAttribute_() {
      return { ...this.selectAttribute, dates: this.value };
    },
    attributes_() {
      if (!this.hasValues) return this.attributes;
      return this.attributes ? [...this.attributes, this.selectAttribute_] : [this.selectAttribute_];
    },
    monthLabels_() {
      return validateMonths(this.monthLabels);
    },
    weekdayLabels_() {
      return validateWeekdays(this.weekdayLabels);
    },
  },
  methods: {
    selectDay(day) {
      // Make sure date selection is valid
      if (this.dateValidator(day.date, 'selectDisabled')) {
        // Check if no values exist
        if (!this.hasValues) {
          this.$emit('input', [day.date]);
        // Check if value contains the selected date
        } else if (this.valueTimes.find(dt => dt === day.dateTime)) {
          this.$emit('input', this.value.filter(v => v.getTime() !== day.dateTime));
        // Value does not contain the selected date
        } else {
          this.$emit('input', [...this.value, day.date].sort((a, b) => a.getTime() - b.getTime()));
        }
      }
      // Forward the event
      this.$emit('dayClick', day);
    },
  },
};
</script>
