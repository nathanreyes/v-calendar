<template>
  <v-date-picker
    :select-mode='selectMode'
    :disabled-dates='showDisabledDates ? disabledDates : null'
    :attributes='[todayAttribute]'
    :is-popover='isPopover'
    :popover-direction='popoverDirection'
    :popover-align='popoverAlign'
    inputClass='input'
    v-model='selectedValue'
    :wrap='!isPopover'
    is-double-paned>
  </v-date-picker>
</template>

<script>
import { getExampleMonthComps } from '../utils';

const { thisMonth, thisMonthYear, nextMonth, nextMonthYear } = getExampleMonthComps();

export default {
  props: {
    selectMode: { type: String, default: 'range' },
    showDisabledDates: Boolean,
    isPopover: { type: Boolean, default: false },
    popoverDirection: { type: String, default: 'bottom' },
    popoverAlign: { type: String, default: 'left' },
  },
  data() {
    return {
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
      todayAttribute: {
        highlight: {
          backgroundColor: '#ff8c66',
        },
        contentStyle: {
          color: 'white',
        },
        dates: [new Date()],
      },
    };
  },
};
</script>
