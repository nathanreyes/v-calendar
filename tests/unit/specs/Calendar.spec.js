import { mount } from '@vue/test-utils';
import Calendar from '@/components/Calendar';

describe('Calendar', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = mount(Calendar);
  });

  describe(':props', () => {
    it(':from-page renders at given page', async () => {
      await wrapper.setProps({ fromPage: { month: 1, year: 2000 } });
      expect(wrapper.find('.vc-day.id-2000-01-01').exists()).toBe(true);
    });
  });

  describe(':methods', () => {
    it(':move should move to a date', async () => {
      await wrapper.vm.move(new Date(2000, 0, 1), { transition: 'none' });
      expect(wrapper.find('.id-2000-01-01').exists()).toBe(true);
    });
    it(':move should move forward by n months', async () => {
      await wrapper.setProps({ fromPage: { month: 1, year: 2000 } });
      await wrapper.vm.move(5, { transition: 'none' });
      expect(wrapper.find('.id-2000-06-01').exists()).toBe(true);
    });
    it(':move should move backwards by n months', async () => {
      await wrapper.setProps({ fromPage: { month: 1, year: 2000 } });
      await wrapper.vm.move(-5, { transition: 'none' });
      expect(wrapper.find('.id-1999-08-01').exists()).toBe(true);
    });
  });
});
