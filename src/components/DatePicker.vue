<script>
import Popover from './Popover';
import SingleDatePicker from './SingleDatePicker';
import MultipleDatePicker from './MultipleDatePicker';
import DateRangePicker from './DateRangePicker';
import DatePickerDayPopover from './DatePickerDayPopover';
import PickerProfile from '@/utils/pickerProfiles';
import Attribute from '@/utils/attribute';
import defaults, { resolveDefault } from '@/utils/defaults';
import { addDays } from '@/utils/dateInfo';
import { pageIsBetweenPages } from '@/utils/helpers';
import { isString, isFunction, isObject, isArray } from '@/utils/typeCheckers';
import { format, parse } from '@/utils/fecha';
import { mergeListeners } from '@/mixins';

export default {
  mixins: [mergeListeners],
  render(h) {
    const getPickerComponent = asSlot =>
      h(this.componentName, {
        attrs: {
          ...this.$attrs,
          value: this.value,
          isRequired: this.isRequired,
          selectAttribute: this.selectAttribute_,
          dragAttribute: this.dragAttribute_,
          disabledAttribute: this.disabledAttribute_,
          minDate: this.minDate,
          maxDate: this.maxDate,
          fromPage: this.fromPage_,
          toPage: this.toPage_,
          themeStyles: this.themeStyles_,
        },
        on: this.mergeListeners(
          {
            'update:fromPage': val => (this.fromPage_ = val),
            'update:toPage': val => (this.toPage_ = val),
            drag: val => (this.dragValue = val),
          },
          this.filteredListeners(),
        ),
        slots: this.$slots,
        scopedSlots: this.$scopedSlots,
        ...(asSlot && {
          slot: asSlot,
        }),
      });
    if (this.isInline) return getPickerComponent();
    return h(
      'popover',
      {
        attrs: {
          isExpanded: this.popoverExpanded,
          direction: this.popoverDirection,
          align: this.popoverAlign,
          visibility: this.popoverVisibility,
          contentStyle: this.popoverContentStyle,
          contentOffset: this.popoverContentOffset,
          forceHidden: this.popoverForceHidden,
          showClearMargin: this.popoverShowClearMargin,
          isInteractive: true,
        },
        on: {
          'will-appear': e => this.$emit('popover-will-appear', e),
          'did-appear': e => this.$emit('popover-did-appear', e),
          'will-disappear': e => this.$emit('popover-will-disappear', e),
          'did-disappear': e => this.$emit('popover-did-disappear', e),
          'update:forceHidden': val => (this.popoverForceHidden = val),
        },
      },
      [
        (isFunction(this.$scopedSlots.default) &&
          this.$scopedSlots.default({
            inputValue: this.inputValue,
            updateValue: this.updateValue,
          })) || [
          h('input', {
            ref: 'input',
            class: this.inputProps_.class,
            style: this.inputProps_.style,
            domProps: {
              value: this.inputValue,
            },
            attrs: {
              type: 'text',
              ...this.inputAttrs,
            },
            on: {
              input: event => (this.inputValue = event.target.value),
              change: () => this.updateValue(),
            },
          }),
        ],
        getPickerComponent('popover-content'),
      ],
    );
  },
  components: {
    Popover,
    SingleDatePicker,
    MultipleDatePicker,
    DateRangePicker,
  },
  props: {
    mode: { type: String, default: 'single' },
    value: { type: null, required: true },
    isRequired: Boolean,
    isInline: Boolean,
    minDate: Date,
    maxDate: Date,
    disabledDates: null,
    availableDates: null,
    formats: { type: Object, default: () => defaults.formats },
    inputProps: { type: Object, default: () => ({}) }, // Resolved by computed property
    tintColor: { type: String, default: () => defaults.datePickerTintColor },
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
    popoverShowClearMargin: Boolean,
    popoverKeepVisibleOnInput: {
      type: Boolean,
      default: () => defaults.popoverKeepVisibleOnInput,
    },
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
    inputFormats() {
      const formats = this.formats && this.formats.input;
      if (!formats) return ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'];
      return (isArray(formats) && formats) || [formats];
    },
    profile() {
      return PickerProfile(
        this.mode,
        d => format(d, this.inputFormats[0]),
        s => parse(s, this.inputFormats),
      );
    },
    componentName() {
      return this.profile.componentName;
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
      if (this.minDate)
        dates.push({ start: null, end: addDays(this.minDate, -1) });
      if (this.maxDate)
        dates.push({ start: addDays(this.maxDate, 1), end: null });
      return dates;
    },
    disabledAttribute_() {
      if (!this.disabledDates_ && !this.availableDates) return null;
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
      if (isFunction(defaultProps)) {
        return {
          ...defaultProps({
            mode: this.mode,
            value: this.value,
            dragValue: this.dragValue,
            format:
              defaults.masks[this.inputFormats[0]] || this.inputFormats[0],
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
    inputAttrs() {
      const props = {
        ...this.inputProps_,
      };
      if (props) {
        delete props.style;
        delete props.class;
      }
      return props;
    },
    themeStyles_() {
      const userDayContent =
        this.themeStyles.dayContent || defaults.themeStyles.dayContent;
      // Strip the wrapper style when used in a popover
      // It will get passed in as the content style
      const styles = {
        ...this.themeStyles,
        dayContent: params => ({
          ...(params.isHovered && {
            backgroundColor: '#dadada',
            border: '0',
            cursor: 'pointer',
          }),
          ...((isFunction(userDayContent) && userDayContent(params)) ||
            userDayContent),
        }),
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
      this.$emit('update:topage', val); // Support in-DOM templates (:topage.sync)
      this.$emit('update:toPage', val); // Allow using :to-page.sync
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
      const { highlight, highlightCaps, contentStyle, dot, bar } = attr;
      // Don't need highlight or content style if using dot or bar
      if (!dot && !bar) {
        attr = {
          ...attr,
          highlight: params => ({
            backgroundColor: this.tintColor,
            ...(isDrag && {
              height: '1.7rem',
              opacity: 0.5,
            }),
            ...((isFunction(highlight) && highlight(params)) || highlight),
          }),
          highlightCaps:
            highlightCaps ||
            (this.showCaps &&
              (params =>
                !params.inBetween && {
                  backgroundColor: '#fafafa',
                  borderColor: this.tintColor,
                  borderWidth: '2px',
                })),
          // Use function wrapper for content style
          contentStyle: params => ({
            // Light color for select attributes
            ...(!isDrag && {
              color: '#fafafa',
            }),
            // Don't show hover style for drag and select attributes
            ...(params.isHovered && {
              backgroundColor: 'transparent',
              border: '0',
            }),
            // Mix in cap style
            ...(this.showCaps &&
              !params.inBetween && {
                color: '#333333',
              }),
            // Mix in user style
            ...((isFunction(contentStyle) && contentStyle(params)) ||
              contentStyle),
          }),
        };
      }
      if (attr.popover || this.showDayPopover) {
        attr.popover = {
          component: DatePickerDayPopover,
          hideIndicator: true,
          ...attr.popover,
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
        const fromInRange = pageIsBetweenPages(
          this.fromPage_,
          range.from,
          range.to,
        );
        const toInRange = pageIsBetweenPages(
          this.toPage_,
          range.from,
          range.to,
        );
        if (this.mode === 'single') {
          if (
            !fromInRange &&
            !Object.prototype.hasOwnProperty.call(
              this.$attrs,
              'is-double-paned',
            )
          ) {
            this.fromPage_ = range.from;
          } else if (!toInRange) {
            this.fromPage_ = range.to;
          }
        } else {
          if (!fromInRange) this.fromPage_ = range.from;
          if (!toInRange) this.toPage_ = range.to;
        }
      }
    },
    updateValue(value = this.inputValue) {
      // Parse value if needed
      const parsedValue = isString(value)
        ? this.profile.parseValue(value)
        : value;
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
