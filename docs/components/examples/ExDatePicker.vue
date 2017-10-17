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
    tintColor: { type: String, default: '#65999a' },
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
        indicator: {
          backgroundColor: '#ff794d',
        },
        contentStyle: {
          color: '#ff794d',
          fontWeight: 600,
          marginBottom: '2px',
        },
        dates: [new Date()],
      },
    };
  },
};
</script>
