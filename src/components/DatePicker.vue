<template>
  <component
    :is='datePicker'
    :value='value'
    :drag-highlight='dragHighlight'
    :select-highlight='selectHighlight'
    v-bind='$attrs'
    v-on='$listeners'>
  </component>
</template>

<script>
import SingleDatePicker from './SingleDatePicker';
import MultipleDatePicker from './MultipleDatePicker';
import DateRangePicker from './DateRangePicker';

const _dragHighlight = {
  backgroundColor: '#a2c2c3',
  color: '#103456',
  height: '27px',
};

const _selectHighlight = {
  backgroundColor: '#74a4a4',
  borderWidth: '1px',
  borderColor: '#65999a',
  color: '#fafafa',
};

export default {
  components: {
    SingleDatePicker,
    MultipleDatePicker,
    DateRangePicker,
  },
  props: {
    value: null,
    selectMode: { type: String, default: 'single' },
    dragHighlight: { type: Object, default: () => _dragHighlight },
    selectHighlight: { type: Object, default: () => _selectHighlight },
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
