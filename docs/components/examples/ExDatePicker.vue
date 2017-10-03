<template>
  <v-date-picker
    :select-mode='selectMode'
    :is-popover='isPopover'
    :disabled-dates='showDisabledDates ? disabledDates : null'
    :attributes='[todayAttribute]'
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
    isPopover: { type: Boolean, default: false },
    selectMode: { type: String, default: 'range' },
    showDisabledDates: Boolean,
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
