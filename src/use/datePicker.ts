import {
  PropType,
  Ref,
  ComputedRef,
  ToRefs,
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  toRef,
  toRefs,
  inject,
  provide,
} from 'vue';
import { getDefault } from '../utils/defaults';
import { CalendarDay } from '../utils/locale';
import { AttributeConfig } from '../utils/attribute';
import {
  createGuid,
  elementContains,
  pageIsBetweenPages,
  on,
  off,
} from '../utils/helpers';
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
import {
  BaseContext,
  BaseProps,
  propsDef as basePropsDef,
  createBase,
} from './base';
import { CalendarContext, MoveTarget, MoveOptions } from './calendar';

type DateType = 'date' | 'string' | 'number';

interface DateConfig {
  type: DateType;
  mask?: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

const contextKey = '__vc_date_picker_context__';

const MODE = {
  DATE: 'date',
  DATE_TIME: 'datetime',
  TIME: 'time',
};

export enum RangePriority {
  None = 0,
  Start,
  End,
  Both,
}

export enum ValueTarget {
  None = 0,
  Start,
  End,
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
  popover: { type: Object, default: () => ({}) },
  dragAttribute: Object,
  selectAttribute: Object,
  attributes: [Object, Array],
};

interface ModelModifiers {
  number?: boolean;
  string?: boolean;
  range?: boolean;
}

interface DatePickerProps extends BaseProps {
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
  popover: any;
  dragAttribute: any;
  selectAttribute: any;
  attributes: AttributeConfig[];
}

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

type DateRangeValue = { start: Date; end: Date };

interface DatePickerLocalState {
  showCalendar: boolean;
  value: null | Date | DateRangeValue;
  dragValue: null | DateRangeValue;
  dragTrackingValue: null | DateRangeValue;
  inputValues: string[];
  updateTimeout: undefined | number;
  watchValue: boolean;
  datePickerPopoverId: string;
}

export interface UpdateOptions {
  config: any;
  patch: DatePatch;
  debounce: number;
  clearIfEqual: boolean;
  formatInput: boolean;
  hidePopover: boolean;
  dragging: boolean;
  rangePriority: RangePriority;
  moveToValue: ValueTarget;
}

export function createDatePicker(props: DatePickerProps, ctx: any) {
  const { emit } = ctx;
  const state = reactive<DatePickerLocalState>({
    showCalendar: false,
    value: null,
    dragValue: null,
    dragTrackingValue: null,
    inputValues: ['', ''],
    updateTimeout: undefined,
    watchValue: true,
    datePickerPopoverId: createGuid(),
  });
  const elOrComp = ref<HTMLElement | CalendarContext | null>(null);
  const baseCtx = createBase(props, ctx);
  const { locale, masks, disabledAttribute } = baseCtx;

  // #region Computed

  const isRange = computed(() => {
    return props.isRange || props.modelModifiers.range === true;
  });

  const valueStart = computed(() =>
    isRange.value && state.value != null
      ? (state.value as DateRangeValue).start
      : null,
  );

  const valueEnd = computed(() =>
    isRange.value && state.value != null
      ? (state.value as DateRangeValue).end
      : null,
  );

  const isDate = computed(() => props.mode.toLowerCase() === MODE.DATE);

  const isDateTime = computed(
    () => props.mode.toLowerCase() === MODE.DATE_TIME,
  );
  const isTime = computed(() => props.mode.toLowerCase() === MODE.TIME);

  const isDragging = computed(() => !!state.dragValue);

  const modelConfig = computed(() => {
    let type: DateType = 'date';
    if (props.modelModifiers.number) type = 'number';
    if (props.modelModifiers.string) type = 'string';
    const mask = masks.value.modelValue || 'iso';
    return normalizeDateConfig({ type, mask });
  });

  const dateParts = computed(() =>
    getDateParts(state.dragValue ?? state.value),
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

  const popover = computed(() =>
    defaultsDeep(props.popover, getDefault('datePicker.popover')),
  );

  const slotArgs = computed(() => {
    const inputValue = isRange.value
      ? {
          start: state.inputValues[0],
          end: state.inputValues[1],
        }
      : state.inputValues[0];
    const events = [true, false].map(isStart => ({
      input: onInputInput(isStart),
      change: onInputChange(isStart),
      keyup: onInputKeyup,
      ...getPopoverEventHandlers({
        ...popover.value,
        id: state.datePickerPopoverId,
      }),
    }));
    const inputEvents = isRange.value
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
      getPopoverEventHandlers,
    };
  });

  const selectAttribute = computed(() => {
    if (!hasValue(state.value)) return null;
    const attribute = {
      key: 'select-drag',
      ...props.selectAttribute,
      dates: state.value,
      pinPage: true,
    };
    const { dot, bar, highlight, content } = attribute;
    if (!dot && !bar && !highlight && !content) {
      attribute.highlight = true;
    }
    return attribute;
  });

  const dragAttribute = computed(() => {
    if (!isRange.value || !hasValue(state.dragValue)) {
      return null;
    }
    const attribute = {
      key: 'select-drag',
      ...props.dragAttribute,
      dates: state.dragValue,
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
    rangePriority: RangePriority,
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
      return sortRange({ start, end }, rangePriority);
    }
    return locale.value.normalizeDate(value, {
      ...config[0],
      fillDate: state.value,
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

  function updateValue(value: any, opts: Partial<UpdateOptions> = {}) {
    clearTimeout(state.updateTimeout);
    return new Promise(resolve => {
      const { debounce = 0, ...args } = opts;
      if (debounce > 0) {
        state.updateTimeout = setTimeout(() => {
          forceUpdateValue(value, args);
          resolve(state.value);
        }, debounce);
      } else {
        forceUpdateValue(value, args);
        resolve(state.value);
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
      rangePriority = RangePriority.Both,
      moveToValue: mValue = ValueTarget.None,
    }: Partial<UpdateOptions> = {},
  ) {
    // 1. Normalization
    let normalizedConfig = normalizeDateConfig(config);
    let normalizedValue = normalizeValue(
      value,
      normalizedConfig,
      patch,
      rangePriority,
    );

    // Reset to previous value if it was cleared but is required
    if (!normalizedValue && props.isRequired) {
      normalizedValue = state.value;
    }

    // 2. Validation (date or range)
    const isDisabled = valueIsDisabled(normalizedValue);
    if (isDisabled) {
      if (dragging) return;
      normalizedValue = state.value;
      // Don't allow hiding popover
      hPopover = false;
    }

    // 3. Assignment
    const valueKey = dragging ? 'dragValue' : 'value';
    let valueChanged = !valuesAreEqual(state[valueKey], normalizedValue);

    // Clear value if same value selected and clearIfEqual is set
    if (!isDisabled && !valueChanged && clearIfEqual) {
      normalizedValue = null;
      valueChanged = true;
    }

    // Assign value
    if (valueChanged) {
      state[valueKey] = normalizedValue;
      // Clear drag value if needed
      if (!dragging) state.dragValue = null;
      // Denormalization
      const denormalizedValue = denormalizeValue(
        normalizedValue,
        normalizedConfig,
      );
      // Notification
      const event = isDragging.value ? 'drag' : 'update:modelValue';
      state.watchValue = false;
      emit(event, denormalizedValue);
      nextTick(() => (state.watchValue = true));
    }

    // 5. Hide popover if needed
    if (hPopover) hidePopover();

    // 6. Format inputs if needed
    if (fInput) formatInput();

    // 7. Move to range target if needed
    if (mValue !== ValueTarget.None) {
      nextTick(() => moveToValue(mValue));
    }
  }

  function formatInput() {
    nextTick(() => {
      const config = normalizeDateConfig({
        type: 'string',
        mask: inputMask.value,
      });
      const value = denormalizeValue(state.dragValue || state.value, config);
      if (isRange.value) {
        state.inputValues = [value && value.start, value && value.end];
      } else {
        state.inputValues = [value, ''];
      }
    });
  }

  function onInputUpdate(
    inputValue: string,
    isStart: boolean,
    opts: Partial<UpdateOptions>,
  ) {
    state.inputValues.splice(isStart ? 0 : 1, 1, inputValue);
    const value = isRange.value
      ? {
          start: state.inputValues[0],
          end: state.inputValues[1] || state.inputValues[0],
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
      rangePriority: isStart ? RangePriority.Start : RangePriority.End,
      moveToValue: isStart ? ValueTarget.Start : ValueTarget.End,
    });
  }

  function onInputInput(isStart: boolean) {
    return (e: InputEvent) => {
      if (!props.updateOnInput) return;
      onInputUpdate((<HTMLInputElement>e.currentTarget).value, isStart, {
        formatInput: false,
        hidePopover: false,
        debounce: props.inputDebounce,
      });
    };
  }

  function onInputChange(isStart: boolean) {
    return (e: InputEvent) => {
      onInputUpdate((<HTMLInputElement>e.currentTarget).value, isStart, {
        formatInput: true,
        hidePopover: false,
      });
    };
  }

  function onInputShow(isStart: boolean) {
    moveToValue(isStart ? ValueTarget.Start : ValueTarget.End);
  }

  function onInputKeyup(e: KeyboardEvent) {
    // Escape key only
    if (e.key !== 'Escape') return;
    updateValue(state.value, {
      formatInput: true,
      hidePopover: true,
    });
  }

  function getDateParts(value: any): (object | DateParts)[] {
    if (isRange.value) {
      return [
        value && value.start ? locale.value.getDateParts(value.start) : {},
        value && value.end ? locale.value.getDateParts(value.end) : {},
      ];
    }
    return [value ? locale.value.getDateParts(value) : {}];
  }

  function onDocumentKeyDown(e: KeyboardEvent) {
    // Clear drag on escape keydown
    if (state.dragValue && e.key === 'Escape') {
      state.dragValue = null;
    }
  }

  function onDocumentClick(e: MouseEvent) {
    // TODO: Fix this!!
    // const el = this.$refs.calendar?.$refs.containerRef;
    // if (
    //   document.body.contains(e.target as Node) &&
    //   !elementContains(el, e.target as Node)
    // ) {
    //   state.dragValue = null;
    //   formatInput();
    // }
  }

  function handleDayClick(day: CalendarDay) {
    const { keepVisibleOnInput, visibility } = popover.value;
    const opts: Partial<UpdateOptions> = {
      patch: DatePatch.Date,
      formatInput: true,
      hidePopover:
        isDate.value && !keepVisibleOnInput && visibility !== 'visible',
    };
    if (isRange.value) {
      const dragging = !isDragging.value;
      if (dragging) {
        state.dragTrackingValue = { ...day.range };
      } else if (state.dragTrackingValue != null) {
        state.dragTrackingValue.end = day.date;
      }
      updateValue(state.dragTrackingValue, {
        ...opts,
        dragging,
        rangePriority: dragging ? RangePriority.None : RangePriority.Both,
        hidePopover: opts.hidePopover && !dragging,
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
    if (!isDragging.value || state.dragTrackingValue == null) return;
    state.dragTrackingValue.end = day.date;
    updateValue(state.dragTrackingValue, {
      patch: DatePatch.Date,
      formatInput: true,
      rangePriority: RangePriority.None,
    });
  }

  function showPopover(opts: Partial<PopoverOptions> = {}) {
    sp({
      ref: elOrComp.value,
      ...popover.value,
      ...opts,
      isInteractive: true,
      id: state.datePickerPopoverId,
    });
  }

  function hidePopover(opts: Partial<PopoverOptions> = {}) {
    hp({
      hideDelay: 10,
      ...popover.value,
      ...opts,
      id: state.datePickerPopoverId,
    });
  }

  function togglePopover(opts: Partial<PopoverOptions>) {
    tp({
      ref: elOrComp.value,
      ...popover.value,
      ...opts,
      isInteractive: true,
      id: state.datePickerPopoverId,
    });
  }

  function sortRange(range: any, priority = RangePriority.None) {
    const { start, end } = range;
    if (start > end) {
      switch (priority) {
        case RangePriority.Start:
          return { start, end: start };
        case RangePriority.End:
          return { start: end, end };
        case RangePriority.Both:
          return { start: end, end: start };
      }
    }
    return { start, end };
  }

  function getPageForValue(isStart: boolean) {
    if (hasValue(state.value)) {
      const date = isRange.value
        ? isStart
          ? valueStart.value
          : valueEnd.value
        : state.value;
      return locale.value.getPageForDate(date as Date);
    }
    return null;
  }

  const calendarRef = computed(() => {
    if (elOrComp.value == null || elOrComp.value instanceof HTMLElement)
      return null;
    return elOrComp.value as CalendarContext;
  });

  async function move(target: MoveTarget, opts: Partial<MoveOptions> = {}) {
    if (calendarRef.value == null) return false;
    return calendarRef.value.move(target, opts);
  }

  async function moveToValue(
    target: ValueTarget,
    opts: Partial<MoveOptions> = {},
  ) {
    if (calendarRef.value == null || target === ValueTarget.None) return false;
    const { firstPage, lastPage, move } = calendarRef.value;
    const start = target === ValueTarget.Start;
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
      if (!state.watchValue) return;
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
      forceUpdateValue(state.value, { formatInput: true });
    },
  );

  // #endregion Watch

  // #region Lifecycle

  onMounted(() => {
    // Handle escape key presses
    on(document, 'keydown', onDocumentKeyDown);
    // Clear drag on background click
    on(document, 'click', onDocumentClick);

    forceUpdateValue(props.modelValue, {
      formatInput: true,
      hidePopover: false,
    });
  });

  onBeforeUnmount(() => {
    // Clean up handlers
    off(document, 'keydown', onDocumentKeyDown);
    off(document, 'click', onDocumentClick);
  });

  // Created
  // Waiting a tick allows calendar to initialize page
  nextTick(() => (state.showCalendar = true));

  // #endregion Lifecycle

  const context = {
    ...baseCtx,
    ...toRefs(state),
    elOrComp,
    calendarRef,
    isRange: toRef(props, 'isRange'),
    isTime,
    isDateTime,
    is24hr: toRef(props, 'is24hr'),
    hideTimeHeader: toRef(props, 'hideTimeHeader'),
    timeAccuracy: toRef(props, 'timeAccuracy'),
    isDragging,
    slotArgs,
    dateParts,
    modelConfig,
    attributes,
    rules,
    move,
    updateValue,
    onDayClick,
    onDayKeydown,
    onDayMouseEnter,
  };
  provide(contextKey, context);
  return context;
}

export interface DatePickerContext
  extends ToRefs<DatePickerLocalState>,
    ToRefs<BaseContext> {
  elOrComp: Ref<null | HTMLElement | CalendarContext>;
  isRange: Ref<boolean>;
  isTime: ComputedRef<boolean>;
  isDateTime: ComputedRef<boolean>;
  is24hr: Ref<boolean>;
  hideTimeHeader: Ref<boolean>;
  timeAccuracy: Ref<number>;
  isDragging: ComputedRef<boolean>;
  slotArgs: any;
  dateParts: ComputedRef<(object | DateParts)[]>;
  modelConfig: ComputedRef<any>;
  attributes: ComputedRef<AttributeConfig[]>;
  move: (target: MoveTarget, opts: Partial<MoveOptions>) => Promise<boolean>;
  moveToValue: (
    target: ValueTarget,
    opts: Partial<MoveOptions>,
  ) => Promise<boolean>;
  updateValue: (value: any, opts: Partial<UpdateOptions>) => Promise<void>;
  onDayClick: (day: CalendarDay, event: MouseEvent) => void;
  onDayKeydown: (day: CalendarDay, event: KeyboardEvent) => void;
  onDayMouseEnter: (day: CalendarDay, event: MouseEvent) => void;
}

export function useDatePicker() {
  let context = inject<DatePickerContext>(contextKey);
  if (context) return context;
  throw new Error(
    'DatePicker context missing. Please verify this component is nested within a valid context provider.',
  );
}
