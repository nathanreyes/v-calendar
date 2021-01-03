import { mount } from '@vue/test-utils';
import DatePicker from '@/components/DatePicker';
import TimePicker from '@/components/TimePicker';
import dateValues from '../util/dateValues.json';
import wait from '../util/wait';

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
        const wrapper = mount(DatePicker, {
          propsData: dv.props,
        });
        await wait(1);
        const timePicker = wrapper.findComponent({ name: 'TimePicker' }).vm;
        expect(timePicker.hours).toEqual(dv.hours);
        expect(timePicker.minutes).toEqual(dv.minutes);
        expect(timePicker.isAM).toEqual(dv.isAM);
      }
    });

    it(':min-date - prevents date before minimum date', async () => {
      const wrapper = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          minDate: new Date(2000, 0, 5),
        },
      });
      // Day before min date is disabled
      expect(wrapper.find('.id-2000-01-04 .is-disabled').exists()).toBe(true);
      // Click day before min date
      await wrapper.find('.id-2000-01-04 .vc-day-content').trigger('click');
      // Highlight should NOT appear
      expect(wrapper.find('.id-2000-01-04 .vc-highlight').exists()).toBe(false);
    });

    it(':min-date - allows date on minimum date', async () => {
      const wrapper = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          minDate: new Date(2000, 0, 5),
        },
      });
      await wait(1);
      // Day of min date is not disabled
      expect(wrapper.find('.id-2000-01-05 .is-disabled').exists()).toBe(false);
      // Click day of min date
      await wrapper.find('.id-2000-01-05 .vc-day-content').trigger('click');
      // Highlight should appear
      expect(wrapper.find('.id-2000-01-05 .vc-highlight').exists()).toBe(true);
    });

    it(':max-date - prevents date after maximum date', async () => {
      const wrapper = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          maxDate: new Date(2000, 0, 25),
        },
      });
      // Day after max date is disabled
      expect(wrapper.find('.id-2000-01-26 .is-disabled').exists()).toBe(true);
      // Click day after max date
      await wrapper.find('.id-2000-01-26 .vc-day-content').trigger('click');
      // Highlight should NOT appear
      expect(wrapper.find('.id-2000-01-26 .vc-highlight').exists()).toBe(false);
    });

    it(':max-date - allows date on maximum date', async () => {
      const wrapper = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          maxDate: new Date(2000, 0, 25),
        },
      });
      await wait(1);
      // Day of max date is not disabled
      expect(wrapper.find('.id-2000-01-25 .is-disabled').exists()).toBe(false);
      // Click day of max date
      await wrapper.find('.id-2000-01-25 .vc-day-content').trigger('click');
      // Highlight should appear
      expect(wrapper.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
    });

    it(':is-required - keeps date when set', async () => {
      const wrapper = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          isRequired: true,
        },
      });
      await wait(1);
      await wrapper.find('.id-2000-01-25 .vc-day-content').trigger('click');
      expect(wrapper.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
      await wrapper.find('.id-2000-01-25 .vc-day-content').trigger('click');
      expect(wrapper.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
    });

    it(':is-required - clears date when not set', async () => {
      const wrapper = mount(DatePicker, {
        propsData: {
          value: new Date(2000, 0, 15),
          isRequired: false,
        },
      });
      await wait(1);
      await wrapper.find('.id-2000-01-25 .vc-day-content').trigger('click');
      expect(wrapper.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
      await wrapper.find('.id-2000-01-25 .vc-day-content').trigger('click');
      expect(wrapper.find('.id-2000-01-25 .vc-highlight').exists()).toBe(false);
    });
  });
});
