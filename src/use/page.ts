import { type Ref, inject, provide } from 'vue';
import { useCalendar } from '..';
import { getMonthDates } from '../utils/date/helpers';
import { type Page, getPageId } from '../utils/page';

export interface MonthNavItem {
  month: number;
  year: number;
  id: string;
  label: string;
  ariaLabel: string;
  isActive: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
}

export type YearNavItem = Omit<MonthNavItem, 'month'>;

export type CalendarPageContext = ReturnType<typeof createPage>;

const contextKey = Symbol('__vc_page_context__');

export function createPage(page: Ref<Page>) {
  const { locale, getDateAddress, canMove } = useCalendar();

  function getMonthItems(year: number, mask: string): MonthNavItem[] {
    const { month: thisMonth, year: thisYear } = getDateAddress(new Date());
    return getMonthDates().map((d, i: number) => {
      const month = i + 1;
      return {
        month,
        year,
        id: getPageId(month, year),
        label: locale.value.formatDate(d, mask),
        ariaLabel: locale.value.formatDate(d, 'MMMM'),
        isActive: month === page.value.month && year === page.value.year,
        isCurrent: month === thisMonth && year === thisYear,
        isDisabled: !canMove(
          { month, year },
          { position: page.value.position },
        ),
      };
    });
  }

  function getYearItems(startYear: number, endYear: number): YearNavItem[] {
    const { year: thisYear } = getDateAddress(new Date());
    const { position } = page.value;
    const items = [];
    for (let year = startYear; year <= endYear; year += 1) {
      const enabled = [...Array(12).keys()].some(m =>
        canMove({ month: m + 1, year }, { position }),
      );
      items.push({
        year,
        id: year.toString(),
        label: year.toString(),
        ariaLabel: year.toString(),
        isActive: year === page.value.year,
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
