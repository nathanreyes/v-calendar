<template>
  <v-date-picker
    :select-mode='selectMode'
    :disabled-dates='showDisabledDates ? disabledDates : null'
    :attributes='[todayAttribute]'
    :is-inline='isInline'
    :popover-direction='popoverDirection'
    :popover-align='popoverAlign'
    inputClass='input'
    v-model='selectedValue'
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
    isInline: Boolean,
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
          borderColor: '#ff794d',
          borderWidth: '2px',
        },
        contentStyle: {
          color: 'white',
          fontWeight: 500,
        },
        dates: [new Date()],
      },
    };
  },
};
</script>
