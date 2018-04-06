<template>
<div
  ref='pane'
  class='c-pane'
  :style='paneStyle'>
  <!--Header slot-->
  <slot name='header' v-bind='page_'>
    <div class='c-header' :style='headerStyle'>
      <!--Header prev button-->
      <div class='c-arrow-layout'>
        <slot
          name='header-left-button'
          v-bind='page_'
          v-if='!hideLeftButton'>
          <svg-icon
            :glyph='angleLeft'
            class='c-arrow'
            :class='{ "c-disabled": !canMovePrevMonth || hideLeftButton }'
            :style='arrowStyle'
            @click='movePrevMonth'>
          </svg-icon>
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
          :content-style='navWrapperStyle'
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
                v-bind='p'>
                {{ p.title }}
              </slot>
            </div>
          </transition-group>
          <!--Navigation pane-->
          <calendar-nav
            slot='popover-content'
            :formats='formats'
            :value='page_'
            :validator='canMove'
            :styles='styles'
            @input='navPageSelected($event)'>
            <!-- Pass through nav slots -->
            <template
              v-for='slot in navSlots'
              :slot='slot'
              slot-scope='props'>
              <slot :name='slot' v-bind='props'></slot>
            </template>
          </calendar-nav>
        </popover>
      </div>
      <!--Header next button-->
      <div class='c-arrow-layout'>
        <slot
          name='header-right-button'
          v-bind='page_'
          v-if='!hideRightButton'>
          <svg-icon
            :glyph='angleRight'
            class='c-arrow'
            :class='{ "c-disabled": !canMoveNextMonth }'
            :style='arrowStyle'
            @click='moveNextMonth'>
          </svg-icon>
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
  <!--Weekday labels-->
  <div
    class='c-weekdays'
    :style='weekdaysStyle_'>
    <div
      v-for='(weekday, i) in weekdayLabels'
      :key='i + 1'
      class='c-weekday'>
      {{ weekday }}
    </div>
  </div>
  <!--Weekdays horizontal divider-->
  <div
    class='c-horizontal-divider'
    :style='weekdaysHorizontalDividerStyle_'
    v-if='weekdaysHorizontalDividerStyle_'>
  </div>
  <!--Weeks-->
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
        <template
          v-for='slot in Object.keys($scopedSlots)'
          :slot='slot'
          slot-scope='props'>
          <slot :name='slot' v-bind='props'></slot>
        </template>
      </calendar-weeks>
    </transition-group>
  </div>
</div>
</template>

<script>
import Popover from './Popover';
import CalendarWeeks from './CalendarWeeks';
import CalendarNav from './CalendarNav';
import SvgIcon from './SvgIcon';
import angleLeft from '@/assets/icons/angle-left.svg';
import angleRight from '@/assets/icons/angle-right.svg';
import defaults from '@/utils/defaults';
import { getWeekdayDates, evalFn } from '@/utils/helpers';
import { format } from '@/utils/fecha';

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
    SvgIcon,
  },
  props: {
    position: { type: Number, default: 1 },
    page: { type: Object, default: () => todayComps },
    navVisibility: { type: String, default: () => defaults.navVisibility },
    minPage: Object,
    maxPage: Object,
    formats: { type: Object, default: () => defaults.formats },
    styles: Object,
    titlePosition: { type: String, default: () => defaults.titlePosition },
    titleTransition: { type: String, default: () => defaults.titleTransition },
    weeksTransition: { type: String, default: () => defaults.weeksTransition },
    paneWidth: Number,
    hideLeftButton: Boolean,
    hideRightButton: Boolean,
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
      moveTimeout: null,
      angleLeft,
      angleRight,
    };
  },
  computed: {
    navSlots() {
      return ['nav-left-button', 'nav-right-button'].filter(
        slot => this.$scopedSlots[slot],
      );
    },
    weekdayLabels() {
      return getWeekdayDates({ firstDayOfWeek: defaults.firstDayOfWeek }).map(
        d => format(d, this.formats.weekdays || 'WW'),
      );
    },
    titleClass() {
      return this.titlePosition ? `align-${this.titlePosition}` : '';
    },
    titleTransition_() {
      return this.getTransitionName(
        'title',
        this.titleTransition,
        this.transitionDirection,
      );
    },
    weeksTransition_() {
      return this.getTransitionName(
        'weeks',
        this.weeksTransition,
        this.transitionDirection,
      );
    },
    paneStyle() {
      return {
        minWidth: `${this.paneWidth}px`,
      };
    },
    headerStyle() {
      return evalFn(this.styles.header, this.page_);
    },
    titleStyle() {
      return evalFn(this.styles.headerTitle, this.page_);
    },
    arrowStyle() {
      return evalFn(this.styles.headerArrows, this.page_);
    },
    headerHorizontalDividerStyle_() {
      return evalFn(this.styles.headerHorizontalDivider, this.page_);
    },
    weekdaysStyle_() {
      return evalFn(this.styles.weekdays, this.page_);
    },
    weekdaysHorizontalDividerStyle_() {
      return evalFn(this.styles.weekdaysHorizontalDivider, this.page_);
    },
    weeksStyle_() {
      return {
        ...evalFn(this.styles.weeks, this.page_),
        ...(this.weeksTransitioning ? { overflow: 'hidden' } : null),
      };
    },
    navWrapperStyle() {
      return {
        padding: '1px',
        ...evalFn(this.styles.navWrapper, this.page_),
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
      if (this.minPage && this.yearNumber === this.minPage.year)
        return month < this.minPage.month;
      if (this.maxPage && this.yearNumber === this.maxPage.year)
        return month > this.maxPage.month;
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
        if (
          Math.abs(deltaX) >= defaults.minHorizontalSwipeDistance &&
          Math.abs(deltaY) <= defaults.maxVerticalSwipeDistance
        ) {
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
      if (this.minPage && pageIsBeforePage(pageInfo, this.minPage))
        return false;
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
      // Check that timeout requirement is met
      const date = new Date();
      if (this.moveTimeout && date < this.moveTimeout) return;
      // Reset move timeout
      this.moveTimeout = new Date(date.getTime() + 250);
      // Exit if there is no page info or page info matches the current page
      if (
        !pageInfo ||
        (pageInfo.month === this.page_.month &&
          pageInfo.year === this.page_.year)
      )
        return;
      // Set the active page
      this.page_ = this.loadPage(pageInfo);
      // Flag that page was updated
      this.$emit('update:page', this.page_);
      // Preload other pages
      this.preloadPages();
    },
    loadPage({ month, year }) {
      const key = `${year.toString()}.${month.toString()}`;
      let page = this.pages.find(p => p.key === key);
      if (!page) {
        const date = new Date(year, month - 1, 15);
        const monthComps = getMonthComps(month, year);
        const prevMonthComps = getPrevMonthComps(month, year);
        const nextMonthComps = getNextMonthComps(month, year);
        page = {
          key,
          month,
          year,
          title: format(date, this.formats.title || 'MMMM YYYY'),
          shortMonthLabel: format(date, 'MMM'),
          monthLabel: format(date, 'MMMM'),
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
        this.pages.forEach(p => {
          p.loaded = false;
        });
      });
    },
    getTransitionDirection(fromPage, toPage) {
      if (!fromPage || !toPage) return '';
      if (fromPage.year !== toPage.year)
        return fromPage.year < toPage.year ? 'next' : 'prev';
      if (fromPage.month !== toPage.month)
        return fromPage.month < toPage.month ? 'next' : 'prev';
      return '';
    },
    getTransitionName(prefix, type, direction) {
      if (type === 'slide-h') {
        return `${prefix}-${
          direction === 'next' ? 'slide-left' : 'slide-right'
        }`;
      } else if (type === 'slide-v') {
        return `${prefix}-${direction === 'next' ? 'slide-up' : 'slide-down'}`;
      }
      return `${prefix}-${type}`;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'
@import '../styles/mixins.sass'

.c-pane
  flex-grow: 1
  flex-shrink: 1
  display: flex
  flex-direction: column
  justify-content: center
  align-items: stretch

.c-horizontal-divider
  align-self: center

.c-header
  display: flex
  align-items: stretch
  user-select: none
  padding: $header-padding
  .c-arrow-layout
    +box()
    min-width: 26px
    .c-arrow
      +box()
      font-size: $arrow-font-size
      transition: $arrow-transition
      cursor: pointer
      user-select: none
      margin-top: -.1em
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

.c-weekdays
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
  transition: $title-transition

.title-slide-left-leave-active,
.title-slide-right-leave-active,
.title-slide-up-leave-active,
.title-slide-down-leave-active,
.title-fade-leave-active,
.title-none-leave-active
  position: absolute

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
.weeks-fade-leave-active,
.weeks-none-leave-active
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
