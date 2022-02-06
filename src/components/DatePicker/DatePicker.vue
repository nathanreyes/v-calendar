<script>
import { h } from 'vue';
import Calendar from '../Calendar/Calendar.vue';
import Popover from '../Popover/Popover.vue';
import TimePicker from '../TimePicker/TimePicker.vue';
import { rootMixin } from '../../utils/mixins';
import { getDefault } from '../../utils/defaults';
import {
  datesAreEqual,
  createGuid,
  elementContains,
  pageIsBetweenPages,
  on,
  off,
} from '../../utils/helpers';
import { isObject, isArray, defaultsDeep } from '../../utils/_';
import {
  showPopover as sp,
  hidePopover as hp,
  togglePopover as tp,
  getPopoverTriggerEvents,
} from '../../utils/popovers';
import { PATCH } from '../../utils/locale';

const _baseConfig = {
  type: 'auto',
  mask: 'iso', // String mask when `type === 'string'`
  timeAdjust: '', // 'HH:MM:SS', 'now'
};

const _config = [_baseConfig, _baseConfig];

const MODE = {
  DATE: 'date',
  DATE_TIME: 'datetime',
  TIME: 'time',
};
const RANGE_PRIORITY = {
  NONE: 0,
  START: 1,
  END: 2,
  BOTH: 3,
};

export default {
  name: 'DatePicker',
  emits: [
    'update:modelValue',
    'drag',
    'dayclick',
    'daykeydown',
    'popover-will-show',
    'popover-did-show',
    'popover-will-hide',
    'popover-did-hide',
  ],
  render() {
    // Footer
    const footer = (wrap, wrapperEl) => {
      if (!this.$slots.footer) return wrap;
      const children = [wrap, this.$slots.footer()];
      return wrapperEl ? h(wrapperEl, children) : children;
    };

    // Timepicker renderer
    const timePicker = () => {
      if (!this.dateParts) return null;
      const parts = this.isRange ? this.dateParts : [this.dateParts[0]];
      return h(
        'div',
        {},
        {
          ...this.$slots,
          default: () =>
            parts.map((dp, idx) => {
              const hourOptions = this.$locale.getHourOptions(
                this.modelConfig_[idx].validHours,
                dp,
              );
              const minuteOptions = this.$locale.getMinuteOptions(
                this.modelConfig_[idx].minuteIncrement,
                dp,
              );
              return h(TimePicker, {
                modelValue: dp,
                locale: this.$locale,
                theme: this.$theme,
                is24hr: this.is24hr,
                showBorder: !this.isTime,
                isDisabled: (this.isDateTime && !dp.isValid) || this.isDragging,
                hourOptions,
                minuteOptions,
                'onUpdate:modelValue': p => this.onTimeInput(p, idx === 0),
              });
            }),
        },
      );
    };

    // Calendar renderer
    const calendar = () =>
      h(
        Calendar,
        {
          ...this.$attrs,
          attributes: this.attributes_,
          theme: this.$theme,
          locale: this.$locale,
          minDate: this.minDateExact || this.minDate,
          maxDate: this.maxDateExact || this.maxDate,
          disabledDates: this.disabledDates,
          availableDates: this.availableDates,
          onDayclick: this.onDayClick,
          onDaykeydown: this.onDayKeydown,
          onDaymouseenter: this.onDayMouseEnter,
          ref: 'calendar',
        },
        {
          ...this.$slots,
          footer: () => (this.isDateTime ? footer(timePicker()) : footer()),
        },
      );

    // Content renderer
    const content = () => {
      if (this.isTime) {
        return h(
          'div',
          {
            class: [
              'vc-container',
              `vc-${this.$theme.color}`,
              { 'vc-is-dark': this.$theme.isDark },
            ],
          },
          footer(timePicker(), 'div'),
        );
      }
      return calendar();
    };

    return this.$slots.default
      ? h('div', [
          // Slot content
          this.$slots.default(this.slotArgs),
          // Popover content
          h(
            Popover,
            {
              id: this.datePickerPopoverId,
              placement: 'bottom-start',
              contentClass: `vc-container${this.isDark ? ' vc-is-dark' : ''}`,
              'on-before-show': e => this.$emit('popover-will-show', e),
              'on-after-show': e => this.$emit('popover-did-show', e),
              'on-before-hide': e => this.$emit('popover-will-hide', e),
              'on-after-hide': e => this.$emit('popover-did-hide', e),
              ref: 'popover',
            },
            {
              default: content,
            },
          ),
        ])
      : content();
  },
  mixins: [rootMixin],
  props: {
    mode: { type: String, default: MODE.DATE },
    modelValue: { type: null, required: true },
    modelConfig: { type: Object, default: () => ({}) },
    is24hr: Boolean,
    minuteIncrement: Number,
    isRequired: Boolean,
    isRange: Boolean,
    updateOnInput: {
      type: Boolean,
      default: () => getDefault('datePicker.updateOnInput'),
    },
    inputDebounce: {
      type: Number,
      default: () => getDefault('datePicker.inputDebounce'),
    },
    popover: { type: Object, default: () => ({}) },
    dragAttribute: Object,
    selectAttribute: Object,
    attributes: Array,
    validHours: [Object, Array, Function],
  },
  data() {
    return {
      value_: null,
      dateParts: null,
      activeDate: '',
      dragValue: null,
      inputValues: ['', ''],
      updateTimeout: null,
      watchValue: true,
      datePickerPopoverId: createGuid(),
    };
  },
  computed: {
    isDate() {
      return this.mode.toLowerCase() === MODE.DATE;
    },
    isDateTime() {
      return this.mode.toLowerCase() === MODE.DATE_TIME;
    },
    isTime() {
      return this.mode.toLowerCase() === MODE.TIME;
    },
    isDragging() {
      return !!this.dragValue;
    },
    modelConfig_() {
      return this.normalizeConfig(this.modelConfig, _config);
    },
    inputMask() {
      const masks = this.$locale.masks;
      if (this.isTime) {
        return this.is24hr ? masks.inputTime24hr : masks.inputTime;
      }
      if (this.isDateTime) {
        return this.is24hr ? masks.inputDateTime24hr : masks.inputDateTime;
      }
      return this.$locale.masks.input;
    },
    inputMaskHasTime() {
      return /[Hh]/g.test(this.inputMask);
    },
    inputMaskHasDate() {
      return /[dD]{1,2}|Do|W{1,4}|M{1,4}|YY(?:YY)?/g.test(this.inputMask);
    },
    inputMaskPatch() {
      if (this.inputMaskHasTime && this.inputMaskHasDate) {
        return PATCH.DATE_TIME;
      }
      if (this.inputMaskHasDate) return PATCH.DATE;
      if (this.inputMaskHasTime) return PATCH.TIME;
      return undefined;
    },
    slotArgs() {
      const {
        isRange,
        isDragging,
        updateValue,
        showPopover,
        hidePopover,
        togglePopover,
      } = this;
      const inputValue = isRange
        ? {
            start: this.inputValues[0],
            end: this.inputValues[1],
          }
        : this.inputValues[0];
      const events = [true, false].map(isStart => ({
        input: this.onInputInput(isStart),
        change: this.onInputChange(isStart),
        keyup: this.onInputKeyup,
        ...getPopoverTriggerEvents({
          ...this.popover_,
          id: this.datePickerPopoverId,
          callback: e => {
            if (e.action === 'show' && e.completed) {
              this.onInputShow(isStart);
            }
          },
        }),
      }));
      const inputEvents = isRange
        ? {
            start: events[0],
            end: events[1],
          }
        : events[0];
      return {
        inputValue,
        inputEvents,
        isDragging,
        updateValue,
        showPopover,
        hidePopover,
        togglePopover,
        getPopoverTriggerEvents,
      };
    },
    popover_() {
      return defaultsDeep(this.popover, getDefault('datePicker.popover'));
    },
    selectAttribute_() {
      if (!this.hasValue(this.value_)) return null;
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
      if (!this.isRange || !this.hasValue(this.dragValue)) {
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
            fillMode: 'outline',
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
  },
  watch: {
    inputMask() {
      this.formatInput();
    },
    modelValue(val) {
      if (!this.watchValue) return;
      this.forceUpdateValue(val, {
        config: this.modelConfig_,
        formatInput: true,
        hidePopover: false,
      });
    },
    value_() {
      this.refreshDateParts();
    },
    dragValue() {
      this.refreshDateParts();
    },
    timezone() {
      this.refreshDateParts();
      this.forceUpdateValue(this.value_, { formatInput: true });
    },
  },
  created() {
    this.value_ = this.normalizeValue(
      this.modelValue,
      this.modelConfig_,
      PATCH.DATE_TIME,
      RANGE_PRIORITY.BOTH,
    );
    this.forceUpdateValue(this.modelValue, {
      config: this.modelConfig_,
      formatInput: true,
      hidePopover: false,
    });
    this.refreshDateParts();
  },
  mounted() {
    // Handle escape key presses
    on(document, 'keydown', this.onDocumentKeyDown);
    // Clear drag on background click
    on(document, 'click', this.onDocumentClick);
  },
  beforeUnmount() {
    // Clean up handlers
    off(document, 'keydown', this.onDocumentKeyDown);
    off(document, 'click', this.onDocumentClick);
  },
  methods: {
    getDateParts(date) {
      return this.$locale.getDateParts(date);
    },
    getDateFromParts(parts) {
      return this.$locale.getDateFromParts(parts);
    },
    refreshDateParts() {
      const value = this.dragValue || this.value_;
      const dateParts = [];
      if (this.isRange) {
        if (value && value.start) {
          dateParts.push(this.getDateParts(value.start));
        } else {
          dateParts.push({});
        }
        if (value && value.end) {
          dateParts.push(this.getDateParts(value.end));
        } else {
          dateParts.push({});
        }
      } else if (value) {
        dateParts.push(this.getDateParts(value));
      } else {
        dateParts.push({});
      }
      this.$nextTick(() => (this.dateParts = dateParts));
    },
    onDocumentKeyDown(e) {
      // Clear drag on escape keydown
      if (this.dragValue && e.key === 'Escape') {
        this.dragValue = null;
      }
    },
    onDocumentClick(e) {
      if (
        document.body.contains(e.target) &&
        !elementContains(this.$el, e.target)
      ) {
        this.dragValue = null;
        this.formatInput();
      }
    },
    onDayClick(day) {
      this.handleDayClick(day);
      // Re-emit event
      this.$emit('dayclick', day);
    },
    onDayKeydown(day) {
      switch (day.event.key) {
        case ' ':
        case 'Enter': {
          this.handleDayClick(day);
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
    handleDayClick(day) {
      const { keepVisibleOnInput, visibility } = this.popover_;
      const opts = {
        patch: PATCH.DATE,
        adjustTime: true,
        formatInput: true,
        hidePopover:
          this.isDate && !keepVisibleOnInput && visibility !== 'visible',
      };
      if (this.isRange) {
        if (!this.isDragging) {
          this.dragTrackingValue = { ...day.range };
        } else {
          this.dragTrackingValue.end = day.date;
        }
        opts.isDragging = !this.isDragging;
        opts.rangePriority = opts.isDragging
          ? RANGE_PRIORITY.NONE
          : RANGE_PRIORITY.BOTH;
        opts.hidePopover = opts.hidePopover && !opts.isDragging;
        this.updateValue(this.dragTrackingValue, opts);
      } else {
        opts.clearIfEqual = !this.isRequired;
        this.updateValue(day.date, opts);
      }
    },
    onDayMouseEnter(day) {
      if (!this.isDragging) return;
      this.dragTrackingValue.end = day.date;
      this.updateValue(this.dragTrackingValue, {
        patch: PATCH.DATE,
        adjustTime: true,
        formatInput: true,
        hidePriority: false,
        rangePriority: RANGE_PRIORITY.NONE,
      });
    },
    onTimeInput(parts, isStart) {
      let value = null;
      if (this.isRange) {
        const start = isStart ? parts : this.dateParts[0];
        const end = isStart ? this.dateParts[1] : parts;
        value = { start, end };
      } else {
        value = parts;
      }
      this.updateValue(value, {
        patch: PATCH.TIME,
        rangePriority: isStart ? RANGE_PRIORITY.START : RANGE_PRIORITY.END,
      }).then(() => this.adjustPageRange(isStart));
    },
    onInputInput(isStart) {
      return e => {
        if (!this.updateOnInput) return;
        this.onInputUpdate(e.target.value, isStart, {
          formatInput: false,
          hidePopover: false,
          debounce: this.inputDebounce,
        });
      };
    },
    onInputChange(isStart) {
      return e => {
        this.onInputUpdate(e.target.value, isStart, {
          formatInput: true,
          hidePopover: false,
        });
      };
    },
    onInputUpdate(inputValue, isStart, opts) {
      this.inputValues.splice(isStart ? 0 : 1, 1, inputValue);
      const value = this.isRange
        ? {
            start: this.inputValues[0],
            end: this.inputValues[1] || this.inputValues[0],
          }
        : inputValue;
      const config = {
        type: 'string',
        mask: this.inputMask,
      };
      this.updateValue(value, {
        ...opts,
        config,
        patch: this.inputMaskPatch,
        rangePriority: isStart ? RANGE_PRIORITY.START : RANGE_PRIORITY.END,
      }).then(() => this.adjustPageRange(isStart));
    },
    onInputShow(isStart) {
      this.adjustPageRange(isStart);
    },
    onInputKeyup(e) {
      // Escape key only
      if (e.key !== 'Escape') return;
      this.updateValue(this.value_, {
        formatInput: true,
        hidePopover: true,
      });
    },
    updateValue(value, opts = {}) {
      clearTimeout(this.updateTimeout);
      return new Promise(resolve => {
        const { debounce, ...args } = opts;
        if (debounce > 0) {
          this.updateTimeout = setTimeout(() => {
            this.forceUpdateValue(value, args);
            resolve(this.value_);
          }, debounce);
        } else {
          this.forceUpdateValue(value, args);
          resolve(this.value_);
        }
      });
    },
    normalizeConfig(config, baseConfig = this.modelConfig_) {
      config = isArray(config)
        ? config
        : [config.start || config, config.end || config];
      return baseConfig.map((b, i) => ({
        validHours: this.validHours,
        minuteIncrement: this.minuteIncrement,
        ...b,
        ...config[i],
      }));
    },
    forceUpdateValue(
      value,
      {
        config = this.modelConfig_,
        patch = PATCH.DATE_TIME,
        clearIfEqual = false,
        formatInput = true,
        hidePopover = false,
        isDragging = this.isDragging,
        rangePriority = RANGE_PRIORITY.BOTH,
      } = {},
    ) {
      // 1. Normalization
      config = this.normalizeConfig(config);
      let normalizedValue = this.normalizeValue(
        value,
        config,
        patch,
        rangePriority,
      );

      // Reset to previous value if it was cleared but is required
      if (!normalizedValue && this.isRequired) {
        normalizedValue = this.value_;
      }

      // Time Adjustment
      normalizedValue = this.adjustTimeForValue(normalizedValue, config);

      // 2. Validation (date or range)
      const isDisabled = this.valueIsDisabled(normalizedValue);
      if (isDisabled) {
        if (isDragging) return;
        normalizedValue = this.value_;
        // Don't allow hiding popover
        hidePopover = false;
      }

      // 3. Assignment
      const valueKey = isDragging ? 'dragValue' : 'value_';
      let valueChanged = !this.valuesAreEqual(this[valueKey], normalizedValue);

      // Clear value if same value selected and clearIfEqual is set
      if (!isDisabled && !valueChanged && clearIfEqual) {
        normalizedValue = null;
        valueChanged = true;
      }

      // Assign value
      if (valueChanged) {
        this[valueKey] = normalizedValue;
        // Clear drag value if needed
        if (!isDragging) this.dragValue = null;
        // Denormalization
        const denormalizedValue = this.denormalizeValue(normalizedValue);
        // Notification
        const event = this.isDragging ? 'drag' : 'update:modelValue';
        this.watchValue = false;
        this.$emit(event, denormalizedValue);
        this.$nextTick(() => (this.watchValue = true));
      }

      // 5. Hide popover if needed
      if (hidePopover) this.hidePopover();

      // 6. Format inputs if needed
      if (formatInput) this.formatInput();
    },
    hasValue(value) {
      if (this.isRange) {
        return isObject(value) && !!value.start && !!value.end;
      }
      return !!value;
    },
    normalizeValue(value, config, patch, rangePriority) {
      if (!this.hasValue(value)) return null;
      if (this.isRange) {
        const result = {};
        const start = value.start > value.end ? value.end : value.start;
        result.start = this.normalizeDate(start, {
          ...config[0],
          fillDate: (this.value_ && this.value_.start) || config[0].fillDate,
          patch,
        });
        const end = value.start > value.end ? value.start : value.end;
        result.end = this.normalizeDate(end, {
          ...config[1],
          fillDate: (this.value_ && this.value_.end) || config[1].fillDate,
          patch,
        });
        return this.sortRange(result, rangePriority);
      }
      return this.normalizeDate(value, {
        ...config[0],
        fillDate: this.value_ || config[0].fillDate,
        patch,
      });
    },
    adjustTimeForValue(value, config) {
      if (!this.hasValue(value)) return null;
      if (this.isRange) {
        return {
          start: this.$locale.adjustTimeForDate(value.start, config[0]),
          end: this.$locale.adjustTimeForDate(value.end, config[1]),
        };
      }
      return this.$locale.adjustTimeForDate(value, config[0]);
    },
    sortRange(range, priority = RANGE_PRIORITY.NONE) {
      const { start, end } = range;
      if (start > end) {
        switch (priority) {
          case RANGE_PRIORITY.START:
            return { start, end: start };
          case RANGE_PRIORITY.END:
            return { start: end, end };
          case RANGE_PRIORITY.BOTH:
            return { start: end, end: start };
        }
      }
      return { start, end };
    },
    denormalizeValue(value, config = this.modelConfig_) {
      if (this.isRange) {
        if (!this.hasValue(value)) return null;
        return {
          start: this.$locale.denormalizeDate(value.start, config[0]),
          end: this.$locale.denormalizeDate(value.end, config[1]),
        };
      }
      return this.$locale.denormalizeDate(value, config[0]);
    },
    valuesAreEqual(a, b) {
      if (this.isRange) {
        const aHasValue = this.hasValue(a);
        const bHasValue = this.hasValue(b);
        if (!aHasValue && !bHasValue) return true;
        if (aHasValue !== bHasValue) return false;
        return datesAreEqual(a.start, b.start) && datesAreEqual(a.end, b.end);
      }
      return datesAreEqual(a, b);
    },
    valueIsDisabled(value) {
      return (
        this.hasValue(value) &&
        this.disabledAttribute &&
        this.disabledAttribute.intersectsDate(value)
      );
    },
    formatInput() {
      this.$nextTick(() => {
        const config = this.normalizeConfig({
          type: 'string',
          mask: this.inputMask,
        });
        const value = this.denormalizeValue(
          this.dragValue || this.value_,
          config,
        );
        if (this.isRange) {
          this.inputValues = [value && value.start, value && value.end];
        } else {
          this.inputValues = [value, ''];
        }
      });
    },
    showPopover(opts = {}) {
      sp({
        ref: this.$el,
        ...this.popover_,
        ...opts,
        isInteractive: true,
        id: this.datePickerPopoverId,
      });
    },
    hidePopover(opts = {}) {
      hp({
        hideDelay: 10,
        ...this.showPopover_,
        ...opts,
        id: this.datePickerPopoverId,
      });
    },
    togglePopover(opts) {
      tp({
        ref: this.$el,
        ...this.popover_,
        ...opts,
        isInteractive: true,
        id: this.datePickerPopoverId,
      });
    },
    adjustPageRange(isStart) {
      this.$nextTick(() => {
        const calendar = this.$refs.calendar;
        const page = this.getPageForValue(isStart);
        const position = isStart ? 1 : -1;
        if (
          page &&
          calendar &&
          !pageIsBetweenPages(page, calendar.firstPage, calendar.lastPage)
        ) {
          calendar.move(page, {
            position,
            transition: 'fade',
          });
        }
      });
    },
    getPageForValue(isStart) {
      if (this.hasValue(this.value_)) {
        return this.pageForDate(
          this.isRange ? this.value_[isStart ? 'start' : 'end'] : this.value_,
        );
      }
      return null;
    },
    move(args, opts) {
      if (this.$refs.calendar) {
        return this.$refs.calendar.move(args, opts);
      }
      return Promise.reject(
        new Error('Navigation disabled while calendar is not yet displayed'),
      );
    },
    focusDate(date, opts) {
      if (this.$refs.calendar) {
        return this.$refs.calendar.focusDate(date, opts);
      }
      return Promise.reject(
        new Error('Navigation disabled while calendar is not yet displayed'),
      );
    },
  },
};
</script>
