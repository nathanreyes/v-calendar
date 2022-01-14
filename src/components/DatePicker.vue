<script>
import Calendar from './Calendar';
import Popover from './Popover';
import TimePicker from './TimePicker';
import { rootMixin } from '../utils/mixins';
import {
  datesAreEqual,
  createGuid,
  elementContains,
  pageIsBetweenPages,
  on,
  off,
} from '../utils/helpers';
import { isObject, isArray } from '../utils/_';
import {
  showPopover as sp,
  hidePopover as hp,
  togglePopover as tp,
  getPopoverTriggerEvents,
} from '../utils/popovers';
import { PATCH } from '../utils/locale';

const _dateConfig = {
  type: 'auto',
  mask: 'iso', // String mask when `type === 'string'`
  timeAdjust: '', // 'HH:MM:SS', 'now'
};

const _rangeConfig = {
  start: {
    ..._dateConfig,
  },
  end: {
    ..._dateConfig,
  },
};

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
  render(h) {
    // Timepicker renderer
    const timePicker = () => {
      if (!this.dateParts) return null;
      const parts = this.isRange ? this.dateParts : [this.dateParts[0]];
      return h('div', [
        ...parts.map((dp, idx) =>
          h(TimePicker, {
            props: {
              value: dp,
              locale: this.$locale,
              theme: this.$theme,
              is24hr: this.is24hr,
              minuteIncrement: this.minuteIncrement,
              showBorder: !this.isTime,
              isDisabled: (this.isDateTime && !dp.isValid) || this.isDragging,
            },
            on: { input: p => this.onTimeInput(p, idx === 0) },
          }),
        ),
        this.$scopedSlots.footer && this.$scopedSlots.footer(),
      ]);
    };
    // Calendar renderer
    const calendar = () =>
      h(Calendar, {
        attrs: {
          ...this.$attrs,
          attributes: this.attributes_,
          theme: this.$theme,
          locale: this.$locale,
        },
        props: {
          minDate: this.minDateExact || this.minDate,
          maxDate: this.maxDateExact || this.maxDate,
          disabledDates: this.disabledDates,
          availableDates: this.availableDates,
        },
        on: {
          ...this.$listeners,
          dayclick: this.onDayClick,
          daykeydown: this.onDayKeydown,
          daymouseenter: this.onDayMouseEnter,
        },
        scopedSlots: {
          ...this.$scopedSlots,
          footer: this.isDateTime ? timePicker : this.$scopedSlots.footer,
        },
        ref: 'calendar',
      });
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
          [timePicker()],
        );
      }
      return calendar();
    };
    return (
      (this.$scopedSlots.default &&
        // Convert this span to a fragment when supported in Vue
        h('span', [
          // Slot content
          this.$scopedSlots.default(this.slotArgs),
          // Popover content
          h(Popover, {
            props: {
              id: this.datePickerPopoverId,
              placement: 'bottom-start',
              contentClass: `vc-container${this.isDark ? ' vc-is-dark' : ''}`,
            },
            on: {
              beforeShow: e => this.$emit('popoverWillShow', e),
              afterShow: e => this.$emit('popoverDidShow', e),
              beforeHide: e => this.$emit('popoverWillHide', e),
              afterHide: e => this.$emit('popoverDidHide', e),
            },
            scopedSlots: {
              default() {
                return content();
              },
            },
            ref: 'popover',
          }),
        ])) ||
      content()
    );
  },
  mixins: [rootMixin],
  props: {
    mode: { type: String, default: MODE.DATE },
    value: { type: null, required: true },
    modelConfig: { type: Object, default: () => ({ ..._dateConfig }) },
    is24hr: Boolean,
    minuteIncrement: Number,
    isRequired: Boolean,
    isRange: Boolean,
    updateOnInput: Boolean,
    inputDebounce: Number,
    popover: { type: Object, default: () => ({}) },
    dragAttribute: Object,
    selectAttribute: Object,
    attributes: Array,
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
    updateOnInput_() {
      return this.propOrDefault('updateOnInput', 'datePicker.updateOnInput');
    },
    inputDebounce_() {
      return this.propOrDefault('inputDebounce', 'datePicker.inputDebounce');
    },
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
      if (this.isRange) {
        return {
          start: {
            ..._rangeConfig.start,
            ...(this.modelConfig.start || this.modelConfig),
          },
          end: {
            ..._rangeConfig.end,
            ...(this.modelConfig.end || this.modelConfig),
          },
        };
      }
      return { ..._dateConfig, ...this.modelConfig };
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
      return this.propOrDefault('popover', 'datePicker.popover', 'merge');
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
    value() {
      if (!this.watchValue) return;
      this.forceUpdateValue(this.value, {
        config: this.modelConfig_,
        notify: false,
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
      this.forceUpdateValue(this.value_, { notify: true, formatInput: true });
    },
  },
  created() {
    this.forceUpdateValue(this.value, {
      config: this.modelConfig_,
      notify: false,
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
  destroyed() {
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
        hidePopover: false,
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
        if (!this.updateOnInput_) return;
        this.onInputUpdate(e.target.value, isStart, {
          formatInput: false,
          hidePopover: false,
          debounce: this.inputDebounce_,
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
    forceUpdateValue(
      value,
      {
        config = this.modelConfig_,
        patch = PATCH.DATE_TIME,
        notify = true,
        clearIfEqual = false,
        formatInput = true,
        hidePopover = false,
        adjustTime = false,
        isDragging = this.isDragging,
        rangePriority = RANGE_PRIORITY.BOTH,
      } = {},
    ) {
      // 1. Normalization
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
      if (adjustTime) {
        normalizedValue = this.adjustTimeForValue(normalizedValue, config);
      }

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
        this.$set(this, valueKey, normalizedValue);
        // Clear drag value if needed
        if (!isDragging) this.dragValue = null;
      }

      // 4. Denormalization/Notification
      if (notify && valueChanged) {
        // 4A. Denormalization
        const denormalizedValue = this.denormalizeValue(normalizedValue);
        // 4B. Notification
        const event = this.isDragging ? 'drag' : 'input';
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
        return isObject(value) && value.start && value.end;
      }
      return !!value;
    },
    normalizeValue(value, config, patch, rangePriority) {
      if (!this.hasValue(value)) return null;
      if (this.isRange) {
        const result = {};
        const start = value.start > value.end ? value.end : value.start;
        const startFillDate =
          (this.value_ && this.value_.start) ||
          this.modelConfig_.start.fillDate;
        const startConfig = config.start || config;
        result.start = this.normalizeDate(start, {
          ...startConfig,
          fillDate: startFillDate,
          patch,
        });
        const end = value.start > value.end ? value.start : value.end;
        const endFillDate =
          (this.value_ && this.value_.end) || this.modelConfig_.end.fillDate;
        const endConfig = config.end || config;
        result.end = this.normalizeDate(end, {
          ...endConfig,
          fillDate: endFillDate,
          patch,
        });
        return this.sortRange(result, rangePriority);
      }
      return this.normalizeDate(value, {
        ...config,
        fillDate: this.value_ || this.modelConfig_.fillDate,
        patch,
      });
    },
    adjustTimeForValue(value, config) {
      if (!this.hasValue(value)) return null;
      if (this.isRange) {
        return {
          start: this.$locale.adjustTimeForDate(
            value.start,
            config.start || config,
          ),
          end: this.$locale.adjustTimeForDate(value.end, config.end || config),
        };
      }
      return this.$locale.adjustTimeForDate(value, config);
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
          start: this.$locale.denormalizeDate(
            value.start,
            config.start || config,
          ),
          end: this.$locale.denormalizeDate(value.end, config.end || config),
        };
      }
      return this.$locale.denormalizeDate(value, config);
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
        const opts = {
          type: 'string',
          mask: this.inputMask,
        };
        const value = this.denormalizeValue(
          this.dragValue || this.value_,
          opts,
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
        ...this.popover_,
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

<style lang="scss">
.vc-container {
  --white: #ffffff;
  --black: #000000;

  --gray-100: #f7fafc;
  --gray-200: #edf2f7;
  --gray-300: #e2e8f0;
  --gray-400: #cbd5e0;
  --gray-500: #a0aec0;
  --gray-600: #718096;
  --gray-700: #4a5568;
  --gray-800: #2d3748;
  --gray-900: #1a202c;

  --red-100: #fff5f5;
  --red-200: #fed7d7;
  --red-300: #feb2b2;
  --red-400: #fc8181;
  --red-500: #f56565;
  --red-600: #e53e3e;
  --red-700: #c53030;
  --red-800: #9b2c2c;
  --red-900: #742a2a;

  --orange-100: #fffaf0;
  --orange-200: #feebc8;
  --orange-300: #fbd38d;
  --orange-400: #f6ad55;
  --orange-500: #ed8936;
  --orange-600: #dd6b20;
  --orange-700: #c05621;
  --orange-800: #9c4221;
  --orange-900: #7b341e;

  --yellow-100: #fffff0;
  --yellow-200: #fefcbf;
  --yellow-300: #faf089;
  --yellow-400: #f6e05e;
  --yellow-500: #ecc94b;
  --yellow-600: #d69e2e;
  --yellow-700: #b7791f;
  --yellow-800: #975a16;
  --yellow-900: #744210;

  --green-100: #f0fff4;
  --green-200: #c6f6d5;
  --green-300: #9ae6b4;
  --green-400: #68d391;
  --green-500: #48bb78;
  --green-600: #38a169;
  --green-700: #2f855a;
  --green-800: #276749;
  --green-900: #22543d;

  --teal-100: #e6fffa;
  --teal-200: #b2f5ea;
  --teal-300: #81e6d9;
  --teal-400: #4fd1c5;
  --teal-500: #38b2ac;
  --teal-600: #319795;
  --teal-700: #2c7a7b;
  --teal-800: #285e61;
  --teal-900: #234e52;

  --blue-100: #ebf8ff;
  --blue-200: #bee3f8;
  --blue-300: #90cdf4;
  --blue-400: #63b3ed;
  --blue-500: #4299e1;
  --blue-600: #3182ce;
  --blue-700: #2b6cb0;
  --blue-800: #2c5282;
  --blue-900: #2a4365;

  --indigo-100: #ebf4ff;
  --indigo-200: #c3dafe;
  --indigo-300: #a3bffa;
  --indigo-400: #7f9cf5;
  --indigo-500: #667eea;
  --indigo-600: #5a67d8;
  --indigo-700: #4c51bf;
  --indigo-800: #434190;
  --indigo-900: #3c366b;

  --purple-100: #faf5ff;
  --purple-200: #e9d8fd;
  --purple-300: #d6bcfa;
  --purple-400: #b794f4;
  --purple-500: #9f7aea;
  --purple-600: #805ad5;
  --purple-700: #6b46c1;
  --purple-800: #553c9a;
  --purple-900: #44337a;

  --pink-100: #fff5f7;
  --pink-200: #fed7e2;
  --pink-300: #fbb6ce;
  --pink-400: #f687b3;
  --pink-500: #ed64a6;
  --pink-600: #d53f8c;
  --pink-700: #b83280;
  --pink-800: #97266d;
  --pink-900: #702459;

  &.vc-red {
    --accent-100: var(--red-100);
    --accent-200: var(--red-200);
    --accent-300: var(--red-300);
    --accent-400: var(--red-400);
    --accent-500: var(--red-500);
    --accent-600: var(--red-600);
    --accent-700: var(--red-700);
    --accent-800: var(--red-800);
    --accent-900: var(--red-900);
  }

  &.vc-orange {
    --accent-100: var(--orange-100);
    --accent-200: var(--orange-200);
    --accent-300: var(--orange-300);
    --accent-400: var(--orange-400);
    --accent-500: var(--orange-500);
    --accent-600: var(--orange-600);
    --accent-700: var(--orange-700);
    --accent-800: var(--orange-800);
    --accent-900: var(--orange-900);
  }

  &.vc-yellow {
    --accent-100: var(--yellow-100);
    --accent-200: var(--yellow-200);
    --accent-300: var(--yellow-300);
    --accent-400: var(--yellow-400);
    --accent-500: var(--yellow-500);
    --accent-600: var(--yellow-600);
    --accent-700: var(--yellow-700);
    --accent-800: var(--yellow-800);
    --accent-900: var(--yellow-900);
  }

  &.vc-green {
    --accent-100: var(--green-100);
    --accent-200: var(--green-200);
    --accent-300: var(--green-300);
    --accent-400: var(--green-400);
    --accent-500: var(--green-500);
    --accent-600: var(--green-600);
    --accent-700: var(--green-700);
    --accent-800: var(--green-800);
    --accent-900: var(--green-900);
  }

  &.vc-teal {
    --accent-100: var(--teal-100);
    --accent-200: var(--teal-200);
    --accent-300: var(--teal-300);
    --accent-400: var(--teal-400);
    --accent-500: var(--teal-500);
    --accent-600: var(--teal-600);
    --accent-700: var(--teal-700);
    --accent-800: var(--teal-800);
    --accent-900: var(--teal-900);
  }

  &.vc-blue {
    --accent-100: var(--blue-100);
    --accent-200: var(--blue-200);
    --accent-300: var(--blue-300);
    --accent-400: var(--blue-400);
    --accent-500: var(--blue-500);
    --accent-600: var(--blue-600);
    --accent-700: var(--blue-700);
    --accent-800: var(--blue-800);
    --accent-900: var(--blue-900);
  }

  &.vc-indigo {
    --accent-100: var(--indigo-100);
    --accent-200: var(--indigo-200);
    --accent-300: var(--indigo-300);
    --accent-400: var(--indigo-400);
    --accent-500: var(--indigo-500);
    --accent-600: var(--indigo-600);
    --accent-700: var(--indigo-700);
    --accent-800: var(--indigo-800);
    --accent-900: var(--indigo-900);
  }

  &.vc-purple {
    --accent-100: var(--purple-100);
    --accent-200: var(--purple-200);
    --accent-300: var(--purple-300);
    --accent-400: var(--purple-400);
    --accent-500: var(--purple-500);
    --accent-600: var(--purple-600);
    --accent-700: var(--purple-700);
    --accent-800: var(--purple-800);
    --accent-900: var(--purple-900);
  }

  &.vc-pink {
    --accent-100: var(--pink-100);
    --accent-200: var(--pink-200);
    --accent-300: var(--pink-300);
    --accent-400: var(--pink-400);
    --accent-500: var(--pink-500);
    --accent-600: var(--pink-600);
    --accent-700: var(--pink-700);
    --accent-800: var(--pink-800);
    --accent-900: var(--pink-900);
  }

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;

  --leading-snug: 1.375;

  --rounded: 0.25rem;
  --rounded-lg: 0.5rem;
  --rounded-full: 9999px;

  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

  --slide-translate: 22px;
  --slide-duration: 0.15s;
  --slide-timing: ease;

  --day-content-transition-time: 0.13s ease-in;
  --weeknumber-offset: -34px;

  position: relative;
  display: inline-flex;
  width: max-content;
  height: max-content;
  font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    'Helvetica', 'Arial', sans-serif;
  color: var(--gray-900);
  background-color: var(--white);
  border: 1px solid;
  border-color: var(--gray-400);
  border-radius: var(--rounded-lg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  &,
  & * {
    box-sizing: border-box;
    &:focus {
      outline: none;
    }
  }
  & button,
  & [role='button'] {
    cursor: pointer;
  }
  &.vc-is-expanded {
    min-width: 100%;
  }
  /* Hides double border within popovers */
  & .vc-container {
    border: none;
  }
  &.vc-is-dark {
    color: var(--gray-100);
    background-color: var(--gray-900);
    border-color: var(--gray-700);
  }
}

</style>
