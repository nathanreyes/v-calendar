<script>
import Calendar from './Calendar';
import Popover from './Popover';
import PopoverRef from './PopoverRef';
import SinglePicker from '../utils/pickers/single';
import MultiplePicker from '../utils/pickers/multiple';
import RangePicker from '../utils/pickers/range';
import {
  rootMixin,
  propOrDefaultMixin,
  safeScopedSlotMixin,
} from '../utils/mixins';
import { addTapOrClickHandler } from '../utils/touch';
import { createGuid, elementContains, on, off } from '../utils/helpers';
import { isString, isArray } from '../utils/_';
import '../styles/tailwind-lib.css';

export default {
  name: 'DatePicker',
  render(h) {
    const calendar = () =>
      h(Calendar, {
        attrs: {
          ...this.$attrs,
          attributes: this.attributes_,
          theme: this.$theme,
          locale: this.$locale,
        },
        props: {
          minDate: this.minDate,
          maxDate: this.maxDate,
          disabledDates: this.disabledDates,
          availableDates: this.availableDates,
        },
        on: {
          ...this.$listeners,
          dayclick: this.onDayClick,
          daymouseenter: this.onDayMouseEnter,
          daykeydown: this.onDayKeydown,
          dayfocusin: this.onDayFocusIn,
        },
        scopedSlots: this.$scopedSlots,
        ref: 'calendar',
      });
    // If inline just return the calendar
    if (this.isInline) return calendar();
    // Render the slot or ihput
    const inputSlot =
      this.safeScopedSlot('default', {
        inputClass: this.inputClass,
        inputValue: this.inputValue,
        inputProps: this.inputProps_,
        inputEvents: this.inputEvents,
        isDragging: !!this.dragValue,
        updateValue: this.updateValue,
        hidePopover: this.hidePopover,
      }) ||
      h('input', {
        class: this.inputClass,
        attrs: this.inputProps_,
        domProps: {
          value: this.inputValue,
        },
        on: this.inputEvents,
      });
    // Convert this span to a fragment when supported in Vue
    return h('span', [
      h(
        PopoverRef,
        {
          props: {
            ...this.popover_,
            id: this.datePickerPopoverId,
            isInteractive: true,
          },
        },
        [inputSlot],
      ),
      // Picker popover
      h(Popover, {
        props: {
          id: this.datePickerPopoverId,
          placement: 'bottom-start',
          contentClass: this.$theme.container,
        },
        on: {
          beforeShow: e => this.$emit('popoverWillShow', e),
          afterShow: e => this.$emit('popoverDidShow', e),
          beforeHide: e => this.$emit('popoverWillHide', e),
          afterHide: e => this.$emit('popoverDidHide', e),
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
  mixins: [rootMixin, propOrDefaultMixin, safeScopedSlotMixin],
  props: {
    mode: { type: String, default: 'single' },
    value: { type: null, required: true },
    isRequired: Boolean,
    isInline: Boolean,
    updateOnInput: Boolean,
    inputDebounce: Number,
    inputProps: { type: Object, default: () => ({}) },
    popover: { type: Object, default: () => ({}) },
    dragAttribute: Object,
    selectAttribute: Object,
    attributes: Array,
  },
  data() {
    return {
      value_: null,
      dragValue: null,
      inputValue: '',
      doFormatInput: true,
      doHidePopover: false,
      doAdjustPageRange: false,
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
    inputMasks() {
      const inputFormat = this.$locale.masks.input;
      return (isArray(inputFormat) && inputFormat) || [inputFormat];
    },
    inputClass() {
      const inputClass = this.inputProps.class || this.$theme.datePickerInput;
      const inputDragClass =
        this.inputProps.dragClass || this.$theme.datePickerInputDrag;
      return this.picker.hasValue(this.dragValue)
        ? inputDragClass || inputClass
        : inputClass;
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
    canHidePopover() {
      return !(
        this.popover.keepVisibleOnInput ||
        this.popover_.visibility !== 'visible'
      );
    },
    selectAttribute_() {
      if (!this.picker.hasValue(this.value_)) return null;
      const attribute = {
        key: 'select-drag',
        ...this.selectAttribute,
        dates: this.value_,
        pinPage: true,
      };
      const { dot, bar, highlight, content } = attribute;
      if (!dot && !bar && !highlight && !content) {
        attribute.highlight = true;
      }
      return attribute;
    },
    dragAttribute_() {
      if (this.mode !== 'range' || !this.picker.hasValue(this.dragValue)) {
        return null;
      }
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
    attributes_() {
      const attrs = isArray(this.attributes) ? [...this.attributes] : [];
      if (this.dragAttribute_) {
        attrs.push(this.dragAttribute_);
      } else if (this.selectAttribute_) {
        attrs.push(this.selectAttribute_);
      }
      return attrs;
    },
    picker() {
      const opts = {
        locale: this.$locale,
        format: d => this.$locale.format(d, this.inputMasks[0]),
        parse: s => this.$locale.parse(s, this.inputMasks),
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
    value: {
      handler() {
        this.value_ = this.picker.filterDisabled({
          value: this.value,
          isRequired: this.isRequired,
          disabled: this.disabledAttribute,
          fallbackValue: null,
        });
        if (this.value && !this.value_) {
          this.$emit('input', null);
        }
      },
      immediate: true,
    },
    value_: {
      handler(val) {
        // Only emit events for internal updates and value changes
        if (!this.picker.valuesAreEqual(val, this.value)) {
          this.$emit('input', val);
        }
        // Execute side-effects for non-inline pickers
        if (!this.isInline) {
          if (this.doFormatInput) this.formatInput();
          if (this.doHidePopover) this.hidePopover();
          if (this.doAdjustPageRange) this.adjustPageRange();
        }
        this.doFormatInput = true;
        this.doHidePopover = false;
        this.doAdjustPageRange = false;
      },
      immediate: true,
    },
    dragValue(val) {
      this.formatInput();
      this.$emit('drag', this.picker.normalize(val));
    },
  },
  mounted() {
    // Handle escape key presses
    on(document, 'keydown', this.onDocumentKeyDown);
    // Clear drag on background click
    const offTapOrClickHandler = addTapOrClickHandler(document, e => {
      if (
        document.body.contains(e.target) &&
        !elementContains(this.$el, e.target) &&
        this.dragValue
      ) {
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
    dateIsValid(date) {
      if (!date) return true;
      return (
        !!this.disabledAttribute && !this.disabledAttribute.intersectsDate(date)
      );
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
    onDayFocusIn(day) {
      this.picker.handleDayMouseEnter(day, this);
      // Re-emit event
      this.$emit('dayfocusin', day);
    },
    onDayKeydown(day) {
      switch (day.event.key) {
        case ' ':
        case 'Enter': {
          this.picker.handleDayClick(day, this);
          day.event.preventDefault();
          break;
        }
        case 'Escape': {
          this.hidePopover();
        }
      }
      // Re-emit event
      this.$emit('daykeydown', day);
    },
    inputInput(e) {
      this.inputValue = e.target.value;
      if (this.updateOnInput_) {
        this.updateValue(this.inputValue, {
          formatInput: false,
          hidePopover: false,
          adjustPageRange: true,
          debounce: this.inputDebounce_,
        });
      }
    },
    inputChange() {
      this.updateValue(this.inputValue, {
        formatInput: true,
        hidePopover: false,
        adjustPageRange: false,
      });
    },
    inputKeyup(e) {
      // Escape key
      if (e.keyCode === 27) {
        this.updateValue(this.value_, {
          formatInput: true,
          hidePopover: true,
          adjustPageRange: false,
        });
      }
    },
    updateValue(
      value = this.inputValue,
      { formatInput, hidePopover, adjustPageRange, debounce } = {},
    ) {
      clearTimeout(this.updateTimeout);
      if (debounce === undefined || debounce < 0) {
        this.forceUpdateValue(value, {
          formatInput,
          hidePopover,
          adjustPageRange,
        });
      } else {
        this.updateTimeout = setTimeout(() => {
          this.updateTimeout = null;
          this.forceUpdateValue(value, {
            formatInput,
            hidePopover,
            adjustPageRange,
          });
        }, debounce);
      }
    },
    forceUpdateValue(value, { formatInput, hidePopover, adjustPageRange }) {
      // Reassign input value for good measure
      this.inputValue = isString(value) ? value : this.inputValue;
      // Parse value if needed
      const userValue = isString(value) ? this.picker.parse(value) : value;
      // Set state for handling value change
      this.doFormatInput = formatInput;
      this.doHidePopover = hidePopover;
      this.doAdjustPageRange = adjustPageRange;
      // Sanitize and assign new value
      this.value_ = this.picker.filterDisabled({
        value: this.picker.normalize(userValue),
        disabled: this.disabledAttribute,
        fallbackValue: this.value_,
      });
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
        popover.hide({ priority: 10, delay: 250 });
      }
    },
    adjustPageRange() {
      if (this.picker.hasValue(this.value_) && this.$refs.calendar) {
        this.$refs.calendar.showPageRange(
          this.picker.getPageRange(this.value_),
        );
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
::v-deep .vc-container {
  border: none;
}
</style>
