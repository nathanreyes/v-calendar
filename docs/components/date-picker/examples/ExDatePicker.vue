<template>
  <v-date-picker
    class='picker'
    :from-page.sync='fromPage'
    :to-page.sync='toPage'
    :mode='mode'
    :select-color='selectColor'
    :drag-color='dragColor'
    :show-caps='showCaps'
    :show-popover='showPopover'
    :disabled-dates='showDisabledDates ? disabledDates : null'
    :attributes='[]'
    :is-inline='isInline'
    :is-expanded='isExpanded'
    :popover-expanded='popoverExpanded'
    :popover-visibility='popoverVisibility'
    :popover-direction='popoverDirection'
    :popover-align='popoverAlign'
    inputClass='input'
    v-model='selectedValue'>
  </v-date-picker>
</template>

<script>
export default {
  props: {
    mode: { type: String, default: 'single' },
    selectColor: { type: String, default: '#66b3cc' },
    dragColor: { type: String, default: '#9fcfdf' },
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
      fromPage: null,
      toPage: null,
      selectedValue: new Date(),
      disabledDates: { weekdays: [1, 7] },
    };
  },
};
</script>

<style lang='sass'>
.picker
  min-width: 220px
</style>
