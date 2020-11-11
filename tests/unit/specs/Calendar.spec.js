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
});
