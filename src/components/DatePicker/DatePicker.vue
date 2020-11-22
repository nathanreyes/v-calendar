<script>
import { h } from 'vue';
import Calendar from '../Calendar/Calendar.vue';
import Popover from '../Popover/Popover.vue';
import TimePicker from '../TimePicker/TimePicker.vue';
import { rootMixin } from '../../utils/mixins';
import { addTapOrClickHandler } from '../../utils/touch';
import {
  pageForDate,
  datesAreEqual,
  createGuid,
  elementContains,
  pageIsBetweenPages,
  on,
  off,
} from '../../utils/helpers';
import { isObject, isArray, pick } from '../../utils/_';
import {
  showPopover as sp,
  hidePopover as hp,
  togglePopover as tp,
  getPopoverTriggerEvents,
} from '../../utils/popovers';

const _dateConfig = {
  type: 'auto',
  mask: 'iso', // String mask when `type === 'string'`
  timeAdjust: '', // 'HH:MM:SS', 'now'
};

const _rangeConfig = {
  start: {
    ..._dateConfig,
    timeAdjust: '00:00:00',
  },
  end: {
    ..._dateConfig,
    timeAdjust: '23:59:59',
  },
};

const PATCH_KEYS = {
  1: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
  2: ['year', 'month', 'day'],
  3: ['hours', 'minutes', 'seconds'],
};

const MODE_DATE = 'date';
const MODE_DATE_TIME = 'datetime';
const MODE_TIME = 'time';

const PATCH_DATE_TIME = 1;
const PATCH_DATE = 2;
const PATCH_TIME = 3;

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
            parts.map((dp, idx) =>
              h(TimePicker, {
                modelValue: dp,
                locale: this.$locale,
                theme: this.$theme,
                is24hr: this.is24hr,
                minuteIncrement: this.minuteIncrement,
                showBorder: !this.isTime,
                'onUpdate:modelValue': p => this.onTimeInput(p, idx),
              }),
            ),
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
          timezone: this.timezone,
          minDate: this.minDate,
          maxDate: this.maxDate,
          disabledDates: this.disabledDates,
          availableDates: this.availableDates,
          onDayclick: this.onDayClick,
          onDaykeydown: this.onDayKeydown,
          onDaymouseenter: this.onDayMouseEnter,
          ref: 'calendar',
        },
        {
          ...this.$slots,
          footer: () => (this.isDateTime ? timePicker() : this.$slots.footer),
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
          [timePicker()],
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
    mode: { type: String, default: MODE_DATE },
    modelValue: { type: null, required: true },
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
      return this.mode.toLowerCase() === MODE_DATE;
    },
    isDateTime() {
      return this.mode.toLowerCase() === MODE_DATE_TIME;
    },
    isTime() {
      return this.mode.toLowerCase() === MODE_TIME;
    },
    isDragging() {
      return !!this.dragValue;
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
    slotArgs() {
      const inputConfig = {
        type: 'string',
        mask: this.inputMask,
        patch: PATCH_DATE_TIME,
        timezone: this.timezone,
      };
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
        input: this.onInputInput(inputConfig, isStart),
        change: this.onInputChange(inputConfig, isStart),
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
    canHidePopover() {
      return !(
        this.popover.keepVisibleOnInput ||
        this.popover_.visibility !== 'visible'
      );
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
    isRange: {
      immediate: true,
      handler() {
        this.initDateConfig();
      },
    },
    modelValue(val) {
      if (!this.watchValue) return;
      this.forceUpdateValue(val, {
        config: this.modelConfig,
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
      this.initDateConfig();
      this.refreshDateParts();
      this.forceUpdateValue(this.value_, { notify: true, formatInput: true });
    },
  },
  created() {
    this.forceUpdateValue(this.modelValue, {
      config: this.modelConfig,
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
    this.offTapOrClickHandler = addTapOrClickHandler(document, e => {
      if (
        document.body.contains(e.target) &&
        !elementContains(this.$el, e.target)
      ) {
        this.dragValue = null;
      }
    });
  },
  beforeUnmount() {
    // Clean up handlers
    off(document, 'keydown', this.onDocumentKeyDown);
    this.offTapOrClickHandler();
  },
  methods: {
    initDateConfig() {
      let config;
      const timezone = this.timezone;
      if (this.isRange) {
        config = {
          start: {
            timezone,
            ..._rangeConfig.start,
            ...(this.modelConfig.start || this.modelConfig),
          },
          end: {
            timezone,
            ..._rangeConfig.end,
            ...(this.modelConfig.end || this.modelConfig),
          },
        };
      } else {
        config = { timezone, ..._dateConfig, ...this.modelConfig };
      }
      this.dateConfig = config;
    },
    getDateParts(date) {
      return this.$locale.getDateParts(date, this.timezone);
    },
    getDateFromParts(parts) {
      return this.$locale.getDateFromParts(parts, this.timezone);
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
      const opts = {
        patch: PATCH_DATE,
        adjustTime: true,
        formatInput: true,
        hidePopover: this.isDate,
      };
      if (this.isRange) {
        if (!this.isDragging) {
          this.dragTrackingValue = { ...day.range };
        } else {
          this.dragTrackingValue.end = day.range.start;
        }
        opts.isDragging = !this.isDragging;
        opts.hidePopover = opts.hidePopover && !opts.isDragging;
        this.updateValue(this.dragTrackingValue, opts);
      } else {
        this.updateValue(day.range.start, opts);
      }
    },
    onDayMouseEnter(day) {
      if (!this.isDragging) return;
      this.dragTrackingValue.end = day.range.start;
      this.updateValue(this.dragTrackingValue, {
        patch: PATCH_DATE,
        adjustTime: true,
      });
    },
    onTimeInput(parts, idx) {
      const opts = {
        config: { timezone: this.timezone, type: 'object' },
        patch: PATCH_TIME,
      };
      if (this.isRange) {
        const start = idx === 0 ? parts : this.dateParts[0];
        const end = idx === 0 ? this.dateParts[1] : parts;
        this.updateValue({ start, end }, opts);
      } else {
        this.updateValue(parts, opts);
      }
    },
    onInputInput(config, isStart) {
      return e => {
        if (!this.updateOnInput_) return;
        let inputValue = e.target.value;
        this.inputValues.splice(isStart ? 0 : 1, 1, inputValue);
        if (this.isRange) {
          inputValue = { start: this.inputValues[0], end: this.inputValues[1] };
        }
        this.updateValue(inputValue, {
          config,
          patch: PATCH_DATE_TIME,
          formatInput: false,
          hidePopover: false,
          debounce: this.inputDebounce_,
        }).then(() => this.adjustPageRange(isStart));
      };
    },
    onInputChange(config, isStart) {
      const opts = {
        config,
        formatInput: true,
        hidePopover: false,
      };
      return e => {
        const inputValue = e.target.value;
        if (this.isRange) {
          this.inputValues.splice(isStart ? 0 : 1, 1, inputValue);
          this.updateValue(
            { start: this.inputValues[0], end: this.inputValues[1] },
            opts,
          );
        } else {
          this.inputValues.splice(0, 1, inputValue);
          this.updateValue(inputValue, opts);
        }
      };
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
        config = this.dateConfig,
        patch = PATCH_DATE_TIME,
        notify = true,
        formatInput = true,
        hidePopover = false,
        adjustTime = false,
        isDragging = this.isDragging,
      } = {},
    ) {
      // 1. Normalization
      let normalizedValue = this.normalizeValue(
        value,
        config,
        patch,
        isDragging,
      );

      // Time Adjustment
      if (adjustTime) {
        normalizedValue = this.adjustTimeForValue(normalizedValue, config);
      }

      // 2. Validation (date or range)
      if (
        this.hasValue(normalizedValue) &&
        this.disabledAttribute &&
        this.disabledAttribute.intersectsDate(normalizedValue)
      ) {
        if (isDragging) return;
        normalizedValue = this.value_;
      }

      // 3. Assignment
      const valueKey = isDragging ? 'dragValue' : 'value_';
      const valueChanged = !this.valuesAreEqual(
        this[valueKey],
        normalizedValue,
      );
      if (valueChanged) {
        this[valueKey] = normalizedValue;
        // Clear drag value if needed
        if (!isDragging) this.dragValue = null;
      }

      // 4. Denormalization/Notification
      if (notify && valueChanged) {
        // 4A. Denormalization
        const denormalizedValue = this.denormalizeValue(
          normalizedValue,
          this.dateConfig,
        );
        // 4B. Notification
        const event = this.isDragging ? 'drag' : 'update:modelValue';
        this.watchValue = false;
        this.$emit(event, denormalizedValue);
        this.$nextTick(() => (this.watchValue = true));
      }

      // 5. Side effects for non-inline pickers
      if (formatInput) this.formatInput();
      if (hidePopover) this.hidePopover();
    },
    hasValue(value) {
      if (this.isRange) {
        return isObject(value) && value.start && value.end;
      }
      return !!value;
    },
    normalizeValue(value, config, patch, isDragging) {
      if (!this.hasValue(value)) return null;
      const patchKeys = PATCH_KEYS[patch];
      if (this.isRange) {
        const start = this.normalizeDate(value.start, config.start || config);
        const end = this.normalizeDate(value.end, config.end || config);
        const result = this.sortRange({ start, end });
        if (patch !== PATCH_DATE_TIME) {
          const startParts = {
            ...this.dateParts[0],
            ...pick(this.getDateParts(result.start), patchKeys),
          };
          result.start = this.getDateFromParts(startParts);
          const endParts = {
            ...this.dateParts[1],
            ...pick(this.getDateParts(result.end), patchKeys),
          };
          result.end = this.getDateFromParts(endParts);
        }
        return isDragging ? result : this.sortRange(result);
      }
      let result = this.normalizeDate(value, config);
      if (patch === PATCH_DATE_TIME) return result;
      result = {
        ...this.dateParts[0],
        ...pick(this.getDateParts(result), patchKeys),
      };
      return this.getDateFromParts(result);
    },
    adjustTimeForValue(value, config) {
      if (this.isRange) {
        if (!this.hasValue(value)) return null;
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
    sortRange(range) {
      const { start, end } = range;
      if (start > end) {
        return { start: end, end: start };
      }
      return { start, end };
    },
    denormalizeValue(value, config) {
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
    formatInput() {
      this.$nextTick(() => {
        const opts = {
          type: 'string',
          mask: this.inputMask,
          timezone: this.timezone,
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
        ...opts,
        isInteractive: true,
        id: this.datePickerPopoverId,
      });
    },
    hidePopover(opts = {}) {
      hp({ ...opts, id: this.datePickerPopoverId });
    },
    togglePopover(opts) {
      tp({
        ref: this.$el,
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
        return pageForDate(
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
