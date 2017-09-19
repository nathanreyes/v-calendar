<template>
<div> 
  <div class='c-week' v-for='(week, i) in weeks' :key='i'>
    <calendar-day
      v-for='day in week'
      :key='day.id'
      :backgrounds='day.backgrounds'
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
import { todayComps } from './utils';

export default {
  components: {
    CalendarDay,
  },
  props: {
    firstDayOfWeek: Number,
    dayContentStyle: Object,
    highlights: Array,
    indicators: Array,
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
  methods: {
    assignDayAttributes(dayInfo) {
      dayInfo.contentStyle = { ...this.dayContentStyle };
      dayInfo.backgrounds = this.getDayBackgrounds(dayInfo);
      // const mapDayContentProps = [
      //   // { from: 'height', to: 'width' },
      //   // { from: 'height', to: 'height' },
      //   { from: 'color', to: 'color' },
      //   { from: 'fontSize', to: 'fontSize' },
      //   { from: 'fontWeight', to: 'fontWeight' },
      //   { from: 'fontDecoration', to: 'fontDecoration' },
      //   { from: 'borderRadius', to: 'borderRadius' },
      // ];
      // // Modify content style if needed
      // mapDayContentProps.forEach((m) => {
      //   if (Object.prototype.hasOwnProperty.call(h, m.from)) dayInfo.contentStyle[m.to] = h[m.from];
      // });
      dayInfo.indicators = this.getDayIndicators(dayInfo);
    },
    getDayBackgrounds(dayInfo) {
      if (!this.highlights || !this.highlights.length) return [];
      const backgrounds = [];
      const contentStyle = { ...this.dayContentStyle };
      // Cycle through each highlight
      this.highlights.forEach((h, i) => {
        // Cycle through highlight dates
        if (!h.dates || !h.dates.length) return;
        h.dates.forEach((d) => {
          const isDate = !!d.getTime;
          const hasStart = !!d.start;
          const hasEnd = !!d.end;
          if (!isDate && !hasStart && !hasEnd) return;
          if (isDate && d.getTime() !== dayInfo.dateTime) return;
          if (hasStart && dayInfo.date < d.start) return;
          if (hasEnd && dayInfo.date > d.end) return;
          // Initialize the background object
          const height = h.height || contentStyle.height || '1.8rem';

          const background = {
            key: h.key || i.toString(),
            type: isDate ? 'date' : 'range',
            date: d,
            horizontalAlign: 'center',
            verticalAlign: 'center',
            transition: 'width-height',
            style: {
              backgroundColor: h.backgroundColor || 'rgba(0, 0, 0, 0.5)',
              borderColor: h.borderColor,
              borderWidth: h.borderWidth || '0',
              borderStyle: h.borderStyle || 'solid',
              borderRadius: h.borderRadius || contentStyle.borderRadius || height,
              width: height,
              height,
              zIndex: h.zIndex || '0',
            },
          };
          // Is the highlight a date range
          if (!isDate) {
            const borderWidth = background.style.borderWidth;
            const borderRadius = background.style.borderRadius;
            const endWidth = '95%';
            const onStart = hasStart && d.start.getTime() === dayInfo.dateTime;
            const onEnd = hasEnd && d.end.getTime() === dayInfo.dateTime;
            // Is the day date on the highlight start and end date
            if (onStart && onEnd) {
              background.style.width = endWidth;
              background.style.borderWidth = borderWidth;
              background.style.borderRadius = `${borderRadius} ${borderRadius} ${borderRadius} ${borderRadius}`;
            // Is the day date on the highlight start date
            } else if (onStart) {
              background.transition = 'from-right';
              background.horizontalAlign = 'right';
              background.style.width = endWidth;
              background.style.borderWidth = `${borderWidth} 0 ${borderWidth} ${borderWidth}`;
              background.style.borderRadius = `${borderRadius} 0 0 ${borderRadius}`;
            // Is the day date on the highlight end date
            } else if (onEnd) {
              background.transition = 'from-left';
              background.horizontalAlign = 'left';
              background.style.width = endWidth;
              background.style.borderWidth = `${borderWidth} ${borderWidth} ${borderWidth} 0`;
              background.style.borderRadius = `0 ${borderRadius} ${borderRadius} 0`;
            // Is the day date between the highlight start/end dates
            } else {
              background.transition = '';
              background.style.width = '100%';
              background.style.borderWidth = `${borderWidth} 0`;
              background.style.borderRadius = '0';
            }
          }
          // Add background to the day info
          backgrounds.push(background);
        });
      });
      return backgrounds.sort((a, b) => {
        if (a.style.zIndex !== '0' || b.style.zIndex !== '0') return (parseInt(a.style.zIndex, 10) - parseInt(b.style.zIndex, 10));
        if (a.type !== b.type) return a.type === 'date' ? 1 : -1;
        if (a.type === 'date') return 0;
        const diff = a.date.start - b.date.start;
        return diff !== 0 ? diff : b.date.end - a.date.end;
      });
    },
    getDayIndicators(dayInfo) {
      if (!this.indicators || !this.indicators.length) return [];
      const indicators = [];
      // Cycle through each indicator
      this.indicators.forEach((i, idx) => {
        // Cycle through indicator dates
        if (!i.dates || !i.dates.length) return;
        i.dates.forEach((d) => {
          if (d.getTime && d.getTime() !== dayInfo.dateTime) return;
          const diameter = i.diameter || '5px';
          const backgroundColor = i.backgroundColor || 'rgba(0, 0, 0, 0.5)';
          const borderWidth = i.borderWidth || '0';
          const borderStyle = i.borderStyle || 'solid';
          const borderRadius = i.borderRadius || '50%';
          indicators.push({
            key: i.key || idx.toString(),
            style: {
              backgroundColor,
              borderWidth,
              borderStyle,
              borderRadius,
              width: diameter,
              height: diameter,
            },
          });
        });
      });
      return indicators;
    },
  },
};
</script>

<style lang='sass' scoped>

.c-week
  display: flex

</style>
