
<script>
import Calendar from './Calendar';
import Popover from './Popover';
import PopoverRef from './PopoverRef';
import TimePicker from './TimePicker';
import {
  rootMixin,
  propOrDefaultMixin,
  safeScopedSlotMixin,
} from '../utils/mixins';
import { addTapOrClickHandler } from '../utils/touch';
import {
  pageForDate,
  datesAreEqual,
  createGuid,
  elementContains,
  getMaxPage,
  addPages,
  on,
  off,
} from '../utils/helpers';
import { isObject, isArray, has, pick } from '../utils/_';
import '../styles/tailwind-lib.css';

const _dateConfig = {
  type: 'auto',
  mask: 'iso', // String mask when `type === 'string'`
  timeOption: 'noon', // 'initial', 'now', 'startOfDay', 'endOfDay', 'custom'
  time: '', // Time when `timeOption === 'custom'`
};

const _rangeConfig = {
  start: {
    ..._dateConfig,
    timeOption: 'startOfDay',
  },
  end: {
    ..._dateConfig,
    timeOption: 'endOfDay',
  },
};

const PATCH_KEYS = {
  1: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
  2: ['year', 'month', 'day'],
  3: ['hours', 'minutes', 'seconds'],
};

const PATCH_DATE_TIME = 1;
const PATCH_DATE = 2;
const PATCH_TIME = 3;

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
          timezone: this.timezone,
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
          daykeydown: this.onDayKeydown,
          daymouseenter: this.onDayMouseEnter,
        },
        scopedSlots: {
          ...this.$scopedSlots,
          footer: () => {
            const parts = this.isRange ? this.dateParts : [this.dateParts[0]];
            return h(
              'div',
              parts.map((dp, idx) =>
                h(
                  TimePicker,
                  {
                    props: { value: dp, locale: this.$locale },
                    on: { input: p => this.onTimeInput(p, idx) },
                  },
                  [
                    h('div', {
                      class:
                        'text-sm vc-text-gray-600 uppercase tracking-wide font-bold mb-1 ml-6',
                    }),
                  ],
                ),
              ),
            );
          },
        },
        ref: 'calendar',
      });
    // If inline just return the calendar
    if (this.inline) return calendar();
    // Convert this span to a fragment when supported in Vue
    return h('span', [
      // Slot content
      this.safeScopedSlot('default', this.slotArgs),
      // Popover ref
      h(PopoverRef, {
        props: {
          ...this.popover_,
          element:
            this.popoverRefEl || this.$slots.default
              ? this.$slots.default[0]
              : null,
          id: this.datePickerPopoverId,
          isInteractive: true,
        },
      }),
      // Popover
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
    modelConfig: { type: Object, default: () => ({ ..._dateConfig }) },
    isRequired: Boolean,
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
      isDragging: false,
      inputValues: ['', ''],
      inline: false,
      updateTimeout: null,
      watchValue: true,
      popoverRefEl: null,
      datePickerPopoverId: createGuid(),
    };
  },
  computed: {
    isRange() {
      return this.mode === 'range';
    },
    updateOnInput_() {
      return this.propOrDefault('updateOnInput', 'datePicker.updateOnInput');
    },
    inputDebounce_() {
      return this.propOrDefault('inputDebounce', 'datePicker.inputDebounce');
    },
    slotArgs() {
      const inputConfig = {
        type: 'string',
        mask: this.$locale.masks.input,
        patch: PATCH_DATE_TIME,
        timezone: this.timezone,
      };
      const { isRange, isDragging, updateValue, hidePopover } = this;
      const inputValue = isRange
        ? {
            start: this.inputValues[0],
            end: this.inputValues[1],
          }
        : this.inputValues[0];
      const inputEvents = isRange
        ? {
            start: {
              input: this.genInputInput(true, inputConfig),
              change: this.genInputChange(true, inputConfig),
              keyup: this.inputKeyup,
            },
            end: {
              input: this.genInputInput(false, inputConfig),
              change: this.genInputChange(false, inputConfig),
              keyup: this.inputKeyup,
            },
          }
        : {
            input: this.genInputInput(true, inputConfig),
            change: this.genInputChange(true, inputConfig),
            keyup: this.inputKeyup,
          };

      return {
        inputValue,
        inputEvents,
        isDragging,
        updateValue,
        hidePopover,
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
      if (this.mode !== 'range' || !this.hasValue(this.dragValue)) {
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
  },
  watch: {
    mode() {
      // Clear value on select mode change
      this.value_ = null;
    },
    isRange: {
      immediate: true,
      handler() {
        this.initDateConfig();
      },
    },
    value: {
      immediate: true,
      handler() {
        if (!this.watchValue) return;
        this.forceUpdateValue(this.value, {
          config: this.modelConfig,
          notify: false,
          formatInput: true,
          hidePopover: false,
        });
      },
    },
    value_: {
      immediate: true,
      handler() {
        this.refreshDateParts();
      },
    },
    dragValue() {
      this.refreshDateParts();
    },
    timezone() {
      this.refreshDateParts();
    },
    isDragging(val) {
      if (!val) this.dragValue = null;
    },
  },
  mounted() {
    this.inline = !this.$slots.default && !this.$scopedSlots.default;
    // Handle escape key presses
    on(document, 'keydown', this.onDocumentKeyDown);
    // Clear drag on background click
    const offTapOrClickHandler = addTapOrClickHandler(document, e => {
      if (
        document.body.contains(e.target) &&
        !elementContains(this.$el, e.target)
      ) {
        this.isDragging = false;
      }
    });
    // Clean up handlers
    this.$once('beforeDestroy', () => {
      off(document, 'keydown', this.onDocumentKeyDown);
      offTapOrClickHandler();
    });
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
      const value = this.isDragging ? this.dragValue : this.value_;
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
      this.dateParts = dateParts;
    },
    onDocumentKeyDown(e) {
      // Clear drag on escape keydown
      if (this.dragValue && e.keyCode === 27) {
        this.isDragging = false;
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
        formatInput: true,
        hidePopover: false,
        adjustPageRange: false,
      };
      if (this.isRange) {
        if (!this.isDragging) {
          this.dragTrackingValue = { ...day.range };
        } else {
          this.dragTrackingValue.end = day.range.start;
        }
        this.isDragging = !this.isDragging;
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
        adjustPageRange: false,
      });
    },
    onTimeInput(parts, idx) {
      const opts = {
        config: { timezone: this.timezone, type: 'object' },
        patch: PATCH_TIME,
        adjustPageRange: false,
      };
      if (this.isRange) {
        const start = idx === 0 ? parts : this.dateParts[1];
        const end = idx === 0 ? this.dateParts[0] : parts;
        this.updateValue({ start, end }, opts);
      } else {
        this.updateValue(parts, opts);
      }
    },
    genInputInput(isStart, config) {
      const opts = {
        config,
        patch: PATCH_DATE_TIME,
        formatInput: false,
        hidePopover: false,
        adjustPageRange: true,
        debounce: this.inputDebounce_,
      };
      return e => {
        if (!this.updateOnInput_) return;
        const inputValue = e.target.value;
        if (this.isRange) {
          const start = isStart ? inputValue : this.value_.end;
          const end = isStart ? this.value_.end : inputValue;
          this.updateValue({ start, end }, opts);
        } else {
          this.updateValue(inputValue, opts);
        }
      };
    },
    genInputChange(isStart, config) {
      const opts = {
        config,
        formatInput: true,
        hidePopover: false,
        adjustPageRange: false,
      };
      return e => {
        const inputValue = e.target.value;
        if (this.isRange) {
          const start = isStart ? inputValue : this.value_.end;
          const end = isStart ? this.value_.end : inputValue;
          this.updateValue({ start, end }, opts);
        } else {
          this.updateValue(inputValue, opts);
        }
      };
    },
    inputKeyup(e) {
      // Escape key only
      if (e.key !== 'Escape') return;
      this.updateValue(this.value_, {
        formatInput: true,
        hidePopover: true,
        adjustPageRange: false,
      });
    },
    updateValue(value, opts = {}) {
      clearTimeout(this.updateTimeout);
      const { debounce, ...args } = opts;
      if (debounce > 0) {
        this.updateTimeout = setTimeout(
          () => this.forceUpdateValue(value, args),
          debounce,
        );
      } else {
        this.forceUpdateValue(value, args);
      }
    },
    forceUpdateValue(
      value,
      {
        config = this.dateConfig,
        patch = PATCH_DATE_TIME,
        notify = true,
        formatInput = true,
        hidePopover = false,
        adjustPageRange = true,
      } = {},
    ) {
      // 1. Normalization
      let normalizedValue = this.normalizeValue(value, config, patch);

      // 2. Validation (date or range)
      if (
        this.hasValue(normalizedValue) &&
        this.disabledAttribute &&
        this.disabledAttribute.intersectsDate(normalizedValue)
      ) {
        normalizedValue = null;
      }

      // 3. Assignment
      const valueKey = this.isDragging ? 'dragValue' : 'value_';
      const valueChanged = !this.valuesAreEqual(
        this[valueKey],
        normalizedValue,
      );
      if (valueChanged) {
        this.$set(this, valueKey, normalizedValue);
      }

      // 4. Denormalization/Notification
      if (notify && valueChanged) {
        // 4A. Denormalization
        const denormalizedValue = this.denormalizeValue(
          normalizedValue,
          this.dateConfig,
        );
        // 4B. Notification
        const event = this.isDragging ? 'drag' : 'input';
        this.watchValue = false;
        this.$emit(event, denormalizedValue);
        this.$nextTick(() => (this.watchValue = true));
      }

      // 5. Side effects for non-inline pickers
      if (!this.inline) {
        if (formatInput) this.formatInput();
        if (hidePopover) this.hidePopover();
        if (adjustPageRange) this.adjustPageRange();
      }
    },
    hasValue(value) {
      if (this.isRange) {
        return isObject(value) && has(value, 'start') && has(value, 'end');
      }
      return !!value;
    },
    normalizeValue(value, config, patch) {
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
        return this.isDragging ? result : this.sortRange(result);
      }
      let result = this.normalizeDate(value, config);
      if (patch === PATCH_DATE_TIME) return result;
      result = {
        ...this.dateParts[0],
        ...pick(this.getDateParts(result), patchKeys),
      };
      return this.getDateFromParts(result);
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
          mask: this.$locale.masks.input,
          timezone: this.timezone,
        };
        const inputValues = ['', ''];
        if (this.isRange) {
          const value = this.denormalizeValue(
            this.isDragging ? this.dragValue : this.value_,
            opts,
          );
          inputValues[0] = value && value.start;
          inputValues[1] = value && value.end;
        } else {
          inputValues[0] = this.denormalizeValue(this.value_, opts);
        }
        this.inputValues = inputValues;
      });
    },
    hidePopover() {
      const popover = this.$refs.popover;
      if (popover) {
        popover.hide({ priority: 10, delay: 250 });
      }
    },
    adjustPageRange() {
      if (this.hasValue(this.value_) && this.$refs.calendar) {
        this.$refs.calendar.showPageRange(this.getPageRange(this.value_));
      }
    },
    getPageRange(value) {
      if (!this.hasValue(value)) {
        return null;
      }
      if (this.isRange) {
        const from = pageForDate(value.start);
        const to = getMaxPage(pageForDate(value.end), addPages(from, 1));
        return { from, to };
      }
      const from = pageForDate(value);
      return { from, to: from };
    },
  },
};
</script>

<style lang="postcss" scoped>
::v-deep .vc-container {
  border: none;
}
</style>
