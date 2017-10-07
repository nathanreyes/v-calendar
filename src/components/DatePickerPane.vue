<template>
  <component
    :is='datePicker'
    :value='value'
    :day-content-hover-style='dayContentHoverStyle'
    :drag-attribute='dragAttribute'
    :select-attribute='selectAttribute'
    :disabled-attribute='disabledAttribute_'
    :attributes='attributes_'
    :date-validator='dateValidator'
    v-bind='$attrs'
    v-on='$listeners'>
  </component>
</template>

<script>
import SingleDatePicker from './SingleDatePicker';
import MultipleDatePicker from './MultipleDatePicker';
import DateRangePicker from './DateRangePicker';
import { DateInfo } from './utils';

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
    attributes: Array,
    dayContentHoverStyle: {
      type: Object,
      default: () => ({
        backgroundColor: 'rgba(16, 52, 86, 0.25)',
        cursor: 'pointer',
      }),
    },
    dragAttribute: {
      type: Object,
      default: () => ({
        highlight: {
          backgroundColor: '#c1d6d7',
          height: '25px',
        },
        contentStyle: {
          color: '#103456',
        },
        contentHoverStyle: {
          backgroundColor: 'transparent',
        },
      }),
    },
    selectAttribute: {
      type: Object,
      default: () => ({
        highlight: {
          backgroundColor: '#74a4a4',
          borderWidth: '1px',
          borderColor: '#65999a',
        },
        contentStyle: {
          color: '#fafafa',
        },
        contentHoverStyle: {
          backgroundColor: 'transparent',
        },
      }),
    },
    disabledDates: Array,
    disabledAttribute: {
      type: Object,
      default: () => ({
        order: 100,
        contentStyle: {
          color: '#ff4000',
          textDecoration: 'line-through',
        },
        contentHoverStyle: {
          cursor: 'not-allowed',
          backgroundColor: 'transparent',
        },
      }),
    },
  },
  computed: {
    disabledDates_() {
      if (this.disabledDates) return this.disabledDates.map(d => new DateInfo(d));
      if (this.disabledAttribute.dates) return this.disableAttribute.dates.map(d => new DateInfo(d));
      return [];
    },
    dateValidator() {
      return (date, failEventName) => {
        if (!this.disabledDates_.length) return true;
        const dateInfo = date instanceof DateInfo ? date : new DateInfo(date);
        const disabledDates = this.disabledDates_.filter(d => dateInfo.intersects(d));
        if (disabledDates && disabledDates.length) {
          this.$emit(failEventName, disabledDates);
          return false;
        }
        return true;
      };
    },
    disabledAttribute_() {
      return {
        key: 'disabled',
        ...this.disabledAttribute,
        dates: this.disabledDates_,
      };
    },
    attributes_() {
      const attributes = this.attributes ? [...this.attributes] : [];
      if (this.disabledAttribute_.dates) attributes.push(this.disabledAttribute_);
      return attributes;
    },
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
