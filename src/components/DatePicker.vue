<template>
<component
  :is='componentName'
  :value='value'
  :is-required='isRequired'
  :select-attribute='selectAttribute_'
  :drag-attribute='dragAttribute_'
  :disabled-attribute='disabledAttribute_'
  :from-page.sync='fromPage_'
  :to-page.sync='toPage_'
  :theme-styles='themeStyles_'
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
  is-interactive
  v-else>
  <slot
    :input-value='inputValue'
    :update-value='updateValue'>
    <input
      ref='input'
      type='text'
      v-bind='inputProps_'
      v-model='inputValue'
      @change='updateValue()' />
  </slot>
  <component
    slot='popover-content'
    :is='componentName'
    :value='value'
    :is-required='isRequired'
    :select-attribute='selectAttribute_'
    :drag-attribute='dragAttribute_'
    :disabled-attribute='disabledAttribute_'
    :from-page.sync='fromPage_'
    :to-page.sync='toPage_'
    :theme-styles='themeStyles_'
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
import DatePickerDayPopover from './DatePickerDayPopover';
import PickerProfile from '../utils/pickerProfiles';
import Attribute from '../utils/attribute';
import defaults, { resolveDefault } from '../utils/defaults';
import { addDays } from '../utils/dateInfo';
import { pageIsBetweenPages } from '../utils/helpers';
import { isString, isFunction, isObject, isArray } from '../utils/typeCheckers';

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
    isRequired: Boolean,
    isInline: Boolean,
    minDate: Date,
    maxDate: Date,
    disabledDates: null,
    availableDates: null,
    inputProps: { type: Object, default: () => ({}) }, // Resolved by computed property
    dateFormatter: Function, // Resolved by computed property
    dateParser: Function, // Resolved by computed property
    tintColor: { type: String, default: () => defaults.datePickerTintColor },
    dragAttribute: Object, // Resolved by computed property
    selectAttribute: Object, // Resolved by computed property
    disabledAttribute: Object, // Resolved by computed property
    showCaps: { type: Boolean, default: () => defaults.datePickerShowCaps },
    showPopover: { type: Boolean, default: () => defaults.datePickerShowPopover },
    popoverExpanded: { type: Boolean, default: () => defaults.popoverExpanded },
    popoverDirection: { type: String, default: () => defaults.popoverDirection },
    popoverAlign: { type: String, default: () => defaults.popoverAlign },
    popoverVisibility: { type: String, default: () => defaults.popoverVisibility },
    popoverContentOffset: { type: String, default: () => defaults.popoverContentOffset },
    popoverKeepVisibleOnInput: { type: Boolean, default: () => defaults.popoverKeepVisibleOnInput },
    fromPage: Object,
    toPage: Object,
    themeStyles: { type: Object, default: () => ({}) }, // Resolved by computed property
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
    dateFormatter_() {
      return this.dateFormatter || defaults.dateFormatter;
    },
    dateParser_() {
      return this.dateParser || defaults.dateParser;
    },
    profile() {
      return PickerProfile(this.mode, this.dateFormatter_, this.dateParser_);
    },
    componentName() {
      return this.profile.componentName;
    },
    formattedValue() {
      return this.profile.formatValue(this.value, this.dragValue);
    },
    attributeParams() {
      return {
        mode: this.mode,
        color: this.tintColor,
        showCaps: this.showCaps,
        showPopover: this.showPopover,
      };
    },
    selectAttribute_() {
      return this.buildSelectDragAttribute(this.selectAttribute);
    },
    dragAttribute_() {
      return this.buildSelectDragAttribute(this.dragAttribute, true);
    },
    disabledDates_() {
      const dates = [];
      if (this.disabledDates) {
        if (isArray(this.disabledDates)) dates.push(...this.disabledDates);
        else dates.push(this.disabledDates);
      }
      if (this.minDate) dates.push({ start: null, end: addDays(this.minDate, -1) });
      if (this.maxDate) dates.push({ start: addDays(this.maxDate, 1), end: null });
      return dates;
    },
    disabledAttribute_() {
      if (!this.disabledDates_ && !this.availableDates) return null;
      return Attribute({
        key: 'disabled',
        order: 100,
        ...(this.disabledAttribute || resolveDefault(defaults.datePickerDisabledAttribute, this.attributeParams)),
        dates: this.disabledDates_,
        excludeDates: this.availableDates,
        excludeMode: 'includes',
      });
    },
    inputProps_() {
      const defaultProps = defaults.datePickerInputProps;
      if (isFunction(defaultProps)) {
        return {
          ...defaultProps({
            mode: this.mode,
            value: this.value,
            dragValue: this.dragValue,
          }),
          ...this.inputProps,
        };
      } else if (isObject(defaultProps)) {
        return {
          ...defaultProps,
          ...this.inputProps,
        };
      }
      return this.inputProps;
    },
    themeStyles_() {
      // Strip the wrapper style when used in a popover
      // It will get passed in as the content style
      const styles = {
        dayContentHover: {
          backgroundColor: '#dadada',
          border: '0',
          cursor: 'pointer',
        },
        ...this.themeStyles,
        ...(!this.isInline && {
          wrapper: null,
        }),
      };
      return styles;
    },
    popoverContentStyle() {
      return {
        ...this.themeStyles.wrapper,
        padding: '0',
        margin: '0',
      };
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
      this.assignPageRange();
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
    disabledAttribute_() {
      if (!this.dragValue) this.updateValue(this.value);
    },
  },
  created() {
    this.fromPage_ = this.fromPage;
    this.toPage_ = this.toPage;
    this.assignPageRange();
    this.updateInputValue();
  },
  methods: {
    buildSelectDragAttribute(propAttr, isDrag) {
      let attr = {
        key: 'drag-select',
        ...propAttr,
      };
      const { highlight, contentStyle, dot, bar } = attr;
      if (!highlight && !contentStyle && !dot && !bar) {
        attr = {
          ...attr,
          highlight: {
            backgroundColor: this.tintColor,
            ...(isDrag && {
              height: '25px',
              opacity: 0.5,
            }),
          },
          ...(!isDrag && {
            contentStyle: {
              color: '#fafafa',
            },
          }),
          contentHoverStyle: {
            backgroundColor: 'transparent',
            border: '0',
          },
        };
      }
      if (attr.highlight && this.showCaps) {
        attr.highlightCaps = {
          backgroundColor: '#fafafa',
          borderColor: this.tintColor,
          borderWidth: '2px',
        };
        attr.contentStyleCaps = {
          color: '#333333',
        };
      }
      if (!attr.popover && this.showPopover) {
        attr.popover = {
          component: DatePickerDayPopover,
          hideIndicator: true,
        };
      }
      return attr;
    },
    filteredListeners() {
      // Remove parent listeners that we want to intercept and re-broadcast
      const listeners = { ...this.$listeners };
      delete listeners['update:frompage'];
      delete listeners['update:fromPage'];
      delete listeners['update:topage'];
      delete listeners['update:toPage'];
      return listeners;
    },
    assignPageRange() {
      const range = this.profile.getPageRange(this.value);
      if (range) {
        const fromInRange = pageIsBetweenPages(this.fromPage_, range.from, range.to);
        const toInRange = pageIsBetweenPages(this.toPage_, range.from, range.to);
        if (this.mode === 'single') {
          if (!fromInRange && !toInRange) {
            this.fromPage_ = range.from;
            this.toPage_ = range.to;
          }
        } else {
          if (!fromInRange) this.fromPage_ = range.from;
          if (!toInRange) this.toPage_ = range.to;
        }
      }
    },
    updateValue(value = this.inputValue) {
      // Parse value if needed
      const parsedValue = isString(value) ? this.profile.parseValue(value) : value;
      // Filter out any disabled dates
      const filteredValue = this.profile.filterDisabled({
        value: this.profile.normalizeValue(parsedValue),
        isRequired: this.isRequired,
        disabled: this.disabledAttribute_,
        fallbackValue: this.value,
      });
      // If everything the user entered was accepted...
      if (this.profile.valuesAreEqual(parsedValue, filteredValue)) {
        // Hide the popover
        this.popoverForceHidden = true;
      } else {
        // Keep the popover open because something they entered was modified
        this.disablePopoverForceHidden = true;
      }
      // Emit event to update value if it has changed
      if (!this.profile.valuesAreEqual(filteredValue, this.value)) {
        this.$emit('input', filteredValue);
      }
      // Blur the input if it is visible
      if (this.$refs.input) this.$refs.input.blur();
      // Update input text for good measure
      this.updateInputValue();
    },
    updateInputValue() {
      this.$nextTick(() => {
        this.inputValue = this.profile.formatValue(this.value, this.dragValue);
      });
    },
  },
};
</script>
