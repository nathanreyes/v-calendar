<template>
<div class='weeks'> 
  <div class='week' v-for='(week, i) in weeks' :key='i'>
    <calendar-day
      v-for='day in week'
      :key='day.id'
      :backgrounds='day.backgrounds'
      :content-class='day.contentClass'
      :content-style='day.contentStyle'
      :indicators='day.indicators'
      :label='day.label'
      :day='day.day'
      :weekday='day.weekday'
      :week='day.week'
      :month='day.month'
      :year='day.year'
      :in-month='day.inMonth'
      :before-month='day.beforeMonth'
      :after-month='day.afterMonth'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-day>
  </div>
</div>
</template>

<script>
import CalendarDay from './CalendarDay';

const _today = new Date();
const _todayComps = {
  year: _today.getFullYear(),
  month: _today.getMonth() + 1,
  day: _today.getDate(),
};

export default {
  components: {
    CalendarDay,
  },
  props: {
    highlights: Array,
    indicators: Array,
    month: Number,
    year: Number,
    isLeapYear: Boolean,
    daysInMonth: Number,
    firstWeekdayInMonth: Number,
    showMaxWeek: { type: Boolean, default: true },
    prevMonthComps: Object,
    nextMonthComps: Object,
    theme: Object,
  },
  computed: {
    weeks() {
      const weeks = [];
      let previousMonth = true;
      let thisMonth = false;
      let nextMonth = false;
      let day = (this.prevMonthComps.days - this.firstWeekdayInMonth) + 2;
      let month = this.prevMonthComps.month;
      let year = this.prevMonthComps.year;
      // Cycle through each week of the month, up to 6 total
      for (let w = 1; w <= 6 && (!nextMonth || this.showMaxWeek); w += 1) {
        // Cycle through each weekday
        const week = [];
        for (let d = 1; d <= 7; d += 1) {
          // We need to know when to start counting actual month days
          if (previousMonth && d >= this.firstWeekdayInMonth) {
            // Reset day/month/year counters
            day = 1;
            month = this.month;
            year = this.year;
            // ...and flag we're tracking actual month days
            previousMonth = false;
            thisMonth = true;
          }
          // Append day info for the current week
          // Note: this might or might not be an actual month day
          //  We don't know how the UI wants to display various days,
          //  so we'll supply all the data we can
          const isToday = day === _todayComps.day && month === _todayComps.month && year === _todayComps.year;
          const dayInfo = {
            id: `${month}.${day}`,
            label: day.toString(),
            day,
            weekday: d,
            week: w,
            month,
            year,
            date: new Date(year, month - 1, day),
            isToday,
            isFirstDay: thisMonth && day === 1,
            isLastDay: thisMonth && day === this.daysInMonth,
            inMonth: thisMonth,
            beforeMonth: previousMonth,
            afterMonth: nextMonth,
          };
          this.assignDayAttributes(dayInfo);
          week.push(dayInfo);

          // We've hit the last day of the month
          if (thisMonth && day >= this.daysInMonth) {
            thisMonth = false;
            nextMonth = true;
            day = 1;
            month = this.nextMonthComps.month;
            year = this.nextMonthComps.year;
          // Still in the middle of the month (hasn't ended yet)
          } else {
            day += 1;
          }
        }
        // Append week info for the month
        weeks.push(week);
      }
      return weeks;
    },
  },
  watch: {
    highlights() {
      this.processHighlights();
    },
  },
  created() {
    this.processHighlights();
  },
  methods: {
    processHighlights() {
      this.highlights.forEach((h) => {
        if (h.date) h.date.setHours(0, 0, 0, 0);
        if (h.startDate) h.startDate.setHours(0, 0, 0, 0);
        if (h.endDate) h.endDate.setHours(0, 0, 0, 0);
      });
    },
    assignDayAttributes(dayInfo) {
      // Assign backgroudns by filtering out highlights that cover dates
      dayInfo.backgrounds = this.highlights.filter((h) => {
        if (h.date) {
          return h.date.getTime() === dayInfo.date.getTime();
        } else if (h.startDate && h.endDate) {
          return dayInfo.date >= h.startDate && dayInfo.date <= h.endDate;
        }
        return false;
      }).map((h) => {
        let horizontalAlign = '';
        const verticalAlign = 'center';
        if (h.startDate === dayInfo.date) horizontalAlign = 'right';
        else if (h.endDate === dayInfo.date) horizontalAlign = 'left';
        else horizontalAlign = 'center';
        if (h.contentClass) dayInfo.contentClass = h.contentClass;
        if (h.contentStyle) dayInfo.contentStyle = h.contentStyle;
        return Object.assign({}, {
          class: h.backgroundClass,
          style: h.backgroundStyle,
          horizontalAlign,
          verticalAlign,
        });
      });
    },
  },
};
</script>

<style lang='sass' scoped>

.weeks
  width: 100%
  display: flex
  flex-direction: column

.week
  display: flex

</style>
