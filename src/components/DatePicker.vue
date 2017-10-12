<template>
  <popover
    :visible='pickerVisible'
    :direction='popoverDirection'
    :align='popoverAlign'
    @contentFocus='popoverFocus'
    @contentBlur='popoverBlur'
    v-if='isPopover'
    is-focusable>
    <slot name='input'>
      <input
        :class='[inputClass, { "c-input-drag": dragValue }]'
        :style='inputStyle'
        :placeholder='placeholder_'
        v-model='valueText'
        @focus='inputFocus'
        @blur='inputBlur'
        @keyup.enter='inputEnter' />
    </slot>
    <component
      slot='popover-content'
      :is='datePicker'
      :value='value'
      :day-content-hover-style='dayContentHoverStyle'
      :drag-attribute='dragAttribute'
      :select-attribute='selectAttribute'
      :disabled-attribute='disabledAttribute_'
      :attributes='attributes_'
      :date-validator='dateValidator'
      @drag='dragValue = $event'
      v-bind='$attrs'
      v-on='$listeners'>
    </component>
  </popover>
  <component
    :is='datePicker'
    :value='value'
    :day-content-hover-style='dayContentHoverStyle'
    :drag-attribute='dragAttribute'
    :select-attribute='selectAttribute'
    :disabled-attribute='disabledAttribute_'
    :attributes='attributes_'
    :date-validator='dateValidator'
    @drag='dragValue = $event'
    v-bind='$attrs'
    v-on='$listeners'
    v-else>
  </component>
</template>

<script>
import Popover from './Popover';
import SingleDatePicker from './SingleDatePicker';
import MultipleDatePicker from './MultipleDatePicker';
import DateRangePicker from './DateRangePicker';
import { DateInfo } from './utils';

export default {
  components: {
    Popover,
    SingleDatePicker,
    MultipleDatePicker,
    DateRangePicker,
  },
  props: {
    selectMode: { type: String, default: 'single' },
    value: null,
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
    attributes: Array,
    dayContentHoverStyle: {
      type: Object,
      default: () => ({
        backgroundColor: 'rgba(16, 52, 86, 0.25)',
        cursor: 'pointer',
      }),
    },
    dragAttribute: {
      type: Object,
      default: () => ({
        highlight: {
          backgroundColor: '#c1d6d7',
          height: '25px',
        },
        contentStyle: {
          color: '#103456',
        },
        contentHoverStyle: {
          backgroundColor: 'transparent',
        },
      }),
    },
    selectAttribute: {
      type: Object,
      default: () => ({
        highlight: {
          backgroundColor: '#74a4a4',
          borderWidth: '1px',
          borderColor: '#65999a',
        },
        contentStyle: {
          color: '#fafafa',
        },
        contentHoverStyle: {
          backgroundColor: 'transparent',
        },
      }),
    },
    disabledDates: Array,
    disabledAttribute: {
      type: Object,
      default: () => ({
        order: 100,
        contentStyle: {
          color: '#ff4000',
          textDecoration: 'line-through',
        },
        contentHoverStyle: {
          cursor: 'not-allowed',
          backgroundColor: 'transparent',
        },
      }),
    },
  },
  data() {
    return {
      pickerVisible: false,
      dragValue: null,
      valueText: '',
    };
  },
  created() {
    this.valueText = this.suggestedInputText;
  },
  computed: {
    datePicker() {
      switch (this.selectMode) {
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
      switch (this.selectMode) {
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
      if (this.selectMode === 'single') {
        if (typeof this.value.getTime !== 'function') return '';
        return this.dateFormatter(this.value);
      } else if (this.selectMode === 'multiple') {
        return this.value.length ? this.value.map(d => this.dateFormatter(d)).join(', ') : '';
      } else if (this.selectMode === 'range') {
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
      if (this.disabledAttribute.dates) return this.disableAttribute.dates.map(d => new DateInfo(d));
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
    disabledAttribute_() {
      return {
        key: 'disabled',
        ...this.disabledAttribute,
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
    dragValue(val) {
      // Forward drag event
      this.$emit('drag', val);
    },
    selectMode() {
      // Clear value on select mode change
      this.$emit('input', null);
    },
    suggestedInputText(val) {
      this.valueText = val;
    },
  },
  methods: {
    inputFocus() {
      this.pickerVisible = true;
    },
    inputBlur() {
      this.pickerVisible = false;
      this.updateValueFromText();
    },
    inputEnter() {
      this.updateValueFromText();
    },
    popoverFocus() {
      this.pickerVisible = true;
    },
    popoverBlur() {
      this.pickerVisible = false;
    },
    updateValueFromText() {
      this.$emit('input', this.getValueForInputText());
    },
    getValueForInputText() {
      const valueText = this.valueText;
      let value = null;
      if (this.selectMode === 'single') {
        value = this.dateParser(valueText.trim());
        if (isNaN(value.getTime())) value = null;
      } else if (this.selectMode === 'multiple') {
        value = valueText
          .split(',')
          .map(s => this.dateParser(s.trim()))
          .filter(d => !isNaN(d.getTime()));
      } else if (this.selectMode === 'range') {
        const dates = valueText.split('-').map(s => s.trim());
        if (!dates.length) {
          value = null;
        } else {
          let start = this.dateParser(dates[0]);
          if (isNaN(start.getTime())) start = null;
          let end = dates.length > 1 ? this.dateParser(dates[1]) : null;
          if (end && isNaN(end)) end = null;
          value = { start, end };
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
