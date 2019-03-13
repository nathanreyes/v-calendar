<script>
import Calendar from './Calendar';
import Fragment from './Fragment';
import Popover from './Popover';
import PopoverRef from './PopoverRef';
import SinglePicker from '@/utils/pickers/single';
import MultiplePicker from '@/utils/pickers/multiple';
import RangePicker from '@/utils/pickers/range';
import Attribute from '@/utils/attribute';
import { rootMixin } from '@/utils/mixins';
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
          dayfocusin: this.onDayFocusIn,
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
          inputClass: this.inputClass,
          inputProps: this.inputProps_,
          inputEvents: this.inputEvents,
          updateValue: this.updateValue,
        })) ||
      h('input', {
        class: this.inputClass,
        domProps: this.inputProps_,
        on: this.inputEvents,
      });
    // Return fragment with slot/input and popover w/ calendar
    return h('span', [
      h(
        PopoverRef,
        {
          props: {
            id: this.datePickerPopoverId,
            visibility: this.popover_.visibility,
            isInteractive: true,
          },
        },
        [inputSlot],
      ),
      h(Popover, {
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
    updateOnInput: Boolean,
    inputDebounce: Number,
    inputProps: { type: Object, default: () => ({}) },
    popover: { type: Object, default: () => ({}) },
    dragAttribute: Object,
    selectAttribute: Object,
    disabledAttribute: Object,
    attributes: Array,
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
    updateOnInput_() {
      return this.propOrDefault('updateOnInput', 'datePicker.updateOnInput');
    },
    inputDebounce_() {
      return this.propOrDefault('inputDebounce', 'datePicker.inputDebounce');
    },
    inputFormats() {
      const inputFormat = this.formats_.input;
      return (isArray(inputFormat) && inputFormat) || [inputFormat];
    },
    inputClass() {
      const inputClass = this.inputProps.class;
      const inputDragClass = this.inputProps.dragClass;
      const themeInputClass = this.theme_.datePickerInput;
      const themeInputDragClass = this.theme_.datePickerInputDrag;
      if (this.picker.hasValue(this.dragValue)) {
        return (
          inputDragClass || inputClass || themeInputDragClass || themeInputClass
        );
      }
      return inputClass || themeInputClass;
    },
    inputProps_() {
      // Merge the user props with local
      const props = {
        ...this.inputProps,
        value: this.inputValue,
        type: 'input',
      };
      // Delete class properties
      delete props.class;
      delete props.dragClass;
      return props;
    },
    inputEvents() {
      return {
        input: this.inputInput,
        change: this.inputChange,
        // keydown: this.inputKeydown,
        keyup: this.inputKeyup,
      };
    },
    popover_() {
      return this.propOrDefault('popover', 'datePicker.popover', 'merge');
    },
    selectAttribute_() {
      if (!this.picker.hasValue(this.value_)) return null;
      const attribute = {
        key: 'select-drag',
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
        key: 'select-drag',
        ...this.dragAttribute,
        dates: this.dragValue,
      };
      const { dot, bar, highlight, content } = attribute;
      if (!dot && !bar && !highlight && !content) {
        attribute.highlight = {
          startEnd: {
            fillMode: 'none',
          },
        };
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
      return new Attribute(
        {
          key: 'disabled',
          ...this.disabledAttribute,
          dates: this.disabledDates_,
          excludeDates: this.availableDates,
          excludeMode: 'includes',
          order: 100,
        },
        this.theme_,
        this.locale_,
      );
    },
    attributes_() {
      const attrs = isArray(this.attributes) ? [...this.attributes] : [];
      if (this.dragAttribute_) {
        attrs.push(this.dragAttribute_);
      } else if (this.selectAttribute_) {
        attrs.push(this.selectAttribute_);
      }
      return attrs;
    },
    popoverContentClass() {
      return this.theme_.container;
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
        this.popover_.visibility !== 'visible' &&
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
    onDayFocusIn(day) {
      // Remove focus from clicked days
      day.el.blur();
      // Re-emit event
      this.$emit('dayfocusin', day);
    },
    onDayMouseEnter(day) {
      this.picker.handleDayMouseEnter(day, this);
      // Re-emit event
      this.$emit('daymouseenter', day);
    },
    inputInput(e) {
      this.inputValue = e.target.value;
      if (this.updateOnInput_) {
        this.updateValue(this.inputValue, {
          formatInput: false,
          hidePopover: false,
          debounce: this.inputDebounce_,
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
        hidePopover = !this.popover_.keepVisibleOnInput,
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
        value: this.picker.normalize(userValue),
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
          : this.value_;
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