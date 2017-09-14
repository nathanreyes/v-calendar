<template>
  <div class='c-wrapper'>
    <slot name='header' :page='page_'>
      <div class='c-header' :style='headerStyle'>
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
        <transition-group
          tag='div'
          class='c-title'
          :name='titleTransition_'
          mode='out-in'>
          <div
            class='c-title-1'
            v-for='p in pages'
            :key='p.key'
            v-if='p === page_'>
            <div class='c-title-2'>
              <slot name='header-title' :page='p'>
                <span
                  class='c-title-3'
                  :style='titleStyle'
                  @click='moveThisMonth'>
                  {{ p.headerLabel }}
                </span>
              </slot>
            </div>
          </div>
        </transition-group>
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
    <div class='c-weekdays'>
      <div
        v-for='weekday in weekdayLabels'
        :key='weekday'
        class='c-weekday'
        :style='weekdayStyle'>
        {{ weekday }}
      </div>
    </div> 
    <transition-group
      tag='div'
      class='c-weeks'
      :name='weeksTransition_'
      mode='out-in'>
      <calendar-weeks
        v-for='p in pages'
        :key='p.key'
        :month='p.month'
        :year='p.year'
        :isLeapYear='p.isLeapYear'
        :daysInMonth='p.daysInMonth'
        :firstWeekdayInMonth='p.firstWeekdayInMonth'
        :prevMonthComps='p.prevMonthComps'
        :nextMonthComps='p.nextMonthComps'
        v-if='p === page_'
        v-bind='$attrs'
        v-on='$listeners'>
      </calendar-weeks> 
    </transition-group> 
  </div>
</template>

<script>
/* eslint-disable camelcase */
import Vue from 'vue';
import CalendarWeeks from './CalendarWeeks';
import {
  daysInMonths,
  todayComps,
  monthLabels,
  weekdayLabels,
  getPrevMonthComps,
  getNextMonthComps,
} from './utils';

export default {
  components: {
    CalendarWeeks,
  },
  props: {
    page: { type: Object, default: () => todayComps },
    minPage: Object,
    maxPage: Object,
    monthLabels: { type: Array, default: () => monthLabels },
    weekdayLabels: { type: Array, default: () => weekdayLabels },
    headerStyle: Object,
    titleStyle: Object,
    titleTransition: { type: String, default: 'slide' },
    arrowStyle: Object,
    weekdayStyle: Object,
    weeksTransition: { type: String, default: 'slide' },
  },
  data() {
    return {
      pages: [],
      page_: null,
      slideTransition: '',
    };
  },
  computed: {
    titleTransition_() {
      if (this.titleTransition === 'slide') return `title-${this.slideTransition}`;
      return `title-${this.titleTransition}`;
    },
    weeksTransition_() {
      if (this.weeksTransition === 'slide') return `weeks-${this.slideTransition}`;
      return `weeks-${this.weeksTransition}`;
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
      this.slideTransition = this.getSlideTransition(oldVal, val);
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
    movePrevYear() {
      this.move({ month: this.page_.month, year: this.page_.year - 1 });
    },
    movePrevMonth() {
      this.move(this.page_.prevMonthComps);
    },
    moveThisMonth() {
      if (this.canMove(todayComps)) {
        this.move(todayComps);
      } else if (this.pageIsBeforePage(todayComps, this.minPage)) {
        this.move(this.minPage);
      } else if (this.pageIsAfterPage(todayComps, this.maxPage)) {
        this.move(this.maxPage);
      }
    },
    moveNextMonth() {
      this.move(this.page_.nextMonthComps);
    },
    moveNextYear() {
      this.move({ month: this.page_.month, year: this.page_.year + 1 });
    },
    move(pageInfo) {
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
    canMove(pageInfo) {
      if (this.minPage && this.pageIsBeforePage(pageInfo, this.minPage)) return false;
      if (this.maxPage && this.pageIsAfterPage(pageInfo, this.maxPage)) return false;
      return true;
    },
    pageIsBeforePage(page, beforePage) {
      if (!page || !beforePage) return false;
      const { month, year } = page;
      if (year < beforePage.year) return true;
      if (year === beforePage.year && month < beforePage.month) return true;
      return false;
    },
    pageIsAfterPage(page, afterPage) {
      if (!afterPage) return false;
      const { month, year } = page;
      if (year > afterPage.year) return true;
      if (year === afterPage.year && month > afterPage.month) return true;
      return false;
    },
    loadPage({ month, year }) {
      const key = `${year.toString()}.${month.toString()}`;
      let page = this.pages.find(p => (p.key === key));
      if (!page) {
        const monthLabel = this.monthLabels[month - 1];
        const monthLabel_1 = monthLabel.substring(0, 1);
        const monthLabel_2 = monthLabel.substring(0, 2);
        const monthLabel_3 = monthLabel.substring(0, 3);
        const yearLabel = year.toString();
        const yearLabel_2 = yearLabel.substring(2, 4);
        const headerLabel = `${monthLabel} ${yearLabel}`;
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        const daysInMonth = isLeapYear && month === 2 ? 29 : daysInMonths[month - 1];
        const firstWeekdayInMonth = new Date(year, month - 1, 1).getDay() + 1;
        const prevMonthComps = getPrevMonthComps(month, year, isLeapYear);
        const nextMonthComps = getNextMonthComps(month, year, isLeapYear);
        page = {
          key,
          month,
          year,
          monthLabel,
          monthLabel_1,
          monthLabel_2,
          monthLabel_3,
          yearLabel,
          yearLabel_2,
          headerLabel,
          isLeapYear,
          daysInMonth,
          firstWeekdayInMonth,
          prevMonthComps,
          nextMonthComps,
          move: (m, y) => this.move({ month: m, year: y }),
          moveThisMonth: () => this.moveThisMonth(),
          movePrevMonth: () => this.move(prevMonthComps),
          moveNextMonth: () => this.move(nextMonthComps),
        };
        this.pages.push(page);
      }
      return page;
    },
    preloadPages() {
      // Load the next and previous pages
      Vue.nextTick(() => {
        this.loadPage(this.page_.prevMonthComps);
        this.loadPage(this.page_.nextMonthComps);
      });
    },
    getSlideTransition(fromPage, toPage) {
      if (!fromPage || !toPage) return '';
      if (fromPage.year !== toPage.year) return fromPage.year < toPage.year ? 'slide-left' : 'slide-right';
      if (fromPage.month !== toPage.month) return fromPage.month < toPage.month ? 'slide-left' : 'slide-right';
      return '';
    },
  },
};
</script>

<style lang='sass' scoped>

$minWidth: 260px
$width: 260px
$bgColor: #fafafa
$border: 1px solid #dbdbdb
$padding: 5px

$headerPadding: 5px 5px 5px 5px

$titleFontSize: 1.1rem
$titleFontWeight: 400
$titleTranslateX: 25px
$titleTransition: all .3s ease-in-out

$arrowWidth: 26px
$arrowHeight: 26px
$arrowFontSize: 1.6rem
$arrowTransition: all .3s ease-in-out

$weekdayColor: #8f9aab
$weekdayFontSize: 0.9rem
$weekdayFontWeight: 500
$weekdayPadding: 6px 0

$weeksTranslateX: 20px
$weeksTransition: all .3s ease-in-out

$dayWidth: 14.2857%

=box($justify: center, $align: center)
  display: flex
  justify-content: $justify
  align-items: $align
  margin: 0
  padding: 0

.c-wrapper
  display: flex
  flex-direction: column
  min-width: $minWidth
  width: $width
  background-color: $bgColor
  border: $border
  padding: $padding
  overflow: hidden

.c-header
  display: flex
  align-items: stretch
  padding: $headerPadding
  user-select: none

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
    flex-grow: 1
    display: flex
    justify-content: center
    align-items: center
    position: relative
    .c-title-1
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      transition: $titleTransition
      .c-title-2
        display: flex
        height: 100%
        justify-content: center
        align-items: center
        .c-title-3
          font-weight: $titleFontWeight
          font-size: $titleFontSize
          transition: $titleTransition
          cursor: pointer
          user-select: none
          &:hover
            opacity: 0.5
    
  .c-arrow.c-disabled
    cursor: not-allowed
    pointer-events: none
    opacity: 0.5

.c-weekdays
  display: flex
  padding: $weekdayPadding

.c-weekday
  +box()
  width: $dayWidth
  cursor: default
  color: $weekdayColor
  font-size: $weekdayFontSize
  font-weight: $weekdayFontWeight

.c-weeks
  flex-grow: 1
  position: relative
  &>div
    transition: $weeksTransition

.title-slide-left-enter,
.title-slide-right-leave-to
  opacity: 0
  transform: translateX($titleTranslateX)

.title-slide-left-leave-to,
.title-slide-right-enter
  opacity: 0
  transform: translateX(-$titleTranslateX)

.weeks-slide-left-leave-active,
.weeks-slide-right-leave-active,
.weeks-fade-leave-active
  position: absolute
  top: 0
  bottom: 0
  left: 0
  width: 100%
  height: 100%

.weeks-slide-left-enter,
.weeks-slide-right-leave-to
  opacity: 0
  transform: translateX($weeksTranslateX)

.weeks-slide-left-leave-to,
.weeks-slide-right-enter
  opacity: 0
  transform: translateX(-$weeksTranslateX)

.weeks-fade-enter,
.weeks-fade-leave-to,
.title-fade-enter,
.title-fade-leave-to
  opacity: 0

</style>
