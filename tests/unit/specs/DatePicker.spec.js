import { mount } from '@vue/test-utils';
import DatePicker from '@/components/DatePicker';

describe('DatePicker', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(DatePicker, {
      propsData: {
        value: new Date(2000, 0, 15),
      },
    });
  });

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  describe(':props', () => {
    it(':value - renders a date value', async () => {
      expect(wrapper.find('.id-2000-01-15').exists()).toBe(true);
    });
    it(':min-date - prevents date before minimum date', async () => {
      await wrapper.setProps({ minDate: new Date(2000, 0, 5) });
      // Day before min date is disabled
      expect(wrapper.find('.id-2000-01-04 .is-disabled').exists()).toBe(true);
      // Click day before min date
      await wrapper.find('.id-2000-01-04 .vc-day-content').trigger('click');
      // Highlight should NOT appear
      expect(wrapper.find('.id-2000-01-04 .vc-highlight').exists()).toBe(false);
    });
    it(':min-date - allows date on minimum date', async () => {
      await wrapper.setProps({ minDate: new Date(2000, 0, 5) });
      // Day of min date is not disabled
      expect(wrapper.find('.id-2000-01-05 .is-disabled').exists()).toBe(false);
      // Click day of min date
      await wrapper.find('.id-2000-01-05 .vc-day-content').trigger('click');
      await wait(1);
      // Highlight should appear
      expect(wrapper.find('.id-2000-01-05 .vc-highlight').exists()).toBe(true);
    });
    it(':max-date - prevents date after maximum date', async () => {
      await wrapper.setProps({ maxDate: new Date(2000, 0, 25) });
      // Day after max date is disabled
      expect(wrapper.find('.id-2000-01-26 .is-disabled').exists()).toBe(true);
      // Click day after max date
      await wrapper.find('.id-2000-01-26 .vc-day-content').trigger('click');
      // Highlight should NOT appear
      expect(wrapper.find('.id-2000-01-26 .vc-highlight').exists()).toBe(false);
    });
    it(':max-date - allows date on maximum date', async () => {
      await wrapper.setProps({ maxDate: new Date(2000, 0, 25) });
      // Day of max date is not disabled
      expect(wrapper.find('.id-2000-01-25 .is-disabled').exists()).toBe(false);
      // Click day of max date
      await wrapper.find('.id-2000-01-25 .vc-day-content').trigger('click');
      await wait(1);
      // Highlight should appear
      expect(wrapper.find('.id-2000-01-25 .vc-highlight').exists()).toBe(true);
    });
    it(':is-required - keeps date when set', async () => {
      await wrapper.setProps({ isRequired: true });
      await wrapper.find('.id-2000-01-15 .vc-day-content').trigger('click');
      expect(wrapper.find('.id-2000-01-15 .vc-highlight').exists()).toBe(true);
      await wrapper.find('.id-2000-01-15 .vc-day-content').trigger('click');
      expect(wrapper.find('.id-2000-01-15 .vc-highlight').exists()).toBe(true);
    });
    it(':is-required - clears date when not set', async () => {
      await wrapper.setProps({ isRequired: false });
      await wrapper.find('.id-2000-01-15 .vc-day-content').trigger('click');
      expect(wrapper.find('.id-2000-01-15 .vc-highlight').exists()).toBe(true);
      await wrapper.find('.id-2000-01-15 .vc-day-content').trigger('click');
      expect(wrapper.find('.id-2000-01-15 .vc-highlight').exists()).toBe(false);
    });
  });
});
