<template>
  <v-date-picker
    class='picker'
    :from-page.sync='fromPage'
    :to-page.sync='toPage'
    :mode='mode'
    :tint-color='tintColor'
    :show-caps='showCaps'
    :show-popover='showPopover'
    :disabled-dates='showDisabledDates ? disabledDates : null'
    :attributes='[]'
    :is-inline='isInline'
    :is-expanded='isExpanded'
    :input-props='inputProps'
    :popover-expanded='popoverExpanded'
    :popover-visibility='popoverVisibility'
    :popover-direction='popoverDirection'
    :popover-align='popoverAlign'
    v-model='selectedValue'
    @drag='dragValue = $event'
    :available-dates='availableDates'
    @input='input'
    >
  </v-date-picker>
</template>

<script>
export default {
  props: {
    mode: { type: String, default: 'single' },
    tintColor: { type: String, default: '#66b3cc' },
    showCaps: { type: Boolean, default: true },
    showPopover: { type: Boolean, default: true },
    showDisabledDates: Boolean,
    isInline: Boolean,
    isExpanded: Boolean,
    popoverExpanded: Boolean,
    popoverVisibility: { type: String, default: 'visible' },
    popoverDirection: { type: String, default: 'bottom' },
    popoverAlign: { type: String, default: 'left' },
  },
  data() {
    return {
      dragValue: null,
      availableDates: null,
      fromPage: null,
      toPage: null,
      selectedValue: new Date(),
      disabledDates: { weekdays: [1, 7] },
      inputProps: {
        class: 'input',
      },
    };
  },
  watch: {
  	dragValue(val, oldVal) {
    	if (!val) {
      	this.availableDates = null;
      } else if (val && !oldVal) {
      	this.availableDates = {
        	start: this.addDays(val.start, -2),
          end: this.addDays(val.start, 2)
        }
      }
    }
  },
  methods: {
    addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
    input() {
      alert('input');
    }
  }
};
</script>

<style lang='sass'>
.picker
  min-width: 220px
</style>
