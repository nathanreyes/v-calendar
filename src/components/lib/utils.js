// Calendar data
export const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const today = new Date();
export const todayComps = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
};

export const getDateComps = (date) => {
  if (!date || !date.getTime) return undefined;
  const month = date.getMonth() + 1;
  const days = daysInMonths[month - 1];
  const year = date.getFullYear();
  return {
    days,
    month,
    year,
  };
};

// Day/month/year components for previous month
export const getPrevMonthComps = (month, year, isLeapYear) => {
  if (month === 1) {
    return {
      days: daysInMonths[11],
      month: 12,
      year: year - 1,
    };
  }
  return {
    days: (month === 3 && isLeapYear) ? 29 : daysInMonths[month - 2],
    month: month - 1,
    year,
  };
};

// Day/month/year components for next month
export const getNextMonthComps = (month, year, isLeapYear) => {
  if (month === 12) {
    return {
      days: daysInMonths[0],
      month: 1,
      year: year + 1,
    };
  }
  return {
    days: (month === 1 && isLeapYear) ? 29 : daysInMonths[month],
    month: month + 1,
    year,
  };
};

function comparePages(firstPage, secondPage) {
  if (!firstPage || !secondPage) return 0;
  if (firstPage.year === secondPage.year) {
    if (firstPage.month === secondPage.month) return 0;
    return firstPage.month < secondPage.month ? -1 : 1;
  }
  return firstPage.year < secondPage.year ? -1 : 1;
}

export const pageIsBeforePage = (page, beforePage) => comparePages(page, beforePage) === -1;

export const pageIsAfterPage = (page, afterPage) => comparePages(page, afterPage) === 1;


export const getMinPage = (...args) => args.reduce((prev, curr) => {
  if (!prev) return curr;
  if (!curr) return prev;
  return (comparePages(prev, curr) === -1) ? prev : curr;
});

export const getMaxPage = (...args) => args.reduce((prev, curr) => {
  if (!prev) return curr;
  if (!curr) return prev;
  return (comparePages(prev, curr) === 1) ? prev : curr;
});

export const getPrevPage = (page) => {
  if (!page) return undefined;
  const prevComps = getPrevMonthComps(page.month, page.year);
  return {
    month: prevComps.month,
    year: prevComps.year,
  };
};

export const getNextPage = (page) => {
  if (!page) return undefined;
  const nextComps = getNextMonthComps(page.month, page.year);
  return {
    month: nextComps.month,
    year: nextComps.year,
  };
};

// Return page if it lies between the from and to pages
export const getPageBetweenPages = (page, fromPage, toPage) => {
  if (!page) return undefined;
  if (fromPage && comparePages(page, fromPage) === -1) return undefined;
  if (toPage && comparePages(page, toPage) === 1) return undefined;
  return page;
};

export const getFirstValidPage = (...args) => args.find(p => !!p);

export const getFirstArrayItem = (array) => {
  if (!array) return undefined;
  return array.length ? array[0] : undefined;
};

export const getLastArrayItem = (array) => {
  if (!array) return undefined;
  return array.length ? array[array.length - 1] : undefined;
};
