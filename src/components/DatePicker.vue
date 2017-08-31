<template>
  <component
    :is='datePicker'
    :value='value'
    v-bind='$attrs'
    v-on='$listeners'>
  </component>
</template>

<script>
import SingleDatePicker from './SingleDatePicker';
import MultipleDatePicker from './MultipleDatePicker';
import DateRangePicker from './DateRangePicker';

export default {
  components: {
    SingleDatePicker,
    MultipleDatePicker,
    DateRangePicker,
  },
  props: {
    value: null,
    selectMode: { type: String, default: 'single' },
  },
  computed: {
    datePicker() {
      switch (this.selectMode) {
        case 'single':
          return 'single-date-picker';
        case 'multiple':
          return 'multiple-date-picker';
        case 'range':
          return 'date-range-picker';
        default:
          return '';
      }
    },
  },
  watch: {
    selectMode() {
      // Clear value on select mode change
      this.$emit('input', null);
    },
  },
};
</script>
