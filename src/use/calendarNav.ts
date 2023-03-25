import {
  type ExtractPropTypes,
  type PropType,
  ref,
  computed,
  watch,
  onMounted,
  provide,
  inject,
} from 'vue';
import { useCalendar } from './calendar';
import type { Page } from '../utils/page';
import { getMonthDates } from '../utils/date/helpers';
import { head, last, pad } from '../utils/helpers';

export interface YearItem {
  year: number;
  id: string;
  label: string;
  ariaLabel: string;
  isActive: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
  click: () => void;
}

export interface MonthItem extends YearItem {
  month: number;
}

export type IQuerySelector = Pick<HTMLElement, 'querySelector'>;

export type CalendarNavContext = ReturnType<typeof createCalendarNav>;

export type CalendarNavProps = Readonly<ExtractPropTypes<typeof propsDef>>;

export const propsDef = {
  value: { type: Object as PropType<Page>, required: true },
};

export const emitsDef = ['input'];

const contextKey = '__vc_calendar_nav_context__';

export function createCalendarNav(props: CalendarNavProps, { emit }: any) {
  const monthMode = ref(true);
  const yearIndex = ref(0);
  const yearGroupIndex = ref(0);
  const yearGroupCount = 12;
  const navContainer = ref<IQuerySelector | null>(null);

  const { locale, masks, canMove, getDateAddress } = useCalendar();

  function focusFirstItem() {
    // Use setTimeout instead of $nextTick so it plays nice with popperjs
    setTimeout(() => {
      if (navContainer.value == null) return;
      // Set focus on the first enabled nav item
      const focusableEl = navContainer.value.querySelector(
        '.vc-nav-item:not(.vc-disabled)',
      ) as HTMLElement;
      if (focusableEl) {
        focusableEl.focus();
      }
    }, 10);
  }

  function monthClick(month: number, year: number) {
    emit('input', { month, year }, { position: currentPosition.value });
  }

  function yearClick(year: number) {
    yearIndex.value = year;
    monthMode.value = true;
    focusFirstItem();
  }

  function getYearItems(yearGroupIndex: number): YearItem[] {
    const { year: thisYear } = getDateAddress(new Date());
    const startYear = yearGroupIndex * yearGroupCount;
    const endYear = startYear + yearGroupCount;
    const items = [];
    for (let year = startYear; year < endYear; year += 1) {
      let enabled = false;
      for (let month = 1; month < 12; month++) {
        enabled = canMove({ month, year }, { position: currentPosition.value });
        if (enabled) break;
      }
      items.push({
        year,
        id: year.toString(),
        label: year.toString(),
        ariaLabel: year.toString(),
        isActive: year === currentYear.value,
        isCurrent: year === thisYear,
        isDisabled: !enabled,
        click: () => yearClick(year),
      });
    }
    return items;
  }

  function getMonthItems(year: number): MonthItem[] {
    const { month: thisMonth, year: thisYear } = getDateAddress(new Date());
    return getMonthDates().map((d, i: number) => {
      const month = i + 1;
      return {
        month,
        year,
        id: `${year}.${pad(month, 2)}`,
        label: locale.value.formatDate(d, masks.value.navMonths),
        ariaLabel: locale.value.formatDate(d, 'MMMM YYYY'),
        isActive: month === currentMonth.value && year === currentYear.value,
        isCurrent: month === thisMonth && year === thisYear,
        isDisabled: !canMove(
          { month, year },
          { position: currentPosition.value },
        ),
        click: () => monthClick(month, year),
      };
    });
  }

  function getItemClasses({
    isActive,
    isCurrent,
    isDisabled,
  }: MonthItem | YearItem) {
    const classes = ['vc-nav-item vc-focus'];
    if (isActive) {
      classes.push('is-active');
    } else if (isCurrent) {
      classes.push('is-current');
    }
    if (isDisabled) {
      classes.push('vc-disabled');
    }
    return classes;
  }

  function getYearGroupIndex(year: number) {
    return Math.floor(year / yearGroupCount);
  }

  function toggleMode() {
    monthMode.value = !monthMode.value;
  }

  // #region Move methods

  function movePrev() {
    if (!prevItemsEnabled.value) return;
    if (monthMode.value) {
      movePrevYear();
    }
    movePrevYearGroup();
  }

  function moveNext() {
    if (!nextItemsEnabled.value) return;
    if (monthMode.value) {
      moveNextYear();
    }
    moveNextYearGroup();
  }

  function movePrevYear() {
    yearIndex.value--;
  }

  function moveNextYear() {
    yearIndex.value++;
  }

  function movePrevYearGroup() {
    yearGroupIndex.value--;
  }

  function moveNextYearGroup() {
    yearGroupIndex.value++;
  }

  // #endregion Move methods

  const currentMonth = computed(() => props.value?.month || 0);

  const currentYear = computed(() => props.value?.year || 0);

  const currentPosition = computed(() => props.value?.position || 1);

  const monthItems = computed(() => getMonthItems(yearIndex.value));

  const yearItems = computed(() => getYearItems(yearGroupIndex.value));

  const firstYear = computed(() => head(yearItems.value.map(i => i.year)));

  const lastYear = computed(() => last(yearItems.value.map(i => i.year)));

  const title = computed(() => {
    return monthMode.value
      ? yearIndex.value
      : `${firstYear.value} - ${lastYear.value}`;
  });

  const prevMonthItemsEnabled = computed(() =>
    getMonthItems(yearIndex.value - 1).some(i => !i.isDisabled),
  );

  const prevYearItemsEnabled = computed(() =>
    getYearItems(yearGroupIndex.value - 1).some(i => !i.isDisabled),
  );

  const prevItemsEnabled = computed(() =>
    monthMode.value ? prevMonthItemsEnabled.value : prevYearItemsEnabled.value,
  );

  const nextMonthItemsEnabled = computed(() =>
    getMonthItems(yearIndex.value + 1).some(i => !i.isDisabled),
  );

  const nextYearItemsEnabled = computed(() =>
    getYearItems(yearGroupIndex.value + 1).some(i => !i.isDisabled),
  );

  const nextItemsEnabled = computed(() =>
    monthMode.value ? nextMonthItemsEnabled.value : nextYearItemsEnabled.value,
  );

  const activeItems = computed(() =>
    monthMode.value ? monthItems.value : yearItems.value,
  );

  watch(
    () => currentYear.value,
    () => {
      yearIndex.value = currentYear.value;
    },
  );

  watch(
    () => yearIndex.value,
    val => {
      yearGroupIndex.value = getYearGroupIndex(val);
    },
  );

  yearIndex.value = currentYear.value;

  onMounted(() => focusFirstItem());

  const context = {
    navContainer,
    title,
    monthMode,
    currentMonth,
    currentYear,
    activeItems,
    prevItemsEnabled,
    nextItemsEnabled,
    getItemClasses,
    toggleMode,
    movePrev,
    moveNext,
    movePrevYear,
    moveNextYear,
    movePrevYearGroup,
    moveNextYearGroup,
  };
  provide(contextKey, context);
  return context;
}

export function useCalendarNav(): CalendarNavContext {
  const context = inject<CalendarNavContext>(contextKey);
  if (context) return context;
  throw new Error(
    'CalendarNav context missing. Please verify this component is nested within a valid context provider.',
  );
}
