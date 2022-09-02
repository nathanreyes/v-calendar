import { ComputedRef, ref, computed } from 'vue';
import { PopoverOptions, getPopoverEventHandlers } from '../../utils/popovers';
import {
  DatePickerContext,
  ValueTarget,
  UpdateOptions,
  DateRange,
} from '../datePicker';

export interface DatePickerSlotProps {
  isDragging: ComputedRef<boolean>;
  updateValue: (
    value: any,
    opts?: Partial<UpdateOptions>,
  ) => Promise<Date | DateRange | null>;
  showPopover: (opts?: Partial<PopoverOptions>) => void;
  hidePopover: (opts?: Partial<PopoverOptions>) => void;
  togglePopover: (opts: Partial<PopoverOptions>) => void;
}

export function useDatePickerInput(ctx: DatePickerContext) {
  const {
    isRange,
    isDragging,
    updateValue,
    popover,
    showPopover,
    hidePopover,
    togglePopover,
  } = ctx;
  const inputValues = ref(['', '']);

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
    updateValue(state.value, {
      formatInput: true,
      hidePopover: true,
    });
  }

  const slotArgs = computed<DatePickerSlotProps>(() => {
    const inputValue = isRange.value
      ? {
          start: inputValues.value[0],
          end: inputValues.value[1],
        }
      : inputValues.value[0];
    const events = [1, 2].map(target => ({
      input: onInputInput(target),
      change: onInputChange(target),
      keyup: onInputKeyup,
      ...getPopoverEventHandlers({
        ...popover.value,
        id: datePickerPopoverId,
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

  return {
    onInputInput,
    onInputChange,
    onInputKeyup,
    slotArgs,
  };
}
