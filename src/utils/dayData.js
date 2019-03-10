const _data = {};

export const getCalendarDays = (page, trimMaxWeek) => {
  let days = _data[page.key];
  if (days) {
    return days;
  }
  days = [];
  const { monthComps, prevMonthComps, nextMonthComps } = page;
  const { firstDayOfWeek, firstWeekday } = monthComps;
  const prevMonthDaysToShow =
    firstWeekday + (firstWeekday < firstDayOfWeek ? 7 : 0) - firstDayOfWeek;
  let prevMonth = true;
  let thisMonth = false;
  let nextMonth = false;
  // Init counters with previous month's data
  let day = prevMonthComps.days - prevMonthDaysToShow + 1;
  let dayFromEnd = prevMonthComps.days - day + 1;
  let weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
  let weekdayOrdinalFromEnd = 1;
  let week = prevMonthComps.weeks;
  let weekFromEnd = 1;
  let month = prevMonthComps.month;
  let year = prevMonthComps.year;
  // Store todays comps
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();
  // Cycle through 6 weeks (max in month)
  for (let w = 1; w <= 6 && (!nextMonth || !trimMaxWeek); w++) {
    // Cycle through 7 days
    for (
      let i = 1, weekday = firstDayOfWeek;
      i <= 7;
      i++, weekday += weekday === 7 ? -6 : 1
    ) {
      // We need to know when to start counting actual month days
      if (prevMonth && weekday === firstWeekday) {
        // Reset counters for current month
        day = 1;
        dayFromEnd = monthComps.days;
        weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
        weekdayOrdinalFromEnd = Math.floor((monthComps.days - day) / 7 + 1);
        week = 1;
        weekFromEnd = monthComps.weeks;
        month = monthComps.month;
        year = monthComps.year;
        // ...and flag we're tracking actual month days
        prevMonth = false;
        thisMonth = true;
      }
      // Append day info for the current week
      // Note: this might or might not be an actual month day
      //  We don't know how the UI wants to display various days,
      //  so we'll supply all the data we can
      const date = new Date(year, month - 1, day);
      const weekdayPosition = i;
      const isToday =
        day === todayDay && month === todayMonth && year === todayYear;
      const isFirstDay = thisMonth && day === 1;
      const isLastDay = thisMonth && day === monthComps.days;
      const onTop = w === 1;
      const onBottom = w === 6;
      const onLeft = i === 1;
      const onRight = i === 7;
      days.push({
        id: `${month}.${day}`,
        label: day.toString(),
        day,
        dayFromEnd,
        weekday,
        weekdayPosition,
        weekdayOrdinal,
        weekdayOrdinalFromEnd,
        week,
        weekFromEnd,
        month,
        year,
        date,
        dateTime: date.getTime(),
        isToday,
        isFirstDay,
        isLastDay,
        inMonth: thisMonth,
        inPrevMonth: prevMonth,
        inNextMonth: nextMonth,
        onTop,
        onBottom,
        onLeft,
        onRight,
        classes: [
          `day-${day}`,
          `day-from-end-${dayFromEnd}`,
          `weekday-${weekday}`,
          `weekday-position-${weekdayPosition}`,
          `weekday-ordinal-${weekdayOrdinal}`,
          `weekday-ordinal-from-end-${weekdayOrdinalFromEnd}`,
          `week-${week}`,
          `week-from-end-${weekFromEnd}`,
          {
            'is-today': isToday,
            'is-first-day': isFirstDay,
            'is-last-day': isLastDay,
            'in-month': thisMonth,
            'in-prev-month': prevMonth,
            'in-next-month': nextMonth,
            'on-top': onTop,
            'on-bottom': onBottom,
            'on-left': onLeft,
            'on-right': onRight,
          },
        ],
      });
      // See if we've hit the last day of the month
      if (thisMonth && isLastDay) {
        thisMonth = false;
        nextMonth = true;
        // Reset counters to next month's data
        day = 1;
        dayFromEnd = nextMonthComps.days;
        weekdayOrdinal = 1;
        weekdayOrdinalFromEnd = Math.floor((nextMonthComps.days - day) / 7 + 1);
        week = 1;
        weekFromEnd = nextMonthComps.weeks;
        month = nextMonthComps.month;
        year = nextMonthComps.year;
        // Still in the middle of the month (hasn't ended yet)
      } else {
        day++;
        dayFromEnd--;
        weekdayOrdinal = Math.floor((day - 1) / 7 + 1);
        weekdayOrdinalFromEnd = Math.floor((monthComps.days - day) / 7 + 1);
      }
    }
    // Append week days
    week++;
    weekFromEnd--;
  }
  _data[page.key] = days;
  return days;
};
