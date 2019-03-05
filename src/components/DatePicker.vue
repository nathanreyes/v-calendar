<script>
import Fragment from './Fragment';
import Popover from './Popover';
import PopoverRef from './PopoverRef';
import PickerProfile from '@/utils/pickerProfiles';
import Attribute from '@/utils/attribute';
import defaults, { resolveDefault } from '@/utils/defaults';
import generateTheme from '@/utils/theme';
import { addDays } from '@/utils/dateInfo';
import { format, parse } from '@/utils/fecha';
import { arrayHasItems, evalFn, createGuid, toDate } from '@/utils/helpers';
import { isString, isFunction, isArray } from '@/utils/_';

export default {
  render(h) {
    const getPickerComponent = () =>
      h(this.component, {
        class: { 'is-popover': !this.isInline },
        attrs: {
          ...this.$attrs,
          formats: this.formats_,
          theme: this.theme_,
        },
        props: {
          value: this.value,
          isRequired: this.isRequired,
          selectAttribute: this.selectAttribute_,
          dragAttribute: this.dragAttribute_,
          disabledAttribute: this.disabledAttribute_,
        },
        on: {
          ...this.$listeners,
          drag: this.onDrag,
        },
        slots: this.$slots,
        scopedSlots: this.$scopedSlots,
      });
    // If inline just return the picker component
    if (this.isInline) return getPickerComponent();

    const inputSlot = () =>
      (isFunction(this.$scopedSlots.default) &&
        this.$scopedSlots.default({
          inputValue: this.inputValue,
          inputProps: this.inputProps_,
          inputEvents: this.inputEvents,
          updateValue: this.updateValue,
        })) ||
      h('input', {
        class: this.inputProps_.class,
        style: this.inputProps_.style,
        attrs: {
          ...this.inputAttrs,
        },
        on: this.inputEvents,
        ref: 'input',
      });

    // Return fragment with slot/input and popover
    return h(Fragment, [
      h(
        PopoverRef,
        {
          props: {
            id: this.datePickerPopoverId,
            visibility: this.popoverVisibility,
            isInteractive: true,
          },
        },
        [inputSlot()],
      ),
      h(
        Popover,
        {
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
            contentClass: this.theme_.container,
          },
          on: {
            'will-appear': e => this.$emit('popover-will-appear', e),
            'did-appear': e => this.$emit('popover-did-appear', e),
            'will-disappear': e => this.$emit('popover-will-disappear', e),
            'did-disappear': e => this.$emit('popover-did-disappear', e),
          },
          ref: 'popover',
        },
        [getPickerComponent()],
      ),
    ]);
  },
  props: {
    mode: { type: String, default: 'single' },
    value: { type: null, required: true },
    isRequired: Boolean,
    isInline: Boolean,
    disabledDates: null,
    availableDates: null,
    formats: Object, // Resolved by computed property
    inputProps: { type: Object, default: () => ({}) }, // Resolved by computed property
    updateOnInput: {
      type: Boolean,
      default: () => defaults.datePickerUpdateOnInput,
    },
    inputDebounce: {
      type: Number,
      default: () => defaults.datePickerInputDebounce,
    },
    tintColor: { type: String, default: () => defaults.datePickerTintColor },
    color: { type: String, default: 'blue' },
    isDark: { type: Boolean, default: false },
    theme: Object,
    dragAttribute: Object, // Resolved by computed property
    selectAttribute: Object, // Resolved by computed property
    disabledAttribute: Object, // Resolved by computed property
    showCaps: { type: Boolean, default: () => defaults.datePickerShowCaps },
    showDayPopover: {
      type: Boolean,
      default: () => defaults.datePickerShowDayPopover,
    },
    popoverExpanded: { type: Boolean, default: () => defaults.popoverExpanded },
    popoverDirection: {
      type: String,
      default: () => defaults.popoverDirection,
    },
    popoverAlign: { type: String, default: () => defaults.popoverAlign },
    popoverVisibility: {
      type: String,
      default: () => defaults.popoverVisibility,
    },
    popoverContentOffset: {
      type: Number,
      default: () => defaults.popoverContentOffset,
    },
    popoverKeepVisibleOnInput: {
      type: Boolean,
      default: () => defaults.popoverKeepVisibleOnInput,
    },
  },
  data() {
    return {
      dragValue: null,
      inputValue: '',
      disableFormatInput: false,
      disablePopoverHide: false,
      updateTimeout: null,
      datePickerPopoverId: createGuid(),
    };
  },
  computed: {
    formats_() {
      return {
        ...defaults.formats,
        ...this.formats,
      };
    },
    theme_() {
      return generateTheme({
        color: this.color,
        isDark: this.isDark,
        config: this.theme,
      });
    },
    inputFormats() {
      const inputFormat = this.formats_.input;
      return (isArray(inputFormat) && inputFormat) || [inputFormat];
    },
    profile() {
      return PickerProfile(
        this.mode,
        d => format(d, this.inputFormats[0]),
        s => parse(s, this.inputFormats),
      );
    },
    component() {
      return this.profile.component;
    },
    selectAttribute_() {
      return this.buildSelectDragAttribute(this.selectAttribute);
    },
    dragAttribute_() {
      return this.buildSelectDragAttribute(this.dragAttribute, true);
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
      minDate = toDate(minDate);
      maxDate = toDate(maxDate);
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
        order: 100,
        ...(this.disabledAttribute ||
          resolveDefault(defaults.datePickerDisabledAttribute, {
            mode: this.mode,
            color: this.tintColor,
            showDayPopover: this.showDayPopover,
          })),
        dates: this.disabledDates_,
        excludeDates: this.availableDates,
        excludeMode: 'includes',
      });
    },
    inputProps_() {
      const defaultProps = defaults.datePickerInputProps;
      return {
        ...evalFn(defaultProps, {
          mode: this.mode,
          value: this.value,
          dragValue: this.dragValue,
          format: defaults.masks[this.inputFormats[0]] || this.inputFormats[0],
        }),
        ...this.inputProps,
        value: this.inputValue,
      };
    },
    inputAttrs() {
      const attrs = {
        ...this.inputProps_,
        value: this.inputProps_.value,
        type: 'input',
      };
      if (attrs) {
        delete attrs.style;
        delete attrs.class;
      }
      return attrs;
    },
    inputEvents() {
      return {
        input: this.inputInput,
        change: this.inputChange,
        // keydown: this.inputKeydown,
        keyup: this.inputKeyup,
      };
    },
  },
  watch: {
    mode() {
      // Clear value on select mode change
      this.$emit('input', null);
    },
    value() {
      if (!this.disableFormatInput) this.formatInput();
      if (
        this.mode !== 'multiple' &&
        !this.isInline &&
        !this.disablePopoverHide
      ) {
        this.hidePopover();
      }
      this.disableFormatInput = false;
      this.disablePopoverHide = false;
    },
    dragValue() {
      this.formatInput();
    },
    disabledAttribute_(val) {
      if (!this.dragValue && val) {
        this.updateValue(this.value, {
          formatInput: true,
          hidePopover: false,
        });
      }
    },
  },
  created() {
    this.formatInput();
  },
  methods: {
    buildSelectDragAttribute(propAttr, isDrag) {
      let attr = {
        key: 'drag-select',
        ...propAttr,
        pinPage: true,
      };
      const { highlight, dot, bar } = attr;
      // Assign attribute type if missing
      if (!dot && !bar && !highlight) {
        attr.highlight = true;
      }
      return attr;
    },
    onDrag(e) {
      this.dragValue = e;
      this.$emit('drag', e);
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
    //     this.updateValue(this.value, {
    //       formatInput: true,
    //       hidePopover: false,
    //     });
    //   }
    // },
    inputKeyup(e) {
      // Escape key
      if (e.keyCode === 27) {
        this.updateValue(this.value, {
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
      const userValue = isString(value)
        ? this.profile.parseValue(value)
        : value;
      // Filter out any disabled dates
      const validatedValue = this.profile.filterDisabled({
        value: this.profile.normalizeValue(userValue),
        isRequired: this.isRequired,
        disabled: this.disabledAttribute_,
        fallbackValue: this.value,
      });
      // If final value is equal to the current value
      if (this.profile.valuesAreEqual(this.value, validatedValue)) {
        // Just format input and hide popover if needed
        if (formatInput) this.formatInput();
        if (hidePopover && !this.isInline) this.hidePopover();
      } else {
        // Value has changed, so handle formatting and hiding on value change
        this.disableFormatInput = !formatInput;
        this.disablePopoverHide = !hidePopover;
        this.$emit('input', validatedValue);
      }
    },
    formatInput() {
      this.$nextTick(() => {
        this.inputValue = this.profile.formatValue(this.value, this.dragValue);
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

<style scoped>
/* /deep/ .vc-pane-container {
  border: none;
} */
</style>