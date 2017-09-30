<template>
  <v-date-picker
    :select-mode='selectMode'
    :is-popover='isPopover'
    :day-content-style='dayStyle'
    :disabled-dates='disabledDates'
    inputClass='input'
    v-model='selectedValue'
    is-double-paned>
  </v-date-picker>
</template>

<script>
import { getExampleMonthComps } from './utils';

const { thisMonth, thisMonthYear, nextMonth, nextMonthYear } = getExampleMonthComps();

export default {
  props: {
    isPopover: { type: Boolean, default: false },
    selectMode: { type: String, default: 'range' },
  },
  data() {
    return {
      dayStyle: {
        hoverBorder: 'solid blue 3px',
        hoverBackgroundColor: 'red',
      },
      selectedValue: {
        start: new Date(thisMonthYear, thisMonth, 6),
        end: new Date(nextMonthYear, nextMonth, 25),
      },
      disabledDates: [
        {
          start: new Date(nextMonthYear, nextMonth, 26),
          end: new Date(nextMonthYear, nextMonth, 28),
        },
      ],
    };
  },
  watch: {
    selectedValue(val) {
      this.$emit('input', val);
    },
  },
  created() {
    this.$emit('input', this.selectedValue);
  },
};
</script>
