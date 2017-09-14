<template>
  <popover :visible='pickerVisible' v-if='isPopover'>
    <slot name='input'>
      <input
        :class='inputClass'
        :style='inputStyle'
        :placeholder='placeholder_'
        @click='pickerVisible = !pickerVisible' />
    </slot>
    <date-picker-panes
      slot='popover-content'
      :value='value'
      v-bind='$attrs'
      v-on='$listeners'>
    </date-picker-panes>
  </popover>
  <date-picker-panes
    v-else
    :value='value'
    v-bind='$attrs'
    v-on='$listeners'>
  </date-picker-panes>
</template>

<script>
import Popover from './Popover';
import DatePickerPanes from './DatePickerPanes';

export default {
  components: {
    Popover,
    DatePickerPanes,
  },
  props: {
    value: null,
    isPopover: Boolean,
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
