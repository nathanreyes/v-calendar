<template>
  <v-date-picker
    :select-mode='selectMode'
    :tint-color='tintColor'
    :disabled-dates='showDisabledDates ? disabledDates : null'
    :attributes='[todayAttribute]'
    :is-inline='isInline'
    :popover-direction='popoverDirection'
    :popover-align='popoverAlign'
    indicators-offset='4px'
    inputClass='input'
    v-model='selectedValue'
    is-double-paned
    is-expanded>
  </v-date-picker>
</template>

<script>
import { getExampleMonthComps } from '../utils';

const { thisMonth, thisMonthYear, nextMonth, nextMonthYear } = getExampleMonthComps();

export default {
  props: {
    selectMode: { type: String, default: 'range' },
    tintColor: { type: String, default: '#66b3cc' },
    showDisabledDates: Boolean,
    isInline: Boolean,
    isExpanded: Boolean,
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
        contentStyle: {
          color: '#ffffff',
          backgroundColor: '#ff9999',
          border: 'solid 1px #ff8080',
          fontWeight: 600,
        },
        dates: [new Date()],
      },
    };
  },
};
</script>
