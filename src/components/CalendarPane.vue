<template>
  <div
    class='c-pane'>
    <!--Header-->
    <div class='c-header-wrapper'>
      <!--Header vertical divider-->
      <div
        :style='verticalDividers.header'
        v-if='verticalDividers.header'>
      </div>
      <!--Header slot-->
      <slot name='header' :page='page_'>
        <div class='c-header' :style='headerStyle'>
          <!--Header prev button-->
          <div class='c-arrow-layout'>
            <slot name='header-left-button' :page='page_'>
              <span
                class='c-arrow vc-angle-left'
                :class='{ "c-disabled": !canMovePrevMonth }'
                :style='arrowStyle'
                @click='movePrevMonth'>
              </span>
            </slot>
          </div>
          <!--Header title-->
          <transition-group
            tag='div'
            :class='["c-title", titleClass]'
            :name='titleTransition_'>
            <div
              class='c-title-1'
              v-for='p in pages'
              :key='p.key'
              v-if='p === page_'>
              <slot name='header-title' :page='p'>
                <div
                  class='c-title-2'
                  :style='titleStyle'
                  @click='moveThisMonth'>
                  {{ p.headerLabel }}
                </div>
              </slot>
            </div>
          </transition-group>
          <!--Header next button-->
          <div class='c-arrow-layout'>
            <slot name='header-right-button' :page='page_'>
              <span
                class='c-arrow vc-angle-right'
                :class='{ "c-disabled": !canMoveNextMonth }'
                :style='arrowStyle'
                @click='moveNextMonth'>
              </span>
            </slot>
          </div>
        </div>
      </slot>
    </div>
    <!--Header horizontal divider-->
    <div
      class='c-horizontal-divider'
      :style='headerHorizontalDividerStyle_'
      v-if='headerHorizontalDividerStyle_'>
    </div>
    <!--Weekdays-->
    <div class='c-weekdays-wrapper'>
      <!--Weekday vertical divider-->
      <div
        :style='verticalDividers.weekdays'
        v-if='verticalDividers.weekdays'>
      </div>
      <div
        class='c-weekdays'
        :style='weekdayStyle_'>
        <!--Weekday labels-->
        <div
          v-for='weekday in weekdayLabels_'
          :key='weekday'
          class='c-weekday'>
          {{ weekday }}
        </div>
      </div>
    </div>
    <!--Weekday horizontal divider-->
    <div
      class='c-horizontal-divider'
      :style='weekdaysHorizontalDividerStyle_'
      v-if='weekdaysHorizontalDividerStyle_'>
    </div>
    <!--Weeks-->
    <div class='c-weeks-wrapper'>
      <!--Weeks vertical divider-->
      <div
        :style='verticalDividers.weeks'
        v-if='verticalDividers.weeks'>
      </div>
      <!--Week rows-->
      <div
        class='c-weeks'
        :style='weeksStyle_'>
        <transition-group
          tag='div'
          class='c-weeks-rel'
          :style='weekRowsStyle'
          :name='weeksTransition_'>
          <calendar-weeks
            class='c-weeks-abs'
            v-for='p in pages'
            :key='p.key'
            :month='p.month'
            :year='p.year'
            :is-leap-year='p.isLeapYear'
            :days-in-month='p.daysInMonth'
            :first-weekday-in-month='p.firstWeekdayInMonth'
            :prev-month-comps='p.prevMonthComps'
            :next-month-comps='p.nextMonthComps'
            :first-day-of-week='firstDayOfWeek'
            :styles='styles'
            v-bind='$attrs'
            @touchstart='touchStart($event)'
            @touchmove='touchMove($event)'
            @touchend='touchEnd($event)'
            v-on='$listeners'
            v-if='p === page_'>
          </calendar-weeks>
        </transition-group> 
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import CalendarWeeks from './CalendarWeeks';
import {
  todayComps,
  getIsLeapYear,
  getMonthComps,
  getThisMonthComps,
  getPrevMonthComps,
  getNextMonthComps,
  pageIsBeforePage,
  pageIsAfterPage,
} from '../utils/helpers';
import {
  monthLabels,
  weekdayLabels,
  titleTransition,
  weeksTransition,
  maxSwipeTimeMs,
  minHorizontalSwipeDistance,
  maxVerticalSwipeDistance,
} from '../utils/defaults';

export default {
  components: {
    CalendarWeeks,
  },
  props: {
    position: { type: Number, default: 1 },
    page: { type: Object, default: () => todayComps },
    minPage: Object,
    maxPage: Object,
    monthLabels: { type: Array, default: () => monthLabels },
    weekdayLabels: { type: Array, default: () => weekdayLabels },
    firstDayOfWeek: { type: Number, default: 1 },
    styles: Object,
    titlePosition: String,
    titleTransition: { type: String, default: titleTransition },
    weeksTransition: { type: String, default: weeksTransition },
  },
  data() {
    return {
      pages: [],
      page_: null,
      transitionDirection: '',
      prevPageStyle: null,
      currPageStyle: null,
      nextPageStyle: null,
      touchState: {},
    };
  },
  computed: {
    weekdayLabels_() {
      const labels = [];
      for (let i = 1, d = this.firstDayOfWeek; i <= 7; i++, d += (d === 7) ? -6 : 1) {
        labels.push(this.weekdayLabels[d - 1]);
      }
      return labels;
    },
    titleClass() {
      return this.titlePosition ? `align-${this.titlePosition}` : '';
    },
    titleTransition_() {
      return this.getTransitionName(this.titleTransition, this.transitionDirection);
    },
    weeksTransition_() {
      return this.getTransitionName(this.weeksTransition, this.transitionDirection);
    },
    headerStyle() {
      return this.getDividerStyle(this.styles.header);
    },
    titleStyle() {
      return this.styles.headerTitle;
    },
    arrowStyle() {
      return this.styles.headerArrows;
    },
    verticalDividers() {
      return this.position === 2 ? {
        header: this.styles.headerVerticalDivider || this.styles.verticalDivider,
        weekdays: this.styles.weekdaysVerticalDivider || this.styles.verticalDivider,
        weeks: this.styles.weeksVerticalDivider || this.styles.verticalDivider,
      } : {};
    },
    headerHorizontalDividerStyle_() {
      return this.styles.headerHorizontalDivider;
    },
    weekdayStyle_() {
      return this.getDividerStyle(this.styles.weekdays);
    },
    weekdaysHorizontalDividerStyle_() {
      return this.styles.weekdaysHorizontalDivider;
    },
    weeksStyle_() {
      return this.getDividerStyle(this.styles.weeks);
    },
    weekRowsStyle() {
      return {
        height: '192px',
      };
    },
    canMovePrevMonth() {
      return this.canMove(this.page_.prevMonthComps);
    },
    canMoveNextMonth() {
      return this.canMove(this.page_.nextMonthComps);
    },
  },
  watch: {
    page(val) {
      this.move(val);
    },
    page_(val, oldVal) {
      this.transitionDirection = this.getTransitionDirection(oldVal, val);
    },
  },
  created() {
    if (this.page) {
      this.page_ = this.loadPage(this.page);
    } else {
      this.page_ = this.loadPage(todayComps);
      this.$emit('update:page');
    }
    this.preloadPages();
  },
  methods: {
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
      if (deltaTime < maxSwipeTimeMs) {
        if (Math.abs(deltaX) >= minHorizontalSwipeDistance && Math.abs(deltaY) <= maxVerticalSwipeDistance) {
          // Swipe left
          if (deltaX < 0) {
            // Move to previous month
            this.moveNextMonth();
          } else {
            // Move to next month
            this.movePrevMonth();
          }
        }
      }
    },
    canMove(pageInfo) {
      if (this.minPage && pageIsBeforePage(pageInfo, this.minPage)) return false;
      if (this.maxPage && pageIsAfterPage(pageInfo, this.maxPage)) return false;
      return true;
    },
    movePrevYear() {
      this.move({ month: this.page_.month, year: this.page_.year - 1 });
    },
    movePrevMonth() {
      this.move(this.page_.prevMonthComps);
    },
    moveThisMonth() {
      this.move(todayComps);
    },
    moveNextMonth() {
      this.move(this.page_.nextMonthComps);
    },
    moveNextYear() {
      this.move({ month: this.page_.month, year: this.page_.year + 1 });
    },
    move(pageInfo) {
      if (this.canMove(pageInfo)) {
        this.forceMove(pageInfo);
      } else if (pageIsBeforePage(todayComps, this.minPage)) {
        this.forceMove(this.minPage);
      } else if (pageIsAfterPage(pageInfo, this.maxPage)) {
        this.forceMove(this.maxPage);
      }
    },
    forceMove(pageInfo) {
      // Exit if there is no page info or page info matches the current page
      if (!pageInfo || (pageInfo.month === this.page_.month && pageInfo.year === this.page_.year)) return;
      // Extract just the month and year info
      const monthYear = { month: pageInfo.month, year: pageInfo.year };
      // Set the active page
      this.page_ = this.loadPage(monthYear);
      // Flag that page was moved to/updated
      this.$emit('move', monthYear);
      this.$emit('update:page', monthYear);
      // Preload other pages
      this.preloadPages();
    },
    loadPage({ month, year }, position = 0) {
      const key = `${year.toString()}.${month.toString()}`;
      let page = this.pages.find(p => (p.key === key));
      if (!page) {
        const monthLabel = this.monthLabels[month - 1];
        const yearLabel = year.toString();
        const yearLabel2 = yearLabel.substring(2, 4);
        const headerLabel = `${monthLabel} ${yearLabel}`;
        const firstWeekdayInMonth = new Date(year, month - 1, 1).getDay() + 1;
        const currMonthComps = getMonthComps(month, year);
        const isLeapYear = getIsLeapYear(year);
        const daysInMonth = currMonthComps.days;
        const thisMonthComps = getThisMonthComps();
        const prevMonthComps = getPrevMonthComps(month, year);
        const nextMonthComps = getNextMonthComps(month, year);
        page = {
          key,
          month,
          year,
          monthLabel,
          yearLabel,
          yearLabel_2: yearLabel2,
          headerLabel,
          isLeapYear,
          daysInMonth,
          firstWeekdayInMonth,
          thisMonthComps,
          prevMonthComps,
          nextMonthComps,
          canMove: pg => this.canMove(pg),
          move: pg => this.move(pg),
          moveThisMonth: () => this.moveThisMonth(),
          movePrevMonth: () => this.move(prevMonthComps),
          moveNextMonth: () => this.move(nextMonthComps),
        };
        this.pages.push(page);
      }
      page.position = position;
      page.loaded = true;
      return page;
    },
    preloadPages() {
      // Load the next and previous pages
      Vue.nextTick(() => {
        this.loadPage(this.page_.prevMonthComps, -1);
        this.loadPage(this.page_.nextMonthComps, 1);
        this.pages = this.pages.filter(p => p.loaded);
        this.pages.forEach((p) => {
          p.loaded = false;
        });
      });
    },
    getTransitionDirection(fromPage, toPage) {
      if (!fromPage || !toPage) return '';
      if (fromPage.year !== toPage.year) return fromPage.year < toPage.year ? 'next' : 'prev';
      if (fromPage.month !== toPage.month) return fromPage.month < toPage.month ? 'next' : 'prev';
      return '';
    },
    getTransitionName(type, direction) {
      if (type === 'slide-h') {
        return `title-${direction === 'next' ? 'slide-left' : 'slide-right'}`;
      } else if (type === 'slide-v') {
        return `title-${direction === 'next' ? 'slide-up' : 'slide-down'}`;
      }
      return `title-${type}`;
    },
    getDividerStyle(defaultStyle) {
      if (this.position === 1) return { ...defaultStyle, borderRight: '0' };
      if (this.position === 2) return { ...defaultStyle, borderLeft: '0' };
      return defaultStyle;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'

=box($justify: center, $align: center)
  display: flex
  justify-content: $justify
  align-items: $align
  margin: 0
  padding: 0

.c-pane
  flex-grow: 1
  flex-shrink: 1
  // min-width: $paneMinWidth
  // width: $paneWidth
  display: flex
  flex-direction: column
  align-items: stretch
  overflow: hidden

.c-header-wrapper
  display: flex

.c-header
  flex: 1
  display: flex
  align-items: stretch
  user-select: none
  padding: $headerPadding

  .c-arrow-layout
    +box()
    .c-arrow
      +box()
      font-size: $arrowFontSize
      width: $arrowWidth
      height: $arrowHeight
      transition: $arrowTransition
      cursor: pointer
      user-select: none
      &:hover
        opacity: 0.5
    
  .c-title
    +box()
    flex-grow: 1
    position: relative
    overflow: hidden
    .c-title-1
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      display: flex
      .c-title-2
        font-weight: $titleFontWeight
        font-size: $titleFontSize
        transition: $titleTransition
        cursor: pointer
        user-select: none
        margin: $titleMargin
        text-align: center
        width: 100%
        &:hover
          opacity: 0.5
    &.align-left
      order: -1
      .c-title-2
        justify-content: flex-start
    &.align-right
      order: 1
      .c-title-2
        justify-content: flex-end
    
  .c-arrow.c-disabled
    cursor: not-allowed
    pointer-events: none
    opacity: 0.2

.c-horizontal-divider
  align-self: center

.c-weekdays-wrapper
  display: flex

.c-weekdays
  flex-grow: 1
  display: flex
  padding: $weekdayPadding
  color: $weekdayColor
  font-size: $weekdayFontSize
  font-weight: $weekdayFontWeight

.c-weekday
  +box()
  flex-grow: 1
  cursor: default

.c-weeks-wrapper
  display: flex

.c-weeks
  flex-grow: 1
  padding: $weeksPadding

.c-weeks-rel
  position: relative
  .c-weeks-abs
    position: absolute
    width: 100%
    display: flex
    flex-direction: column

.title-slide-left-enter-active,
.title-slide-left-leave-active,
.title-slide-right-enter-active,
.title-slide-right-leave-active,
.title-slide-up-enter-active,
.title-slide-up-leave-active,
.title-slide-down-enter-active,
.title-slide-down-leave-active,
.title-fade-enter-active,
.title-fade-leave-active
  transition: $titleTransition

.title-none-enter-active,
.title-none-leave-active
  transition-duration: 0s

.title-slide-left-enter,
.title-slide-right-leave-to
  opacity: 0
  transform: translateX($titleTranslateX)

.title-slide-left-leave-to,
.title-slide-right-enter
  opacity: 0
  transform: translateX(-$titleTranslateX)

.title-slide-up-enter,
.title-slide-down-leave-to
  opacity: 0
  transform: translateY($weeksTranslateX)

.title-slide-down-enter,
.title-slide-up-leave-to
  opacity: 0
  transform: translateY(-$weeksTranslateX)

.weeks-slide-left-enter-active,
.weeks-slide-left-leave-active,
.weeks-slide-right-enter-active,
.weeks-slide-right-leave-active,
.weeks-slide-up-enter-active,
.weeks-slide-up-leave-active,
.weeks-slide-down-enter-active,
.weeks-slide-down-leave-active,
.weeks-fade-enter-active,
.weeks-fade-leave-active
  transition: $weeksTransition

.weeks-none-enter-active,
.weeks-none-leave-active
  transition-duration: 0s

.weeks-slide-left-enter,
.weeks-slide-right-leave-to
  opacity: 0
  transform: translateX($weeksTranslateX)

.weeks-slide-left-leave-to,
.weeks-slide-right-enter
  opacity: 0
  transform: translateX(-$weeksTranslateX)

.weeks-slide-up-enter,
.weeks-slide-down-leave-to
  opacity: 0
  transform: translateY($weeksTranslateX)

.weeks-slide-down-enter,
.weeks-slide-up-leave-to
  opacity: 0
  transform: translateY(-$weeksTranslateX)

.weeks-fade-enter,
.weeks-fade-leave-to,
.weeks-none-enter,
.weeks-none-leave-to,
.title-fade-enter,
.title-fade-leave-to,
.title-none-enter,
.title-none-leave-to,
  opacity: 0

</style>
