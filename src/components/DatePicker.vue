<template>
<component
  :is='componentName'
  :value='value'
  :drag-attribute='dragAttribute_'
  :select-attribute='selectAttribute_'
  :from-page.sync='fromPage_'
  :to-page.sync='toPage_'
  :theme-styles='themeStyles_'
  :disabled-attribute='disabledAttribute'
  :date-formatter='dateFormatter'
  @drag='dragValue = $event'
  v-bind='$attrs'
  v-on='filteredListeners()'
  v-if='isInline'>
</component>
<popover
  :is-expanded='popoverExpanded'
  :direction='popoverDirection'
  :align='popoverAlign'
  :visibility='popoverVisibility'
  :content-style='popoverContentStyle'
  :content-offset='popoverContentOffset'
  :force-hidden.sync='popoverForceHidden'
  @didDisappear='popoverDidDisappear'
  is-interactive
  v-else>
  <slot
    :input-value='inputValue'
    :update-value='updateValue'>
    <input
      ref='input'
      type='text'
      :class='[inputClass, { "c-input-drag": dragValue }]'
      :style='inputStyle'
      :placeholder='inputPlaceholder_'
      :value='inputValue'
      :readonly='inputReadOnly'
      @change='updateValue($event.target.value)' />
  </slot>
  <component
    slot='popover-content'
    :is='componentName'
    :value='value'
    :drag-attribute='dragAttribute_'
    :select-attribute='selectAttribute_'
    :from-page.sync='fromPage_'
    :to-page.sync='toPage_'
    :theme-styles='themeStyles_'
    :disabled-attribute='disabledAttribute'
    :date-formatter='dateFormatter'
    @drag='dragValue = $event'
    v-bind='$attrs'
    v-on='filteredListeners()'>
  </component>
</popover>
</template>

<script>
import Popover from './Popover';
import SingleDatePicker from './SingleDatePicker';
import MultipleDatePicker from './MultipleDatePicker';
import DateRangePicker from './DateRangePicker';
import PickerProfile from '../utils/pickerProfiles';
import Attribute from '../utils/attribute';
import defaults from '../utils/defaults';
import { isString } from '../utils/typeCheckers';

export default {
  components: {
    Popover,
    SingleDatePicker,
    MultipleDatePicker,
    DateRangePicker,
  },
  props: {
    mode: { type: String, default: 'single' },
    value: null,
    isInline: Boolean,
    fromPage: Object,
    toPage: Object,
    dragColor: { type: String, default: () => defaults.datePickerDragColor },
    dragAttribute: Object,
    selectColor: { type: String, default: () => defaults.datePickerSelectColor },
    selectAttribute: Object,
    showCaps: { type: Boolean, default: () => defaults.datePickerShowCaps },
    showPopover: { type: Boolean, default: () => defaults.datePickerShowPopover },
    popoverExpanded: { type: Boolean, default: () => defaults.popoverExpanded },
    popoverDirection: { type: String, default: () => defaults.popoverDirection },
    popoverAlign: { type: String, default: () => defaults.popoverAlign },
    popoverVisibility: { type: String, default: () => defaults.popoverVisibility },
    popoverContentOffset: { type: String, default: () => defaults.popoverContentOffset },
    popoverKeepVisibleOnInput: { type: Boolean, default: () => defaults.popoverKeepVisibleOnInput },
    inputClass: { type: String, default: () => defaults.datePickerInputClass },
    inputStyle: { type: Object, default: () => defaults.datePickerInputStyle },
    inputPlaceholder: String,
    inputReadOnly: Boolean,
    dateFormatter: { type: Function, default: defaults.dateFormatter },
    dateParser: { type: Function, default: defaults.dateParser },
    themeStyles: { type: Object, default: () => ({}) },
    availableDates: null,
    disabledDates: null,
  },
  data() {
    return {
      fromPage_: null,
      toPage_: null,
      dragValue: null,
      inputValue: '',
      popoverForceHidden: false,
      disablePopoverForceHidden: false,
    };
  },
  computed: {
    profile() {
      return PickerProfile(this.mode, this.dateFormatter, this.dateParser);
    },
    componentName() {
      return this.profile.componentName;
    },
    inputPlaceholder_() {
      return this.inputPlaceholder || this.profile.inputPlaceholder;
    },
    formattedValue() {
      return this.profile.formatValue(this.value, this.dragValue);
    },
    dragAttribute_() {
      return {
        ...defaults.datePickerDragAttribute(this.dragColor, this.showCaps, this.showPopover),
        ...this.dragAttribute,
      };
    },
    selectAttribute_() {
      return {
        ...defaults.datePickerSelectAttribute(this.selectColor, this.showCaps, this.showPopover),
        ...this.selectAttribute,
      };
    },
    themeStyles_() {
      const styles = {
        dayContentHover: {
          backgroundColor: '#dadada',
          border: '0',
          cursor: 'pointer',
        },
        ...this.themeStyles,
      };
      // Strip border from the wrapper when used in a popover
      // It will get applied to the popover content style instead so that the caret inherits it
      if (!this.isInline) {
        styles.wrapper = {
          ...styles.wrapper,
          border: '0',
        };
      }
      return styles;
    },
    popoverContentStyle() {
      return {
        ...this.themeStyles.wrapper,
        ...this.themeStyles.header,
        padding: '0',
        margin: '0',
      };
    },
    disabledAttribute() {
      if (!this.disabledDates && !this.availableDates) return null;
      return Attribute({
        ...defaults.datePickerDisabledAttribute,
        dates: this.disabledDates,
        excludeDates: this.availableDates,
      });
    },
  },
  watch: {
    fromPage(val) {
      this.fromPage_ = val;
    },
    toPage(val) {
      this.toPage_ = val;
    },
    fromPage_(val) {
      this.$emit('update:frompage', val); // Support in-DOM templates (:frompage.sync)
      this.$emit('update:fromPage', val); // Allow using :from-page.sync
    },
    toPage_(val) {
      this.$emit('update:topage', val);   // Support in-DOM templates (:topage.sync)
      this.$emit('update:toPage', val);   // Allow using :to-page.sync
    },
    mode() {
      // Clear value on select mode change
      this.$emit('input', null);
    },
    value() {
      this.updateInputValue();
      if (this.popoverKeepVisibleOnInput) return;
      if (this.mode !== 'multiple' && !this.disablePopoverForceHidden) {
        setTimeout(() => {
          this.popoverForceHidden = true;
        }, 300);
        if (this.$refs.input) this.$refs.input.blur();
      }
      this.disablePopoverForceHidden = false;
    },
    dragValue() {
      this.updateInputValue();
    },
    disabledAttribute() {
      this.updateValue(this.value);
    },
  },
  created() {
    this.assignPageRange();
    this.updateInputValue();
  },
  methods: {
    filteredListeners() {
      // Remove parent listeners that we want to intercept and re-broadcast
      const listeners = { ...this.$listeners };
      delete listeners['update:frompage'];
      delete listeners['update:fromPage'];
      delete listeners['update:topage'];
      delete listeners['update:toPage'];
      return listeners;
    },
    popoverDidDisappear() {
      this.assignPageRange();
    },
    assignPageRange() {
      const range = this.profile.getPageRange(this.value);
      if (range) {
        this.fromPage_ = range.from;
        this.toPage_ = range.to;
      }
    },
    updateValue(value) {
      const parsedValue = isString(value) ? this.profile.parseValue(value) : value;
      // Filter out any disabled dates
      const filteredValue = this.profile.filterDisabled(parsedValue, this.disabledAttribute);
      // Everything user entered was accepted so hide popover
      if (this.profile.valuesAreEqual(parsedValue, filteredValue)) {
        this.popoverForceHidden = true;
        if (this.$refs.input) this.$refs.input.blur();
      } else {
        // Keep the popover open because something they entered was modified
        this.disablePopoverForceHidden = true;
      }
      this.$emit('input', filteredValue);
      // Update input text for good measure
      this.updateInputValue();
    },
    updateInputValue() {
      this.$nextTick(() => { this.inputValue = this.profile.formatValue(this.value, this.dragValue); });
    },
  },
};
</script>

<style lang='sass' scoped>
  .c-input-drag
    color: rgba(0, 0, 0, 0.3)
</style>
