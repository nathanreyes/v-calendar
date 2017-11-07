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
    value: { type: Date, default: null },
    selectAttribute: { type: Object, required: true },
    attributes: Array,
    dateValidator: Function,
    monthLabels: Array,
    weekdayLabels: Array,
  },
  computed: {
    hasValue() {
      return this.value && typeof this.value.getTime === 'function';
    },
    valueTime() {
      return this.hasValue ? this.value.getTime() : null;
    },
    selectAttribute_() {
      return { ...this.selectAttribute, dates: [this.value] };
    },
    attributes_() {
      if (!this.hasValue) return this.attributes;
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
        this.$emit('input', (day.date === this.value) ? null : day.date);
      }
      // Forward the event
      this.$emit('dayClick', day);
    },
  },
};
</script>
