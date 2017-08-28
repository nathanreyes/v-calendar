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
      :date='day.date'
      :dateTime='day.dateTime'
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
          const date = new Date(year, month - 1, day);
          const isToday = day === _todayComps.day && month === _todayComps.month && year === _todayComps.year;
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
      if (!this.highlights) return;
      this.highlights.forEach((h) => {
        if (h.date) h.date.setHours(0, 0, 0, 0);
        if (h.dates) h.dates.forEach(d => d.setHours(0, 0, 0, 0));
        if (h.startDate) h.startDate.setHours(0, 0, 0, 0);
        if (h.endDate) h.endDate.setHours(0, 0, 0, 0);
      });
    },
    assignDayAttributes(dayInfo) {
      dayInfo.contentStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '30px',
      };
      dayInfo.backgrounds = [];
      // Done if there are no highlights to process
      if (!this.highlights || !this.highlights.length) return;
      // Assign backgrounds by filtering out highlights that cover dates
      this.highlights.filter((h) => {
        if (h.date) {
          return h.date.getTime() === dayInfo.date.getTime();
        } else if (h.dates) {
          return h.dates.find(d => d.getTime() === dayInfo.date.getTime());
        } else if (h.startDate && h.endDate) {
          return dayInfo.date >= h.startDate && dayInfo.date <= h.endDate;
        }
        return false;
      }).forEach((h, i) => {
        // Initialize the background object
        const span = h.height || dayInfo.contentStyle.height;
        const borderRadius = h.isSquared ? '0' : span;
        const background = {
          key: h.key || i.toString(),
          horizontalAlign: 'center',
          verticalAlign: 'center',
          transition: 'width-height',
          style: {
            backgroundColor: h.backgroundColor,
            width: span,
            height: span,
            borderColor: h.borderColor,
            borderWidth: h.borderWidth,
            borderStyle: h.borderStyle,
            borderRadius,
          },
        };
        // Is the highlight a date range
        if (!h.date && !h.dates) {
          const onStart = h.startDate.getTime() === dayInfo.dateTime;
          const onEnd = h.endDate.getTime() === dayInfo.dateTime;
          // Is the day date on the highlight start and end date
          if (onStart && onEnd) {
            // background.key = `${background.key}-end`;
            background.style.width = '100%';
            background.style.borderRadius = `${borderRadius} ${borderRadius} ${borderRadius} ${borderRadius}`;
          // Is the day date on the highlight start date
          } else if (onStart) {
            // background.key = `${background.key}-end`;
            background.transition = 'from-right';
            background.horizontalAlign = 'right';
            background.style.width = '100%';
            background.style.borderRadius = `${borderRadius} 0 0 ${borderRadius}`;
          // Is the day date on the highlight end date
          } else if (onEnd) {
            // background.key = `${background.key}-end`;
            background.transition = 'from-left';
            background.horizontalAlign = 'left';
            background.style.zIndex = '1';
            background.style.width = '100%';
            background.style.borderRadius = `0 ${borderRadius} ${borderRadius} 0`;
          // Is the day date between the highlight start/end dates
          } else {
            background.key = `${background.key}-span`;
            background.transition = '';
            background.style.width = '100%';
            background.style.borderRadius = '0';
          }
        }
        // Add background to the day info
        dayInfo.backgrounds.push(background);
        // Modify content style if needed
        if (h.color) dayInfo.contentStyle.color = h.color;
        if (h.fontSize) dayInfo.contentStyle.fontSize = h.fontSize;
        if (h.fontWeight) dayInfo.contentStyle.fontWeight = h.fontWeight;
        if (h.fontDecoration) dayInfo.contentStyle.fontDecoration = h.fontDecoration;
        if (h.height) dayInfo.contentStyle.height = h.height;
      });
    },
  },
};
</script>

<style lang='sass' scoped>

*
  box-sizing: border-box

.weeks
  width: 100%
  display: flex
  flex-direction: column

.week
  display: flex

</style>
