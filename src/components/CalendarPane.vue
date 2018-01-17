<template>
<div
  ref='pane'
  :class='["c-pane", { "is-single": position === 0 }]'>
  <!--Header-->
  <div class='c-section-wrapper'>
    <!--Header vertical divider-->
    <div
      class='c-vertical-divider'
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
        <div
          :class='["c-title-layout", titleClass]'>   
          <!--Navigation popover--> 
          <popover
            class='c-title-popover'
            direction='bottom'
            :align='titlePosition'
            :visibility='navVisibility'
            :content-style='{ padding: "0" }'
            :force-hidden.sync='navForceHidden'
            toggle-visible-on-click
            is-interactive>
            <!--Title content-->
            <transition-group
              tag='div'
              class='c-title-anchor'
              :name='titleTransition_'>
              <div
                class='c-title'
                :style='titleStyle'
                v-for='p in pages'
                :key='p.key'
                v-if='p === page_'>
                <slot
                  name='header-title'
                  :page='p'>
                  {{ `${p.monthLabel} ${p.yearLabel}` }}
                </slot>
              </div>
            </transition-group>
            <!--Navigation pane-->
            <calendar-nav
              slot='popover-content'
              :month-labels='monthLabels'
              :value='page_'
              :validator='canMove'
              @input='navPageSelected($event)'>
            </calendar-nav>
          </popover>
        </div>
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
    <!--Header horizontal divider-->
    <div
      class='c-horizontal-divider'
      :style='headerHorizontalDividerStyle_'
      v-if='headerHorizontalDividerStyle_'>
    </div>
  </div>
  <!--Weekdays-->
  <div class='c-section-wrapper'>
    <!--Weekday vertical divider-->
    <div
      class='c-vertical-divider'
      :style='verticalDividers.weekdays'
      v-if='verticalDividers.weekdays'>
    </div>
    <!--Weekday labels-->
    <div
      class='c-weekdays'
      :style='weekdayStyle_'>
      <div
        v-for='(weekday, i) in weekdayLabels_'
        :key='i + 1'
        class='c-weekday'>
        {{ weekday }}
      </div>
    </div>
    <!--Weekday horizontal divider-->
    <div
      class='c-horizontal-divider'
      :style='weekdaysHorizontalDividerStyle_'
      v-if='weekdaysHorizontalDividerStyle_'>
    </div>
  </div>
  <!--Weeks-->
  <div class='c-section-wrapper'>
    <!--Weeks vertical divider-->
    <div
      class='c-vertical-divider'
      :style='verticalDividers.weeks'
      v-if='verticalDividers.weeks'>
    </div>
    <!--Week rows-->
    <div
      class='c-weeks'
      :style='weeksStyle_'>
      <transition-group
        tag='div'
        class='c-weeks-rows-wrapper'
        :name='weeksTransition_'
        @before-enter='weeksTransitioning = true'
        @after-enter='weeksTransitioning = false'>
        <calendar-weeks
          class='c-weeks-rows'
          v-for='p in pages'
          :key='p.key'
          :month-comps='p.monthComps'
          :prev-month-comps='p.prevMonthComps'
          :next-month-comps='p.nextMonthComps'
          :styles='styles'
          v-bind='$attrs'
          @touchstart.passive='touchStart($event)'
          @touchmove.passive='touchMove($event)'
          @touchend.passive='touchEnd($event)'
          v-on='$listeners'
          v-if='p === page_'>
          <template v-for='slot in Object.keys($scopedSlots)' :slot='slot' slot-scope='props'>
            <slot :name='slot' v-bind='props'></slot>
          </template>
        </calendar-weeks>
      </transition-group> 
    </div>
  </div>
</div>
</template>

<script>
import Popover from './Popover';
import CalendarWeeks from './CalendarWeeks';
import CalendarNav from './CalendarNav';
import defaults from '../utils/defaults';

import {
  todayComps,
  getMonthComps,
  getPrevMonthComps,
  getNextMonthComps,
  pageIsBeforePage,
  pageIsAfterPage,
} from '../utils/helpers';

export default {
  components: {
    CalendarWeeks,
    CalendarNav,
    Popover,
  },
  props: {
    position: { type: Number, default: 1 },
    page: { type: Object, default: () => todayComps },
    navVisibility: { type: String, default: () => defaults.navVisibility },
    minPage: Object,
    maxPage: Object,
    monthLabels: { type: Array, default: () => defaults.monthLabels },
    weekdayLabels: { type: Array, default: () => defaults.weekdayLabels },
    styles: Object,
    titlePosition: { type: String, default: () => defaults.titlePosition },
    titleTransition: { type: String, default: () => defaults.titleTransition },
    weeksTransition: { type: String, default: () => defaults.weeksTransition },
  },
  data() {
    return {
      todayComps,
      pages: [],
      page_: null,
      transitionDirection: '',
      touchState: {},
      navForceHidden: false,
      weeksTransitioning: false,
    };
  },
  computed: {
    weekdayLabels_() {
      const labels = [];
      for (let i = 1, d = defaults.firstDayOfWeek; i <= 7; i++, d += (d === 7) ? -6 : 1) {
        labels.push(this.weekdayLabels[d - 1]);
      }
      return labels;
    },
    titleClass() {
      return this.titlePosition ? `align-${this.titlePosition}` : '';
    },
    titleTransition_() {
      return this.getTransitionName('title', this.titleTransition, this.transitionDirection);
    },
    weeksTransition_() {
      return this.getTransitionName('weeks', this.weeksTransition, this.transitionDirection);
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
      return {
        ...this.getDividerStyle(this.styles.weeks),
        ...(this.weeksTransitioning ? { overflow: 'hidden' } : null),
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
    navPageSelected(page) {
      this.navForceHidden = true;
      this.move(page);
    },
    monthIsDisabled(month) {
      if (this.minPage && this.yearNumber === this.minPage.year) return month < this.minPage.month;
      if (this.maxPage && this.yearNumber === this.maxPage.year) return month > this.maxPage.month;
      return false;
    },
    yearIsDisabled(year) {
      if (this.minPage && year < this.minPage.year) return true;
      if (this.maxPage && year > this.maxPage.year) return true;
      return false;
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
      if (deltaTime < defaults.maxSwipeTime) {
        if (Math.abs(deltaX) >= defaults.minHorizontalSwipeDistance && Math.abs(deltaY) <= defaults.maxVerticalSwipeDistance) {
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
    loadPage({ month, year }) {
      const key = `${year.toString()}.${month.toString()}`;
      let page = this.pages.find(p => (p.key === key));
      if (!page) {
        const monthComps = getMonthComps(month, year);
        const prevMonthComps = getPrevMonthComps(month, year);
        const nextMonthComps = getNextMonthComps(month, year);
        page = {
          key,
          month,
          year,
          shortMonthLabel: defaults.shortMonthLabels[month - 1],
          monthLabel: this.monthLabels[month - 1],
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
        this.pages.push(page);
      }
      page.position = this.position;
      page.loaded = true;
      return page;
    },
    preloadPages() {
      // Load the next and previous pages
      this.$nextTick(() => {
        this.loadPage(this.page_.prevMonthComps);
        this.loadPage(this.page_.nextMonthComps);
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
    getTransitionName(prefix, type, direction) {
      if (type === 'slide-h') {
        return `${prefix}-${direction === 'next' ? 'slide-left' : 'slide-right'}`;
      } else if (type === 'slide-v') {
        return `${prefix}-${direction === 'next' ? 'slide-up' : 'slide-down'}`;
      }
      return `${prefix}-${type}`;
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
@import '../styles/mixins.sass'

.c-pane
  width: 50%
  display: flex
  flex-direction: column
  align-items: stretch
  position: relative
  &.is-single
    width: 100%

.c-section-wrapper
  position: relative
  display: flex
  flex-direction: column

.c-header
  flex: 1
  display: flex
  align-items: stretch
  user-select: none
  padding: $header-padding
  .c-arrow-layout
    +box()
    .c-arrow
      +box()
      font-size: $arrow-font-size
      width: $arrow-width
      height: $arrow-height
      transition: $arrow-transition
      cursor: pointer
      user-select: none
      &:hover
        opacity: 0.5
  .c-title-layout
    display: inline-flex
    justify-content: center
    align-items: center
    flex-grow: 1
    .c-title-popover
      display: flex
      justify-content: inherit
      .c-title-anchor
        display: flex
        justify-content: inherit
        .c-title
          font-weight: $title-font-weight
          font-size: $title-font-size
          transition: $title-transition
          cursor: pointer
          user-select: none
          white-space: nowrap
    &.align-left
      order: -1
      justify-content: flex-start
    &.align-right
      order: 1
      justify-content: flex-end
    
  .c-arrow.c-disabled
    cursor: not-allowed
    pointer-events: none
    opacity: 0.2

.c-horizontal-divider
  align-self: center

.c-vertical-divider
  display: flex
  align-items: center
  position: absolute
  left: 0
  height: 100%

.c-weekdays
  flex-grow: 1
  display: flex
  padding: $weekday-padding
  color: $weekday-color
  font-size: $weekday-font-size
  font-weight: $weekday-font-weight

.c-weekday
  +box()
  flex: 1
  cursor: default

.c-weeks
  flex-grow: 1
  padding: $weeks-padding

.c-weeks-rows-wrapper
  position: relative

.c-weeks-rows
  display: flex
  flex-direction: column
  width: 100%

.title-slide-left-leave-active,
.title-slide-right-leave-active,
.title-slide-up-leave-active,
.title-slide-down-leave-active,
.title-fade-leave-active
  position: absolute

.title-slide-left-leave,
.title-slide-right-leave,
.title-slide-up-leave,
.title-slide-down-leave
  opacity: 1

.title-none-enter-active,
.title-none-leave-active
  transition-duration: 0s

.title-slide-left-enter,
.title-slide-right-leave-to
  opacity: 0
  transform: translateX($title-translate-x)

.title-slide-left-leave-to,
.title-slide-right-enter
  opacity: 0
  transform: translateX(-$title-translate-x)

.title-slide-up-enter,
.title-slide-down-leave-to
  opacity: 0
  transform: translateY($weeks-translate-x)

.title-slide-down-enter,
.title-slide-up-leave-to
  opacity: 0
  transform: translateY(-$weeks-translate-x)

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
  transition: $weeks-transition

.weeks-slide-left-leave-active,
.weeks-slide-right-leave-active,
.weeks-slide-up-leave-active,
.weeks-slide-down-leave-active,
.weeks-fade-leave-active
  position: absolute

.weeks-none-enter-active,
.weeks-none-leave-active
  transition-duration: 0s

.weeks-slide-left-enter,
.weeks-slide-right-leave-to
  opacity: 0
  transform: translateX($weeks-translate-x)

.weeks-slide-left-leave-to,
.weeks-slide-right-enter
  opacity: 0
  transform: translateX(-$weeks-translate-x)

.weeks-slide-up-enter,
.weeks-slide-down-leave-to
  opacity: 0
  transform: translateY($weeks-translate-x)

.weeks-slide-down-enter,
.weeks-slide-up-leave-to
  opacity: 0
  transform: translateY(-$weeks-translate-x)

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
