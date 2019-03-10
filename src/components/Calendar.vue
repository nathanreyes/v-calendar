<script>
import Popover from './Popover';
import Grid from './Grid';
import CalendarPane from './CalendarPane';
import CustomTransition from './CustomTransition';
import CalendarDayPopovers from './CalendarDayPopovers';
import SvgIcon from './SvgIcon';
import AttributeStore from '../utils/attributeStore';
import {
  pageForDate,
  pageForThisMonth,
  addPages,
  pageIsValid,
  pageIsBeforePage,
  pageIsAfterPage,
  pageIsBetweenPages,
  arrayHasItems,
  createGuid,
  toDate,
} from '@/utils/helpers';
import Locale from '@/utils/locale';
import { generateTheme } from '@/utils/theme';
import { isNumber } from '@/utils/_';

export default {
  name: 'Calendar',
  render(h) {
    // Renderer for calendar panes
    const getPaneComponent = ({ position }) =>
      h(CalendarPane, {
        attrs: {
          ...this.$attrs,
          attributes: this.attributes_,
        },
        props: {
          position,
          page: this.pages[position - 1],
          minPage: this.minPage_,
          maxPage: this.maxPage_,
          canMove: this.canMove,
          formats: this.formats_,
        },
        on: {
          ...this.$listeners,
          'update:page': e =>
            this.refreshPages({ page: e, position: position }),
        },
        slots: this.$slots,
        scopedSlots: this.$scopedSlots,
      });

    // Renderer for calendar arrows
    const getArrowButton = isPrev => {
      const slot =
        (isPrev && this.$slots.headerLeftButton) ||
        (!isPrev && this.$slots.headerRightButton);
      const svgName = isPrev ? 'left-arrow' : 'right-arrow';
      const directionClass = isPrev ? 'is-left' : 'is-right';
      const isDisabled = isPrev ? !this.canMovePrev : !this.canMoveNext;
      const onClick = isPrev ? this.movePrev : this.moveNext;
      return h(
        'span',
        {
          class: ['vc-arrow-layout', { [directionClass]: true }],
          attrs: {
            tabindex: '0',
          },
        },
        [
          slot ||
            h(SvgIcon, {
              class: [
                'vc-arrow',
                { [directionClass]: true, 'vc-disabled': isDisabled },
                this.sharedState.theme.arrows,
              ],
              props: {
                name: svgName,
              },
              on: {
                click: onClick,
              },
            }),
        ],
      );
    };
    // Renderer for calendar container
    const getContainerGrid = () =>
      h(
        'div',
        {
          class: [
            'vc-pane-container',
            {
              'is-expanded': this.isExpanded,
            },
            this.sharedState.theme.container,
          ],
          on: {
            touchstart: this.touchStart,
            touchmove: this.touchMove,
            touchend: this.touchEnd,
          },
        },
        [
          h(
            'div',
            {
              class: [
                'c-pane-transition',
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
                  h(Grid, {
                    key: this.pages[0].key,
                    class: 'grid',
                    props: {
                      rows: this.rows,
                      columns: this.columns,
                      gap: this.gap,
                      columnWidth: 'minmax(256px, 1fr)',
                      innerBorderClass: 'c-pane-inner-border',
                    },
                    attrs: {
                      ...this.$attrs,
                    },
                    scopedSlots: {
                      default: getPaneComponent,
                    },
                  }),
                ],
              ),
              getArrowButton(true),
              getArrowButton(false),
            ],
          ),
          h(Popover, {
            props: {
              id: this.sharedState.dayPopoverId,
              align: 'center',
              contentClass: `c-day ${
                this.sharedState.theme.dayPopoverContainer
              }`,
            },
            scopedSlots: {
              default: ({ args: day }) => {
                return h(CalendarDayPopovers, {
                  props: {
                    day,
                    formats: this.formats_,
                  },
                  scopedSlots: this.$scopedSlots,
                });
              },
            },
          }),
        ],
      );

    return getContainerGrid();
  },
  provide() {
    return {
      sharedState: this.sharedState,
    };
  },
  props: {
    color: { type: String, default: 'blue' },
    isDark: { type: Boolean, default: false },
    rows: {
      type: Number,
      default: 1,
    },
    columns: {
      type: Number,
      default: 1,
    },
    step: Number,
    gap: {
      type: String,
      default: '1px',
    },
    isExpanded: Boolean,
    fromDate: Date,
    toDate: Date,
    fromPage: Object,
    toPage: Object,
    minDate: null,
    maxDate: null,
    minPage: Object,
    maxPage: Object,
    transition: String,
    attributes: Array,
    formats: Object,
    theme: Object,
    locale: String,
  },
  data() {
    return {
      pages: [],
      touchState: {},
      transitionName: '',
      inTransition: false,
      isRefreshing: false,
      sharedState: {
        dayPopoverId: createGuid(),
        theme: {},
        formats: {},
        locale: {},
      },
    };
  },
  computed: {
    minPage_() {
      return this.minPage || pageForDate(this.locale_.toDate(this.minDate));
    },
    maxPage_() {
      return this.maxPage || pageForDate(this.locale_.toDate(this.maxDate));
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
    formats_() {
      return {
        ...this.$vc.formats,
        ...this.formats,
      };
    },
    attributes_() {
      return AttributeStore(this.attributes, this.locale_);
    },
    locale_() {
      return this.$vc.getLocale(this.locale);
    },
  },
  watch: {
    fromPage() {
      this.refreshPages();
    },
    toPage() {
      this.refreshPages();
    },
    color() {
      this.refreshTheme();
    },
    isDark() {
      this.refreshTheme();
    },
    theme(val) {
      this.refreshTheme();
    },
    formats_() {
      this.refreshFormats();
    },
    locale_() {
      this.refreshLocale();
    },
  },
  created() {
    this.refreshTheme();
    this.refreshFormats();
    this.refreshLocale();
    this.refreshPages();
  },
  methods: {
    refreshFormats() {
      this.sharedState.formats = this.formats_;
    },
    refreshLocale() {
      this.sharedState.locale = this.locale_;
    },
    refreshTheme() {
      this.sharedState.theme = generateTheme({
        color: this.color,
        isDark: this.isDark,
        config: this.theme,
      });
    },
    canMove(page) {
      return pageIsBetweenPages(page, this.minPage_, this.maxPage_);
    },
    movePrev() {
      this.move(-this.step_);
    },
    moveNext() {
      this.move(this.step_);
    },
    move(monthsOrPage) {
      if (isNumber(monthsOrPage)) {
        this.refreshPages({
          page: addPages(this.pages[0], monthsOrPage),
          position: 1,
        });
      }
    },
    refreshPages({ page, position = 1 } = {}) {
      // Exit if we just finished refreshing
      if (this.isRefreshing) return;
      // Calculate the page to start displaying from
      let fromPage = null;
      // 1. Try the page parameter
      if (pageIsValid(page)) {
        fromPage = addPages(page, -(position - 1));
      } else {
        // 2. Try the fromPage prop
        fromPage =
          this.fromPage || pageForDate(this.locale_.toDate(this.fromDate));
        if (!pageIsValid(fromPage)) {
          // 3. Try the toPage prop
          const toPage =
            this.toPage || pageForDate(this.locale_.toDate(this.toPage));
          if (pageIsValid(toPage)) {
            fromPage = addPages(toPage, -(this.count - 1));
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
        fromPage = addPages(this.maxPage_, -(this.count - 1));
      }
      this.isRefreshing = true;
      // Create the new pages
      const pages = [...Array(this.count).keys()].map(i =>
        this.buildPage(addPages(fromPage, i)),
      );
      // Assign the new transition
      this.transitionName = this.getPageTransition(this.pages[0], pages[0]);
      // Assign the new pages
      this.pages = pages;
      // Emit page update events
      this.$emit('update:frompage', fromPage);
      this.$emit('update:fromPage', fromPage);
      this.$emit('update:topage', toPage);
      this.$emit('update:toPage', toPage);
      // Not refreshing anymore
      this.$nextTick(() => (this.isRefreshing = false));
    },
    getPageTransition(oldPage, newPage) {
      if (this.transition === 'none') return this.transition;
      if (
        this.transition === 'fade' ||
        (!this.transition && this.count > 1) ||
        !pageIsValid(oldPage) ||
        !pageIsValid(newPage)
      ) {
        return 'fade';
      }
      // Moving to a previous page
      const movePrev = pageIsBeforePage(newPage, oldPage);
      // Vertical slide
      if (this.transition === 'slide-v') {
        return movePrev ? 'slide-down' : 'slide-up';
      }
      // Horizontal slide
      return movePrev ? 'slide-right' : 'slide-left';
    },
    getPageForAttributes() {
      const attr = this.attributes_.find(attr => attr.pinPage);
      if (attr && arrayHasItems(attr.dates)) {
        let [date] = attr.dates;
        date = date.start || date.date;
        return pageForDate(this.locale_.toDate(date));
      }
      return null;
    },
    buildPage({ month, year }, position) {
      const key = `${year.toString()}.${month.toString()}`;
      let page = this.pages.find(p => p.key === key);
      if (!page) {
        const date = new Date(year, month - 1, 15);
        const monthComps = this.locale_.getMonthComps(month, year);
        const prevMonthComps = this.locale_.getPrevMonthComps(month, year);
        const nextMonthComps = this.locale_.getNextMonthComps(month, year);
        page = {
          key,
          month,
          year,
          title: this.locale_.format(date, this.formats_.title),
          shortMonthLabel: this.locale_.format(date, 'MMM'),
          monthLabel: this.locale_.format(date, 'MMMM'),
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
        };
      }
      // Reassign position if needed
      page.position = position;
      return page;
    },
    touchStart(e) {
      const t = e.changedTouches[0];
      this.touchState = {
        active: true,
        startX: t.screenX,
        startY: t.screenY,
        startTime: new Date().getTime(),
        isSwiping: false,
        isMonitoringSwipe: true,
      };
    },
    touchMove(e) {
      if (!this.touchState.isMonitoringSwipe) {
        if (this.touchState.isSwiping) e.preventDefault();
        return;
      }
      const deltaTime = new Date().getTime() - this.touchState.startTime;
      if (deltaTime <= 5) {
        e.preventDefault();
        return;
      }
      const t = e.changedTouches[0];
      const deltaX = t.screenX - this.touchState.startX;
      const deltaY = t.screenY - this.touchState.startY;
      if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        this.touchState.isSwiping = true;
        e.preventDefault();
      }
      this.touchState.isMonitoringSwipe = false;
    },
    touchEnd(e) {
      const t = e.changedTouches[0];
      const deltaX = t.screenX - this.touchState.startX;
      const deltaY = t.screenY - this.touchState.startY;
      const deltaTime = new Date().getTime() - this.touchState.startTime;
      if (deltaTime < this.$vc.defaults.maxSwipeTime) {
        if (
          Math.abs(deltaX) >= this.$vc.defaults.minHorizontalSwipeDistance &&
          Math.abs(deltaY) <= this.$vc.defaults.maxVerticalSwipeDistance
        ) {
          // Swipe left
          if (deltaX < 0) {
            // Move to previous month
            this.moveNext();
          } else {
            // Move to next month
            this.movePrev();
          }
        }
      }
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'
@import '../styles/mixins.sass'

/deep/ .vc-popover-content.vc-day
  padding: $day-popover-padding

.vc-pane-container
  position: relative
  font-family: $font-family
  line-height: 1.5
  width: max-content
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  box-sizing: border-box
  &.is-expanded
    min-width: 100%
  .c-pane-transition
    width: 100%
    position: relative
    &.in-transition
      overflow: hidden
  /deep/ *
    box-sizing: inherit
    &:focus
      outline: none

.vc-arrow-layout
  +box()
  position: absolute
  top: $arrow-vertical-offset
  &.is-left
    left: $arrow-horizontal-offset
  &.is-right
    right: $arrow-horizontal-offset

.vc-arrow
  +box()
  transition: $arrow-transition
  cursor: pointer
  user-select: none
  &.vc-disabled
    cursor: not-allowed
    pointer-events: none
    opacity: 0.2
  &:hover
    fill-opacity: 0.5

</style>
