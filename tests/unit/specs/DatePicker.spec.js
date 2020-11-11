import { mount } from '@vue/test-utils';
import DatePicker from '@/components/DatePicker';

describe('DatePicker', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(DatePicker, {
      propsData: {
        value: new Date(2000, 0, 1),
      },
    });
  });

  describe(':props', () => {
    it(':value - renders a date value', async () => {
      expect(wrapper.find('.id-2000-01-01').exists()).toBe(true);
    });
  });
});
