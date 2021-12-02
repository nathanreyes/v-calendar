import {
  SetupContext,
  computed,
  reactive,
  toRefs,
  provide,
  onMounted,
  onUnmounted,
  watch,
  inject,
  ToRefs,
  nextTick,
} from 'vue';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';
import Popover from '../Popover/Popover.vue';
import AttributeStore from './attributeStore';
import Attribute from './attribute';
import {
  default as Locale,
  CalendarDay,
  CalendarWeek,
  Page,
  TitlePosition,
} from './locale';
import Theme from './theme';
import {
  pageIsValid,
  pageIsEqualToPage,
  pageIsBeforePage,
  pageIsAfterPage,
  pageIsBetweenPages,
  createGuid,
  arrayHasItems,
  getPageTransition,
  PageAddress,
} from './helpers';
import { isBoolean, isNumber, isObject, hasAny, omit, head, last } from './_';
import { locales, getDefault } from './defaults';
import { addHorizontalSwipeHandler } from './touch';
import { skipWatcher, handleWatcher } from './watchers';

type CalendarView = 'daily' | 'weekly' | 'monthly';

type NavVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';

interface MoveOptions {
  page: PageAddress;
  position: number;
  view: CalendarView;
  transition: string;
  force: boolean;
  fromPage: PageAddress;
  toPage: PageAddress;
}

interface CalendarProps {
  view: CalendarView;
  rows: number;
  columns: number;
  step?: number;
  titlePosition: TitlePosition;
  navVisibility: NavVisibility;
  isExpanded: boolean;
  showWeeknumbers: boolean | string;
  showIsoWeeknumbers: boolean | string;
  minPage?: PageAddress;
  minDate?: Date;
  minDateExact?: Date;
  maxPage?: PageAddress;
  maxDate?: Date;
  maxDateExact?: Date;
  transition: string;
  attributes: AttributeStore | [];
  disabledDates?: [];
  availableDates?: [];
  trimWeeks: boolean;
  disablePageSwipe: boolean;
  color: string;
  isDark: boolean;
  theme?: string | Theme;
  locale?: string | Record<string, any> | Locale;
  firstDayOfWeek: number;
  masks?: Record<string, any>;
  timezone?: string;
}

export const props = {
  color: {
    type: String,
    default: getDefault('color'),
  },
  isDark: {
    type: Boolean,
    default: getDefault('isDark'),
  },
  view: {
    type: String,
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
    type: String,
    default: getDefault('titlePosition'),
  },
  navVisibility: {
    type: String,
    default: getDefault('navVisibility'),
  },
  showWeeknumbers: [Boolean, String],
  showIsoWeeknumbers: [Boolean, String],
  isExpanded: Boolean,
  minPage: Object,
  maxPage: Object,
  transition: String,
  attributes: [Object, Array],
  trimWeeks: Boolean,
  firstDayOfWeek: Number,
  masks: Object,
  locale: [String, Object],
  timezone: String,
  minDate: null,
  maxDate: null,
  minDateExact: null,
  maxDateExact: null,
  disabledDates: null,
  availableDates: null,
  disablePageSwipe: Boolean,
};

export const emits = [
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
];

interface CalendarState {
  containerRef: HTMLElement | null;
  navPopoverRef: typeof Popover | null;
  lastFocusedDay: CalendarDay | null;
  focusableDay: number;
  inTransition: boolean;
  navPopoverId: string;
  dayPopoverId: string;
  view: CalendarView;
  pages: Page[];
  store: AttributeStore;
  transitionName: string;
  refreshing: boolean;
}

interface CalendarContext extends CalendarState {
  theme: Theme;
  locale: Locale;
  masks: Record<string, any>;
  count: number;
}

export function useCalendar(props: CalendarProps, { emit }: SetupContext) {
  const state = reactive<CalendarState>({
    containerRef: null,
    navPopoverRef: null,
    lastFocusedDay: null,
    focusableDay: new Date().getDate(),
    inTransition: false,
    navPopoverId: createGuid(),
    dayPopoverId: createGuid(),
    view: props.view,
    pages: [],
    store: null,
    transitionName: '',
    refreshing: false,
  });

  // Non-reactive util vars
  let transitionPromise: any = null;
  let removeHandlers: any = null;

  // #region Computed properties

  const theme = computed(() => {
    // Return the theme prop if it is an instance of the Theme class
    if (props.theme instanceof Theme) return props.theme;
    // Create the theme
    return new Theme({
      color: props.color,
      isDark: props.isDark,
    });
  });

  const locale = computed(() => {
    // Return the locale prop if it is an instance of the Locale class
    if (props.locale instanceof Locale) return props.locale;
    // Build up a base config from component props
    const config = isObject(props.locale)
      ? props.locale
      : {
          id: props.locale,
          firstDayOfWeek: props.firstDayOfWeek,
          masks: props.masks,
        };
    // Return new locale
    return new Locale(config, {
      locales: locales.value,
      timezone: props.timezone,
    });
  });

  const masks = computed(() => locale.value.masks);

  const count = computed(() => props.rows * props.columns);

  const step = computed(() => props.step || count.value);

  const firstPage = computed(() => head(state.pages));

  const lastPage = computed(() => last(state.pages));

  const minPage = computed(
    () => props.minPage || locale.value.getPageForDate(props.minDate),
  );

  const maxPage = computed(
    () => props.maxPage || locale.value.getPageForDate(props.maxDate),
  );

  const navVisibility = computed(() => props.navVisibility);

  const showWeeknumbers = computed(() => !!props.showWeeknumbers);

  const showIsoWeeknumbers = computed(() => !!props.showIsoWeeknumbers);

  const disabledDates = computed(() => {
    const dates = locale.value.normalizeDates(props.disabledDates, {
      isFullDay: true,
    });
    // Add disabled range for min date
    if (props.minDateExact || props.minDate) {
      const end = props.minDateExact
        ? locale.value.normalizeDate(props.minDateExact)
        : locale.value.normalizeDate(props.minDate!, { time: '00:00:00' });
      dates.push({
        start: null,
        end: new Date(end.getTime() - 1000),
      });
    }
    // Add disabled range for min date
    if (props.maxDateExact || props.maxDate) {
      const start = props.maxDateExact
        ? locale.value.normalizeDate(props.maxDateExact)
        : locale.value.normalizeDate(props.maxDate!, { time: '23:59:59' });
      dates.push({
        start: new Date(start.getTime() + 1000),
        end: null,
      });
    }
    return dates;
  });

  const availableDates = computed(() => {
    return locale.value.normalizeDates(props.availableDates, {
      isFullDay: false,
    });
  });

  const disabledAttribute = computed(() => {
    return new Attribute(
      {
        key: 'disabled',
        dates: disabledDates.value,
        excludeDates: availableDates.value,
        excludeMode: 'includes',
        order: 100,
      },
      theme.value,
      locale.value,
    );
  });

  const isMonthly = computed(() => state.view === 'monthly');

  // #endregion Computed properties

  // #region Methods

  const onTransitionBeforeEnter = () => {
    state.inTransition = true;
    emit('transition-start');
  };

  const onTransitionAfterEnter = () => {
    state.inTransition = false;
    emit('transition-end');
    if (transitionPromise) {
      transitionPromise.resolve(true);
      transitionPromise = null;
    }
  };

  const addPages = (address: PageAddress, count: number) => {
    return locale.value.addPages(address, count, state.view);
  };

  const getPageForAttributes = () => {
    let page = null;
    const attr = state.store.pinAttr;
    if (attr && attr.hasDates) {
      let [date] = attr.dates;
      date = date.start || date.date;
      page = locale.value.getPageForDate(date);
    }
    return page;
  };

  const getDefaultInitialPage = () => {
    // 1. Try existing first page
    if (pageIsValid(firstPage.value)) return firstPage.value;
    // 2. Try the first attribute
    const page = getPageForAttributes();
    if (pageIsValid(page)) return page;
    // 3. Use today's page
    return locale.value.getPageForThisMonth();
  };

  const getTargetPageRange = (
    page: PageAddress | undefined,
    { position, force }: Partial<MoveOptions> = {},
  ) => {
    let fromPage = null;
    let toPage = null;
    if (pageIsValid(page)) {
      let pagesToAdd = 0;
      position = +position!;
      if (!isNaN(position)) {
        pagesToAdd = position > 0 ? 1 - position : -(count.value + position);
      }
      fromPage = addPages(page!, pagesToAdd);
    } else {
      fromPage = getDefaultInitialPage();
    }
    toPage = addPages(fromPage!, count.value - 1);
    // Adjust range for min/max if not forced
    if (!force) {
      if (pageIsBeforePage(fromPage, minPage.value)) {
        fromPage = minPage.value;
      } else if (pageIsAfterPage(toPage, maxPage.value)) {
        fromPage = addPages(maxPage.value!, 1 - count.value);
      }
      toPage = addPages(fromPage!, count.value - 1);
    }
    return { fromPage, toPage };
  };

  const getPageDays = (pages: Page[] = state.pages): CalendarDay[] => {
    return pages.reduce(
      (prev, curr) => prev.concat(curr.days),
      [] as CalendarDay[],
    );
  };

  const refreshDisabledDays = (pages: Page[]) => {
    getPageDays(pages).forEach(d => {
      d.isDisabled =
        !!disabledAttribute.value && disabledAttribute.value.intersectsDay(d);
    });
  };

  const refreshFocusableDays = (pages: Page[]) => {
    getPageDays(pages).forEach(d => {
      d.isFocusable =
        isMonthly.value || (d.inMonth && d.day === state.focusableDay);
    });
  };

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

  const refreshPages = ({
    page,
    position = 1,
    force,
    transition,
  }: Partial<MoveOptions> = {}) => {
    return new Promise((resolve, reject) => {
      const { fromPage } = getTargetPageRange(page, {
        position,
        force,
      });
      // Create the new pages
      const pages = [];
      for (let i = 0; i < count.value; i++) {
        const newPage = addPages(fromPage!, i);
        const position = i + 1;
        const row = Math.ceil(position / props.columns);
        const rowFromEnd = props.rows - row + 1;
        const column = position % props.columns || props.columns;
        const columnFromEnd = props.columns - column + 1;
        const weeknumberPosition = getWeeknumberPosition(column, columnFromEnd);
        pages.push(
          locale.value.getPage(newPage, {
            view: state.view,
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
      // Refresh disabled days for new pages
      refreshDisabledDays(pages);
      // Refresh focusable days for new pages
      refreshFocusableDays(pages);
      // Assign the transition
      state.transitionName = getPageTransition(
        state.pages[0],
        pages[0],
        transition,
      );
      // Assign the new pages
      state.pages = pages;
      // Emit page update events
      if (state.transitionName && state.transitionName !== 'none') {
        transitionPromise = {
          resolve,
          reject,
        };
      } else {
        resolve(true);
      }
    });
  };

  const refreshAttrs = (
    pages: Page[] = [],
    adds: Attribute[] = [],
    deletes: any = [],
    reset: boolean,
  ) => {
    if (!arrayHasItems(pages)) return;
    // For each page...
    pages.forEach(p => {
      // For each day...
      p.days.forEach(d => {
        let shouldRefresh = false;
        let map: any = {};
        // If resetting...
        if (reset) {
          shouldRefresh = true;
        } else if (hasAny(d.attributesMap, deletes)) {
          // Delete attributes from the delete list
          map = omit(d.attributesMap, deletes);
          // Flag day for refresh
          shouldRefresh = true;
        } else {
          // Get the existing attributes
          map = { ...d.attributesMap };
        }
        // For each attribute to add...
        adds.forEach(attr => {
          // Add it if it includes the current day
          const targetDate = attr.intersectsDay(d);
          if (targetDate) {
            const newAttr = {
              ...attr,
              targetDate,
            };
            map[attr.key] = newAttr;
            // Flag day for refresh
            shouldRefresh = true;
          }
        });
        // Reassign day attributes
        if (shouldRefresh) {
          d.attributesMap = map;
        }
      });
    });
  };

  const initStore = () => {
    // Create a new attribute store
    state.store = new AttributeStore(
      theme.value,
      locale.value,
      props.attributes,
    );
    // Refresh attributes for existing pages
    refreshAttrs(state.pages, state.store.list, [], true);
  };

  const canMove = (
    arg: number | string | Date | PageAddress,
    opts: Partial<MoveOptions> = {},
  ) => {
    const page =
      firstPage.value && locale.value.toPage(arg, firstPage.value, state.view);
    if (!page) return false;
    let { position } = opts;
    // Pin position if arg is number
    if (isNumber(arg)) position = 1;
    // Set position if unspecified and out of current bounds
    if (!position) {
      if (pageIsBeforePage(page, firstPage.value)) {
        position = -1;
      } else if (pageIsAfterPage(page, lastPage.value)) {
        position = 1;
      } else if (pageIsEqualToPage(page, firstPage.value) || isMonthly.value) {
        // Page already displayed
        return true;
      }
    }
    // Calculate new page range without adjusting to min/max
    Object.assign(
      opts,
      getTargetPageRange(page, {
        position,
        force: true,
      }),
    );
    // Verify we can move to any pages in the target range
    return locale.value
      .pageRangeToArray(opts.fromPage!, opts.toPage!, state.view)
      .some(p => pageIsBetweenPages(p, minPage.value, maxPage.value));
  };

  const canMovePrev = computed(() => canMove(-step.value));

  const canMoveNext = computed(() => canMove(step.value));

  const canMoveUp = computed(() => state.view !== 'monthly');

  const move = async (
    arg: number | string | Date | PageAddress,
    opts: Partial<MoveOptions> = {},
  ) => {
    // Reject if we can't move to this page
    if (!opts.force && !canMove(arg, opts)) {
      return Promise.reject(
        new Error(`Move target is disabled: ${JSON.stringify(opts)}`),
      );
    }
    // Move to new `fromPage` if it's different from the current one
    if (opts.fromPage && !pageIsEqualToPage(opts.fromPage, firstPage.value)) {
      // Hide nav popover for good measure
      if (state.navPopoverRef) {
        state.navPopoverRef.hide({ hideDelay: 0 });
      }
      // Quietly change view if needed
      if (opts.view) {
        skipWatcher('view', 10);
        state.view = opts.view;
      }
      await refreshPages({
        ...opts,
        page: opts.fromPage,
        position: 1,
        force: true,
      });
      emit('did-move', state.pages);
    }
    return true;
  };

  const movePrev = (opts: Partial<MoveOptions> = {}) => {
    return move(-step.value, opts);
  };

  const moveNext = (opts: Partial<MoveOptions> = {}) => {
    return move(step.value, opts);
  };

  const moveUp = () => {
    if (state.view === 'daily') {
      state.view = 'weekly';
    } else if (state.view === 'weekly') {
      state.view = 'monthly';
    }
  };

  const tryFocusDate = (date: Date) => {
    const inMonth = isMonthly.value ? '.in-month' : '';
    const daySelector = `.id-${locale.value.getDayId(date)}${inMonth}`;
    const selector = `${daySelector}.vc-focusable, ${daySelector} .vc-focusable`;
    const el = state.containerRef;
    if (el) {
      const focusableEl = el.querySelector(selector) as HTMLElement;
      if (focusableEl) {
        focusableEl.focus();
        return true;
      }
    }
    return false;
  };

  const focusDate = (date: Date, opts = {}) => {
    if (tryFocusDate(date)) return Promise.resolve(true);
    // Move to the given date
    return move(date, opts).then(() => {
      return Promise.resolve(tryFocusDate(date));
    });
  };

  const onDayClick = (day: CalendarDay) => {
    emit('dayclick', day);
  };

  const onDayMouseenter = (day: CalendarDay) => {
    emit('daymouseenter', day);
  };

  const onDayMouseleave = (day: CalendarDay) => {
    emit('daymouseleave', day);
  };

  const onDayFocusin = (day: CalendarDay) => {
    state.lastFocusedDay = day;
    emit('dayfocusin', day);
  };

  const onDayFocusout = (day: CalendarDay) => {
    state.lastFocusedDay = null;
    emit('dayfocusout', day);
  };

  const onDayKeydown = (day: CalendarDay, event: KeyboardEvent) => {
    emit('daykeydown', day);
    const { dateFromTime } = day;
    // Set to noon to offset any daylight savings time offset
    const date = dateFromTime(12, 0, 0, 0);
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
    const day = state.lastFocusedDay;
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
  initStore();
  refreshPages();

  onMounted(() => {
    if (!props.disablePageSwipe) {
      // Add swipe handler to move to next and previous pages
      removeHandlers = addHorizontalSwipeHandler(
        state.containerRef,
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

  onUnmounted(() => {
    state.pages = [];
    state.store.destroy();
    state.store = null;
    if (removeHandlers) removeHandlers();
  });

  // #endregion Lifecycle methods

  // #region Watch

  watch(
    () => locale,
    () => {
      refreshPages();
      initStore();
    },
  );

  watch(
    () => theme,
    () => {
      // refreshPages();
      initStore();
    },
  );

  watch(
    () => count,
    () => {
      refreshPages();
    },
  );

  watch(
    () => props.view,
    () => {
      state.view = props.view;
    },
  );

  watch(
    () => state.view,
    () => {
      handleWatcher('view', () => {
        refreshPages();
      });
      emit('update:view', state.view);
    },
  );

  watch(
    () => props.attributes,
    val => {
      const { adds, deletes } = state.store.refresh(val);
      refreshAttrs(state.pages, adds, deletes, false);
    },
    {
      deep: true,
    },
  );

  // #endregion Watch

  const context = reactive({
    ...toRefs(state),
    theme,
    locale,
    masks,
    count,
    step,
    firstPage,
    lastPage,
    minPage,
    maxPage,
    navVisibility,
    canMovePrev,
    canMoveNext,
    canMoveUp,
    showWeeknumbers,
    showIsoWeeknumbers,
    canMove,
    move,
    movePrev,
    moveNext,
    moveUp,
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
  });
  provide('context', context);
  return context;
}

export function useCalendarContext(): ToRefs<CalendarContext> {
  const context = inject<CalendarContext>('context');
  if (!context) {
    throw new Error(
      'Calendar context missing. Please verify this component is nexted within a valid context provider.',
    );
  }
  return toRefs(context);
}
