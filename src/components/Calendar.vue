<script>
import Popover from './Popover';
import PopoverRow from './PopoverRow';
import Grid from './Grid';
import CalendarPane from './CalendarPane';
import CustomTransition from './CustomTransition';
import SvgIcon from './SvgIcon';
import AttributeStore from '@/utils/attributeStore';
import { propOrDefaultMixin, rootMixin } from '@/utils/mixins';
import { addHorizontalSwipeHandler } from '@/utils/touch';
import {
  pageForDate,
  pageForThisMonth,
  addPages,
  pageIsValid,
  pageIsBeforePage,
  pageIsAfterPage,
  pageIsBetweenPages,
  createGuid,
} from '@/utils/helpers';
import { isNumber, isFunction } from '@/utils/_';

export default {
  name: 'VCalendar',
  render(h) {
    // Renderer for calendar panes
    const getPaneComponent = ({ position }) =>
      h(CalendarPane, {
        attrs: {
          ...this.$attrs,
          attributes: this.attributes_,
        },
        props: {
          titlePosition: this.titlePosition_,
          page: this.pages[position - 1],
          minPage: this.minPage_,
          maxPage: this.maxPage_,
          canMove: this.canMove,
        },
        on: {
          ...this.$listeners,
          'update:page': e => this.refreshPages({ page: e, position }),
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
      const isDisabled = isPrev ? !this.canMovePrev : !this.canMoveNext;
      const onClick = isPrev ? this.movePrev : this.moveNext;
      return h(
        'span',
        {
          class: 'vc-arrow-layout',
          attrs: {
            tabindex: '0',
          },
        },
        [
          slot ||
            h(SvgIcon, {
              class: [
                'vc-arrow vc-cursor-pointer vc-select-none',
                { 'vc-disabled': isDisabled },
                this.theme_.arrows,
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

    // Renderer for popover
    const getDayPopover = () => {
      return h(Popover, {
        props: {
          id: this.sharedState.dayPopoverId,
          contentClass: this.theme_.dayPopoverContainer,
        },
        scopedSlots: {
          default: ({ args: day, updateLayout, hide }) => {
            const attributes = day.attributes.filter(a => a.popover);
            const masks = this.locale_.masks;
            const format = this.format;
            const dayTitle = format(day.date, masks.dayPopover);
            return isFunction(this.$scopedSlots['day-popover'])
              ? this.$scopedSlots['day-popover']({
                  day,
                  attributes,
                  masks,
                  format,
                  dayTitle,
                  updateLayout,
                  hide,
                })
              : h('div', [
                  // Show popover header only if format is defined
                  masks.dayPopover &&
                    h(
                      'div',
                      {
                        class: ['vc-text-center', this.theme_.dayPopoverHeader],
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
                ]);
          },
        },
      });
    };

    // Renderer for calendar container
    const getContainerGrid = () =>
      h(
        'div',
        {
          class: [
            'vc-container',
            'vc-relative',
            {
              'vc-min-w-full': this.isExpanded,
            },
            this.theme_.container,
          ],
          ref: 'container',
        },
        [
          h(
            'div',
            {
              class: [
                'vc-w-full vc-relative',
                { 'vc-overflow-hidden': this.inTransition },
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
                      columnWidth: 'minmax(256px, 1fr)',
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
              h(
                'div',
                {
                  class: [`vc-arrows-container title-${this.titlePosition_}`],
                },
                [getArrowButton(true), getArrowButton(false)],
              ),
            ],
          ),
          getDayPopover(),
        ],
      );

    return getContainerGrid();
  },
  mixins: [propOrDefaultMixin, rootMixin],
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
    minDate: null,
    maxDate: null,
    minPage: Object,
    maxPage: Object,
    transition: String,
    attributes: [Object, Array],
    disablePageSwipe: Boolean,
  },
  data() {
    return {
      pages: [],
      transitionName: '',
      inTransition: false,
      isRefreshing: false,
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
    attributes_() {
      return this.attributes instanceof AttributeStore
        ? this.attributes
        : new AttributeStore(this.attributes, this.theme_, this.locale_);
    },
  },
  watch: {
    locale_() {
      this.refreshLocale();
    },
    theme_() {
      this.refreshTheme();
    },
    fromPage() {
      this.refreshPages();
    },
    toPage() {
      this.refreshPages();
    },
    count() {
      this.refreshPages();
    },
  },
  created() {
    this.refreshLocale();
    this.refreshTheme();
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
        this.$vc.defaults.touch,
      );
      // Clean up on destroy
      this.$once('beforeDestroy', () => removeHandlers());
    }
  },
  methods: {
    refreshLocale() {
      this.sharedState.locale = this.locale_;
      this.sharedState.masks = this.locale_.masks;
    },
    refreshTheme() {
      this.sharedState.theme = this.theme_;
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
      const attr = this.attributes_.pinAttr;
      if (attr && attr.hasDates) {
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
          title: this.locale_.format(date, this.locale_.masks.title),
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
  },
};
</script>

<style lang="postcss" scoped>
.vc-container {
  --slide-translate: 22px;
  --slide-duration: 0.15s;
  --slide-timing: ease;

  --header-padding: 10px 10px 0 10px;
  --title-padding: 0 8px;
  --arrows-padding: 10px;
  --arrow-font-size: 1.6rem;
  --weekday-padding: 5px 0;
  --weeks-padding: 5px 6px 7px 6px;
  --arrow-horizontal-offset: 10px;
  --arrow-vertical-offset: 11px;

  --day-content-width: 1.8rem;
  --day-content-height: 1.8rem;
  --day-content-transition-time: 0.13s ease-in;

  --dot-diameter: 5px;
  --dot-border-radius: 50%;
  --dot-spacing: 3px;

  --bar-height: 3px;
  --bars-width: 75%;

  font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  width: max-content;
  & /deep/ * {
    box-sizing: inherit;
    &:focus {
      outline: none;
    }
  }
}

.vc-arrows-container {
  width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  padding: var(--arrows-padding);
  pointer-events: none;
  &.title-left {
    justify-content: flex-end;
  }
  &.title-right {
    justify-content: flex-start;
  }
}

.vc-arrow-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
}

.vc-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
