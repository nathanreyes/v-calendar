<script>
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';
import Popover from './Popover';
import PopoverRow from './PopoverRow';
import Grid from './Grid';
import CalendarPane from './CalendarPane';
import CustomTransition from './CustomTransition';
import SvgIcon from './SvgIcon';
import AttributeStore from '../utils/attributeStore';
import { rootMixin, safeScopedSlotMixin } from '../utils/mixins';
import { addHorizontalSwipeHandler } from '../utils/touch';
import {
  pageForDate,
  pageForThisMonth,
  addPages,
  pageIsValid,
  pageIsEqualToPage,
  pageIsBeforePage,
  pageIsAfterPage,
  pageIsBetweenPages,
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
    const panes = this.pages.map((page, i) =>
      h(CalendarPane, {
        attrs: {
          ...this.$attrs,
          attributes: this.store,
        },
        props: {
          titlePosition: this.titlePosition_,
          page,
          minPage: this.minPage_,
          maxPage: this.maxPage_,
          canMove: this.canMove,
        },
        on: {
          ...this.$listeners,
          'update:page': e => this.refreshPages({ page: e, position: i + 1 }),
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
      }),
    );
    // Renderer for calendar arrows
    const getArrowButton = isPrev => {
      const click = () => this.move(isPrev ? -this.step_ : this.step_);
      const keydown = e => onSpaceOrEnter(e, click);
      const isDisabled = isPrev ? !this.canMovePrev : !this.canMoveNext;
      return h(
        'div',
        {
          class: ['vc-arrow', { 'is-disabled': isDisabled }],
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
    const getContainerGrid = () =>
      h(
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
                    Grid,
                    {
                      class: 'grid',
                      props: {
                        rows: this.rows,
                        columns: this.columns,
                        columnWidth: 'minmax(256px, 1fr)',
                        disableFocus: true,
                      },
                      attrs: {
                        ...this.$attrs,
                      },
                      key: arrayHasItems(this.pages) ? this.pages[0].key : '',
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

    return getContainerGrid();
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
    disablePageSwipe: Boolean,
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
      return this.minPage || pageForDate(this.normalizeDate(this.minDate));
    },
    maxPage_() {
      return this.maxPage || pageForDate(this.normalizeDate(this.maxDate));
    },
    count() {
      return this.rows * this.columns;
    },
    step_() {
      return this.step || this.count;
    },
    canMovePrev() {
      return (
        !pageIsValid(this.minPage_) ||
        pageIsAfterPage(this.pages[0], this.minPage_)
      );
    },
    canMoveNext() {
      return (
        !pageIsValid(this.maxPage_) ||
        pageIsBeforePage(this.pages[this.pages.length - 1], this.maxPage_)
      );
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
    timezone() {
      // Refresh pages to reset the time boundaries
      this.refreshPages({ ignoreCache: true });
      // Refresh attributes
      this.refreshAttrs(this.pages, this.store.list, null, true);
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
    attributes(val) {
      const { adds, deletes } = this.store.refresh(val);
      this.refreshAttrs(this.pages, adds, deletes);
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
          this.transitionPromise.resolve();
          this.transitionPromise = null;
        }
      }
    },
  },
  created() {
    this.refreshLocale();
    this.refreshTheme();
    this.initStore();
    this.refreshPages();
  },
  mounted() {
    if (!this.disablePageSwipe) {
      // Add swipe handler to move to next and previous pages
      const removeHandlers = addHorizontalSwipeHandler(
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
      // Clean up on destroy
      this.$once('beforeDestroy', () => removeHandlers());
    }
  },
  methods: {
    refreshLocale() {
      this.sharedState.locale = this.$locale;
      this.sharedState.masks = this.$locale.masks;
    },
    refreshTheme() {
      this.sharedState.theme = this.$theme;
    },
    canMove(page) {
      return pageIsBetweenPages(page, this.minPage_, this.maxPage_);
    },
    async movePrev(opts) {
      const result = await this.move(-this.step_, opts);
      return result;
    },
    async moveNext(opts) {
      const result = this.move(this.step_, opts);
      return result;
    },
    async move(arg, opts) {
      const page = this.$locale.toPage(arg, this.pages[0]);
      if (!page) {
        return null;
      }
      const result = await this.refreshPages({
        ...opts,
        page,
      });
      return result;
    },
    async focusDate(date, opts = {}) {
      const page = pageForDate(date);
      // Calculate new fromPage
      let fromPage = null;
      if (opts.position) {
        fromPage = this.getTargetPageRange(page, opts.position).fromPage;
      } else if (pageIsBeforePage(page, this.firstPage)) {
        fromPage = this.getTargetPageRange(page, -1).fromPage;
      } else if (pageIsAfterPage(page, this.lastPage)) {
        fromPage = this.getTargetPageRange(page, 1).fromPage;
      }
      // Move to new fromPage if it's different from the current one
      if (fromPage && !pageIsEqualToPage(fromPage, this.pages[0])) {
        await this.refreshPages({
          ...opts,
          position: 1,
          page: fromPage,
        });
      }
      // Set focus on the element for the date
      const focusableEl = this.$el.querySelector(
        `.id-${this.$locale.getDayId(date)}.in-month .vc-focusable`,
      );
      if (focusableEl) {
        focusableEl.focus();
      }
    },
    async showPageRange(range, opts) {
      let fromPage;
      let toPage;
      if (isDate(range)) {
        fromPage = pageForDate(range);
      } else if (isObject(range)) {
        const { month, year } = range;
        const { from, to } = range;
        if (isNumber(month) && isNumber(year)) {
          fromPage = range;
        } else if (from || to) {
          fromPage = isDate(from) ? pageForDate(from) : from;
          toPage = isDate(to) ? pageForDate(to) : to;
        }
      } else {
        return;
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
      await this.refreshPages({ ...opts, page });
    },
    getTargetPageRange(page, position) {
      // Calculate the page to start displaying from
      let fromPage = null;
      // 1. Try the page parameter
      if (pageIsValid(page)) {
        const pagesToAdd =
          position > 0 ? 1 - position : -(this.count + position);
        fromPage = addPages(page, pagesToAdd);
      } else {
        // 2. Try the fromPage prop
        fromPage =
          this.fromPage || pageForDate(this.normalizeDate(this.fromDate));
        if (!pageIsValid(fromPage)) {
          // 3. Try the toPage prop
          const toPage =
            this.toPage || pageForDate(this.normalizeDate(this.toPage));
          if (pageIsValid(toPage)) {
            fromPage = addPages(toPage, 1 - this.count);
          } else {
            // 4. Try the first attribute
            fromPage = this.getPageForAttributes();
          }
        }
      }
      // 5. Fall back to today's page
      fromPage = pageIsValid(fromPage) ? fromPage : pageForThisMonth();
      // Adjust from page within allowed min/max pages
      const toPage = addPages(fromPage, this.count - 1);
      if (pageIsBeforePage(fromPage, this.minPage_)) {
        fromPage = this.minPage_;
      } else if (pageIsAfterPage(toPage, this.maxPage_)) {
        fromPage = addPages(this.maxPage_, 1 - this.count);
      }
      return { fromPage, toPage };
    },
    async refreshPages({ page, position = 1, transition, ignoreCache } = {}) {
      return new Promise((resolve, reject) => {
        const { fromPage, toPage } = this.getTargetPageRange(page, position);
        // Create the new pages
        const pages = [];
        for (let i = 0; i < this.count; i++) {
          pages.push(this.buildPage(addPages(fromPage, i), ignoreCache));
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
          resolve();
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
    getPageForAttributes() {
      let page = null;
      const attr = this.store.pinAttr;
      if (attr && attr.hasDates) {
        let [date] = attr.dates;
        date = date.start || date.date;
        page = pageForDate(this.normalizeDate(date));
      }
      return page;
    },
    buildPage({ month, year }, ignoreCache) {
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
          title: this.$locale.format(date, this.$locale.masks.title),
          shortMonthLabel: this.$locale.format(date, 'MMM'),
          monthLabel: this.$locale.format(date, 'MMMM'),
          shortYearLabel: year.toString().substring(2),
          yearLabel: year.toString(),
          monthComps,
          prevMonthComps,
          nextMonthComps,
          canMove: pg => this.canMove(pg),
          move: pg => this.move(pg),
          moveThisMonth: () => this.moveThisMonth(),
          movePrevMonth: () => this.move(prevMonthComps),
          moveNextMonth: () => this.move(nextMonthComps),
          refresh: true,
        };
        // Assign day info
        page.days = this.$locale.getCalendarDays(page, this.timezone);
      }
      return page;
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
      const { date, event } = day;
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
        this.focusDate(newDate);
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

.vc-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
  color: var(--gray-600);
  border-width: 2px;
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
