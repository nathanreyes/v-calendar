import DatePicker from '@/components/DatePicker/DatePicker.vue';
import { CalendarContext } from '@/use/calendar';
import { DatePickerContext } from '@/use/datePicker';
import { VueWrapper, mount } from '@vue/test-utils';
import { expect } from 'vitest';
import { ComponentPublicInstance, UnwrapNestedRefs, h } from 'vue';

export type CalendarComponent = UnwrapNestedRefs<CalendarContext> &
  ComponentPublicInstance;

export type DatePickerComponent = UnwrapNestedRefs<DatePickerContext> &
  ComponentPublicInstance;

export type PluginComponent = CalendarComponent | DatePickerComponent;

export type ComponentMount = (props?: any) => VueWrapper<PluginComponent>;

export function mountDp(ctx: any) {
  return mount(DatePicker, ctx) as unknown as VueWrapper<DatePickerComponent>;
}

export function getDayClass(vm: PluginComponent, date: Date) {
  return `.id-${vm.locale.getDayId(date)}`;
}

export function getDayContentClass(vm: PluginComponent, date: Date) {
  return `${getDayClass(vm, date)} .vc-day-content`;
}

export function expectValueEmitted(
  dp: VueWrapper<DatePickerComponent>,
  value: any,
) {
  expect(dp.emitted('update:modelValue')).toHaveLength(1);
  expect(dp.emitted('update:modelValue')![0][0]).toEqual(value);
  dp.emitted('update:modelValue')!.pop();
}

export function expectNoValueEmitted(dp: VueWrapper<DatePickerComponent>) {
  expect(dp.emitted('update:modelValue')).toBeUndefined();
}

export function renderFnEvents(evts: Record<string, Function>) {
  const result: Record<string, Function> = {};
  Object.entries(evts).forEach(([evtName, evtFunction]) => {
    result[`on${evtName.charAt(0).toUpperCase() + evtName.slice(1)}`] =
      evtFunction;
  });
  return result;
}

export function mountWithInputs(ctx: any) {
  return mountDp({
    ...ctx,
    slots: {
      default: function (sProps: any) {
        return h('input', {
          props: {
            modelValue: sProps.inputValue,
          },
          ...renderFnEvents(sProps.inputEvents),
        });
      },
    },
  });
}

export function mountWithRangeInputs(ctx: any) {
  return mountDp({
    props: {
      ...ctx.props,
      modelModifiers: {
        range: true,
      },
    },
    slots: {
      default: function (sProps: any) {
        return h('div', [
          h('input', {
            props: {
              modelValue: sProps.inputValue.start,
            },
            ...renderFnEvents(sProps.inputEvents.start),
          }),
          h('input', {
            props: {
              modelValue: sProps.inputValue.end,
            },
            ...renderFnEvents(sProps.inputEvents.end),
          }),
        ]);
      },
    },
  });
}

export async function updateInputs(
  dp: VueWrapper<DatePickerComponent>,
  startValue: string,
  endValue?: string,
) {
  const inputs = dp.findAll('input');
  if (startValue != null) {
    await inputs[0].setValue(startValue);
    await inputs[0].trigger('change');
  }
  if (endValue != null) {
    await inputs[1].setValue(endValue);
    await inputs[1].trigger('change');
  }
  return endValue == null
    ? dp.emitted('update:modelValue')![0][0]
    : dp.emitted('update:modelValue')![1][0];
}
