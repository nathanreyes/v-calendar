<template>
  <div class='calendar'>
    <div class='calendar-header'>
      <!-- <a class='calendar-arrow' @click='movePrevYear'>
        <slot name='prev-year'>&laquo;</slot>
      </a>  -->
      <a class='calendar-arrow' @click='movePrevMonth'>
        <slot name='prev-month'>&lsaquo;</slot>
      </a>
      <transition-group tag='div' class='calendar-title-wrapper' :name='"header-" + transitionName'>
        <div class='calendar-title' v-for='page in pages' :key='page.id' v-if='page === activePage' @click='moveThisMonth'>
          <slot name='title' :page='page'>
            {{ page.headerLabel }}
          </slot>
        </div>
      </transition-group>
      <a class='calendar-arrow' @click='moveNextMonth'>
        <slot name='next-month'>&rsaquo;</slot>
      </a>
      <!-- <a class='calendar-arrow' @click='moveNextYear'>
        <slot name='next-year'>&raquo;</slot>
      </a>  -->
    </div>
     <div class='weekdays'>
      <div class='weekday' :style='weekdayStyle' v-for='weekday in weekdayLabels' :key='weekday'>
        {{ weekday }}
      </div>
    </div> 
     <transition-group tag='div' class='calendar-weeks' :name='"header-" + transitionName'>
       <calendar-weeks
        v-for='page in pages'
        :key='page.id'
        :month='page.month'
        :year='page.year'
        :isLeapYear='page.isLeapYear'
        :daysInMonth='page.daysInMonth'
        :firstWeekdayInMonth='page.firstWeekdayInMonth'
        :prevMonthComps='page.prevMonthComps'
        :nextMonthComps='page.nextMonthComps'
        :theme='computedTheme'
        v-if='page === activePage'
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
const _weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const _monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const _today = new Date();
const _todayComps = {
  year: _today.getFullYear(),
  month: _today.getMonth() + 1,
  day: _today.getDate(),
};
const _defaultTheme = {
  dayColor: '#fafafa',
  dayFontSize: '0.8rem',
  dayFontWeight: '600',
  dayHoverHeight: '1.9em',
  dayHoverBgColor: 'rgba(16, 52, 86, 0.25)',
  todayBgColor: '#ff7a58',
  todayColor: 'white',
  selectBgColor: '#fafafa',
  selectColor: '#103456',
  selectHeight: '1.9em',
};

export default {
  components: {
    CalendarWeeks,
  },
  props: {
    initPage: {
      type: Object,
      default: () => ({ month: _todayComps.month, year: _todayComps.year }),
    },
    weekdayLabels: { type: Array, default: () => _weekdayLabels },
    weekdayStyle: {
      type: Object,
      default: () => ({
        color: '#8f9aab',
        fontSize: '0.9rem',
        fontWeight: '500',
        padding: '0.6em 0',
      }),
    },
    monthLabels: { type: Array, default: () => _monthLabels },
    theme: { type: Object, default: () => {} },
  },
  data() {
    return {
      pages: [],
      activePage: null,
      transitionName: '',
    };
  },
  computed: {
    computedTheme() {
      return Object.assign({}, _defaultTheme, this.theme);
    },
  },
  created() {
    this.move(this.initPage);
  },
  methods: {
    movePrevYear() {
      this.move({ month: this.activePage.month, year: this.activePage.year - 1 });
    },
    movePrevMonth() {
      this.move(this.activePage.prevMonthComps);
    },
    moveThisMonth() {
      this.move(_todayComps);
    },
    moveNextMonth() {
      this.move(this.activePage.nextMonthComps);
    },
    moveNextYear() {
      this.move({ month: this.activePage.month, year: this.activePage.year + 1 });
    },
    move(pageInfo) {
      // Make sure the next page is loaded
      const page = this.loadPage(pageInfo);
      // Set up the page transition
      this.transitionName = this.getTransitionName(this.activePage, page);
      // Set the active page
      this.activePage = page;
      // Flag that page was moved to
      this.$emit('move', page);
      // Load the next and previous pages after move
      Vue.nextTick(() => {
        this.loadPage(this.activePage.prevMonthComps);
        this.loadPage(this.activePage.nextMonthComps);
      });
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
$bgColor: #3c6186
$padding: 0.2em 0.4em 0.8em 0.4em

$headerPadding: 0
$headerBorderWidth: 1px
$headerBorderStyle: none
$headerBorderColor: #aaaaaa
$headerBackground: transparent
$headerColor: white
$headerTransition: all .3s ease-in-out

$dayWidth: 14.2857%

*
  box-sizing: border-box

.calendar
  display: flex
  flex-direction: column
  min-width: $minWidth
  background-color: $bgColor
  padding: $padding

.calendar-header
  display: flex
  align-items: stretch
  padding: $headerPadding
  border-width: $headerBorderWidth
  border-style: $headerBorderStyle
  border-color: $headerBorderColor
  background-color: $headerBackground
  
  =pointer()
    cursor: pointer
    &:hover
      color: #dcdcdc
  
  .calendar-arrow
    +pointer
    color: $headerColor
    padding: 0 0.4em 0.2em 0.4em
    font-size: 1.8rem
    font-weight: 500
    user-select: none
    flex-grow: 0
    
  .calendar-title-wrapper
    flex-grow: 1
    display: flex
    justify-content: center
    align-items: center
    position: relative
    .calendar-title
      +pointer
      display: inline-block
      color: $headerColor
      font-size: 1.2rem

.weekdays
  display: flex
  
.weekday
  width: $dayWidth
  display: flex
  justify-content: center
  align-items: center  
  cursor: default

.calendar-weeks
  flex-grow: 1
  position: relative

.header-slide-left-enter-active, .header-slide-left-leave-active, .header-slide-right-enter-active, .header-slide-right-leave-active
  transition: $headerTransition

.header-slide-left-leave-active, .header-slide-right-leave-active
  position: absolute

.header-slide-left-enter, .header-slide-left-leave-to, .header-slide-right-enter, .header-slide-right-leave-to
  opacity: 0

.header-slide-left-enter, .header-slide-right-leave-to
  transform: translateX(25px)

.header-slide-left-leave-to, .header-slide-right-enter
  transform: translateX(-25px)

</style>
