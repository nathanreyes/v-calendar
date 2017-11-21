<template>
  <v-date-picker
    class='picker'
    :from-page.sync='fromPage'
    :to-page.sync='toPage'
    :mode='mode'
    :select-color='selectColor'
    :drag-color='dragColor'
    :disabled-dates='showDisabledDates ? disabledDates : null'
    :attributes='[]'
    :is-inline='isInline'
    :is-expanded='isExpanded'
    :popover-expanded='popoverExpanded'
    :popover-visibility='popoverVisibility'
    :popover-direction='popoverDirection'
    :popover-align='popoverAlign'
    inputClass='input'
    v-model='selectedValue'
    is-double-paned>
  </v-date-picker>
</template>

<script>
import { getExampleMonthComps } from '@/utils/helpers';

const { thisMonth, thisMonthYear, nextMonth, nextMonthYear } = getExampleMonthComps();

export default {
  props: {
    mode: { type: String, default: 'range' },
    selectColor: { type: String, default: '#66b3cc' },
    dragColor: { type: String, default: '#9fcfdf' },
    showDisabledDates: Boolean,
    isInline: Boolean,
    isExpanded: Boolean,
    popoverExpanded: Boolean,
    popoverVisibility: { type: String, default: 'hover' },
    popoverDirection: { type: String, default: 'bottom' },
    popoverAlign: { type: String, default: 'left' },
  },
  data() {
    return {
      fromPage: null,
      toPage: null,
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

<style lang='sass'>
.picker
  min-width: 220px
</style>
