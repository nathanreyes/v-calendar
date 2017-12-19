<template>
  <calendar
    :attributes='attributes_'
    :month-interval='monthInterval'
    :only-in-month='onlyInMonth'
    @dayselect='selectDay'
    v-bind='$attrs'
    v-on='$listeners'>
  </calendar>
</template>

<script>
import Calendar from './Calendar';
import defaults from '../utils/defaults';
import { singleHasValue, singleValuesAreEqual } from '../utils/pickerProfiles';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Date, default: null },
    selectColor: { type: String, default: () => defaults.datePickerSelectColor },
    selectAttribute: Object,
    disabledAttribute: Object,
    attributes: Array,
    monthInterval: Number,
    onlyInMonth: Boolean,
  },
  computed: {
    selectAttribute_() {
      if (!singleHasValue(this.value)) return null;
      return {
        ...defaults.datePickerSelectAttribute(this.selectColor),
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
