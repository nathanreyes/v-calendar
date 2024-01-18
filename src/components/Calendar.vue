<script>
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';
import Popover from './Popover';
import PopoverRow from './PopoverRow';
import CalendarNav from './CalendarNav';
import CalendarPane from './CalendarPane';
import CustomTransition from './CustomTransition';
import SvgIcon from './SvgIcon';
import AttributeStore from '../utils/attributeStore';
import { rootMixin, safeScopedSlotMixin } from '../utils/mixins';
import { addHorizontalSwipeHandler } from '../utils/touch';
import {
  addPages,
  pageIsValid,
  pageIsEqualToPage,
  pageIsBeforePage,
  pageIsAfterPage,
  pageIsBetweenPages,
  pageRangeToArray,
  createGuid,
  arrayHasItems,
  onSpaceOrEnter,
} from '../utils/helpers';
import {
  isNumber,
  isDate,
  isObject,
  hasAny,
  omit,
  head,
  last,
} from '../utils/_';
import '../styles/base.css';

export default {
  name: 'Calendar',
  render(h) {
    // Renderer for calendar panes
    const panes = this.pages.map((page, i) => {
      const position = i + 1;
      const row = Math.ceil((i + 1) / this.columns);
      const rowFromEnd = this.rows - row + 1;
      const column = position % this.columns || this.columns;
      const columnFromEnd = this.columns - column + 1;
      return h(CalendarPane, {
        attrs: {
          ...this.$attrs,
          attributes: this.store,
        },
        props: {
          page,
          position,
          row,
          rowFromEnd,
          column,
          columnFromEnd,
          titlePosition: this.titlePosition_,
        },
        on: {
          ...this.$listeners,
          dayfocusin: e => {
            this.lastFocusedDay = e;
            this.$emit('dayfocusin', e);
          },
          dayfocusout: e => {
            this.lastFocusedDay = null;
            this.$emit('dayfocusout', e);
          },
        },
        scopedSlots: this.$scopedSlots,
        key: page.key,
        ref: 'pages',
        refInFor: true,
      });
    });
    // Renderer for calendar arrows
    const getArrowButton = isPrev => {
      const click = () => this.move(isPrev ? -this.step_ : this.step_);
      const keydown = e => onSpaceOrEnter(e, click);
      const isDisabled = isPrev ? !this.canMovePrev : !this.canMoveNext;
      return h(
        'div',
        {
          class: [
            'vc-arrow',
            `is-${isPrev ? 'left' : 'right'}`,
            { 'is-disabled': isDisabled },
          ],
          attrs: {
            role: 'button',
          },
          on: {
            click,
            keydown,
          },
        },
        [
          (isPrev
            ? this.safeScopedSlot('header-left-button', { click })
            : this.safeScopedSlot('header-right-button', { click })) ||
            h(SvgIcon, {
              props: {
                name: isPrev ? 'left-arrow' : 'right-arrow',
              },
            }),
        ],
      );
    };

    // Nav popover
    const getNavPopover = () =>
      h(Popover, {
        props: {
          id: this.sharedState.navPopoverId,
          contentClass: 'vc-nav-popover-container',
        },
        ref: 'navPopover',
        scopedSlots: {
          default: ({ data }) => {
            const { position, page } = data;
            return h(CalendarNav, {
              props: {
                value: page,
                position,
                validator: e => this.canMove(e, { position }),
              },
              on: {
                input: e => this.move(e, { position }),
              },
              scopedSlots: this.$scopedSlots,
            });
          },
        },
      });

    // Day popover
    const getDayPopover = () =>
      h(Popover, {
        props: {
          id: this.sharedState.dayPopoverId,
          contentClass: 'vc-day-popover-container',
        },
        scopedSlots: {
          default: ({ data: day, updateLayout, hide }) => {
            const attributes = Object.values(day.attributes).filter(
              a => a.popover,
            );
            const masks = this.$locale.masks;
            const format = this.formatDate;
            const dayTitle = format(day.date, masks.dayPopover);
            return (
              this.safeScopedSlot('day-popover', {
                day,
                attributes,
                masks,
                format,
                dayTitle,
                updateLayout,
                hide,
              }) ||
              h('div', [
                // Show popover header only if format is defined
                masks.dayPopover &&
                  h(
                    'div',
                    {
                      class: ['vc-day-popover-header'],
                    },
                    [dayTitle],
                  ),
                attributes.map(attribute =>
                  h(PopoverRow, {
                    key: attribute.key,
                    props: {
                      attribute,
                    },
                  }),
                ),
              ])
            );
          },
        },
      });

    // Renderer for calendar container
    return h(
      'div',
      {
        attrs: {
          'data-helptext':
            'Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year',
        },
        class: [
          'vc-container',
          `vc-${this.$theme.color}`,
          {
            'vc-is-expanded': this.isExpanded,
            'vc-is-dark': this.$theme.isDark,
          },
        ],
        on: {
          keydown: this.handleKeydown,
          mouseup: e => e.preventDefault(),
        },
        ref: 'container',
      },
      [
        getNavPopover(),
        h(
          'div',
          {
            class: [
              'vc-pane-container',
              { 'in-transition': this.inTransition },
            ],
          },
          [
            h(
              CustomTransition,
              {
                props: {
                  name: this.transitionName,
                },
                on: {
                  beforeEnter: () => {
                    this.inTransition = true;
                  },
                  afterEnter: () => {
                    this.inTransition = false;
                  },
                },
              },
              [
                h(
                  'div',
                  {
                    class: 'vc-pane-layout',
                    style: {
                      gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
                    },
                    attrs: {
                      ...this.$attrs,
                    },
                    key: arrayHasItems(this.pages) ? `${this.pages[0].key}${this.pages[0].view === 'weekly' ? this.pages[0].currentWeek : ''}` : '',
                  },
                  panes,
                ),
              ],
            ),
            h(
              'div',
              {
                class: [`vc-arrows-container title-${this.titlePosition_}`],
              },
              [getArrowButton(true), getArrowButton(false)],
            ),
            this.$scopedSlots.footer && this.$scopedSlots.footer(),
          ],
        ),
        getDayPopover(),
      ],
    );
  },
  mixins: [rootMixin, safeScopedSlotMixin],
  provide() {
    return {
      sharedState: this.sharedState,
    };
  },
  props: {
    rows: {
      type: Number,
      default: 1,
    },
    columns: {
      type: Number,
      default: 1,
    },
    step: Number,
    titlePosition: String,
    isExpanded: Boolean,
    fromDate: Date,
    toDate: Date,
    fromPage: Object,
    toPage: Object,
    minPage: Object,
    maxPage: Object,
    transition: String,
    attributes: [Object, Array],
    trimWeeks: Boolean,
    disablePageSwipe: Boolean,
    view: {
      type: String,
      default: 'monthly',
      require: false,
      validator(value) {
        return ['monthly', 'weekly'].includes(value);
      },
    },
  },
  data() {
    return {
      pages: [],
      store: null,
      lastFocusedDay: null,
      focusableDay: new Date().getDate(),
      transitionName: '',
      inTransition: false,
      sharedState: {
        navPopoverId: createGuid(),
        dayPopoverId: createGuid(),
        theme: {},
        masks: {},
        locale: {},
      },
    };
  },
  computed: {
    titlePosition_() {
      return this.propOrDefault('titlePosition', 'titlePosition');
    },
    firstPage() {
      return head(this.pages);
    },
    lastPage() {
      return last(this.pages);
    },
    minPage_() {
      return this.minPage || this.pageForDate(this.minDate);
    },
    maxPage_() {
      return this.maxPage || this.pageForDate(this.maxDate);
    },
    count() {
      return this.rows * this.columns;
    },
    step_() {
      return this.step || this.count;
    },
    canMovePrev() {
      return this.canMove(-this.step_);
    },
    canMoveNext() {
      return this.canMove(this.step_);
    },
  },
  watch: {
    $locale() {
      this.refreshLocale();
      this.refreshPages({ page: this.firstPage, ignoreCache: true });
      this.initStore();
    },
    $theme() {
      this.refreshTheme();
      this.initStore();
    },
    fromDate() {
      this.refreshPages();
    },
    fromPage(val) {
      const firstPage = this.pages && this.pages[0];
      if (pageIsEqualToPage(val, firstPage)) return;
      this.refreshPages();
    },
    toPage(val) {
      const lastPage = this.pages && this.pages[this.pages.length - 1];
      if (pageIsEqualToPage(val, lastPage)) return;
      this.refreshPages();
    },
    count() {
      this.refreshPages();
    },
    attributes: {
      handler(val) {
        const { adds, deletes } = this.store.refresh(val);
        this.refreshAttrs(this.pages, adds, deletes);
      },
      deep: true,
    },
    pages(val) {
      this.refreshAttrs(val, this.store.list, null, true);
    },
    disabledAttribute() {
      this.refreshDisabledDays();
    },
    lastFocusedDay(val) {
      if (val) {
        this.focusableDay = val.day;
        this.refreshFocusableDays();
      }
    },
    inTransition(val) {
      if (val) {
        this.$emit('transition-start');
      } else {
        this.$emit('transition-end');
        if (this.transitionPromise) {
          this.transitionPromise.resolve(true);
          this.transitionPromise = null;
        }
      }
    },
    view() {
      this.refreshPages({ page: this.pages[0], ignoreCache: true });
      this.refreshAttrs(this.pages, this.store.list, null, true);
    },
  },
  created() {
    this.refreshLocale();
    this.refreshTheme();
    this.initStore();
    this.refreshPages();
  },
  mounted() {
    const [currentPage] = this.pages;

    this.setCurrentWeekByDay(new Date().getDate());
    this.definePageTitle(currentPage);

    if (!this.disablePageSwipe) {
      // Add swipe handler to move to next and previous pages
      this.removeHandlers = addHorizontalSwipeHandler(
        this.$refs.container,
        ({ toLeft, toRight }) => {
          if (toLeft) {
            this.moveNext();
          } else if (toRight) {
            this.movePrev();
          }
        },
        this.$defaults.touch,
      );
    }
  },
  destroyed() {
    this.pages = [];
    this.store.destroy();
    this.store = null;
    this.sharedState = null;
    if (this.removeHandlers) this.removeHandlers();
  },
  methods: {
    definePageTitle(currentPage) {
      const isFirstWeek = currentPage.currentWeek === 0;
      const isLastWeek = currentPage.currentWeek === currentPage.lastWeek;
      if (isFirstWeek && !currentPage.weekDays[0][0].inMonth) {
        const currentDate = {
          month: currentPage.month,
          year: currentPage.year
        };
        const prevMonthDate = {
          month: currentPage.prevMonthComps.month,
          year: currentPage.prevMonthComps.year
        };
        currentPage.title = this.mixedWeekTitle(prevMonthDate, currentDate);
      } else if (isLastWeek && !currentPage.weekDays[currentPage.lastWeek][6].inMonth) {
        const currentDate = {
          month: currentPage.month,
          year: currentPage.year
        };
        const nextMonthDate = {
          month: currentPage.nextMonthComps.month,
          year: currentPage.nextMonthComps.year
        };
        currentPage.title = this.mixedWeekTitle(currentDate, nextMonthDate);
      } else {
        currentPage.title = this.$locale.format(new Date(currentPage.year, currentPage.month - 1, 15), this.$locale.masks.title);
      }
    },
    refreshLocale() {
      this.sharedState.locale = this.$locale;
      this.sharedState.masks = this.$locale.masks;
    },
    refreshTheme() {
      this.sharedState.theme = this.$theme;
    },
    canMove(arg, opts = {}) {
      const page = this.$locale.toPage(arg, this.firstPage);
      let { position } = opts;
      // Pin position if arg is number
      if (isNumber(arg)) position = 1;
      // Reject unresolved pages
      if (!page) {
        return Promise.reject(new Error(`Invalid argument provided: ${arg}`));
      }
      // Set position if unspecified and out of current bounds
      if (!position) {
        if (pageIsBeforePage(page, this.firstPage)) {
          position = -1;
        } else if (pageIsAfterPage(page, this.lastPage)) {
          position = 1;
        } else {
          // Page already displayed with no specified position, so we're done
          return Promise.resolve(true);
        }
      }
      // Calculate new page range without adjusting to min/max
      Object.assign(
        opts,
        this.getTargetPageRange(page, {
          position,
          force: true,
        }),
      );
      // Verify we can to move to any pages in the target range
      return pageRangeToArray(opts.fromPage, opts.toPage).some(p =>
        pageIsBetweenPages(p, this.minPage_, this.maxPage_),
      );
    },
    movePrev(opts) {
      return this.move(-this.step_, opts);
    },
    moveNext(opts) {
      return this.move(this.step_, opts);
    },
    move(arg, opts = {}) {
      // Reject if we can't move to this page
      const canMove = this.canMove(arg, opts);
      if (!opts.force && !canMove) {
        return Promise.reject(
          new Error(`Move target is disabled: ${JSON.stringify(opts)}`),
        );
      }
      // Hide nav popover for good measure
      this.$refs.navPopover.hide({ hideDelay: 0 });

      // Move pages on weekly view
      const [currentPage] = this.pages;

      const isHeaderNav = arg && typeof arg === 'object' && Object.keys(arg).includes(...['month', 'year']);

      if (!isHeaderNav && currentPage && currentPage.view === 'weekly') {
        if (opts.focusOnDay) {
          return Promise.all([
            this.refreshPages({
              ...opts,
              page: opts.fromPage,
              position: 1,
              force: true,
            }),
            this.setCurrentWeekByDay(opts.focusOnDay.day)
          ]);
        }

        const shouldMovePageWeek = this.adjustWeeklyPage(currentPage, opts.fromPage);

        if (shouldMovePageWeek) {
          this.definePageTitle(currentPage);

          this.refreshAttrs(this.pages, this.store.list, null, true);

          return Promise.resolve(true);
        }
      }

      // Move to new `fromPage` if it's different from the current one
      if (opts.fromPage && !pageIsEqualToPage(opts.fromPage, this.firstPage)) {
        return this.refreshPages({
          ...opts,
          page: opts.fromPage,
          position: 1,
          force: true,
          currentWeek: isHeaderNav ? 0 : null
        });
      }

      return Promise.resolve(true);
    },
    adjustWeeklyPage(currentPage, fromPage) {
      if (!currentPage || currentPage.view !== 'weekly') {
        return false;
      }

      if (fromPage.year !== currentPage.year) {
        if (fromPage.year > currentPage.year && currentPage.currentWeek < currentPage.lastWeek) {
          currentPage.currentWeek++;
          this.transitionName = this.getWeekpageTransition(false);
          return true;
        }

        if (fromPage.year < currentPage.year && currentPage.currentWeek > 0) {
          currentPage.currentWeek--;
          this.transitionName = this.getWeekpageTransition(true);
          return true;
        }

        return false;
      }

      const shouldIncrementWeek = fromPage.month > currentPage.month && currentPage.currentWeek < currentPage.lastWeek;
      if (shouldIncrementWeek) {
        currentPage.currentWeek++;
        this.transitionName = this.getWeekpageTransition(false);
        return true;
      }

      const shouldDecrementWeek = fromPage.month < currentPage.month && currentPage.currentWeek > 0;
      if (shouldDecrementWeek) {
        currentPage.currentWeek--;
        this.transitionName = this.getWeekpageTransition(true);
        return true;
      }

      return false;
    },
    setCurrentWeekByDay(day) {
      return new Promise((resolve, reject) => {
        const currentPage = this.pages[0];
        const { month } = currentPage;

        const { currentWeek, lastWeek } = currentPage;
        const weekDay = currentPage.days.find(d => d.day === day && d.month === month);

        if (!weekDay) {
          reject(new Error('Day not found in current page.'));
          return;
        }

        const week = weekDay.week;

        const isSameWeek = week === currentWeek;

        if (isSameWeek) {
          resolve(false);
          return;
        }

        if (week > lastWeek) {
          currentPage.currentWeek = lastWeek;
          resolve(true);
          return;
        }

        currentPage.currentWeek = week - 1;
        resolve(true);
      });
    },
    focusDate(date, opts = {}) {
      // Move to the given date
      return this.move(date, opts).then(() => {
        // Set focus on the element for the date
        const focusableEl = this.$el.querySelector(
          `.id-${this.$locale.getDayId(date)}.in-month .vc-focusable`,
        );
        if (focusableEl) {
          focusableEl.focus();
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
    },
    showPageRange(range, opts) {
      let fromPage;
      let toPage;
      if (isDate(range)) {
        fromPage = this.pageForDate(range);
      } else if (isObject(range)) {
        const { month, year } = range;
        const { from, to } = range;
        if (isNumber(month) && isNumber(year)) {
          fromPage = range;
        } else if (from || to) {
          fromPage = isDate(from) ? this.pageForDate(from) : from;
          toPage = isDate(to) ? this.pageForDate(to) : to;
        }
      } else {
        return Promise.reject(new Error('Invalid page range provided.'));
      }
      const lastPage = this.lastPage;
      let page = fromPage;
      // Offset page from the desired `toPage`
      if (pageIsAfterPage(toPage, lastPage)) {
        page = addPages(toPage, -(this.pages.length - 1));
      }
      // But no earlier than the desired `fromPage`
      if (pageIsBeforePage(page, fromPage)) {
        page = fromPage;
      }
      return this.refreshPages({ ...opts, page });
    },
    getTargetPageRange(page, { position, force } = {}) {
      let fromPage = null;
      let toPage = null;
      if (pageIsValid(page)) {
        let pagesToAdd = 0;
        position = +position;
        if (!isNaN(position)) {
          pagesToAdd = position > 0 ? 1 - position : -(this.count + position);
        }
        fromPage = addPages(page, pagesToAdd);
      } else {
        fromPage = this.getDefaultInitialPage();
      }
      toPage = addPages(fromPage, this.count - 1);
      // Adjust range for min/max if not forced
      if (!force) {
        if (pageIsBeforePage(fromPage, this.minPage_)) {
          fromPage = this.minPage_;
        } else if (pageIsAfterPage(toPage, this.maxPage_)) {
          fromPage = addPages(this.maxPage_, 1 - this.count);
        }
        toPage = addPages(fromPage, this.count - 1);
      }
      return { fromPage, toPage };
    },
    getDefaultInitialPage() {
      // 1. Try the fromPage prop
      let page = this.fromPage || this.pageForDate(this.fromDate);
      if (!pageIsValid(page)) {
        // 2. Try the toPage prop
        const toPage = this.toPage || this.pageForDate(this.toPage);
        if (pageIsValid(toPage)) {
          page = addPages(toPage, 1 - this.count);
        }
      }
      // 3. Try the first attribute
      if (!pageIsValid(page)) {
        page = this.getPageForAttributes();
      }
      // 4. Use today's page
      if (!pageIsValid(page)) {
        page = this.pageForThisMonth();
      }
      return page;
    },
    refreshPages({ page, position = 1, force, transition, ignoreCache, currentWeek } = {}) {
      return new Promise((resolve, reject) => {
        const { fromPage, toPage } = this.getTargetPageRange(page, {
          position,
          force,
        });
        // Create the new pages
        const pages = [];
        for (let i = 0; i < this.count; i++) {
          pages.push(this.buildPage({ ...addPages(fromPage, i), ignoreCache, currentWeek }));
        }
        // Refresh disabled days for new pages
        this.refreshDisabledDays(pages);
        // Refresh focusable days for new pages
        this.refreshFocusableDays(pages);
        // Assign the transition
        this.transitionName = this.getPageTransition(
          this.pages[0],
          pages[0],
          transition,
        );
        // Assign the new pages
        this.pages = pages;
        // Emit page update events
        this.$emit('update:from-page', fromPage);
        this.$emit('update:to-page', toPage);
        if (this.transitionName && this.transitionName !== 'none') {
          this.transitionPromise = {
            resolve,
            reject,
          };
        } else {
          resolve(true);
        }
      });
    },
    refreshDisabledDays(pages) {
      this.getPageDays(pages).forEach(d => {
        d.isDisabled =
          !!this.disabledAttribute && this.disabledAttribute.intersectsDay(d);
      });
    },
    refreshFocusableDays(pages) {
      this.getPageDays(pages).forEach(d => {
        d.isFocusable = d.inMonth && d.day === this.focusableDay;
      });
    },
    getPageDays(pages = this.pages) {
      return pages.reduce((prev, curr) => prev.concat(curr.days), []);
    },
    getPageTransition(oldPage, newPage, transition = this.transition) {
      if (transition === 'none') return transition;
      if (
        transition === 'fade' ||
        (!transition && this.count > 1) ||
        !pageIsValid(oldPage) ||
        !pageIsValid(newPage)
      ) {
        return 'fade';
      }
      // Moving to a previous page
      const movePrev = pageIsBeforePage(newPage, oldPage);
      // Vertical slide
      if (transition === 'slide-v') {
        return movePrev ? 'slide-down' : 'slide-up';
      }
      // Horizontal slide
      return movePrev ? 'slide-right' : 'slide-left';
    },
    getWeekpageTransition(isPrev, transition = this.transition) {
      if (transition === 'none') return transition;

      // Vertical slide
      if (transition === 'slide-v') {
        return isPrev ? 'slide-down' : 'slide-up';
      }
      // Horizontal slide
      return isPrev ? 'slide-right' : 'slide-left';
    },
    getPageForAttributes() {
      let page = null;
      const attr = this.store.pinAttr;
      if (attr && attr.hasDates) {
        let [date] = attr.dates;
        date = date.start || date.date;
        page = this.pageForDate(date);
      }
      return page;
    },
    buildPage({ month, year, currentWeek }, ignoreCache) {
      const key = `${year.toString()}-${month.toString()}`;
      let page = this.pages.find(p => p.key === key);
      if (!page || ignoreCache) {
        const date = new Date(year, month - 1, 15);
        const monthComps = this.$locale.getMonthComps(month, year);
        const prevMonthComps = this.$locale.getPrevMonthComps(month, year);
        const nextMonthComps = this.$locale.getNextMonthComps(month, year);
        page = {
          key,
          month,
          year,
          view: this.view,
          weeks: this.trimWeeks ? monthComps.weeks : 6,
          title: this.$locale.format(date, this.$locale.masks.title),
          shortMonthLabel: this.$locale.format(date, 'MMM'),
          monthLabel: this.$locale.format(date, 'MMMM'),
          shortYearLabel: year.toString().substring(2),
          yearLabel: year.toString(),
          monthComps,
          prevMonthComps,
          nextMonthComps,
          weekDays: [],
          canMove: pg => this.canMove(pg),
          move: pg => this.move(pg),
          moveThisMonth: () => this.moveThisMonth(),
          movePrevMonth: () => this.move(prevMonthComps),
          moveNextMonth: () => this.move(nextMonthComps),
          refresh: true,
        };
        // Assign day info
        page.days = this.$locale.getCalendarDays(page);

        if (this.view === 'weekly') {
          const pageWeeks = page.days.reduce((acc, day) => {
            const { weeks } = acc;
            const lastWeekFull = weeks[weeks.length - 1] && weeks[weeks.length - 1].length >= 7;

            if (day.inNextMonth && lastWeekFull) {
              return acc;
      }

            if (!weeks[weeks.length - 1] || lastWeekFull) {
              return {
                weeks: [...weeks, [day]]
              };
            }

            return {
              weeks: [...weeks.slice(0, -1), [...weeks[weeks.length - 1], day]]
            };
          }, { weeks: [] });

          page.weekDays = pageWeeks.weeks;

          page.lastWeek = page.weekDays.length - 1;

          const [currentPage] = this.pages;

          if (typeof currentWeek === 'number') {
            page.currentWeek = currentWeek;
          } else if (currentPage) {
            const isFirstWeekdayInNewMonth = page.weekDays[0][0].inMonth ? 0 : 1;
            const isLastWeekdayInNewMonth = page.weekDays[page.weekDays.length - 1][6].inMonth ? 0 : 1;

            const isNewPageAfterCurrent = page.year > currentPage.year || (page.year === currentPage.year && page.month > currentPage.month);
            page.currentWeek = isNewPageAfterCurrent ? isFirstWeekdayInNewMonth : page.lastWeek - isLastWeekdayInNewMonth;
          } else {
            page.currentWeek = 0;
      }

          if (page.currentWeek === 0) {
            const currentDate = {
              month: page.month,
              year: page.year
            };

            const prevMonthDate = {
              month: page.prevMonthComps.month,
              year: page.prevMonthComps.year
            };

            page.title = this.mixedWeekTitle(prevMonthDate, currentDate);
          }
        }
      }

      return page;
    },
    mixedWeekTitle(oldDate, newDate) {
      const { month: oldMonth, year: oldYear } = oldDate;
      const { month: newMonth, year: newYear } = newDate;

      const oldTitle = this.$locale.format(new Date(oldYear, oldMonth - 1, 1), 'MMM');
      const newTitle = this.$locale.format(new Date(newYear, newMonth - 1, 1), 'MMM');

      return oldYear === newYear
        ? `${oldTitle} - ${newTitle} ${oldYear}`
        : `${oldTitle} ${oldYear} - ${newTitle} ${newYear}`;
    },
    initStore() {
      // Create a new attribute store
      this.store = new AttributeStore(
        this.$theme,
        this.$locale,
        this.attributes,
      );
      // Refresh attributes for existing pages
      this.refreshAttrs(this.pages, this.store.list, [], true);
    },
    refreshAttrs(pages = [], adds = [], deletes = [], reset) {
      if (!arrayHasItems(pages)) return;
      // For each page...
      pages.forEach(p => {
        // For each day...
        p.days.forEach(d => {
          let map = {};
          // If resetting...
          if (reset) {
            d.refresh = true;
          } else if (hasAny(d.attributesMap, deletes)) {
            // Delete attributes from the delete list
            map = omit(d.attributesMap, deletes);
            // Flag day for refresh
            d.refresh = true;
          } else {
            // Get the existing attributes
            map = d.attributesMap || {};
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
              d.refresh = true;
            }
          });
          // Reassign day attributes
          if (d.refresh) {
            d.attributesMap = map;
          }
        });
      });
      // Refresh pages
      this.$nextTick(() => {
        this.$refs.pages.forEach(p => p.refresh());
      });
    },
    handleKeydown(e) {
      const day = this.lastFocusedDay;
      if (day != null) {
        day.event = e;
        this.handleDayKeydown(day);
      }
    },
    handleDayKeydown(day) {
      const { dateFromTime, event } = day;
      // Set to noon to offset any daylight savings time offset
      const date = dateFromTime(12);
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
        this.focusDate(newDate).catch(() => {});
      }
    },
  },
};
</script>

<style lang="postcss">
.vc-pane-container {
  width: 100%;
  position: relative;
  &.in-transition {
    overflow: hidden;
  }
}

.vc-pane-layout {
  display: grid;
}

.vc-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
  color: var(--gray-600);
  border-width: 2px;
  border-style: solid;
  border-radius: var(--rounded);
  border-color: transparent;
  &:hover {
    background: var(--gray-200);
  }
  &:focus {
    border-color: var(--gray-300);
  }

  &.is-disabled {
    opacity: 0.25;
    pointer-events: none;
    cursor: not-allowed;
  }
}

.vc-day-popover-container {
  color: var(--white);
  background-color: var(--gray-800);
  border: 1px solid;
  border-color: var(--gray-700);
  border-radius: var(--rounded);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  padding: 4px 8px;
  box-shadow: var(--shadow);
}

.vc-day-popover-header {
  font-size: var(--text-xs);
  color: var(--gray-300);
  font-weight: var(--font-semibold);
  text-align: center;
}

.vc-arrows-container {
  width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  pointer-events: none;
  &.title-left {
    justify-content: flex-end;
  }
  &.title-right {
    justify-content: flex-start;
  }
}

.vc-is-dark {
  & .vc-arrow {
    color: var(--white);
    &:hover {
      background: var(--gray-800);
    }
    &:focus {
      border-color: var(--gray-700);
    }
  }
  & .vc-day-popover-container {
    color: var(--gray-800);
    background-color: var(--white);
    border-color: var(--gray-100);
  }
  & .vc-day-popover-header {
    color: var(--gray-700);
  }
}
</style>
