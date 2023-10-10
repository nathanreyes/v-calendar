import TimePicker from '@/components/DatePicker/TimePicker.vue';
import { describe, expect, it } from 'vitest';
import { testNavigationMethods, testNavigationProps } from './navigation';
import { testCalendarSlots, testDatePickerSlots } from './slots';
import {
  expectNoValueEmitted,
  expectValueEmitted,
  getDayContentClass,
  mountDp,
  mountWithInputs,
  mountWithRangeInputs,
  updateInputs,
} from './utils';

describe('DatePicker', () => {
  describe(':props', async () => {
    testNavigationProps((ctx: any) => mountDp(ctx));

    it(':value - does not emit update:modelValue on initial load', () => {
      const dp = mountDp({ props: { modelValue: new Date() } });
      expect(dp.emitted('update:modelValue')).toBeUndefined();
    });

    it(':value - updates model value on day click', async () => {
      const date = new Date(2023, 0, 15);
      const initialPage = { year: 2023, month: 1 };
      const dp = mountDp({ props: { modelValue: null, initialPage } });
      const day = dp.get(getDayContentClass(dp.vm, date));
      await day.trigger('click');
      expectValueEmitted(dp, date);
    });

    it(':value - updates model value on time select', async () => {
      const date = new Date(2023, 0, 15);
      const newDate = new Date(date);
      const dp = mountDp({
        props: {
          modelValue: date,
          mode: 'dateTime',
          timeAccuracy: 4,
        },
      });
      // Update hours
      await dp.get('.vc-time-select-hours').setValue('5');
      newDate.setHours(5);
      expectValueEmitted(dp, newDate);
      // Update minutes
      await dp.get('.vc-time-select-minutes').setValue('30');
      newDate.setMinutes(30);
      expectValueEmitted(dp, newDate);
      // Update seconds
      await dp.get('.vc-time-select-seconds').setValue('15');
      newDate.setSeconds(15);
      expectValueEmitted(dp, newDate);
      // Update milliseconds
      await dp.get('.vc-time-select-milliseconds').setValue('300');
      newDate.setMilliseconds(300);
      expectValueEmitted(dp, newDate);
    });

    it(':model-modifiers - emits correct updated value with number model modifier', async () => {
      const initialDate = new Date(2000, 0, 15);
      const clickDate = new Date(2000, 0, 20);
      const dp = mountDp({
        props: {
          modelValue: initialDate.getTime(),
          modelModifiers: {
            number: true,
          },
        },
      });
      const day = dp.get(getDayContentClass(dp.vm, clickDate));
      await day.trigger('click');
      expectValueEmitted(dp, clickDate.getTime());
    });

    it(':model-modifiers - emits correct updated ISO value with string model modifier', async () => {
      const initialDate = new Date(2000, 0, 15);
      const clickDate = new Date(2000, 0, 20);
      const dp = mountDp({
        props: {
          modelValue: initialDate.toISOString(),
          modelModifiers: {
            string: true,
          },
        },
      });
      const day = dp.get(getDayContentClass(dp.vm, clickDate));
      await day.trigger('click');
      expectValueEmitted(dp, clickDate.toISOString());
    });

    it(':model-modifiers - emits correct masked value with string model modifier', async () => {
      const initialPage = { year: 2000, month: 1 };
      const clickDate = new Date(2000, 0, 20);
      const mask = 'YYYY-MM-DD';
      const dp = mountDp({
        props: {
          modelValue: null,
          modelModifiers: {
            string: true,
          },
          masks: {
            modelValue: mask,
          },
          initialPage,
        },
      });
      const day = dp.get(getDayContentClass(dp.vm, clickDate));
      await day.trigger('click');
      expectValueEmitted(dp, '2000-01-20');
    });

    it(':is-range - clears value when change from false to true', async () => {
      const dp = mountDp({
        props: {
          modelValue: new Date(2000, 0, 15),
          modelModifiers: {
            range: false,
          },
        },
      });
      await dp.setProps({
        modelModifiers: {
          range: true,
        },
      });
      expectValueEmitted(dp, null);
    });

    it(':is-range - clears value when change from true to false', async () => {
      const dp = mountDp({
        props: {
          modelValue: {
            start: new Date(2000, 0, 12),
            end: new Date(2000, 0, 16),
          },
          modelModifiers: {
            range: true,
          },
        },
      });
      await dp.setProps({
        modelModifiers: {
          range: false,
        },
      });
      expectValueEmitted(dp, null);
    });

    it(':is-required - clears value if set to false and new value equal to previous value', async () => {
      const date = new Date(2023, 0, 15);
      const dp = mountDp({ props: { modelValue: date } });
      const day = dp.get(getDayContentClass(dp.vm, date));
      await day.trigger('click');
      expectValueEmitted(dp, null);
    });

    it(':is-required - keeps value if set to true and new value equal to previous value', async () => {
      const date = new Date(2023, 0, 15);
      const dp = mountDp({ props: { modelValue: date, isRequired: true } });
      const day = dp.get(getDayContentClass(dp.vm, date));
      await day.trigger('click');
      expectNoValueEmitted(dp);
    });

    it(':disabled-dates - prevents selection of single dates', async () => {
      const dp = mountDp({
        props: {
          modelValue: new Date(2023, 0, 1),
          disabledDates: [{ repeat: { weekdays: [4, 5] } }],
        },
      });
      const day = dp.get(getDayContentClass(dp.vm, new Date(2023, 0, 11)));
      await day.trigger('click');
      expectNoValueEmitted(dp);
    });

    it(':rules - emits update:modelValue on initial load if rule modifies value', () => {
      const date = new Date(2023, 0, 15, 0, 0, 0, 0);
      const rulesDate = new Date(2023, 0, 15, 12, 0, 0, 0);
      const rules = { hours: 12 };
      const dp = mountDp({ props: { modelValue: date, rules } });
      expectValueEmitted(dp, rulesDate);
    });

    it(':rules - applies number rule on date selection', async () => {
      const initialPage = { year: 2000, month: 1 };
      const clickDate = new Date(2000, 0, 20);
      const rulesDate = new Date(2000, 0, 20, 9, 0, 0, 0);
      const dp = mountDp({
        props: {
          modelValue: null,
          rules: { hours: 9 },
          initialPage,
        },
      });
      const day = dp.get(getDayContentClass(dp.vm, clickDate));
      await day.trigger('click');
      expectValueEmitted(dp, rulesDate);
    });

    it(':rules - limits time components to static number', () => {
      const rules = { hours: 5 };
      expectHours({ rules }, [5]);
    });

    it(':rules - limits time components to array', () => {
      const hours = [0, 3, 5, 8, 10, 11, 15, 19, 23];
      const rules = { hours };
      expectHours({ rules }, hours);
    });

    it(':rules - limits time components to min/max', () => {
      const rules = { hours: { min: 4, max: 15 } };
      const hours = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      expectHours({ rules }, hours);
    });

    it(':rules - limits time components to min/interval', () => {
      const rules = { hours: { min: 4, interval: 2 } };
      const hours = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
      expectHours({ rules }, hours);
    });

    it(':rules - limits time components to interval/max', () => {
      const rules = { hours: { interval: 2, max: 16 } };
      const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16];
      expectHours({ rules }, hours);
    });

    it(':rules - limits time components to hours in work week function', () => {
      const modelValue = new Date(2023, 0, 26);
      const rules = {
        hours: (hour: number, { weekday }: { weekday: number }) => {
          return ![1, 7].includes(weekday) && hour >= 8 && hour < 12;
        },
      };
      const hours = [8, 9, 10, 11];
      expectHours({ modelValue, rules }, hours);
    });

    function expectHours(props: any, hours: number[]) {
      const dp = mountDp({
        props: {
          modelValue: new Date(),
          mode: 'dateTime',
          is24hr: true,
          ...props,
        },
      });
      const tp = dp.getComponent(TimePicker);
      const { hourOptions } = tp.vm;
      expect(hourOptions).toHaveLength(hours.length);
      // Check select options
      const selector = dp.find<HTMLSelectElement>('.vc-base-select select');
      const options = selector.element.options;
      expect(options.length).toEqual(hours.length);
      hours.forEach((hour, i) => {
        expect(options[i].value).toEqual(hour.toString());
      });
    }

    it(':min-date - prevents date before minimum date', async () => {
      const dp = mountDp({
        props: {
          modelValue: new Date(2000, 0, 15),
          minDate: new Date(2000, 0, 5),
        },
      });
      // Day before min date is disabled
      expect(dp.find('.id-2000-01-04 .vc-disabled').exists()).toEqual(true);
      // Click day before min date
      await dp.find('.id-2000-01-04 .vc-day-content').trigger('click');
      // Highlight should NOT appear
      expect(dp.find('.id-2000-01-04 .vc-highlight').exists()).toEqual(false);
    });

    it(':min-date - allows date on minimum date', async () => {
      const dp = mountDp({
        props: {
          modelValue: new Date(2000, 0, 15),
          minDate: new Date(2000, 0, 5),
        },
      });
      // Day of min date is not disabled
      expect(dp.find('.id-2000-01-05 .vc-disabled').exists()).toEqual(false);
      // Click day of min date
      await dp.find('.id-2000-01-05 .vc-day-content').trigger('click');
      // Highlight should appear
      expect(dp.find('.id-2000-01-05 .vc-highlight').exists()).toEqual(true);
    });

    it(':max-date - prevents date after maximum date', async () => {
      const dp = mountDp({
        props: {
          modelValue: new Date(2000, 0, 15),
          maxDate: new Date(2000, 0, 25),
        },
      });
      // Day after max date is disabled
      expect(dp.find('.id-2000-01-26 .vc-disabled').exists()).toEqual(true);
      // Click day after max date
      await dp.find('.id-2000-01-26 .vc-day-content').trigger('click');
      // Highlight should NOT appear
      expect(dp.find('.id-2000-01-26 .vc-highlight').exists()).toEqual(false);
    });

    it(':max-date - allows date on maximum date', async () => {
      const dp = mountDp({
        props: {
          modelValue: new Date(2000, 0, 15),
          maxDate: new Date(2000, 0, 25),
        },
      });
      // Day of max date is not disabled
      expect(dp.find('.id-2000-01-25 .vc-disabled').exists()).toEqual(false);
      // Click day of max date
      await dp.find('.id-2000-01-25 .vc-day-content').trigger('click');
      // Highlight should appear
      expect(dp.find('.id-2000-01-25 .vc-highlight').exists()).toEqual(true);
    });
  });

  describe(':withInputs', async () => {
    it(':sets value when input text is set in YYYY-MM-DD format', async () => {
      const dp = mountWithInputs({
        props: {
          modelValue: null,
        },
      });
      expect(await updateInputs(dp, '2023-01-01')).toEqual(
        new Date(2023, 0, 1),
      );
    });

    it(':sets values when input text is set in custom format', async () => {
      const dp = mountWithInputs({
        props: {
          modelValue: null,
          masks: {
            input: 'MM/DD/YYYY',
          },
        },
      });
      expect(await updateInputs(dp, '1/21/1983')).toEqual(
        new Date(1983, 0, 21),
      );
    });

    it(':resets value to null when input is cleared', async () => {
      const dp = mountWithInputs({
        props: {
          modelValue: new Date(),
        },
      });
      expect(await updateInputs(dp, '')).toEqual(null);
    });
  });

  describe(':withRangeInputs', async () => {
    it(':sets range value when input text is set in YYYY-MM-DD format', async () => {
      const dp = mountWithRangeInputs({
        props: {
          modelValue: null,
        },
      });
      expect(await updateInputs(dp, '2023-01-01', '2023-01-05')).toEqual({
        start: new Date(2023, 0, 1),
        end: new Date(2023, 0, 5),
      });
    });
  });

  describe(':withRangeInputs', async () => {
    it(':sets range value when input text is set in custom format', async () => {
      const dp = mountWithRangeInputs({
        props: {
          modelValue: null,
          masks: {
            input: 'MM/DD/YYYY',
          },
        },
      });
      expect(await updateInputs(dp, '1/21/1983', '10/1/2004')).toEqual({
        start: new Date(1983, 0, 21),
        end: new Date(2004, 9, 1),
      });
    });
  });

  describe(':methods', () => {
    testNavigationMethods(ctx => mountDp(ctx));
  });

  describe(':slots', () => {
    testCalendarSlots(ctx => mountDp(ctx));
    testDatePickerSlots(ctx => mountDp(ctx));
  });

  // it(':model-config.fillDate - fills missing date parts for date input', async () => {
  //   const dp = mountWithInputs({
  //     modelValue: null,
  //     mode: 'time',
  //     modelConfig: {
  //       type: 'string',
  //       fillDate: new Date(2021, 0, 1),
  //     },
  //   });
  //   await updateInputs(dp, '12:15 PM');
  //   expect(dp.vm.value_.toISOString()).toEqual('2021-01-01T12:15:00.000Z');
  // });

  // it(':model-config.fillDate - fills missing date parts for date range inputs', async () => {
  //   const dp = mountWithInputs({
  //     modelValue: null,
  //     mode: 'time',
  //     isRange: true,
  //     modelConfig: {
  //       type: 'string',
  //       fillDate: new Date(2021, 0, 1),
  //     },
  //   });
  //   await updateInputs(dp, '12:15 PM', '12:15 PM');
  //   expect(dp.vm.value_).toEqual({
  //     start: new Date('2021-01-01T12:15:00.000Z'),
  //     end: new Date('2021-01-01T12:15:00.000Z'),
  //   });
  // });
});
