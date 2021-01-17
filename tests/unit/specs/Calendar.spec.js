import { mount } from '@vue/test-utils';
import Calendar from '@/components/Calendar';
import disabledTests from '../util/disabledTests';
import { pad } from '@/utils/helpers';
import { isNumber } from 'lodash';

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

    const expectDisabledArrows = (arrows, wrapper) => {
      ['left', 'right'].forEach(dir => {
        const disabledClass = arrows.includes(dir) ? '.is-disabled' : ':not(.is-disabled)';
        const arrowSelector = `.vc-arrow.is-${dir}${disabledClass}`;
        expect(wrapper.find(arrowSelector).exists()).toBe(true);
      });
    };

    const expectDisabledDays = (days, wrapper) => {
      for (let i = 1; i <= 31; i++) {
        const daySelector = `.vc-day.day-${i}:not(.is-not-in-month) .vc-day-content`;
        if (wrapper.find(daySelector).exists()) {
          const isDisabled = days.some(d => (d > 0 ? d === i : d.start <= i && i <= d.end));
          const disabledClass = isDisabled ? '.is-disabled' : ':not(.is-disabled)';
          const dayContentSelector = `${daySelector}${disabledClass}`;
          expect(wrapper.find(dayContentSelector).exists()).toBe(true);
        }
      }
      return;
    };

    const expectDisabledNavArrows = (directions, wrapper) => {
      ['left', 'right'].forEach(dir => {
        const disabledClass = directions.includes(dir) ? '.is-disabled' : ':not(.is-disabled)';
        const arrowSelector = `.vc-nav-arrow.is-${dir}${disabledClass}`;
        expect(wrapper.find(arrowSelector).exists()).toBe(true);
      });
    };

    const expectDisabledNavMonths = (months, year, wrapper) => {
      for (let i = 1; i <= 12; i++) {
        const disabledClass = months.includes(i) ? '.is-disabled' : ':not(.is-disabled)';
        const itemSelector = `.vc-nav-item${disabledClass}[data-id="${year}.${pad(i, 2)}"]`;
        expect(wrapper.find(itemSelector).exists()).toBe(true);
      }
    };

    const expectDisabledNavYears = (years, wrapper) => {
      for (let i = 2016; i <= 2027; i++) {
        const disabledClass = years.includes(i) ? '.is-disabled' : ':not(.is-disabled)';
        const itemSelector = `.vc-nav-item${disabledClass}[data-id="${i}"]`;
        expect(wrapper.find(itemSelector).exists()).toBe(true);
      }
    };

    for (let test of disabledTests) {
      it(test.it, async () => {
        await wrapper.setProps(test.props);
        // Test disabled arrows
        if (test.disabledArrows) {
          expectDisabledArrows(test.disabledArrows, wrapper);
        }
        // Test disabled days
        if (test.disabledDays) {
          expectDisabledDays(test.disabledDays, wrapper);
        }
        const nav = test.nav;
        if (nav) {
          // Click header title to display nav popover
          await wrapper.find('.vc-title').trigger('click');
          const months = nav.months;
          if (months) {
            // Test disabled nav month arrows
            if (months.disabledArrows) {
              expectDisabledNavArrows(months.disabledArrows, wrapper);
            }
            // Test disabled nav month items
            if (months.disabledMonths) {
              expectDisabledNavMonths(months.disabledMonths, months.year, wrapper);
            }
          }
          const years = nav.years;
          if (years) {
            // Click nav title to display nav years
            await wrapper.find('.vc-nav-title').trigger('click');
            // Test disabled nav year arrows
            if (years.disabledArrows) {
              expectDisabledNavArrows(years.disabledArrows, wrapper);
            }
            // Test disabled nav year items
            if (years.disabledYears) {
              expectDisabledNavYears(years.disabledYears, wrapper);
            }
          }
        }
      });
    }
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
