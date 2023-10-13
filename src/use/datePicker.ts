import {
  type SetupContext,
  type ExtractPropTypes,
  type PropType,
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  toRef,
  inject,
  provide,
} from 'vue';
import Calendar from '../components/Calendar/Calendar.vue';
import Popover from '../components/Popover/Popover.vue';
import { getDefault } from '../utils/defaults';
import type { AttributeConfig } from '../utils/attribute';
import { type CalendarDay, getPageAddressForDate } from '../utils/page';
import {
  defaultsDeep,
  isArray,
  isDate,
  isNumber,
  isObject,
  isString,
} from '../utils/helpers';
import {
  type DatePatch,
  type DateParts,
  type DatePartsRules,
  type DateSource,
  type SimpleDateParts,
  isDateParts,
} from '../utils/date/helpers';
import type { SimpleDateRange } from '../utils/date/range';
import {
  type PopoverOptions,
  showPopover as sp,
  hidePopover as hp,
  togglePopover as tp,
  getPopoverEventHandlers,
} from '../utils/popovers';
import { propsDef as basePropsDef, createBase } from './base';
import type { MoveTarget, MoveOptions } from './calendar';
import { provideSlots } from './slots';

export type DateType = 'date' | 'string' | 'number';

export interface DateConfig {
  type: DateType;
  rules: DatePartsRules;
  mask?: string;
}

const contextKey = Symbol('__vc_date_picker_context__');

export type DateModes = 'date' | 'datetime' | 'time';

export type ValueTarget = 'start' | 'end';

export interface UpdateOptions {
  config: any;
  patch: DatePatch;
  debounce: number;
  clearIfEqual: boolean;
  formatInput: boolean;
  hidePopover: boolean;
  dragging: boolean;
  targetPriority: ValueTarget;
  moveToValue: boolean;
}

export interface ModelModifiers {
  number?: boolean;
  string?: boolean;
  range?: boolean;
}

export type DatePickerDate = DateSource | Partial<SimpleDateParts> | null;
export type DatePickerRangeArray = [DatePickerDate, DatePickerDate];
export type DatePickerRangeObject = {
  start: Exclude<DatePickerDate, null>;
  end: Exclude<DatePickerDate, null>;
};
export type DatePickerModel = DatePickerDate | DatePickerRangeObject;

export type DatePickerContext = ReturnType<typeof createDatePicker>;

export type DatePickerProps = Readonly<ExtractPropTypes<typeof propsDef>>;

export const propsDef = {
  ...basePropsDef,
  mode: { type: String, default: 'date' },
  modelValue: {
    type: [Number, String, Date, Object] as PropType<DatePickerModel>,
  },
  modelModifiers: {
    type: Object as PropType<ModelModifiers>,
    default: () => ({}),
  },
  rules: [String, Object] as PropType<'auto' | DatePartsRules>,
  is24hr: Boolean,
  hideTimeHeader: Boolean,
  timeAccuracy: { type: Number, default: 2 },
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
  popover: {
    type: [Boolean, Object] as PropType<boolean | Partial<PopoverOptions>>,
    default: true,
  },
  dragAttribute: Object as PropType<AttributeConfig>,
  selectAttribute: Object as PropType<AttributeConfig>,
  attributes: [Object, Array],
};

export const emits = [
  'update:modelValue',
  'drag',
  'dayclick',
  'daykeydown',
  'popover-will-show',
  'popover-did-show',
  'popover-will-hide',
  'popover-did-hide',
];

export function createDatePicker(
  props: DatePickerProps,
  { emit, slots }: SetupContext<string[]>,
) {
  provideSlots(slots, { footer: 'dp-footer' });

  const baseCtx = createBase(props);
  const { locale, masks, disabledAttribute } = baseCtx;

  const showCalendar = ref(false);
  const datePickerPopoverId = ref(Symbol());
  const dateValue = ref<null | Date | SimpleDateRange>(null);
  const dragValue = ref<null | SimpleDateRange>(null);
  const inputValues = ref<string[]>(['', '']);
  const popoverRef = ref<InstanceType<typeof Popover> | null>(null);
  const calendarRef = ref<InstanceType<typeof Calendar> | null>(null);

  let updateTimeout: undefined | number = undefined;
  let dragTrackingValue: null | SimpleDateRange;
  let watchValue = true;

  // #region Computed

  const isRange = computed(() => {
    return props.isRange || props.modelModifiers.range === true;
  });

  const valueStart = computed(() =>
    isRange.value && dateValue.value != null
      ? (dateValue.value as SimpleDateRange).start
      : null,
  );

  const valueEnd = computed(() =>
    isRange.value && dateValue.value != null
      ? (dateValue.value as SimpleDateRange).end
      : null,
  );

  const isDateMode = computed(() => props.mode.toLowerCase() === 'date');
  const isDateTimeMode = computed(
    () => props.mode.toLowerCase() === 'datetime',
  );
  const isTimeMode = computed(() => props.mode.toLowerCase() === 'time');

  const isDragging = computed(() => !!dragValue.value);

  const modelConfig = computed(() => {
    let type: DateType = 'date';
    if (props.modelModifiers.number) type = 'number';
    if (props.modelModifiers.string) type = 'string';
    const mask = masks.value.modelValue || 'iso';
    return normalizeConfig(<DateConfig>{ type, mask });
  });

  const dateParts = computed(() =>
    getDateParts(dragValue.value ?? dateValue.value),
  );

  const inputMask = computed(() => {
    if (isTimeMode.value) {
      return props.is24hr ? masks.value.inputTime24hr : masks.value.inputTime;
    }
    if (isDateTimeMode.value) {
      return props.is24hr
        ? masks.value.inputDateTime24hr
        : masks.value.inputDateTime;
    }
    return masks.value.input;
  });

  const inputMaskHasTime = computed(() => /[Hh]/g.test(inputMask.value));

  const inputMaskHasDate = computed(() =>
    /[dD]{1,2}|Do|W{1,4}|M{1,4}|YY(?:YY)?/g.test(inputMask.value),
  );

  const inputMaskPatch = computed(() => {
    if (inputMaskHasTime.value && inputMaskHasDate.value) {
      return 'dateTime';
    }
    if (inputMaskHasDate.value) return 'date';
    if (inputMaskHasTime.value) return 'time';
    return undefined;
  });

  const popover = computed(() => {
    const target = popoverRef.value?.$el.previousElementSibling ?? undefined;
    return defaultsDeep({}, props.popover, getDefault('datePicker.popover'), {
      target,
    }) as Partial<PopoverOptions>;
  });

  const popoverEvents = computed(() =>
    getPopoverEventHandlers({
      ...popover.value,
      id: datePickerPopoverId.value,
    }),
  );

  const inputValue = computed(() => {
    return isRange.value
      ? {
          start: inputValues.value[0],
          end: inputValues.value[1],
        }
      : inputValues.value[0];
  });

  const inputEvents = computed(() => {
    const events = (['start', 'end'] as const).map(target => ({
      input: onInputInput(target),
      change: onInputChange(target),
      keyup: onInputKeyup,
      ...(props.popover && popoverEvents.value),
    }));
    return isRange.value
      ? {
          start: events[0],
          end: events[1],
        }
      : events[0];
  });

  const selectAttribute = computed(() => {
    if (!hasValue(dateValue.value)) return null;
    const attribute = {
      key: 'select-drag',
      ...props.selectAttribute,
      dates: dateValue.value,
      pinPage: true,
    };
    const { dot, bar, highlight, content } = attribute;
    if (!dot && !bar && !highlight && !content) {
      attribute.highlight = true;
    }
    return attribute;
  });

  const dragAttribute = computed(() => {
    if (!isRange.value || !hasValue(dragValue.value)) {
      return null;
    }
    const attribute = {
      key: 'select-drag',
      ...props.dragAttribute,
      dates: dragValue.value,
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
  });

  const attributes = computed(() => {
    const attrs = isArray(props.attributes) ? [...props.attributes] : [];
    if (dragAttribute.value) {
      attrs.unshift(dragAttribute.value);
    } else if (selectAttribute.value) {
      attrs.unshift(selectAttribute.value);
    }
    return attrs;
  });

  const rules = computed(() => {
    return normalizeConfig(
      props.rules === 'auto' ? getAutoRules() : props.rules ?? {},
    );
  });

  // #endregion Computed

  function getAutoRules() {
    const _rules = {
      ms: [0, 999],
      sec: [0, 59],
      min: [0, 59],
      hr: [0, 23],
    };
    const accuracy = isDateMode.value ? 0 : props.timeAccuracy;
    return [0, 1].map(i => {
      switch (accuracy) {
        case 0:
          return {
            hours: _rules.hr[i],
            minutes: _rules.min[i],
            seconds: _rules.sec[i],
            milliseconds: _rules.ms[i],
          };
        case 1:
          return {
            minutes: _rules.min[i],
            seconds: _rules.sec[i],
            milliseconds: _rules.ms[i],
          };
        case 3:
          return { milliseconds: _rules.ms[i] };
        case 4:
          return {};
        default:
          return { seconds: _rules.sec[i], milliseconds: _rules.ms[i] };
      }
    });
  }

  function normalizeConfig<T>(config: T | T[]): T[] {
    if (isArray(config)) {
      if (config.length === 1) return [config[0], config[0]];
      return config;
    }
    return [config, config];
  }

  function normalizeDateConfig(
    config: Partial<DateConfig> | Partial<DateConfig>[],
  ): DateConfig[] {
    return normalizeConfig(config).map(
      (c, i) =>
        ({
          ...c,
          rules: rules.value[i],
        }) as DateConfig,
    );
  }

  function hasDateValue(
    value: DatePickerDate,
  ): value is Exclude<DatePickerDate, null> {
    if (value == null) return false;
    if (isNumber(value)) return !isNaN(value);
    if (isDate(value)) return !isNaN(value.getTime());
    if (isString(value)) return value !== '';
    return isDateParts(value);
  }

  function hasRangeValue(value: unknown): value is DatePickerRangeObject {
    return (
      isObject(value) &&
      'start' in value &&
      'end' in value &&
      hasDateValue(value.start ?? null) &&
      hasDateValue(value.end ?? null)
    );
  }

  function hasValue(
    value: DatePickerModel,
  ): value is Exclude<DatePickerDate, null> | DatePickerRangeObject {
    return hasRangeValue(value) || hasDateValue(value);
  }

  function valuesAreEqual(
    a: null | Date | SimpleDateRange,
    b: null | Date | SimpleDateRange,
  ): boolean {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    const aIsDate = isDate(a);
    const bIsDate = isDate(b);
    if (aIsDate && bIsDate) return a.getTime() === b.getTime();
    if (aIsDate || bIsDate) return false;
    return valuesAreEqual(a.start, b.start) && valuesAreEqual(a.end, b.end);
  }

  function valueIsDisabled(value: Date | SimpleDateRange | null) {
    if (!hasValue(value) || !disabledAttribute.value) return false;
    return disabledAttribute.value.intersectsRange(locale.value.range(value));
  }

  function normalizeValue(
    value: DatePickerModel,
    config: DateConfig[],
    patch: DatePatch,
    targetPriority?: ValueTarget,
  ): Date | SimpleDateRange | null {
    if (!hasValue(value)) return null;
    if (hasRangeValue(value)) {
      const start = locale.value.toDate(value.start, {
        ...config[0],
        fillDate: valueStart.value ?? undefined,
        patch,
      });
      const end = locale.value.toDate(value.end, {
        ...config[1],
        fillDate: valueEnd.value ?? undefined,
        patch,
      });
      return sortRange({ start, end }, targetPriority);
    }
    return locale.value.toDateOrNull(value, {
      ...config[0],
      fillDate: dateValue.value as Date,
      patch,
    });
  }

  function denormalizeValue(
    value: null | Date | SimpleDateRange,
    config: DateConfig[],
  ) {
    if (hasRangeValue(value)) {
      return {
        start: locale.value.fromDate(value.start, config[0]),
        end: locale.value.fromDate(value.end, config[1]),
      };
    }
    if (isRange.value) {
      return null;
    }
    return locale.value.fromDate(value, config[0]);
  }

  function updateValue(
    value: any,
    opts: Partial<UpdateOptions> = {},
  ): Promise<ReturnType<typeof forceUpdateValue>> {
    clearTimeout(updateTimeout);
    return new Promise(resolve => {
      const { debounce = 0, ...args } = opts;
      if (debounce > 0) {
        updateTimeout = window.setTimeout(() => {
          resolve(forceUpdateValue(value, args));
        }, debounce);
      } else {
        resolve(forceUpdateValue(value, args));
      }
    });
  }

  function forceUpdateValue(
    value: any,
    {
      config = modelConfig.value,
      patch = 'dateTime',
      clearIfEqual = false,
      formatInput: fInput = true,
      hidePopover: hPopover = false,
      dragging = isDragging.value,
      targetPriority,
      moveToValue: mValue = false,
    }: Partial<UpdateOptions> = {},
  ) {
    // 1. Normalization
    const normalizedConfig = normalizeDateConfig(config);
    let normalizedValue = normalizeValue(
      value,
      normalizedConfig,
      patch,
      targetPriority,
    );

    // 2a. Validation against disabled dates
    const isDisabled = valueIsDisabled(normalizedValue);
    if (isDisabled) {
      if (dragging) return null;
      normalizedValue = dateValue.value;
      // Don't allow hiding popover
      hPopover = false;
      // 2b. Validation against is-required or clearIfEqual
    } else if (normalizedValue == null && props.isRequired) {
      // Reset to previous value if it was cleared but is required
      normalizedValue = dateValue.value;
      // 2c. Validation against clearIfEqual
    } else if (
      // Clear value if same value was passed
      normalizedValue != null &&
      valuesAreEqual(dateValue.value, normalizedValue) &&
      clearIfEqual
    ) {
      normalizedValue = null;
    }

    // 3. Assignment
    const valueRef = dragging ? dragValue : dateValue;
    const notify = !valuesAreEqual(valueRef.value, normalizedValue);
    valueRef.value = normalizedValue;
    // Clear drag value if needed
    if (!dragging) dragValue.value = null;
    // Denormalize value using the model config
    const denormalizedValue = denormalizeValue(
      normalizedValue,
      modelConfig.value,
    );

    // 4. Notification
    if (notify) {
      watchValue = false;
      emit(dragging ? 'drag' : 'update:modelValue', denormalizedValue);
      nextTick(() => (watchValue = true));
    }

    // 5. Hide popover if needed
    if (hPopover && !dragging) hidePopover();

    // 6. Format inputs if needed
    if (fInput) formatInput();

    // 7. Move to range target if needed
    if (mValue) {
      nextTick(() => moveToValue(targetPriority ?? 'start'));
    }

    return denormalizedValue;
  }

  function formatInput() {
    nextTick(() => {
      const config = normalizeDateConfig({
        type: 'string',
        mask: inputMask.value,
      });
      const value = denormalizeValue(
        dragValue.value ?? dateValue.value,
        config,
      );
      if (isRange.value) {
        // @ts-ignore
        inputValues.value = [value && value.start, value && value.end];
      } else {
        inputValues.value = [value as string, ''];
      }
    });
  }

  function onInputUpdate(
    inputValue: string,
    target: ValueTarget,
    opts: Partial<UpdateOptions>,
  ) {
    inputValues.value.splice(target === 'start' ? 0 : 1, 1, inputValue);
    const value = isRange.value
      ? {
          start: inputValues.value[0],
          end: inputValues.value[1] || inputValues.value[0],
        }
      : inputValue;
    const config = {
      type: 'string',
      mask: inputMask.value,
    };
    updateValue(value, {
      ...opts,
      config,
      patch: inputMaskPatch.value,
      targetPriority: target,
      moveToValue: true,
    });
  }

  function onInputInput(target: ValueTarget) {
    return (e: InputEvent) => {
      if (!props.updateOnInput) return;
      onInputUpdate((<HTMLInputElement>e.currentTarget).value, target, {
        formatInput: false,
        hidePopover: false,
        debounce: props.inputDebounce,
      });
    };
  }

  function onInputChange(target: ValueTarget) {
    return (e: InputEvent) => {
      onInputUpdate((<HTMLInputElement>e.currentTarget).value, target, {
        formatInput: true,
        hidePopover: false,
      });
    };
  }

  function onInputKeyup(e: KeyboardEvent) {
    // Escape key only
    if (e.key !== 'Escape') return;
    updateValue(dateValue.value, {
      formatInput: true,
      hidePopover: true,
    });
  }

  function getDateParts(value: any): (DateParts | null)[] {
    if (isRange.value) {
      return [
        value && value.start ? locale.value.getDateParts(value.start) : null,
        value && value.end ? locale.value.getDateParts(value.end) : null,
      ];
    }
    return [value ? locale.value.getDateParts(value) : null];
  }

  function cancelDrag() {
    dragValue.value = null;
    formatInput();
  }

  function onPopoverBeforeShow(el: HTMLElement) {
    emit('popover-will-show', el);
  }

  function onPopoverAfterShow(el: HTMLElement) {
    emit('popover-did-show', el);
  }

  function onPopoverBeforeHide(el: HTMLElement) {
    cancelDrag();
    emit('popover-will-hide', el);
  }

  function onPopoverAfterHide(el: HTMLElement) {
    emit('popover-did-hide', el);
  }

  function handleDayClick(day: CalendarDay) {
    const opts: Partial<UpdateOptions> = {
      patch: 'date',
      formatInput: true,
      hidePopover: true,
    };
    if (isRange.value) {
      const dragging = !isDragging.value;
      if (dragging) {
        dragTrackingValue = { start: day.startDate, end: day.endDate };
      } else if (dragTrackingValue != null) {
        dragTrackingValue.end = day.date;
      }
      updateValue(dragTrackingValue, {
        ...opts,
        dragging,
      });
    } else {
      updateValue(day.date, {
        ...opts,
        clearIfEqual: !props.isRequired,
      });
    }
  }

  function onDayClick(day: CalendarDay, event: MouseEvent) {
    handleDayClick(day);
    // Re-emit event
    emit('dayclick', day, event);
  }

  function onDayKeydown(day: CalendarDay, event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
      case 'Enter': {
        handleDayClick(day);
        event.preventDefault();
        break;
      }
      case 'Escape': {
        hidePopover();
      }
    }
    // Re-emit event
    emit('daykeydown', day, event);
  }

  function onDayMouseEnter(day: CalendarDay, event: MouseEvent) {
    if (!isDragging.value || dragTrackingValue == null) return;
    dragTrackingValue.end = day.date;
    updateValue(sortRange(dragTrackingValue), {
      patch: 'date',
      formatInput: true,
    });
  }

  function showPopover(opts: Partial<PopoverOptions> = {}) {
    sp({
      ...popover.value,
      ...opts,
      isInteractive: true,
      id: datePickerPopoverId.value,
    });
  }

  function hidePopover(opts: Partial<PopoverOptions> = {}) {
    hp({
      hideDelay: 10,
      force: true,
      ...popover.value,
      ...opts,
      id: datePickerPopoverId.value,
    });
  }

  function togglePopover(opts: Partial<PopoverOptions>) {
    tp({
      ...popover.value,
      ...opts,
      isInteractive: true,
      id: datePickerPopoverId.value,
    });
  }

  function sortRange(range: SimpleDateRange, priority?: ValueTarget) {
    const { start, end } = range;
    if (start > end) {
      switch (priority) {
        case 'start':
          return { start, end: start };
        case 'end':
          return { start: end, end };
        default:
          return { start: end, end: start };
      }
    }
    return { start, end };
  }

  async function move(target: MoveTarget, opts: Partial<MoveOptions> = {}) {
    if (calendarRef.value == null) return false;
    return calendarRef.value.move(target, opts);
  }

  async function moveBy(pages: number, opts: Partial<MoveOptions> = {}) {
    if (calendarRef.value == null) return false;
    return calendarRef.value.moveBy(pages, opts);
  }

  async function moveToValue(
    target: ValueTarget,
    opts: Partial<MoveOptions> = {},
  ) {
    const dValue = dateValue.value;
    if (calendarRef.value == null || !hasValue(dValue)) return false;
    const start = target !== 'end';
    const position = start ? 1 : -1;
    const date = hasRangeValue(dValue)
      ? start
        ? dValue.start
        : dValue.end
      : dValue;
    const page = getPageAddressForDate(date, 'monthly', locale.value);
    return calendarRef.value.move(page, { position, ...opts });
  }

  // #endregion Methods

  // #region Watch

  watch(
    () => props.isRange,
    val => {
      if (val) {
        console.warn(
          'The `is-range` prop will be deprecated in future releases. Please use the `range` modifier.',
        );
      }
    },
    { immediate: true },
  );

  watch(
    () => isRange.value,
    () => {
      forceUpdateValue(null, { formatInput: true });
    },
  );

  watch(
    () => inputMask.value,
    () => formatInput(),
  );

  watch(
    () => props.modelValue,
    val => {
      if (!watchValue) return;
      forceUpdateValue(val, {
        formatInput: true,
        hidePopover: false,
      });
    },
  );

  watch(
    () => rules.value,
    () => {
      if (isObject(props.rules)) {
        forceUpdateValue(props.modelValue, {
          formatInput: true,
          hidePopover: false,
        });
      }
    },
  );

  watch(
    () => props.timezone,
    () => {
      forceUpdateValue(dateValue.value, { formatInput: true });
    },
  );

  // #endregion Watch

  // #region Lifecycle

  // Set initial date value (no validation applied)
  const config = normalizeConfig(modelConfig.value);
  dateValue.value = normalizeValue(
    props.modelValue ?? null,
    config,
    'dateTime',
  );

  onMounted(() => {
    forceUpdateValue(props.modelValue, {
      formatInput: true,
      hidePopover: false,
    });
  });

  // Created
  // Waiting a tick allows calendar to initialize page
  nextTick(() => (showCalendar.value = true));

  // #endregion Lifecycle

  const context = {
    ...baseCtx,
    showCalendar,
    datePickerPopoverId,
    popoverRef,
    popoverEvents,
    calendarRef,
    isRange,
    isTimeMode,
    isDateTimeMode,
    is24hr: toRef(props, 'is24hr'),
    hideTimeHeader: toRef(props, 'hideTimeHeader'),
    timeAccuracy: toRef(props, 'timeAccuracy'),
    isDragging,
    inputValue,
    inputEvents,
    dateParts,
    attributes,
    rules,
    move,
    moveBy,
    moveToValue,
    updateValue,
    showPopover,
    hidePopover,
    togglePopover,
    onDayClick,
    onDayKeydown,
    onDayMouseEnter,
    onPopoverBeforeShow,
    onPopoverAfterShow,
    onPopoverBeforeHide,
    onPopoverAfterHide,
  };
  provide(contextKey, context);
  return context;
}

export function useDatePicker() {
  const context = inject<DatePickerContext>(contextKey);
  if (context) return context;
  throw new Error(
    'DatePicker context missing. Please verify this component is nested within a valid context provider.',
  );
}
