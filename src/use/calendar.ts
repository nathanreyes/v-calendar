import {
  type ExtractPropTypes,
  type PropType,
  type SetupContext,
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  watchEffect,
} from 'vue';
import { Attribute, type AttributeConfig } from '../utils/attribute';
import {
  type DateSource,
  addDays,
  addMonths,
  addYears,
} from '../utils/date/helpers';
import { type DateRangeCell, DateRangeContext } from '../utils/date/range';
import { getDefault } from '../utils/defaults';
import {
  type CustomElement,
  arrayHasItems,
  has,
  head,
  isBoolean,
  last,
} from '../utils/helpers';
import {
  type CalendarDay,
  type CalendarWeek,
  type Page,
  type PageAddress,
  type TitlePosition,
  addPages as _addPages,
  getPageAddressForDate,
  pageIsAfterPage,
  pageIsBeforePage,
  pageIsBetweenPages,
  pageIsEqualToPage,
  pageIsValid,
  pageRangeToArray,
} from '../utils/page';
import { type PopoverVisibility, hidePopover } from '../utils/popovers';
import { addHorizontalSwipeHandler } from '../utils/touch';
import { handleWatcher, skipWatcher } from '../utils/watchers';
import { propsDef as basePropsDef, useOrCreateBase } from './base';
import { provideSlots } from './slots';

export type CalendarView = 'daily' | 'weekly' | 'monthly';

export type MoveTarget = DateSource | PageAddress;

export type MoveTransition = 'none' | 'fade' | 'slide-v' | 'slide-h';

export interface MoveOptions {
  position: number;
  view: CalendarView;
  transition: MoveTransition;
  force: boolean;
  fromPage: PageAddress;
  toPage: PageAddress;
}

export interface RefreshOptions {
  page: PageAddress;
  position: number;
  force: boolean;
  transition: MoveTransition;
}

export type DayCells = Record<
  number,
  { day: CalendarDay; cells: DateRangeCell<Attribute>[] }
>;

export type CalendarProps = Readonly<ExtractPropTypes<typeof propsDef>>;

type IContainer = Pick<Element, 'querySelector'> & CustomElement;

export type CalendarContext = ReturnType<typeof createCalendar>;

export const propsDef = {
  ...basePropsDef,
  view: {
    type: String as PropType<CalendarView>,
    default: 'monthly',
    validator(value: string) {
      return ['daily', 'weekly', 'monthly'].includes(value);
    },
  },
  rows: {
    type: Number,
    default: 1,
  },
  columns: {
    type: Number,
    default: 1,
  },
  step: Number,
  titlePosition: {
    type: String as PropType<TitlePosition>,
    default: () => getDefault('titlePosition') as TitlePosition,
  },
  navVisibility: {
    type: String as PropType<PopoverVisibility>,
    default: () => getDefault('navVisibility') as PopoverVisibility,
  },
  showWeeknumbers: [Boolean, String],
  showIsoWeeknumbers: [Boolean, String],
  expanded: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  initialPage: Object as PropType<PageAddress>,
  initialPagePosition: { type: Number, default: 1 },
  minPage: Object as PropType<PageAddress>,
  maxPage: Object as PropType<PageAddress>,
  transition: String as PropType<MoveTransition>,
  attributes: Array as PropType<Array<AttributeConfig>>,
  trimWeeks: Boolean,
  disablePageSwipe: Boolean,
};

export const emitsDef = [
  'dayclick',
  'daymouseenter',
  'daymouseleave',
  'dayfocusin',
  'dayfocusout',
  'daykeydown',
  'weeknumberclick',
  'transition-start',
  'transition-end',
  'did-move',
  'update:view',
  'update:pages',
];

const contextKey = Symbol('__vc_calendar_context__');

export function createCalendar(
  props: CalendarProps,
  { slots, emit }: Pick<SetupContext, 'slots' | 'emit'>,
) {
  // #region Refs

  const containerRef = ref<IContainer | null>(null);
  const focusedDay = ref<CalendarDay | null>(null);
  const focusableDay = ref(new Date().getDate());
  const inTransition = ref(false);
  const navPopoverId = ref(Symbol());
  const dayPopoverId = ref(Symbol());
  const _view = ref(props.view);
  const _pages = ref<Page[]>([]);
  const transitionName = ref('');

  // #endregion

  // Non-reactive util vars
  let transitionPromise: any = null;
  let removeHandlers: any = null;

  provideSlots(slots);

  const {
    theme,
    color,
    displayMode,
    locale,
    masks,
    minDate,
    maxDate,
    disabledAttribute,
    disabledDates,
  } = useOrCreateBase(props);

  // #region Computed

  const count = computed(() => props.rows * props.columns);

  const step = computed(() => props.step || count.value);

  const firstPage = computed(() => head(_pages.value) ?? null);

  const lastPage = computed(() => last(_pages.value) ?? null);

  const minPage = computed(
    () =>
      props.minPage || (minDate.value ? getDateAddress(minDate.value) : null),
  );

  const maxPage = computed(
    () =>
      props.maxPage || (maxDate.value ? getDateAddress(maxDate.value) : null),
  );

  const navVisibility = computed(() => props.navVisibility);

  const showWeeknumbers = computed(() => !!props.showWeeknumbers);

  const showIsoWeeknumbers = computed(() => !!props.showIsoWeeknumbers);

  const isMonthly = computed(() => _view.value === 'monthly');
  const isWeekly = computed(() => _view.value === 'weekly');
  const isDaily = computed(() => _view.value === 'daily');

  // #endregion Computed

  // #region Methods

  const onTransitionBeforeEnter = () => {
    inTransition.value = true;
    emit('transition-start');
  };

  const onTransitionAfterEnter = () => {
    inTransition.value = false;
    emit('transition-end');
    if (transitionPromise) {
      transitionPromise.resolve(true);
      transitionPromise = null;
    }
  };

  const addPages = (
    address: PageAddress,
    count: number,
    view = _view.value,
  ) => {
    return _addPages(address, count, view, locale.value);
  };

  const getDateAddress = (date: DateSource) => {
    return getPageAddressForDate(date, _view.value, locale.value);
  };

  const refreshDisabled = (day: CalendarDay) => {
    if (!disabledAttribute.value || !attributeContext.value) return;
    day.isDisabled = attributeContext.value.cellExists(
      disabledAttribute.value.key,
      day.dayIndex,
    );
  };

  const refreshFocusable = (day: CalendarDay) => {
    day.isFocusable = day.inMonth && day.day === focusableDay.value;
  };

  const forDays = (pages: Page[], fn: (day: CalendarDay) => boolean | void) => {
    for (const page of pages) {
      for (const day of page.days) {
        if (fn(day) === false) return;
      }
    }
  };

  const days = computed(() =>
    _pages.value.reduce((result: CalendarDay[], page: Page) => {
      result.push(...page.viewDays);
      return result;
    }, [] as CalendarDay[]),
  );

  const attributes = computed(() => {
    const result: Attribute[] = [];
    (props.attributes || []).forEach((attr, i) => {
      if (!attr || !attr.dates) return;
      result.push(
        new Attribute(
          {
            ...attr,
            order: attr.order || 0,
          },
          theme.value,
          locale.value,
        ),
      );
    });
    if (disabledAttribute.value) {
      result.push(disabledAttribute.value);
    }
    return result;
  });

  const hasAttributes = computed(() => arrayHasItems(attributes.value));

  const attributeContext = computed(() => {
    const ctx = new DateRangeContext();
    attributes.value.forEach(attr => {
      attr.ranges.forEach(range => {
        ctx.render(attr, range, days.value);
      });
    });
    return ctx;
  });

  const dayCells = computed(() => {
    return days.value.reduce((result, day) => {
      result[day.dayIndex] = { day, cells: [] };
      result[day.dayIndex].cells.push(...attributeContext.value.getCells(day));
      return result;
    }, {} as DayCells);
  });

  const getWeeknumberPosition = (column: number, columnFromEnd: number) => {
    const showWeeknumbers = props.showWeeknumbers || props.showIsoWeeknumbers;
    if (showWeeknumbers == null) return '';
    if (isBoolean(showWeeknumbers)) {
      return showWeeknumbers ? 'left' : '';
    }
    if (showWeeknumbers.startsWith('right')) {
      return columnFromEnd > 1 ? 'right' : showWeeknumbers;
    }
    return column > 1 ? 'left' : showWeeknumbers;
  };

  const getPageForAttributes = () => {
    if (!hasAttributes.value) return null;
    const attr =
      attributes.value.find(attr => attr.pinPage) || attributes.value[0];
    if (!attr || !attr.hasRanges) return null;
    const [range] = attr.ranges;
    const date = range.start?.date || range.end?.date;
    return date ? getDateAddress(date) : null;
  };

  const getDefaultInitialPage = () => {
    // 1. Try existing first page
    if (pageIsValid(firstPage.value)) return firstPage.value as PageAddress;
    // 2. Try the first attribute
    const page = getPageForAttributes();
    if (pageIsValid(page)) return page as PageAddress;
    // 3. Use today's page
    return getDateAddress(new Date());
  };

  const getTargetPageRange = (
    page: PageAddress,
    opts: Partial<MoveOptions> = {},
  ) => {
    const { view = _view.value, position = 1, force } = opts;
    const pagesToAdd = position > 0 ? 1 - position : -(count.value + position);
    let fromPage = addPages(page, pagesToAdd, view);
    let toPage = addPages(fromPage!, count.value - 1, view);

    // Adjust range for min/max if not forced
    if (!force) {
      if (pageIsBeforePage(fromPage, minPage.value)) {
        fromPage = minPage.value!;
      } else if (pageIsAfterPage(toPage, maxPage.value)) {
        fromPage = addPages(maxPage.value!, 1 - count.value);
      }
      toPage = addPages(fromPage!, count.value - 1);
    }
    return { fromPage, toPage };
  };

  const getPageTransition = (
    oldPage: Page,
    newPage: Page,
    defaultTransition = '',
  ) => {
    if (defaultTransition === 'none' || defaultTransition === 'fade')
      return defaultTransition;
    // Moving to a different view
    if (oldPage?.view !== newPage?.view) return 'fade';
    // Moving to a previous page
    const moveNext = pageIsAfterPage(newPage, oldPage);
    const movePrev = pageIsBeforePage(newPage, oldPage);
    if (!moveNext && !movePrev) {
      return 'fade';
    }
    // Vertical slide
    if (defaultTransition === 'slide-v') {
      return movePrev ? 'slide-down' : 'slide-up';
    }
    // Horizontal slide
    return movePrev ? 'slide-right' : 'slide-left';
  };

  const refreshPages = (opts: Partial<RefreshOptions> = {}) => {
    return new Promise((resolve, reject) => {
      const { position = 1, force = false, transition } = opts;
      const page = pageIsValid(opts.page)
        ? opts.page!
        : getDefaultInitialPage();
      const { fromPage } = getTargetPageRange(page, {
        position,
        force,
      });
      // Create the new pages
      const pages: Page[] = [];
      for (let i = 0; i < count.value; i++) {
        const newPage = addPages(fromPage!, i);
        const position = i + 1;
        const row = Math.ceil(position / props.columns);
        const rowFromEnd = props.rows - row + 1;
        const column = position % props.columns || props.columns;
        const columnFromEnd = props.columns - column + 1;
        const weeknumberPosition = getWeeknumberPosition(column, columnFromEnd);
        pages.push(
          locale.value.getPage({
            ...newPage,
            view: _view.value,
            titlePosition: props.titlePosition,
            trimWeeks: props.trimWeeks,
            position,
            row,
            rowFromEnd,
            column,
            columnFromEnd,
            showWeeknumbers: showWeeknumbers.value,
            showIsoWeeknumbers: showIsoWeeknumbers.value,
            weeknumberPosition,
          }),
        );
      }
      // Assign the transition
      transitionName.value = getPageTransition(
        _pages.value[0],
        pages[0],
        transition,
      );
      // Assign the new pages
      _pages.value = pages;
      // Cache or resolve transition promise
      if (transitionName.value && transitionName.value !== 'none') {
        transitionPromise = {
          resolve,
          reject,
        };
      } else {
        resolve(true);
      }
    });
  };

  const targetBy = (pages: number) => {
    const fromPage = firstPage.value ?? getDateAddress(new Date());
    return addPages(fromPage, pages);
  };

  const canMove = (target: MoveTarget, opts: Partial<MoveOptions> = {}) => {
    const page = pageIsValid(target as PageAddress)
      ? (target as Page)
      : getDateAddress(target as DateSource);
    // Calculate new page range without adjusting to min/max
    Object.assign(
      opts,
      getTargetPageRange(page, {
        ...opts,
        force: true,
      }),
    );
    // Verify we can move to any pages in the target range
    const pagesInRange = pageRangeToArray(
      opts.fromPage!,
      opts.toPage!,
      _view.value,
      locale.value,
    ).map(p => pageIsBetweenPages(p, minPage.value, maxPage.value));
    return pagesInRange.some(val => val);
  };

  const canMoveBy = (pages: number, opts: Partial<MoveOptions> = {}) => {
    return canMove(targetBy(pages), opts);
  };

  const canMovePrev = computed(() => canMoveBy(-step.value));

  const canMoveNext = computed(() => canMoveBy(step.value));

  const move = async (target: MoveTarget, opts: Partial<MoveOptions> = {}) => {
    // Return if we can't move to this page
    if (!opts.force && !canMove(target, opts)) return false;
    // Move to new `fromPage` if it's different from the current one
    if (opts.fromPage && !pageIsEqualToPage(opts.fromPage, firstPage.value)) {
      // Hide nav popover for good measure
      hidePopover({ id: navPopoverId.value, hideDelay: 0 });
      // Quietly change view if needed
      if (opts.view) {
        skipWatcher('view', 10);
        _view.value = opts.view;
      }
      await refreshPages({
        ...opts,
        page: opts.fromPage,
        position: 1,
        force: true,
      });
      emit('did-move', _pages.value);
    }
    return true;
  };

  const moveBy = (pages: number, opts: Partial<MoveOptions> = {}) => {
    return move(targetBy(pages), opts);
  };

  const movePrev = () => {
    return moveBy(-step.value);
  };

  const moveNext = () => {
    return moveBy(step.value);
  };

  const tryFocusDate = (date: Date) => {
    const inMonth = isMonthly.value ? '.in-month' : '';
    const daySelector = `.id-${locale.value.getDayId(date)}${inMonth}`;
    const selector = `${daySelector}.vc-focusable, ${daySelector} .vc-focusable`;
    const el = containerRef.value;
    if (el) {
      const focusableEl = el.querySelector(selector) as HTMLElement;
      if (focusableEl) {
        focusableEl.focus();
        return true;
      }
    }
    return false;
  };

  const focusDate = async (date: Date, opts: Partial<MoveOptions> = {}) => {
    if (tryFocusDate(date)) return true;
    // Move to the given date
    await move(date, opts);
    return tryFocusDate(date);
  };

  const onDayClick = (day: CalendarDay, event: MouseEvent) => {
    focusableDay.value = day.day;
    emit('dayclick', day, event);
  };

  const onDayMouseenter = (day: CalendarDay, event: MouseEvent) => {
    emit('daymouseenter', day, event);
  };

  const onDayMouseleave = (day: CalendarDay, event: MouseEvent) => {
    emit('daymouseleave', day, event);
  };

  const onDayFocusin = (day: CalendarDay, event: FocusEvent | null) => {
    focusableDay.value = day.day;
    focusedDay.value = day;
    day.isFocused = true;
    emit('dayfocusin', day, event);
  };

  const onDayFocusout = (day: CalendarDay, event: FocusEvent) => {
    focusedDay.value = null;
    day.isFocused = false;
    emit('dayfocusout', day, event);
  };

  const onDayKeydown = (day: CalendarDay, event: KeyboardEvent) => {
    emit('daykeydown', day, event);
    const date = day.noonDate;
    let newDate = null;
    switch (event.key) {
      case 'ArrowLeft': {
        // Move to previous day
        newDate = addDays(date, -1);
        break;
      }
      case 'ArrowRight': {
        // Move to next day
        newDate = addDays(date, 1);
        break;
      }
      case 'ArrowUp': {
        // Move to previous week
        newDate = addDays(date, -7);
        break;
      }
      case 'ArrowDown': {
        // Move to next week
        newDate = addDays(date, 7);
        break;
      }
      case 'Home': {
        // Move to first weekday position
        newDate = addDays(date, -day.weekdayPosition + 1);
        break;
      }
      case 'End': {
        // Move to last weekday position
        newDate = addDays(date, day.weekdayPositionFromEnd);
        break;
      }
      case 'PageUp': {
        if (event.altKey) {
          // Move to previous year w/ Alt/Option key
          newDate = addYears(date, -1);
        } else {
          // Move to previous month
          newDate = addMonths(date, -1);
        }
        break;
      }
      case 'PageDown': {
        if (event.altKey) {
          // Move to next year w/ Alt/Option key
          newDate = addYears(date, 1);
        } else {
          // Move to next month
          newDate = addMonths(date, 1);
        }
        break;
      }
    }
    if (newDate) {
      event.preventDefault();
      focusDate(newDate).catch();
    }
  };

  const onKeydown = (event: KeyboardEvent) => {
    const day = focusedDay.value;
    if (day != null) {
      onDayKeydown(day, event);
    }
  };

  const onWeeknumberClick = (week: CalendarWeek, event: MouseEvent) => {
    emit('weeknumberclick', week, event);
  };

  // #endregion Methods

  // #region Lifecycle methods

  // Created

  refreshPages({
    page: props.initialPage,
    position: props.initialPagePosition,
  });

  // Mounted

  onMounted(() => {
    if (!props.disablePageSwipe && containerRef.value) {
      // Add swipe handler to move to next and previous pages
      removeHandlers = addHorizontalSwipeHandler(
        containerRef.value,
        ({ toLeft = false, toRight = false }) => {
          if (toLeft) {
            moveNext();
          } else if (toRight) {
            movePrev();
          }
        },
        getDefault('touch'),
      );
    }
  });

  // Unmounted
  onUnmounted(() => {
    _pages.value = [];
    if (removeHandlers) removeHandlers();
  });

  // #endregion Lifecycle methods

  // #region Watch

  watch(
    () => locale.value,
    () => {
      refreshPages();
    },
  );

  watch(
    () => count.value,
    () => refreshPages(),
  );

  watch(
    () => props.view,
    () => (_view.value = props.view),
  );

  watch(
    () => _view.value,
    () => {
      handleWatcher('view', () => {
        refreshPages();
      });
      emit('update:view', _view.value);
    },
  );

  watch(
    () => focusableDay.value,
    () => {
      forDays(_pages.value, day => refreshFocusable(day));
    },
  );

  watchEffect(() => {
    emit('update:pages', _pages.value);
    // Refresh state for days
    forDays(_pages.value, day => {
      // Refresh disabled state
      refreshDisabled(day);
      // Refresh focusable state
      refreshFocusable(day);
    });
  });

  // #endregion Watch

  const context = {
    emit,
    containerRef,
    focusedDay,
    inTransition,
    navPopoverId,
    dayPopoverId,
    view: _view,
    pages: _pages,
    transitionName,
    theme,
    color,
    displayMode,
    locale,
    masks,
    attributes,
    disabledAttribute,
    disabledDates,
    attributeContext,
    days,
    dayCells,
    count,
    step,
    firstPage,
    lastPage,
    canMovePrev,
    canMoveNext,
    minPage,
    maxPage,
    isMonthly,
    isWeekly,
    isDaily,
    navVisibility,
    showWeeknumbers,
    showIsoWeeknumbers,
    getDateAddress,
    canMove,
    canMoveBy,
    move,
    moveBy,
    movePrev,
    moveNext,
    onTransitionBeforeEnter,
    onTransitionAfterEnter,
    tryFocusDate,
    focusDate,
    onKeydown,
    onDayKeydown,
    onDayClick,
    onDayMouseenter,
    onDayMouseleave,
    onDayFocusin,
    onDayFocusout,
    onWeeknumberClick,
  };
  provide(contextKey, context);
  return context;
}

export function useCalendar(): CalendarContext {
  const context = inject<CalendarContext>(contextKey);
  if (context) return context;
  throw new Error(
    'Calendar context missing. Please verify this component is nested within a valid context provider.',
  );
}
