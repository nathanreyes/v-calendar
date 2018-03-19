<template>
  <v-date-picker
    class='picker'
    :from-page.sync='fromPage'
    :to-page.sync='toPage'
    :mode='mode'
    :tint-color='tintColor'
    :show-caps='showCaps'
    :show-day-popover='showDayPopover'
    :disabled-dates='showDisabledDates ? disabledDates : null'
    :attributes='[]'
    :is-inline='isInline'
    :is-expanded='isExpanded'
    :input-props='inputProps'
    :popover-expanded='popoverExpanded'
    :popover-visibility='popoverVisibility'
    :popover-direction='popoverDirection'
    :popover-align='popoverAlign'
    v-model='selectedValue'>
  </v-date-picker>
</template>

<script>
export default {
  props: {
    mode: { type: String, default: 'single' },
    tintColor: { type: String, default: '#66b3cc' },
    showCaps: { type: Boolean, default: true },
    showDayPopover: { type: Boolean, default: true },
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
      fromPage: null,
      toPage: null,
      selectedValue: new Date(),
      disabledDates: { weekdays: [1, 7] },
      inputProps: {
        class: 'input',
      },
    };
  },
};
</script>

<style lang='sass'>
.picker
  min-width: 220px
</style>
