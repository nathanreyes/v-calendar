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
    const minDate = new Date(2020, 10, 15);
    const testMinDate = () => {
      expect(wrapper.find('.id-2020-11-14 .vc-day-content').exists()).toBe(
        true,
      );
      expect(
        wrapper.find('.id-2020-11-14 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
      expect(wrapper.find('.id-2020-11-15 .vc-day-content').exists()).toBe(
        true,
      );
      expect(
        wrapper.find('.id-2020-11-15 .vc-day-content.is-disabled').exists(),
      ).toBe(false);
    };
    const maxDate = new Date(2020, 10, 15);
    const testMaxDate = () => {
      expect(wrapper.find('.id-2020-11-15 .vc-day-content').exists()).toBe(
        true,
      );
      expect(
        wrapper.find('.id-2020-11-15 .vc-day-content.is-disabled').exists(),
      ).toBe(false);
      expect(wrapper.find('.id-2020-11-16 .vc-day-content').exists()).toBe(
        true,
      );
      expect(
        wrapper.find('.id-2020-11-16 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
    };
    const disabledDatesDailyInterval = [
      { start: new Date(2020, 10, 1), end: null, on: { dailyInterval: 4 } },
    ];
    const testDisabledDatesDailyInterval = isCombinedWithOtherTests => {
      expect(
        wrapper.find('.id-2020-11-01 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
      if (!isCombinedWithOtherTests) {
        expect(
          wrapper.find('.id-2020-11-02 .vc-day-content.is-disabled').exists(),
        ).toBe(false);
        expect(
          wrapper.find('.id-2020-11-03 .vc-day-content.is-disabled').exists(),
        ).toBe(false);
        expect(
          wrapper.find('.id-2020-11-04 .vc-day-content.is-disabled').exists(),
        ).toBe(false);
      }
      expect(
        wrapper.find('.id-2020-11-05 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
      expect(
        wrapper.find('.id-2020-11-09 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
      expect(
        wrapper.find('.id-2020-11-13 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
      expect(
        wrapper.find('.id-2020-11-17 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
      expect(
        wrapper.find('.id-2020-11-21 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
      expect(
        wrapper.find('.id-2020-11-25 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
      expect(
        wrapper.find('.id-2020-11-29 .vc-day-content.is-disabled').exists(),
      ).toBe(true);
    };
    it(':min-date disables dates before date', async () => {
      await wrapper.setProps({ fromPage: { month: 11, year: 2020 }, minDate });
      testMinDate();
    });
    it(':max-date disables dates after date', async () => {
      await wrapper.setProps({ fromPage: { month: 11, year: 2020 }, maxDate });
      testMaxDate();
    });
    it(':disabled-dates disables dates with daily interval', async () => {
      await wrapper.setProps({
        fromPage: { month: 11, year: 2020 },
        disabledDates: disabledDatesDailyInterval,
      });
      testDisabledDatesDailyInterval();
    });
    it(':min-date works with :disabled-dates', async () => {
      await wrapper.setProps({
        fromPage: { month: 11, year: 2020 },
        minDate,
        disabledDates: disabledDatesDailyInterval,
      });
      testMinDate();
      testDisabledDatesDailyInterval(true);
    });
    it(':max-date works with :disabled-dates', async () => {
      await wrapper.setProps({
        fromPage: { month: 11, year: 2020 },
        maxDate,
        disabledDates: disabledDatesDailyInterval,
      });
      testMaxDate();
      testDisabledDatesDailyInterval(true);
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
