<template>
  <v-date-picker
    :select-mode='selectMode'
    :is-popover='isPopover'
    :day-content-style='{ borderRadius: "5px" }'
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
      selectedValue: {
        start: new Date(thisMonthYear, thisMonth, 6),
        end: new Date(nextMonthYear, nextMonth, 25),
      },
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
