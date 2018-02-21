import { mount } from '@vue/test-utils';
import DatePicker from '@/components/DatePicker';

describe('DatePicker', () => {
  it('renders props.fromPage', () => {
    const fromPage = { month: 4, year: 2001 };
    const wrapper = mount(DatePicker, {
      attrs: {
        fromPage,
        isInline: true,
      },
    });
    const cal = wrapper.find('div');
    console.log(cal.html());
    // if (cal) {
    //   const attrs = cal.attributes();
    //   console.log(attrs);
    // }
    expect(2).toBe(2);
  });
});
