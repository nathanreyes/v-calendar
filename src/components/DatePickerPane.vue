<template>
  <component
    :is='datePicker'
    :value='value'
    :drag-highlight='dragHighlight'
    :select-highlight='selectHighlight'
    show-hover
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
    page: Object,
    value: null,
    selectMode: { type: String, default: 'single' },
    dragHighlight: {
      type: Object,
      default: () => ({
        backgroundColor: '#c1d6d7',
        color: '#103456',
        height: '25px',
      }),
    },
    selectHighlight: {
      type: Object,
      default: () => ({
        backgroundColor: '#74a4a4',
        borderWidth: '1px',
        borderColor: '#65999a',
        color: '#fafafa',
      }),
    },
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
