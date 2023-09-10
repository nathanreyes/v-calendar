import { pad } from '@/utils/helpers';
import { VueWrapper } from '@vue/test-utils';
import { expect, it } from 'vitest';
import disabledTests from '../util/disabledTests';
import type { ComponentMount } from './utils';

const expectDisabledArrows = (arrows: string[], wrapper: VueWrapper) => {
  ['prev', 'next'].forEach(dir => {
    const disabledClass = arrows.includes(dir)
      ? ':disabled'
      : ':not(:disabled)';
    const arrowSelector = `.vc-arrow.vc-${dir}${disabledClass}`;
    expect(wrapper.find(arrowSelector).exists()).toBe(true);
  });
};

const expectDisabledDays = (
  days: { start: number; end: number }[],
  wrapper: VueWrapper,
) => {
  for (let i = 1; i <= 31; i++) {
    const daySelector = `.vc-day.day-${i}:not(.is-not-in-month) .vc-day-content`;
    if (wrapper.find(daySelector).exists()) {
      const isDisabled = days.some(d => d.start <= i && i <= d.end);
      const disabledClass = isDisabled ? '.vc-disabled' : ':not(.vc-disabled)';
      const dayContentSelector = `${daySelector}${disabledClass}`;
      expect(wrapper.find(dayContentSelector).exists()).toBe(true);
    }
  }
  return;
};

const expectDisabledNavArrows = (directions: string[], wrapper: VueWrapper) => {
  ['left', 'right'].forEach(dir => {
    const disabledClass = directions.includes(dir)
      ? ':disabled'
      : ':not(:disabled)';
    const arrowSelector = `.vc-nav-arrow.is-${dir}${disabledClass}`;
    expect(wrapper.find(arrowSelector).exists()).toBe(true);
  });
};

const expectDisabledNavMonths = (
  months: number[],
  year: number,
  wrapper: VueWrapper,
) => {
  for (let i = 1; i <= 12; i++) {
    const disabledClass = months.includes(i) ? ':disabled' : ':not(:disabled)';
    const itemSelector = `.vc-nav-item${disabledClass}[data-id="${year}.${pad(
      i,
      2,
    )}"]`;
    expect(wrapper.find(itemSelector).exists()).toBe(true);
  }
};

const expectDisabledNavYears = (years: number[], wrapper: VueWrapper) => {
  for (let i = 2016; i <= 2027; i++) {
    const disabledClass = years.includes(i) ? ':disabled' : ':not(:disabled)';
    const itemSelector = `.vc-nav-item${disabledClass}[data-id="${i}"]`;
    expect(wrapper.find(itemSelector).exists()).toBe(true);
  }
};

export function testNavigationProps(mountFn: ComponentMount) {
  it(':initial-page renders at given page', async () => {
    const wrapper = mountFn({
      props: {
        initialPage: { month: 1, year: 2000 },
      },
    });
    expect(wrapper.find('.vc-day.id-2000-01-01').exists()).toBe(true);
  });

  for (let test of disabledTests) {
    it(test.it, async () => {
      // Set props
      const wrapper = mountFn({ props: test.props });
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
            // expectDisabledNavArrows(months.disabledArrows, wrapper);
          }
          // Test disabled nav month items
          if (months.disabledMonths) {
            expectDisabledNavMonths(
              months.disabledMonths,
              months.year,
              wrapper,
            );
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
}

export function testNavigationMethods(mountFn: ComponentMount) {
  it(':move should move to a date', async () => {
    const wrapper = mountFn();
    const vm = wrapper.vm;
    await vm.move(new Date(2000, 0, 1), { transition: 'none' });
    expect(wrapper.find('.id-2000-01-01').exists()).toBe(true);
  });
  it(':move should move forward by n months', async () => {
    const wrapper = mountFn();
    const vm = wrapper.vm;
    await vm.move({ month: 1, year: 2000 }, { transition: 'none' });
    await vm.moveBy(5, { transition: 'none' });
    expect(wrapper.find('.id-2000-06-01').exists()).toBe(true);
  });
  it(':move should move backwards by n months', async () => {
    const wrapper = mountFn();
    const vm = wrapper.vm;
    await vm.move({ month: 1, year: 2000 }, { transition: 'none' });
    await vm.moveBy(-5, { transition: 'none' });
    expect(wrapper.find('.id-1999-08-01').exists()).toBe(true);
  });
}
