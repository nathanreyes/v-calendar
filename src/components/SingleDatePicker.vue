<template>
  <calendar
    :attributes='attributes_'
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
    selectAttribute: { type: Object, required: true },
    attributes: Array,
    dateValidator: Function,
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
