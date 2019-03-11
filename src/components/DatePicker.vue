<script>
import Calendar from './Calendar';
import Fragment from './Fragment';
import Popover from './Popover';
import PopoverRef from './PopoverRef';
import SinglePicker from '@/utils/pickers/single';
import MultiplePicker from '@/utils/pickers/multiple';
import RangePicker from '@/utils/pickers/range';
import Attribute from '@/utils/attribute';
import { rootMixin } from '@/utils/mixins/root';
import { addDays } from '@/utils/dateInfo';
import { addTapOrClickHandler } from '@/utils/touch';
import {
  arrayHasItems,
  evalFn,
  createGuid,
  elementContains,
  on,
  off,
} from '@/utils/helpers';
import { isString, isFunction, isArray } from '@/utils/_';

export default {
  render(h) {
    const calendar = () =>
      h(Calendar, {
        attrs: {
          ...this.$attrs,
          attributes: this.attributes_,
          formats: this.formats_,
          theme: this.theme_,
          locale: this.locale_,
        },
        props: {},
        on: {
          ...this.$listeners,
          dayclick: this.onDayClick,
          daymouseenter: this.onDayMouseEnter,
        },
        slots: this.$slots,
        scopedSlots: this.$scopedSlots,
      });
    // If inline just return the calendar
    if (this.isInline) return calendar();
    // Render the slot or ihput
    const inputSlot =
      (isFunction(this.$scopedSlots.default) &&
        this.$scopedSlots.default({
          inputAttrs: this.inputAttrs,
          inputEvents: this.inputEvents,
          updateValue: this.updateValue,
        })) ||
      h('input', {
        class: this.inputClass,
        attrs: this.inputAttrs,
        on: this.inputEvents,
      });
    // Return fragment with slot/input and popover w/ calendar
    return h('span', [
      h(
        PopoverRef,
        {
          props: {
            id: this.datePickerPopoverId,
            visibility: this.popoverVisibility,
            isInteractive: true,
          },
        },
        [inputSlot],
      ),
      h(Popover, {
        attrs: {
          isExpanded: this.popoverExpanded,
          direction: this.popoverDirection,
          align: this.popoverAlign,
          contentOffset: this.popoverContentOffset,
          isInteractive: true,
        },
        props: {
          id: this.datePickerPopoverId,
          placement: 'bottom-start',
          contentClass: this.popoverContentClass,
        },
        scopedSlots: {
          default() {
            return calendar();
          },
        },
        ref: 'popover',
      }),
    ]);
  },
  mixins: [rootMixin],
  props: {
    mode: { type: String, default: 'single' },
    value: { type: null, required: true },
    isRequired: Boolean,
    isInline: Boolean,
    disabledDates: null,
    availableDates: null,
    color: String,
    isDark: Boolean,
    inputProps: { type: Object, default: () => ({}) },
    updateOnInput: Boolean,
    // updateOnInput: {
    //   type: Boolean,
    //   default: () => defaults.datePickerUpdateOnInput,
    // },
    inputDebounce: Number,
    // inputDebounce: {
    //   type: Number,
    //   default: () => defaults.datePickerInputDebounce,
    // },
    dragAttribute: Object,
    selectAttribute: Object,
    disabledAttribute: Object,
    popoverExpanded: Boolean,
    // popoverExpanded: { type: Boolean, default: () => defaults.popoverExpanded },
    popoverDirection: String,
    // popoverDirection: {
    //   type: String,
    //   default: () => defaults.popoverDirection,
    // },
    popoverAlign: String,
    // popoverAlign: { type: String, default: () => defaults.popoverAlign },
    popoverVisibility: String,
    // popoverVisibility: {
    //   type: String,
    //   default: () => defaults.popoverVisibility,
    // },
    popoverContentOffset: Number,
    // popoverContentOffset: {
    //   type: Number,
    //   default: () => defaults.popoverContentOffset,
    // },
    popoverKeepVisibileOnInput: Boolean,
    // popoverKeepVisibleOnInput: {
    //   type: Boolean,
    //   default: () => defaults.popoverKeepVisibleOnInput,
    // },
    formats: Object,
    theme: Object,
    locale: null,
  },
  data() {
    return {
      value_: null,
      dragValue: null,
      inputValue: '',
      disableFormatInput: false,
      disablePopoverHide: false,
      updateTimeout: null,
      datePickerPopoverId: createGuid(),
    };
  },
  computed: {
    inputFormats() {
      const inputFormat = this.formats_.input;
      return (isArray(inputFormat) && inputFormat) || [inputFormat];
    },
    picker() {
      const opts = {
        locale: this.locale_,
        format: d => this.locale_.format(d, this.inputFormats[0]),
        parse: s => this.locale_.parse(s, this.inputFormats),
      };
      switch (this.mode) {
        case 'multiple':
          return new MultiplePicker(opts);
        case 'range':
          return new RangePicker(opts);
        default:
          return new SinglePicker(opts);
      }
    },
    selectAttribute_() {
      if (!this.picker.hasValue(this.value_)) return null;
      const attribute = {
        key: 'select',
        ...this.selectAttribute,
        dates: this.value_,
      };
      const { dot, bar, highlight } = attribute;
      if (!dot && !bar && !highlight) {
        attribute.highlight = true;
      }
      return attribute;
    },
    dragAttribute_() {
      if (this.mode !== 'range' || !this.picker.hasValue(this.dragValue))
        return null;
      const attribute = {
        key: 'drag',
        ...this.dragAttribute,
        dates: this.dragValue,
      };
      const { dot, bar, highlight } = attribute;
      if (!dot && !bar && !highlight) {
        attribute.highlight = true;
      }
      return attribute;
    },
    disabledDates_() {
      const dates = [];
      // Add the manually applied disabled dates
      if (this.disabledDates) {
        if (isArray(this.disabledDates)) dates.push(...this.disabledDates);
        else dates.push(this.disabledDates);
      }
      // Add disabled dates for minDate and maxDate props
      let { 'min-date': minDate, 'max-date': maxDate } = this.$attrs;
      minDate = this.locale_.toDate(minDate);
      maxDate = this.locale_.toDate(maxDate);
      if (minDate) {
        dates.push({ start: null, end: addDays(minDate, -1) });
      }
      if (maxDate) {
        dates.push({ start: addDays(maxDate, 1), end: null });
      }
      return dates;
    },
    disabledAttribute_() {
      if (
        !arrayHasItems(this.disabledDates_) &&
        !arrayHasItems(this.availableDates)
      )
        return null;
      return Attribute({
        key: 'disabled',
        ...this.disabledAttribute,
        dates: this.disabledDates_,
        excludeDates: this.availableDates,
        excludeMode: 'includes',
        order: 100,
      });
    },
    attributes_() {
      const attrs = [];
      if (this.dragAttribute_) {
        attrs.push(this.dragAttribute_);
      } else if (this.selectAttribute_) {
        attrs.push(this.selectAttribute_);
      }
      return attrs;
    },
    // inputProps_() {
    //   const defaultProps = defaults.datePickerInputProps;
    //   return {
    //     ...evalFn(defaultProps, {
    //       mode: this.mode,
    //       value: this.value_,
    //       dragValue: this.dragValue,
    //       format: defaults.masks[this.inputFormats[0]] || this.inputFormats[0],
    //     }),
    //     ...this.inputProps,
    //     value: this.inputValue,
    //   };
    // },
    inputClass() {
      return this.theme_.datePickerInput;
    },
    inputAttrs() {
      return {
        ...this.inputProps,
        value: this.inputValue,
        type: 'input',
      };
    },
    inputEvents() {
      return {
        input: this.inputInput,
        change: this.inputChange,
        // keydown: this.inputKeydown,
        keyup: this.inputKeyup,
      };
    },
    popoverContentClass() {
      return this.theme_.container;
    },
  },
  watch: {
    mode() {
      // Clear value on select mode change
      this.value_ = null;
    },
    value(val) {
      this.refreshValue();
    },
    value_(val) {
      if (!this.disableFormatInput) this.formatInput();
      if (
        !this.isInline &&
        this.mode !== 'multiple' &&
        this.popoverVisibility !== 'visible' &&
        !this.disablePopoverHide
      ) {
        this.hidePopover();
      }
      this.disableFormatInput = false;
      this.disablePopoverHide = false;
      this.$emit('input', val);
    },
    dragValue(val) {
      this.formatInput();
      this.$emit('drag', this.picker.normalize(val));
    },
    // disabledAttribute_(val) {
    //   if (!this.dragValue && val) {
    //     this.updateValue(this.value, {
    //       formatInput: true,
    //       hidePopover: false,
    //     });
    //   }
    // },
  },
  created() {
    this.refreshValue();
  },
  mounted() {
    on(document, 'keydown', this.onDocumentKeyDown);
    // Clear drag on background click
    const offTapOrClickHandler = addTapOrClickHandler(document, e => {
      if (!elementContains(this.$el, e.target)) {
        this.dragValue = null;
      }
    });
    // Clean up handlers
    this.$once('beforeDestroy', () => {
      off(document, 'keydown', this.onDocumentKeyDown);
      offTapOrClickHandler();
    });
  },
  methods: {
    refreshValue() {
      if (!this.picker.valuesAreEqual(this.value, this.value_)) {
        this.value_ = this.value;
      }
    },
    dateIsValid(date) {
      if (
        this.disabledAttribute &&
        this.disabledAttribute.intersectsDate(date)
      ) {
        this.$emit('invalid-input', {
          reason: 'disabled',
          value: day.date,
        });
        return false;
      }
      return true;
    },
    onDocumentKeyDown(e) {
      // Clear drag on escape keydown
      if (this.dragValue && e.keyCode === 27) {
        this.dragValue = null;
      }
    },
    onDayClick(day) {
      this.picker.handleDayClick(day, this);
      // Re-emit event
      this.$emit('dayclick', day);
    },
    onDayMouseEnter(day) {
      this.picker.handleDayMouseEnter(day, this);
      // Re-emit event
      this.$emit('daymouseenter', day);
    },
    inputInput(e) {
      this.inputValue = e.target.value;
      if (this.updateOnInput) {
        this.updateValue(this.inputValue, {
          formatInput: false,
          hidePopover: false,
          debounce: this.inputDebounce,
        });
      }
    },
    inputChange() {
      this.updateValue(this.inputValue, {
        formatInput: true,
        hidePopover: false,
      });
    },
    // inputKeydown(e) {
    //   if (e.keyCode === 13) {
    //     this.updateValue(this.value_, {
    //       formatInput: true,
    //       hidePopover: false,
    //     });
    //   }
    // },
    inputKeyup(e) {
      // Escape key
      if (e.keyCode === 27) {
        this.updateValue(this.value_, {
          formatInput: true,
          hidePopover: true,
        });
      }
    },
    updateValue(
      value = this.inputValue,
      {
        formatInput = false,
        hidePopover = !this.popoverKeepVisibleOnInput,
        debounce,
      } = {},
    ) {
      clearTimeout(this.updateTimeout);
      if (debounce === undefined || debounce < 0) {
        this.forceUpdateValue(value, { formatInput, hidePopover });
      } else {
        this.updateTimeout = setTimeout(() => {
          this.updateTimeout = null;
          this.forceUpdateValue(value, { formatInput, hidePopover });
        }, debounce);
      }
    },
    forceUpdateValue(value, { formatInput, hidePopover }) {
      // Reassign input value for good measure
      this.inputValue = isString(value) ? value : this.inputValue;
      // Parse value if needed
      const userValue = isString(value) ? this.picker.parse(value) : value;
      // Filter out any disabled dates
      const validatedValue = this.picker.filterDisabled({
        value: this.picker.normalizeValue(userValue),
        isRequired: this.isRequired,
        disabled: this.disabledAttribute_,
        fallbackValue: this.value_,
      });
      // If final value is equal to the current value
      if (this.picker.valuesAreEqual(this.value_, validatedValue)) {
        // Just format input and hide popover if needed
        if (formatInput) this.formatInput();
        if (hidePopover && !this.isInline) this.hidePopover();
      } else {
        // Value has changed, so handle formatting and hiding on value change
        this.disableFormatInput = !formatInput;
        this.disablePopoverHide = !hidePopover;
        this.value_ = validatedValue;
      }
    },
    formatInput() {
      this.$nextTick(() => {
        const value = this.picker.hasValue(this.dragValue)
          ? this.dragValue
          : this.value;
        this.inputValue = this.picker.format(value);
      });
    },
    hidePopover() {
      const popover = this.$refs.popover;
      if (popover) {
        popover.onHide({
          ref: popover.ref,
          delay: 400,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .vc-pane-container {
  border: none;
}
</style>