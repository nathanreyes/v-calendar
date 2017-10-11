<template>
  <popover
    :visible='pickerVisible'
    :direction='popoverDirection'
    :align='popoverAlign'
    v-if='isPopover'>
    <slot name='input'>
      <input
        ref='input'
        :class='[inputClass, { "c-input-drag": dragValue_ }]'
        :style='inputStyle'
        :placeholder='placeholder_'
        v-model='valueText'
        @focus='inputFocus'
        @blur='inputSubmit'
        @keyup.enter='inputSubmit' />
    </slot>
    <date-picker-pane
      slot='popover-content'
      :select-mode='selectMode'
      :value='value'
      :drag-value.sync='dragValue_'
      @input='dateSelected($event)'
      v-bind='$attrs'
      v-on='$listeners'>
    </date-picker-pane>
  </popover>
  <date-picker-pane
    v-else
    :select-mode='selectMode'
    :value='value'
    :dragValue.sync='dragValue_'
    @input='dateSelected($event)'
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
    selectMode: { type: String, default: 'single' },
    value: null,
    dragValue: null,
    isPopover: Boolean,
    popoverDirection: { type: String, default: 'bottom' },
    popoverAlign: { type: String, default: 'left' },
    inputClass: String,
    inputStyle: Object,
    inputPlaceholder: String,
    dateFormatter: {
      type: Function,
      default: d => d.toLocaleDateString(),
    },
    dateParser: {
      type: Function,
      default: s => new Date(Date.parse(s)),
    },
  },
  data() {
    return {
      pickerVisible: false,
      dragValue_: this.dragValue,
      valueText: '',
    };
  },
  computed: {
    placeholder_() {
      if (this.inputPlaceholder) return this.inputPlaceholder;
      return this.pickerVisible ? 'Click to hide' : 'Click to select';
    },
    suggestedValueText() {
      if (!this.value || typeof this.dateFormatter !== 'function') return '';
      if (this.selectMode === 'single') {
        if (typeof this.value.getTime !== 'function') return '';
        return this.dateFormatter(this.value);
      } else if (this.selectMode === 'multiple') {
        return this.value.length ? this.value.map(d => this.dateFormatter(d)).join(', ') : '';
      } else if (this.selectMode === 'range') {
        if (this.dragValue_) {
          const startText = this.dateFormatter(this.dragValue_.start);
          const endText = this.dateFormatter(this.dragValue_.end);
          return `${startText} - ${endText}`;
        } else if (this.value) {
          const startText = this.dateFormatter(this.value.start);
          const endText = this.dateFormatter(this.value.end);
          return `${startText} - ${endText}`;
        }
        return '';
      }
      return '';
    },
  },
  watch: {
    dragValue(val) {
      this.dragValue_ = val;
    },
    dragValue_(val) {
      this.$emit('update:dragValue', val);
    },
    valueText(val) {
      if (!this.inputHasFocus()) return;
      let value = null;
      if (this.value) {
        if (this.selectMode === 'single') {
          value = this.dateParser(val.trim());
          if (isNaN(value)) value = null;
        } else if (this.selectMode === 'multiple') {
          value = val
            .split(',')
            .map(s => this.dateParser(s.trim()))
            .filter(d => !isNaN(d.getTime()));
        } else if (this.selectMode === 'range') {
          value = {};
        }
      }
      this.$emit('input', value);
    },
    suggestedValueText() {
      if (this.inputHasFocus()) return;
      this.valueText = this.suggestedValueText;
    },
  },
  methods: {
    inputHasFocus() {
      return this.$refs.input === document.activeElement;
    },
    dateSelected(date) {
      this.$emit('input', date);
    },
    inputFocus() {
      this.pickerVisible = true;
    },
    inputSubmit() {
      this.valueText = this.suggestedValueText;
      // this.pickerVisible = false;
    },
  },
};
</script>

<style lang='sass'>
  .c-input-drag
    color: rgba(0, 0, 0, 0.3)
</style>
