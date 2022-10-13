import {
  PropType,
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  toRef,
  inject,
  provide,
} from 'vue';
import Calendar from '../components/Calendar.vue';
import Popover from '../components/Popover.vue';
import { getDefault } from '../utils/defaults';
import { CalendarDay } from '../utils/locale';
import { AttributeConfig } from '../utils/attribute';
import { createGuid, pageIsBetweenPages } from '../utils/helpers';
import { isObject, isArray, defaultsDeep } from '../utils/_';
import {
  DatePatch,
  DateParts,
  DatePartsRules,
  datesAreEqual,
} from '../utils/dates';
import {
  PopoverOptions,
  showPopover as sp,
  hidePopover as hp,
  togglePopover as tp,
  getPopoverEventHandlers,
} from '../utils/popovers';
import { BaseProps, propsDef as basePropsDef, createBase } from './base';
import { MoveTarget, MoveOptions } from './calendar';

export type DateType = 'date' | 'string' | 'number';

export interface DateConfig {
  type: DateType;
  mask?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

const contextKey = '__vc_date_picker_context__';

const MODE = {
  DATE: 'date',
  DATE_TIME: 'datetime',
  TIME: 'time',
};

export enum ValueTarget {
  None = 0,
  Start,
  End,
  Both,
}

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

interface ModelModifiers {
  number?: boolean;
  string?: boolean;
  range?: boolean;
}

export type DatePickerContext = ReturnType<typeof createDatePicker>;

export interface DatePickerProps extends BaseProps {
  mode: string;
  modelValue: any;
  modelModifiers: ModelModifiers;
  time?: string;
  rules?: DatePartsRules;
  modelConfig?: any;
  is24hr: boolean;
  hideTimeHeader: boolean;
  timeAccuracy: number;
  isRequired: boolean;
  isRange: boolean;
  updateOnInput: boolean;
  inputDebounce: number;
  popover: boolean | Partial<PopoverOptions>;
  dragAttribute: any;
  selectAttribute: any;
  attributes: AttributeConfig[];
}

export const propsDef = {
  ...basePropsDef,
  mode: { type: String, default: MODE.DATE },
  modelValue: { type: null, required: true },
  modelModifiers: { default: () => ({}) },
  time: String,
  rules: [String as PropType<'auto'>, Object as PropType<DatePartsRules>],
  modelConfig: { type: Object, default: () => ({}) },
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
    type: [Boolean, Object as PropType<Partial<PopoverOptions>>],
    default: true,
  },
  dragAttribute: Object,
  selectAttribute: Object,
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

export function createDatePicker(props: DatePickerProps, ctx: any) {
  const baseCtx = createBase(props);
  const { locale, masks, disabledAttribute } = baseCtx;
  const { emit } = ctx;

  const showCalendar = ref(false);
  const datePickerPopoverId = ref(createGuid());
  const dateValue = ref<null | Date | DateRange>(null);
  const dragValue = ref<null | DateRange>(null);
  const inputValues = ref<string[]>(['', '']);
  const popoverRef = ref<InstanceType<typeof Popover> | null>(null);
  const calendarRef = ref<InstanceType<typeof Calendar> | null>(null);

  let updateTimeout: undefined | number = undefined;
  let dragTrackingValue: null | DateRange;
  let watchValue = true;

  // #region Computed

  const isRange = computed(() => {
    return props.isRange || props.modelModifiers.range === true;
  });

  const valueStart = computed(() =>
    isRange.value && dateValue.value != null
      ? (dateValue.value as DateRange).start
      : null,
  );

  const valueEnd = computed(() =>
    isRange.value && dateValue.value != null
      ? (dateValue.value as DateRange).end
      : null,
  );

  const isDate = computed(() => props.mode.toLowerCase() === MODE.DATE);

  const isDateTime = computed(
    () => props.mode.toLowerCase() === MODE.DATE_TIME,
  );
  const isTime = computed(() => props.mode.toLowerCase() === MODE.TIME);

  const isDragging = computed(() => !!dragValue.value);

  const modelConfig = computed(() => {
    let type: DateType = 'date';
    if (props.modelModifiers.number) type = 'number';
    if (props.modelModifiers.string) type = 'string';
    const mask = masks.value.modelValue || 'iso';
    return normalizeDateConfig({ type, mask });
  });

  const dateParts = computed(() =>
    getDateParts(dragValue.value ?? dateValue.value),
  );

  const inputMask = computed(() => {
    if (isTime.value) {
      return props.is24hr ? masks.value.inputTime24hr : masks.value.inputTime;
    }
    if (isDateTime.value) {
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
      return DatePatch.DateTime;
    }
    if (inputMaskHasDate.value) return DatePatch.Date;
    if (inputMaskHasTime.value) return DatePatch.Time;
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
    const events = [1, 2].map(target => ({
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

  const rules = computed<DatePartsRules[]>(() => {
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
    const accuracy = isDate.value ? 0 : props.timeAccuracy;
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
    config: DateConfig | DateConfig[],
  ): DateConfig[] {
    return normalizeConfig(config).map((c, i) => ({
      rules: rules.value[i],
      ...c,
    }));
  }

  function hasValue(value: any) {
    if (isRange.value) {
      return isObject(value) && value.start != null && value.end != null;
    }
    return value != null;
  }

  function valuesAreEqual(a: any, b: any) {
    if (isRange.value) {
      const aHasValue = hasValue(a);
      const bHasValue = hasValue(b);
      if (!aHasValue && !bHasValue) return true;
      if (aHasValue !== bHasValue) return false;
      return datesAreEqual(a.start, b.start) && datesAreEqual(a.end, b.end);
    }
    return datesAreEqual(a, b);
  }

  function valueIsDisabled(value: any) {
    return (
      hasValue(value) &&
      disabledAttribute.value &&
      disabledAttribute.value.intersectsDate(value)
    );
  }

  function normalizeValue(
    value: any,
    config: DateConfig[],
    patch: DatePatch,
    targetPriority: ValueTarget,
  ): Date | DateRange | null {
    if (!hasValue(value)) return null;
    if (isRange.value) {
      let start = value.start > value.end ? value.end : value.start;
      start = locale.value.normalizeDate(start, {
        ...config[0],
        fillDate: valueStart.value ?? undefined,
        patch,
      });
      let end = value.start > value.end ? value.start : value.end;
      end = locale.value.normalizeDate(end, {
        ...config[1],
        fillDate: valueEnd.value ?? undefined,
        patch,
      });
      return sortRange({ start, end }, targetPriority);
    }
    return locale.value.normalizeDate(value, {
      ...config[0],
      fillDate: dateValue.value as Date,
      patch,
    });
  }

  function denormalizeValue(value: any, config: DateConfig[]) {
    if (isRange.value) {
      if (!hasValue(value)) return null;
      return {
        start: locale.value.denormalizeDate(value.start, config[0]),
        end: locale.value.denormalizeDate(value.end, config[1]),
      };
    }
    return locale.value.denormalizeDate(value, config[0]);
  }

  function updateValue(
    value: any,
    opts: Partial<UpdateOptions> = {},
  ): Promise<Date | DateRange | null> {
    clearTimeout(updateTimeout);
    return new Promise(resolve => {
      const { debounce = 0, ...args } = opts;
      if (debounce > 0) {
        updateTimeout = setTimeout(() => {
          forceUpdateValue(value, args);
          resolve(dateValue.value);
        }, debounce);
      } else {
        forceUpdateValue(value, args);
        resolve(dateValue.value);
      }
    });
  }

  function forceUpdateValue(
    value: any,
    {
      config = modelConfig.value,
      patch = DatePatch.DateTime,
      clearIfEqual = false,
      formatInput: fInput = true,
      hidePopover: hPopover = false,
      dragging = isDragging.value,
      targetPriority = ValueTarget.Both,
      moveToValue: mValue = false,
    }: Partial<UpdateOptions> = {},
  ) {
    // 1. Normalization
    let normalizedConfig = normalizeDateConfig(config);
    let normalizedValue = normalizeValue(
      value,
      normalizedConfig,
      patch,
      targetPriority,
    );

    // Reset to previous value if it was cleared but is required
    if (!normalizedValue && props.isRequired) {
      normalizedValue = dateValue.value;
    }

    // 2. Validation (date or range)
    const isDisabled = valueIsDisabled(normalizedValue);
    if (isDisabled) {
      if (dragging) return;
      normalizedValue = dateValue.value;
      // Don't allow hiding popover
      hPopover = false;
    }

    // 3. Assignment
    const valueRef = dragging ? dragValue : dateValue;
    let valueChanged = !valuesAreEqual(valueRef.value, normalizedValue);

    // Clear value if same value selected and clearIfEqual is set
    if (!isDisabled && !valueChanged && clearIfEqual) {
      normalizedValue = null;
      valueChanged = true;
    }

    // Assign value
    if (valueChanged) {
      valueRef.value = normalizedValue;
      // Clear drag value if needed
      if (!dragging) dragValue.value = null;
      // Denormalization
      const denormalizedValue = denormalizeValue(
        normalizedValue,
        normalizedConfig,
      );
      // Notification
      const event = isDragging.value ? 'drag' : 'update:modelValue';
      watchValue = false;
      emit(event, denormalizedValue);
      nextTick(() => (watchValue = true));
    }

    // 5. Hide popover if needed
    if (hPopover && !dragging) hidePopover();

    // 6. Format inputs if needed
    if (fInput) formatInput();

    // 7. Move to range target if needed
    if (mValue) {
      nextTick(() => moveToValue(targetPriority));
    }
  }

  function formatInput() {
    nextTick(() => {
      const config = normalizeDateConfig({
        type: 'string',
        mask: inputMask.value,
      });
      const value = denormalizeValue(
        dragValue.value || dateValue.value,
        config,
      );
      if (isRange.value) {
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
    inputValues.value.splice(target - 1, 1, inputValue);
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

  function getDateParts(value: any): Partial<DateParts>[] {
    if (isRange.value) {
      return [
        value && value.start ? locale.value.getDateParts(value.start) : {},
        value && value.end ? locale.value.getDateParts(value.end) : {},
      ];
    }
    return [value ? locale.value.getDateParts(value) : {}];
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
      patch: DatePatch.Date,
      formatInput: true,
      hidePopover: true,
    };
    if (isRange.value) {
      const dragging = !isDragging.value;
      if (dragging) {
        dragTrackingValue = { ...day.range };
      } else if (dragTrackingValue != null) {
        dragTrackingValue.end = day.date;
      }
      updateValue(dragTrackingValue, {
        ...opts,
        dragging,
        targetPriority: dragging ? ValueTarget.None : ValueTarget.Both,
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
    updateValue(dragTrackingValue, {
      patch: DatePatch.Date,
      formatInput: true,
      targetPriority: ValueTarget.None,
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

  function sortRange(range: any, priority = ValueTarget.None) {
    const { start, end } = range;
    if (start > end) {
      switch (priority) {
        case ValueTarget.Start:
          return { start, end: start };
        case ValueTarget.End:
          return { start: end, end };
        case ValueTarget.Both:
          return { start: end, end: start };
      }
    }
    return { start, end };
  }

  function getPageForValue(isStart: boolean) {
    if (hasValue(dateValue.value)) {
      const date = isRange.value
        ? isStart
          ? valueStart.value
          : valueEnd.value
        : dateValue.value;
      return locale.value.getPageForDate(date as Date, 'monthly');
    }
    return null;
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
    if (calendarRef.value == null || target === ValueTarget.None) return false;
    const { firstPage, lastPage, move } = calendarRef.value;
    const start = target !== ValueTarget.End;
    const page = getPageForValue(start);
    const position = start ? 1 : -1;
    if (!page || pageIsBetweenPages(page, firstPage, lastPage)) return false;
    return move(page, {
      position,
      ...opts,
    });
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

  onMounted(() => {
    // Handle escape key presses
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
    isTime,
    isDateTime,
    is24hr: toRef(props, 'is24hr'),
    hideTimeHeader: toRef(props, 'hideTimeHeader'),
    timeAccuracy: toRef(props, 'timeAccuracy'),
    isDragging,
    inputValue,
    inputEvents,
    dateParts,
    modelConfig,
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
