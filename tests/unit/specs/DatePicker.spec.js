import { mount } from '@vue/test-utils';
import DatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import dateValues from '../util/dateValues.json';

describe('DatePicker', () => {
  describe(':props', () => {
    it(':value - renders a date value', async () => {
      const wrapper = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
        },
      });
      expect(wrapper.find('.id-2000-01-15').exists()).toBe(true);
    });

    it(':value - sets the right dates and times', async () => {
      for (const dv of dateValues) {
        const dp = mount(DatePicker, {
          propsData: dv.props,
        });
        await dp.vm.$nextTick();
        if (dv.props.mode !== 'date') {
          const tp = dp.findComponent(TimePicker).vm;
          const { hours, minutes, isAM } = dv.time;
          expect(tp.hours).toEqual(hours);
          expect(tp.minutes).toEqual(minutes);
          expect(tp.isAM).toEqual(isAM);
        }
        if (dv.clickEl) {
          await dp.find(dv.clickEl).trigger('click');
          expect(dp.emitted().input[0][0]).toEqual(dv.newValue);
        }
      }
    });

    it(':min-date - prevents date before minimum date', async () => {
      const dp = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          minDate: new Date(2000, 0, 5),
        },
      });
      await dp.vm.$nextTick();
      // Day before min date is disabled
      expect(dp.find('.id-2000-01-04 .is-disabled').exists()).toBe(true);
      // Click day before min date
      await dp.find('.id-2000-01-04 .vc-day-content').trigger('click');
      // Highlight should NOT appear
      expect(dp.find('.id-2000-01-04 .vc-highlight').exists()).toBe(false);
    });

    it(':min-date - allows date on minimum date', async () => {
      const dp = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          minDate: new Date(2000, 0, 5),
        },
      });
      await dp.vm.$nextTick();
      // Day of min date is not disabled
      expect(dp.find('.id-2000-01-05 .is-disabled').exists()).toBe(false);
      // Click day of min date
      await dp.find('.id-2000-01-05 .vc-day-content').trigger('click');
      // Highlight should appear
      expect(dp.find('.id-2000-01-05 .vc-highlight').exists()).toBe(true);
    });

    it(':max-date - prevents date after maximum date', async () => {
      const dp = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          maxDate: new Date(2000, 0, 25),
        },
      });
      await dp.vm.$nextTick();
      // Day after max date is disabled
      expect(dp.find('.id-2000-01-26 .is-disabled').exists()).toBe(true);
      // Click day after max date
      await dp.find('.id-2000-01-26 .vc-day-content').trigger('click');
      // Highlight should NOT appear
      expect(dp.find('.id-2000-01-26 .vc-highlight').exists()).toBe(false);
    });

    it(':max-date - allows date on maximum date', async () => {
      const dp = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          maxDate: new Date(2000, 0, 25),
        },
      });
      await dp.vm.$nextTick();
      // Day of max date is not disabled
      expect(dp.find('.id-2000-01-25 .is-disabled').exists()).toBe(false);
      // Click day of max date
      await dp.find('.id-2000-01-25 .vc-day-content').trigger('click');
      // Highlight should appear
      expect(dp.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
    });

    it(':is-required - keeps date when set', async () => {
      const dp = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          isRequired: true,
        },
      });
      await dp.vm.$nextTick();
      await dp.find('.id-2000-01-25 .vc-day-content').trigger('click');
      expect(dp.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
      await dp.find('.id-2000-01-25 .vc-day-content').trigger('click');
      expect(dp.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
    });

    it(':is-required - clears date when not set', async () => {
      const dp = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          isRequired: false,
        },
      });
      await dp.vm.$nextTick();
      await dp.find('.id-2000-01-25 .vc-day-content').trigger('click');
      expect(dp.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
      await dp.find('.id-2000-01-25 .vc-day-content').trigger('click');
      expect(dp.find('.id-2000-01-25 .vc-highlight').exists()).toBe(false);
    });

    it(':model-config.fillDate - fills missing date parts for date input', async () => {
      const dp = mountWithInputs({
        value: null,
        mode: 'time',
        modelConfig: {
          type: 'string',
          fillDate: new Date(2021, 0, 1),
        },
      });
      await updateInputs(dp, '12:15 PM');
      expect(dp.vm.value_.toISOString()).toEqual('2021-01-01T12:15:00.000Z');
    });

    it(':model-config.fillDate - fills missing date parts for date range inputs', async () => {
      const dp = mountWithInputs({
        value: null,
        mode: 'time',
        isRange: true,
        modelConfig: {
          type: 'string',
          fillDate: new Date(2021, 0, 1),
        },
      });
      await updateInputs(dp, '12:15 PM', '12:15 PM');
      expect(dp.vm.value_).toEqual({
        start: new Date('2021-01-01T12:15:00.000Z'),
        end: new Date('2021-01-01T12:15:00.000Z'),
      });
    });
  });
});

function mountWithInputs(props) {
  return mount(DatePicker, {
    propsData: {
      ...props,
      timezone: 'utc',
    },
    scopedSlots: {
      default: function(sProps) {
        if (props.isRange) {
          return this.$createElement('div', [
            this.$createElement('input', {
              props: {
                value: sProps.inputValue.start,
              },
              on: sProps.inputEvents.start,
            }),
            this.$createElement('input', {
              props: {
                value: sProps.inputValue.end,
              },
              on: sProps.inputEvents.end,
            }),
          ]);
        }
        return this.$createElement('input', {
          props: {
            value: sProps.inputValue,
          },
          on: sProps.inputEvents,
        });
      },
    },
  });
}

async function updateInputs(dp, startValue, endValue) {
  const inputs = dp.findAll('input');
  let input = null;
  if (startValue) {
    input = inputs.at(0);
    await input.setValue(startValue);
    await input.trigger('change');
  }
  if (endValue) {
    input = inputs.at(1);
    await input.setValue(endValue);
    await input.trigger('change');
  }
}
