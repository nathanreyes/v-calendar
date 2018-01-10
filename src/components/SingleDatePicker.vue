<template>
  <calendar
    :attributes='attributes_'
    @dayselect='selectDay'
    v-bind='$attrs'
    v-on='$listeners'>
  </calendar>
</template>

<script>
import Calendar from './Calendar';
import { singleHasValue, singleValuesAreEqual } from '../utils/pickerProfiles';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Date, default: null },
    selectAttribute: Object,
    disabledAttribute: Object,
    attributes: Array,
  },
  computed: {
    selectAttribute_() {
      if (!singleHasValue(this.value)) return null;
      return {
        ...this.selectAttribute,
        dates: [this.value],
      };
    },
    attributes_() {
      const attributes = [...(this.attributes || [])];
      if (this.selectAttribute_) attributes.push(this.selectAttribute_);
      if (this.disabledAttribute) attributes.push(this.disabledAttribute);
      return attributes;
    },
  },
  methods: {
    selectDay(day) {
      // Done if day selection is invalid
      if (this.disabledAttribute && this.disabledAttribute.includesDay(day)) return;
      this.$emit('input', singleValuesAreEqual(day.date, this.value) ? null : day.date);
    },
  },
};
</script>
