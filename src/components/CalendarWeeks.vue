<template>
<div> 
  <div
    class='c-week'
    v-for='(week, i) in weeks'
    :key='i'
    @touchstart='$emit("touchstart", $event)'
    @touchmove='$emit("touchmove", $event)'
    @touchend='$emit("touchend", $event)'>
    <calendar-day
      v-for='day in week'
      :key='day.id'
      :label='day.label'
      :day='day.day'
      :weekday='day.weekday'
      :week='day.week'
      :month='day.month'
      :year='day.year'
      :date='day.date'
      :dateTime='day.dateTime'
      :in-month='day.inMonth'
      :in-prev-month='day.inPrevMonth'
      :in-next-month='day.inNextMonth'
      :attributes='day.attributes'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-day>
  </div>
</div>
</template>

<script>
import CalendarDay from './CalendarDay';
import { todayComps } from './utils';

export default {
  components: {
    CalendarDay,
  },
  props: {
    firstDayOfWeek: Number,
    attributes: Array,
    month: Number,
    year: Number,
    isLeapYear: Boolean,
    daysInMonth: Number,
    firstWeekdayInMonth: Number,
    trimMaxWeek: Boolean,
    prevMonthComps: Object,
    nextMonthComps: Object,
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
      for (let w = 1; w <= 6 && (!nextMonth || !this.trimMaxWeek); w++) {
        // Cycle through each weekday
        const week = [];
        for (let i = 1, d = this.firstDayOfWeek; i <= 7; i++, d += (d === 7) ? -6 : 1) {
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
          const date = new Date(year, month - 1, day);
          const isToday = day === todayComps.day && month === todayComps.month && year === todayComps.year;
          const dayInfo = {
            id: `${month}.${day}`,
            label: day.toString(),
            day,
            weekday: d,
            week: w,
            month,
            year,
            date,
            dateTime: date.getTime(),
            isToday,
            isFirstDay: thisMonth && day === 1,
            isLastDay: thisMonth && day === this.daysInMonth,
            inMonth: thisMonth,
            inPrevMonth: previousMonth,
            inNextMonth: nextMonth,
            attributes: this.getDayAttributes(date),
          };
          week.push(dayInfo);

          // See if we've hit the last day of the month
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
  methods: {
    getDayAttributes(date) {
      if (!this.attributes || !this.attributes.length) return [];
      const attributes = [];
      this.attributes.forEach((a) => {
        // Cycle through each attribute date
        a.dates.forEach((dateInfo) => {
          // Done if attribute date doesn't contain the day date
          if (!dateInfo.containsDate(date)) return;
          // Create new reference attribute
          const attribute = {
            ...a,
            date: dateInfo.date,
            dateInfo,
          };
          delete attribute.dates;
          attributes.push(attribute);
        });
      });
      attributes.sort((a, b) => a.dateInfo.compare(b.dateInfo));
      return attributes;
    },
  },
};
</script>

<style lang='sass' scoped>

.c-week
  flex-grow: 1
  display: flex

</style>
