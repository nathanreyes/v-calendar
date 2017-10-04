<template>
  <popover
    :visible='pickerVisible'
    :direction='popoverDirection'
    :align='popoverAlign'
    v-if='isPopover'>
    <slot name='input'>
      <input
        :class='inputClass'
        :style='inputStyle'
        :placeholder='placeholder_'
        @click='pickerVisible = !pickerVisible' />
    </slot>
    <date-picker-pane
      slot='popover-content'
      :value='value'
      v-bind='$attrs'
      v-on='$listeners'>
    </date-picker-pane>
  </popover>
  <date-picker-pane
    v-else
    :value='value'
    v-bind='$attrs'
    v-on='$listeners'>
  </date-picker-pane>
</template>

<script>
import Popover from './Popover';
import DatePickerPane from './DatePickerPane';

export default {
  components: {
    Popover,
    DatePickerPane,
  },
  props: {
    value: null,
    isPopover: Boolean,
    popoverDirection: { type: String, default: 'bottom' },
    popoverAlign: { type: String, default: 'left' },
    inputClass: String,
    inputStyle: Object,
    inputPlaceholder: String,
  },
  data() {
    return {
      pickerVisible: false,
    };
  },
  computed: {
    placeholder_() {
      if (this.inputPlaceholder) return this.inputPlaceholder;
      return this.pickerVisible ? 'Click to hide' : 'Click to select';
    },
  },
};
</script>
