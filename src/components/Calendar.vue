<template>
  <div class='c-wrapper' :style='wrapperStyle'>
    <div class='c-header' :style='headerStyle'>
      <a class='c-arrow' @click='movePrevMonth'>
        <slot name='prev-month'>
          <p class='c-left'>&lsaquo;</p>
        </slot>
      </a>
      <transition-group
        tag='div'
        class='c-title'
        :name='"title-" + transitionName'>
        <div
          class='c-title-1'
          v-for='p in pages'
          :key='p.id'
          v-if='p === page_'
          @click='moveThisMonth'>
          <div class='c-title-2'>
            <slot name='title' :page='p'>
              <span class='c-title-3'>{{ p.headerLabel }}</span>
            </slot>
          </div>
        </div>
      </transition-group>
      <a class='c-arrow' @click='moveNextMonth'>
        <slot name='next-month'>
          <p class='c-right'>&rsaquo;</p>
        </slot>
      </a>
    </div>
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
      :name='"weeks-" + transitionName'>
      <calendar-weeks
        v-for='p in pages'
        :key='p.id'
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

// Calendar data
const _daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const _monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const _weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const _today = new Date();
const _todayComps = {
  year: _today.getFullYear(),
  month: _today.getMonth() + 1,
  day: _today.getDate(),
};

export default {
  components: {
    CalendarWeeks,
  },
  props: {
    page: { type: Object, default: () => _todayComps },
    monthLabels: { type: Array, default: () => _monthLabels },
    weekdayLabels: { type: Array, default: () => _weekdayLabels },
    wrapperStyle: Object,
    headerStyle: Object,
    weekdayStyle: Object,
  },
  data() {
    return {
      pages: [],
      page_: null,
      transitionName: '',
    };
  },
  watch: {
    page(val) {
      this.move(val);
    },
  },
  created() {
    this.page_ = this.loadPage(this.page || _todayComps);
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
      this.move(_todayComps);
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
      // Make sure the next page is loaded
      const page = this.loadPage(monthYear);
      // Set up the page transition
      this.transitionName = this.getTransitionName(this.page_, page);
      // Set the active page
      this.page_ = page;
      // Flag that page was moved to/updated
      this.$emit('move', monthYear);
      this.$emit('update:page', monthYear);
      // Preload other pages
      this.preloadPages();
    },
    loadPage({ month, year }) {
      const id = `${year.toString()}.${month.toString()}`;
      let page = this.pages.find(p => (p.id === id));
      if (!page) {
        const monthLabel = this.monthLabels[month - 1];
        const monthLabel_1 = monthLabel.substring(0, 1);
        const monthLabel_2 = monthLabel.substring(0, 2);
        const monthLabel_3 = monthLabel.substring(0, 3);
        const yearLabel = year.toString();
        const yearLabel_2 = yearLabel.substring(2, 4);
        const headerLabel = `${monthLabel} ${yearLabel}`;
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        const daysInMonth = isLeapYear && month === 2 ? 29 : _daysInMonths[month - 1];
        const firstWeekdayInMonth = new Date(year, month - 1, 1).getDay() + 1;
        const prevMonthComps = this.getPrevMonthComps(month, year, isLeapYear);
        const nextMonthComps = this.getNextMonthComps(month, year, isLeapYear);
        page = {
          id,
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
    getTransitionName(fromPage, toPage) {
      if (!fromPage || !toPage) return '';
      if (fromPage.year !== toPage.year) return fromPage.year < toPage.year ? 'slide-left' : 'slide-right';
      if (fromPage.month !== toPage.month) return fromPage.month < toPage.month ? 'slide-left' : 'slide-right';
      return '';
    },
    // Day/month/year components for previous month
    getPrevMonthComps(month, year, isLeapYear) {
      if (month === 1) {
        return {
          days: _daysInMonths[11],
          month: 12,
          year: year - 1,
        };
      }
      return {
        days: (month === 3 && isLeapYear) ? 29 : _daysInMonths[month - 2],
        month: month - 1,
        year,
      };
    },
    // Day/month/year components for next month
    getNextMonthComps(month, year, isLeapYear) {
      if (month === 12) {
        return {
          days: _daysInMonths[0],
          month: 1,
          year: year + 1,
        };
      }
      return {
        days: (month === 1 && isLeapYear) ? 29 : _daysInMonths[month],
        month: month + 1,
        year,
      };
    },
  },
};
</script>

<style lang='sass' scoped>

$minWidth: 320px
$bgColor: #dae6e7
$padding: 0.8em 0.4em

$headerPadding: 0 0.4em 0.3em 0.4em

$titleColor: #637083
$titleFontSize: 1.2rem
$titleFontWeight: 400
$titleHoverColor: rgba(0, 0, 0, 0.6)
$titleHoverBgColor: rgba(71, 105, 108, 0.15)
$titlePadding: 0 8px
$titleBorderRadius: 4px
$titleTranslateX: 25px
$titleTransition: all .3s ease-in-out

$arrowColor: #637083
$arrowFontSize: 2.6rem
$arrowFontWeight: 200
$arrowHoverColor: #8f9aab
$arrowHoverBgColor: rgba(71, 105, 108, 0.15)
$arrowSize: 0.7em
$arrowMarginTop: -.15em
$arrowMarginHorizontal: .05em
$arrowTransition: all .3s ease-in-out

$weekdayColor: #8f9aab
$weekdayFontSize: 0.9rem
$weekdayFontWeight: 500
$weekdayPadding: 0.6em 0

$weeksTranslateX: 25px
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
  background-color: $bgColor
  padding: $padding
  overflow: hidden

.c-header
  display: flex
  align-items: stretch
  padding: $headerPadding
  user-select: none

  .c-arrow
    +box()
    color: $arrowColor
    font-size: $arrowFontSize
    font-weight: $arrowFontWeight
    width: $arrowSize
    height: $arrowSize
    border-radius: 50%
    transition: $arrowTransition
    cursor: pointer
    user-select: none
    &:hover
      color: $arrowHoverColor
      background-color: $arrowHoverBgColor
    .c-left
      margin-top: $arrowMarginTop
      margin-left: -$arrowMarginHorizontal
    .c-right
      margin-top: $arrowMarginTop
      margin-left: $arrowMarginHorizontal
    
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
          color: $titleColor
          font-weight: $titleFontWeight
          font-size: $titleFontSize
          transition: $titleTransition
          padding: $titlePadding
          border-radius: $titleBorderRadius
          cursor: pointer
          user-select: none
          &:hover
            color: $titleHoverColor
            background-color: $titleHoverBgColor

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
  >div
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
.weeks-slide-right-leave-active
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0

.weeks-slide-left-enter,
.weeks-slide-right-leave-to
  opacity: 0
  transform: translateX($weeksTranslateX)

.weeks-slide-left-leave-to,
.weeks-slide-right-enter
  opacity: 0
  transform: translateX(-$weeksTranslateX)

</style>
