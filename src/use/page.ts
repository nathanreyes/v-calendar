import { provide, inject } from 'vue';
import { type Page } from '../utils/page';
import { getMonthDates } from '../utils/date/helpers';
import { pad } from '../utils/helpers';
import { useCalendar } from '..';

export interface YearItem {
  year: number;
  id: string;
  label: string;
  ariaLabel: string;
  isActive: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
}

export interface MonthItem extends YearItem {
  month: number;
}

export type CalendarPageContext = ReturnType<typeof createPage>;

const contextKey = '__vc_page_context__';

export function createPage(page: Page) {
  const { locale, getDateAddress, canMove } = useCalendar();

  function getMonthItems(year: number, mask: string): MonthItem[] {
    const { month: thisMonth, year: thisYear } = getDateAddress(new Date());
    return getMonthDates().map((d, i: number) => {
      const month = i + 1;
      return {
        month,
        year,
        id: `${year}.${pad(month, 2)}`,
        label: locale.value.formatDate(d, mask),
        ariaLabel: locale.value.formatDate(d, 'MMMM'),
        isActive: month === page.month && year === page.year,
        isCurrent: month === thisMonth && year === thisYear,
        isDisabled: !canMove({ month, year }, { position: page.position }),
      };
    });
  }

  function getYearItems(startYear: number, endYear: number): YearItem[] {
    const { year: thisYear } = getDateAddress(new Date());
    const items = [];
    for (let year = startYear; year <= endYear; year += 1) {
      let enabled = false;
      for (let month = 1; month < 12; month++) {
        enabled = canMove({ month, year }, { position: page.position });
        if (enabled) break;
      }
      items.push({
        year,
        id: year.toString(),
        label: year.toString(),
        ariaLabel: year.toString(),
        isActive: year === page.year,
        isCurrent: year === thisYear,
        isDisabled: !enabled,
      });
    }
    return items;
  }

  const context = { page, getMonthItems, getYearItems };
  provide(contextKey, context);
  return context;
}

export function usePage(): CalendarPageContext {
  const context = inject<CalendarPageContext>(contextKey);
  if (context) return context;
  throw new Error(
    'Page context missing. Please verify this component is nested within a valid context provider.',
  );
}
