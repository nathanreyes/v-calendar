<template>
  <component
    :is='datePicker'
    :value='value'
    :from-page.sync='fromPage_'
    :to-page.sync='toPage_'
    :theme-styles='themeStyles_'
    :drag-attribute='dragAttribute_'
    :select-attribute='selectAttribute_'
    :disabled-attribute='disabledAttribute_'
    :attributes='attributes_'
    :date-validator='dateValidator'
    @drag='dragValue = $event'
    @input='updateValue'
    v-bind='$attrs'
    v-on='filteredListeners()'
    v-if='isInline'>
  </component>
  <popover
    :direction='popoverDirection'
    :align='popoverAlign'
    :visibility='popoverVisibility'
    :is-expanded='popoverExpanded'
    :content-style='popoverContentStyle'
    :force-hidden.sync='popoverForceHidden'
    :force-hidden-delay='400'
    @didDisappear='popoverDidDisappear'
    v-else>
    <slot
      :input-value='valueText'
      :update-value='updateValue'>
      <input
        type='text'
        :class='[inputClass, { "c-input-drag": dragValue }]'
        :style='inputStyle'
        :placeholder='placeholder_'
        :value='valueText'
        @change='updateValue($event.target.value)' />
    </slot>
    <component
      slot='popover-content'
      :is='datePicker'
      :value='value'
      :from-page.sync='fromPage_'
      :to-page.sync='toPage_'
      :theme-styles='themeStyles_'
      :drag-attribute='dragAttribute_'
      :select-attribute='selectAttribute_'
      :disabled-attribute='disabledAttribute_'
      :attributes='attributes_'
      :date-validator='dateValidator'
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
import DateInfo from '../utils/dateInfo';
import defaults from '../utils/defaults';
import {
  getDateComps,
  getNextPage,
  getMaxPage,
  getLastArrayItem,
  blendColors } from '../utils/helpers';

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
    popoverExpanded: { type: Boolean, default: () => defaults.popoverExpanded },
    popoverDirection: { type: String, default: () => defaults.popoverDirection },
    popoverAlign: { type: String, default: () => defaults.popoverAlign },
    popoverVisibility: { type: String, default: () => defaults.popoverVisibility },
    popoverKeepVisibleOnInput: Boolean,
    inputClass: { type: String, default: () => defaults.datePickerInputClass },
    inputStyle: { type: Object, default: () => defaults.datePickerInputStyle },
    inputPlaceholder: String,
    dateFormatter: { type: Function, default: defaults.dateFormatter },
    dateParser: { type: Function, default: defaults.dateParser },
    themeStyles: { type: Object, default: () => ({}) },
    selectColor: { type: String, default: () => defaults.datePickerSelectColor },
    dragColor: { type: String, default: () => defaults.datePickerDragColor },
    selectAttribute: Object,
    dragAttribute: Object,
    disabledDates: Array,
    disabledAttribute: Object,
    attributes: Array,
  },
  data() {
    return {
      fromPage_: null,
      toPage_: null,
      dragValue: null,
      valueText: '',
      popoverForceHidden: false,
    };
  },
  computed: {
    datePicker() {
      switch (this.mode) {
        case 'single':
          return 'single-date-picker';
        case 'multiple':
          return 'multiple-date-picker';
        case 'range':
          return 'date-range-picker';
        default:
          return '';
      }
    },
    placeholder_() {
      if (this.inputPlaceholder) return this.inputPlaceholder;
      switch (this.mode) {
        case 'single':
          return 'Enter Date';
        case 'multiple':
          return 'Date 1, Date 2, ...';
        case 'range':
          return 'Start Date - End Date';
        default:
          return '';
      }
    },
    suggestedInputText() {
      if (!this.value || typeof this.dateFormatter !== 'function') return '';
      if (this.mode === 'single') {
        if (typeof this.value.getTime !== 'function') return '';
        return this.dateFormatter(this.value);
      } else if (this.mode === 'multiple') {
        return this.value.length ? this.value.map(d => this.dateFormatter(d)).join(', ') : '';
      } else if (this.mode === 'range') {
        if (this.dragValue) {
          const startText = this.dateFormatter(this.dragValue.start);
          const endText = this.dateFormatter(this.dragValue.end);
          return `${startText} - ${endText}`;
        } else if (this.value) {
          const startText = this.value.start ? this.dateFormatter(this.value.start) : '';
          const endText = this.value.end ? this.dateFormatter(this.value.end) : '';
          if (!startText && !endText) return '';
          if (!endText) return startText;
          return `${startText} - ${endText}`;
        }
      }
      return '';
    },
    disabledDates_() {
      if (this.disabledDates) return this.disabledDates.map(d => new DateInfo(d));
      if (this.disabledAttribute && this.disabledAttribute.dates) return this.disableAttribute.dates.map(d => new DateInfo(d));
      return [];
    },
    dateValidator() {
      return (date, failEventName) => {
        if (!this.disabledDates_.length) return true;
        const dateInfo = date instanceof DateInfo ? date : new DateInfo(date);
        const disabledDates = this.disabledDates_.filter(d => dateInfo.intersects(d));
        if (disabledDates && disabledDates.length) {
          this.$emit(failEventName, disabledDates);
          return false;
        }
        return true;
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
      if (!this.isInline && styles.wrapper) styles.wrapper.border = '0';
      return styles;
    },
    popoverContentStyle() {
      return {
        ...this.themeStyles.wrapper,
        padding: '0',
      };
    },
    selectAttribute_() {
      return this.selectAttribute || {
        highlight: {
          backgroundColor: this.selectColor,
          borderWidth: '1px',
          borderColor: blendColors(this.selectColor, '#000000', 0.1),
        },
        contentStyle: {
          color: '#fafafa',
        },
        contentHoverStyle: {
          backgroundColor: 'transparent',
          border: '0',
        },
      };
    },
    dragAttribute_() {
      return this.dragAttribute || {
        highlight: {
          backgroundColor: this.dragColor,
          height: '25px',
        },
        contentHoverStyle: {
          backgroundColor: 'transparent',
          border: '0',
        },
      };
    },
    disabledAttribute_() {
      const baseAttribute = this.disabledAttribute || {
        order: 100,
        contentStyle: {
          color: '#bcbcbc',
          textDecoration: 'line-through',
        },
        contentHoverStyle: {
          cursor: 'not-allowed',
          backgroundColor: 'transparent',
        },
      };
      return {
        key: 'disabled',
        ...baseAttribute,
        dates: this.disabledDates_,
      };
    },
    attributes_() {
      const attributes = this.attributes ? [...this.attributes] : [];
      if (this.disabledAttribute_.dates) attributes.push(this.disabledAttribute_);
      return attributes;
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
      this.$emit('update:fromPage', val);
    },
    toPage_(val) {
      this.$emit('update:toPage', val);
    },
    mode() {
      // Clear value on select mode change
      this.$emit('input', null);
    },
    suggestedInputText(val) {
      this.valueText = val;
    },
    value() {
      if (!this.popoverKeepVisibleOnInput) this.popoverForceHidden = true;
    },
  },
  created() {
    this.assignPageRange();
    this.valueText = this.suggestedInputText;
  },
  methods: {
    filteredListeners() {
      // Remove parent listeners that we want to intercept and re-broadcast
      const listeners = { ...this.$listeners };
      delete listeners['update:fromPage'];
      delete listeners['update:toPage'];
      return listeners;
    },
    popoverDidDisappear() {
      this.assignPageRange();
    },
    assignPageRange() {
      if (!this.value) return;
      switch (this.mode) {
        case 'single':
          this.fromPage_ = getDateComps(this.value);
          this.toPage_ = getNextPage(this.fromPage_);
          break;
        case 'multiple':
          if (!this.value.length) return;
          this.fromPage_ = getDateComps(this.value[0]);
          this.toPage_ = getMaxPage(getDateComps(getLastArrayItem(this.value)), getNextPage(this.fromPage_));
          break;
        case 'range':
          if (!this.value.start || !this.value.end) return;
          this.fromPage_ = getDateComps(this.value.start);
          this.toPage_ = getMaxPage(getDateComps(this.value.end), getNextPage(this.fromPage_));
          break;
        default:
      }
    },
    updateValue(value = this.valueText) {
      if (typeof value === 'string') {
        this.$emit('input', this.parseValue(value));
      } else {
        this.$emit('input', value);
      }
    },
    parseValue(valueText) {
      let value = null;
      if (this.mode === 'single') {
        value = this.dateParser(valueText.trim());
        if (isNaN(value.getTime())) value = null;
      } else if (this.mode === 'multiple') {
        value = valueText
          .split(',')
          .map(s => this.dateParser(s.trim()))
          .filter(d => !isNaN(d.getTime()));
      } else if (this.mode === 'range') {
        const dates = valueText.split('-').map(s => s.trim());
        if (dates.length < 2) {
          value = null;
        } else {
          let start = this.dateParser(dates[0]);
          if (isNaN(start.getTime())) start = null;
          let end = dates.length > 1 ? this.dateParser(dates[1]) : null;
          if (end && isNaN(end)) end = null;
          value = start && end ? { start, end } : null;
        }
      }
      return value;
    },
  },
};
</script>

<style lang='sass'>
  .c-input-drag
    color: rgba(0, 0, 0, 0.3)
</style>
