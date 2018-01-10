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
import { multipleHasValue } from '../utils/pickerProfiles';

export default {
  components: {
    Calendar,
  },
  props: {
    value: { type: Array, default: () => [] },
    selectAttribute: Object,
    disabledAttribute: Object,
    attributes: Array,
  },
  computed: {
    selectAttribute_() {
      if (!multipleHasValue(this.value)) return null;
      return {
        ...this.selectAttribute,
        dates: this.value,
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
      // Done if date selection is invalid
      if (this.disabledAttribute && this.disabledAttribute.includesDay(day)) return;
      // Check if no values exist
      if (!multipleHasValue(this.value)) {
        this.$emit('input', [day.date]);
      // Check if value contains the selected date
      } else if (this.value.find(d => d.getTime() === day.dateTime)) {
        this.$emit('input', this.value.filter(v => v.getTime() !== day.dateTime));
      // Append selected date
      } else {
        this.$emit('input', [...this.value, day.date].sort((a, b) => a.getTime() - b.getTime()));
      }
    },
  },
};
</script>
