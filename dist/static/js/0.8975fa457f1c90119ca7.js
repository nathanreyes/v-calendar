webpackJsonp([0],Array(302).concat([
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(329)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(317),
  /* template */
  __webpack_require__(377),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 303 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Calendar data
const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/* unused harmony export monthLabels */

const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
/* unused harmony export weekdayLabels */

const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/* unused harmony export daysInMonths */

const today = new Date();
/* unused harmony export today */

const todayComps = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
};
/* unused harmony export todayComps */


const getIsLeapYear = year => ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
/* unused harmony export getIsLeapYear */


// Days/month/year components for a given month and year
const getMonthComps = (month, year) => ({
  days: (month === 2 && getIsLeapYear(year)) ? 29 : daysInMonths[month - 1],
  month,
  year,
});
/* unused harmony export getMonthComps */


// Days/month/year components for a given date
const getDateComps = (date) => {
  if (!date || !date.getTime) return undefined;
  return getMonthComps(date.getMonth() + 1, date.getFullYear());
};
/* unused harmony export getDateComps */


// Days/month/year components for today's month
const getThisMonthComps = () => getMonthComps(todayComps.month, todayComps.year);
/* unused harmony export getThisMonthComps */


// Day/month/year components for previous month
const getPrevMonthComps = (month, year) => {
  if (month === 1) return getMonthComps(12, year - 1);
  return getMonthComps(month - 1, year);
};
/* unused harmony export getPrevMonthComps */


// Day/month/year components for next month
const getNextMonthComps = (month, year) => {
  if (month === 12) return getMonthComps(1, year + 1);
  return getMonthComps(month + 1, year);
};
/* unused harmony export getNextMonthComps */


function comparePages(firstPage, secondPage) {
  if (!firstPage || !secondPage) return 0;
  if (firstPage.year === secondPage.year) {
    if (firstPage.month === secondPage.month) return 0;
    return firstPage.month < secondPage.month ? -1 : 1;
  }
  return firstPage.year < secondPage.year ? -1 : 1;
}

const pageIsBeforePage = (page, beforePage) => comparePages(page, beforePage) === -1;
/* unused harmony export pageIsBeforePage */


const pageIsAfterPage = (page, afterPage) => comparePages(page, afterPage) === 1;
/* unused harmony export pageIsAfterPage */



const getMinPage = (...args) => args.reduce((prev, curr) => {
  if (!prev) return curr;
  if (!curr) return prev;
  return (comparePages(prev, curr) === -1) ? prev : curr;
});
/* unused harmony export getMinPage */


const getMaxPage = (...args) => args.reduce((prev, curr) => {
  if (!prev) return curr;
  if (!curr) return prev;
  return (comparePages(prev, curr) === 1) ? prev : curr;
});
/* unused harmony export getMaxPage */


const getPrevPage = (page) => {
  if (!page) return undefined;
  const prevComps = getPrevMonthComps(page.month, page.year);
  return {
    month: prevComps.month,
    year: prevComps.year,
  };
};
/* unused harmony export getPrevPage */


const getNextPage = (page) => {
  if (!page) return undefined;
  const nextComps = getNextMonthComps(page.month, page.year);
  return {
    month: nextComps.month,
    year: nextComps.year,
  };
};
/* unused harmony export getNextPage */


// Return page if it lies between the from and to pages
const getPageBetweenPages = (page, fromPage, toPage) => {
  if (!page) return undefined;
  if (fromPage && comparePages(page, fromPage) === -1) return undefined;
  if (toPage && comparePages(page, toPage) === 1) return undefined;
  return page;
};
/* unused harmony export getPageBetweenPages */


const getFirstValidPage = (...args) => args.find(p => !!p);
/* unused harmony export getFirstValidPage */


const getFirstArrayItem = (array) => {
  if (!array) return undefined;
  return array.length ? array[0] : undefined;
};
/* unused harmony export getFirstArrayItem */


const getLastArrayItem = (array) => {
  if (!array) return undefined;
  return array.length ? array[array.length - 1] : undefined;
};
/* unused harmony export getLastArrayItem */


const getExampleMonthComps = () => {
  const thisMonthComps = getThisMonthComps();
  const nextMonthComps = getNextMonthComps(thisMonthComps.month, thisMonthComps.year);

  return {
    thisMonth: thisMonthComps.month - 1,
    thisMonthYear: thisMonthComps.year,
    nextMonth: nextMonthComps.month - 1,
    nextMonthYear: nextMonthComps.year,
  };
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getExampleMonthComps;



/***/ }),
/* 304 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var props = [{
      propertyName: '<code>key: String</code>',
      description: 'Attribute keys may affect how animations are applied when they appear or disappear.',
      default: '<code><i>index</i></code>'
    }, {
      propertyName: '<code>highlight: Object</code>',
      description: 'Highlight to associate with the attribute.',
      default: '<code>undefined</code>'
    }, {
      propertyName: '<code>indicator: Object</code>',
      description: 'Indicator to associate with the attribute.',
      default: '<code>undefined</code>'
    }, {
      propertyName: '<code>contentStyle: Object</code>',
      description: 'Day cell content style to associate with the attribute. This property is inherited from the default <code>dayContentStyle</code> calendar property, so only assign this property if it needs to be overwritten by the attribute.',
      default: '<code>undefined</code>'
    }, {
      propertyName: '<code>contentHoverStyle: Object</code>',
      description: 'Day cell content <strong>hover</strong> style to associate with the attribute. This does not affect the content itself, just the hover layer that appears above the content. This property is inherited from the default <code>dayContentHoverStyle</code> calendar property, so only assign this property if it needs to be overwritten by the attribute.',
      default: '<code>undefined</code>'
    }, {
      propertyName: '<code>showHover: Boolean</code>',
      description: 'Determines if hover layer should display. This property is inherited from the default <code>showHover</code> calendar property, so only assign this property if it needs to be overwritten by the attribute.',
      default: '<code>undefined</code>'
    }, {
      propertyName: '<code>dates: Array[Date, Object]</code>',
      description: 'List of dates or date range objects for the attribute. Date ranges must specify <code>start</code> and <code>end</code> dates.',
      default: '<code>[]</code>'
    }, {
      propertyName: '<code>order: Number</code>',
      description: 'By default, attributes are ordered to display the most information possible. For example, when attributes overlap, single date attributes appear above/before date range attributes, and date range attributes with a later start date appear above/before those with an earlier start date. If you would like to force an attribute to prioritize above all others (overriding these rules), assign an <code>order</code> value greater than 0.',
      default: '<code>0</code>'
    }];
    return {
      props: props
    };
  }
});

/***/ }),
/* 305 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var props = [{
      propertyName: '<code>day: Number</code>',
      description: 'Day number (1-31).'
    }, {
      propertyName: '<code>weekday: Number</code>',
      description: 'Day weekday number (1-7, Sun-Sat).'
    }, {
      propertyName: '<code>week: Number</code>',
      description: 'Number of week that contains this day (1-6).'
    }, {
      propertyName: '<code>month: Number</code>',
      description: 'Number of month that contains this day (1-12).'
    }, {
      propertyName: '<code>year: Number</code>',
      description: 'Number of year that contains this day.'
    }, {
      propertyName: '<code>date: Date</code>',
      description: 'Date for this day.'
    }, {
      propertyName: '<code>dateTime: Number</code>',
      description: 'Result of date.getTime() for this day.'
    }, {
      propertyName: '<code>inMonth: Boolean</code>',
      description: 'Day lies in the currently active month.'
    }, {
      propertyName: '<code>inPrevMonth: Boolean</code>',
      description: 'Day lies in the month before the currently active month.'
    }, {
      propertyName: '<code>inNextMonth: Boolean</code>',
      description: 'Day lies in the month after the currently active month.'
    }, {
      propertyName: '<code>attributes: Array</code>',
      description: 'Attributes associated with the day.'
    }];
    return {
      props: props
    };
  }
});

/***/ }),
/* 306 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var props = [{
      name: '<code>dayClick</code>',
      description: 'Calendar day cell was clicked.',
      parameters: '<code>dayInfo: Object</code>'
    }, {
      name: '<code>dayEnter</code>',
      description: 'Cursor entered a calendar day cell.',
      parameters: '<code>dayInfo: Object</code>'
    }, {
      name: '<code>dayLeave</code>',
      description: 'Cursor left a calendar day cell.',
      parameters: '<code>dayInfo: Object</code>'
    }, {
      name: '<code>updated:fromPage</code>',
      description: 'Calendar left/single pane moved to a different page.',
      parameters: '<code>page: Object</code>'
    }, {
      name: '<code>updated:toPage</code>',
      description: 'Calendar right pane moved to a different page.',
      parameters: '<code>page: Object</code>'
    }, {
      name: '<code>input</code>',
      description: '<span class="tag is-warning">Date Picker</span>New date was selected.',
      parameters: '<code>value: Date, Array[Date], Object</code>'
    }, {
      name: '<code>drag</code>',
      description: '<span class="tag is-warning">Date Picker</span>Dragged selection was updated. Only valid for "range" selection mode.',
      parameters: '<code>range: Object</code>'
    }];
    return {
      props: props
    };
  }
});

/***/ }),
/* 307 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var props = [{
      propertyName: '<code>key: String</code>',
      description: 'Key for highlighted region. Keys affect how highlight animations are applied when appearing or disappearing.',
      default: '<code><i>index</i></code>'
    }, {
      propertyName: '<code>height: String</code>',
      description: 'Height of highlighted region.',
      default: '<code>"1.8rem"</code>'
    }, {
      propertyName: '<code>backgroundColor: String</code>',
      description: 'Background color in highlighted region.',
      default: '<code>"rgba(0, 0, 0, 0.5)"</code>'
    }, {
      propertyName: '<code>borderColor: String</code>',
      description: 'Border color in highlighted region.',
      default: '<code>undefined</code>'
    }, {
      propertyName: '<code>borderWidth: String</code>',
      description: 'Border width in highlighted region.',
      default: '<code>"0"</code>'
    }, {
      propertyName: '<code>borderStyle: String</code>',
      description: 'Border style in highlighted region.',
      default: '<code>"solid"</code>'
    }, {
      propertyName: '<code>borderRadius: String</code>',
      description: 'Border radius in highlighted region.',
      default: '<code>"1.8rem"</code>'
    }];
    return {
      props: props
    };
  }
});

/***/ }),
/* 308 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var props = [{
      propertyName: '<code>key: String</code>',
      description: 'Key for indicator. Keys affect how highlight animations are applied when appearing or disappearing.',
      default: '<code><i>index</i></code>'
    }, {
      propertyName: '<code>diameter: String</code>',
      description: 'Diameter of indicator.',
      default: '<code>"5px"</code>'
    }, {
      propertyName: '<code>backgroundColor: String</code>',
      description: 'Background color of indicator.',
      default: '<code>"rgba(0, 0, 0, 0.5)"</code>'
    }, {
      propertyName: '<code>border: String</code>',
      description: 'Border of indicator.',
      default: '<code>undefined</code>'
    }, {
      propertyName: '<code>borderColor: String</code>',
      description: 'Border color of indicator.',
      default: '<code>undefined</code>'
    }, {
      propertyName: '<code>borderWidth: String</code>',
      description: 'Border width of indicator.',
      default: '<code>"0"</code>'
    }, {
      propertyName: '<code>borderStyle: String</code>',
      description: 'Border style of indicator.',
      default: '<code>"solid"</code>'
    }, {
      propertyName: '<code>borderRadius: String</code>',
      description: 'Border radius of indicator.',
      default: '<code>"50%"<code>'
    }];
    return {
      props: props
    };
  }
});

/***/ }),
/* 309 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var props = [{
      propertyName: '<code>month: Number</code>',
      description: 'Page month number.'
    }, {
      propertyName: '<code>year: Number</code>',
      description: 'Page year number.'
    }, {
      propertyName: '<code>monthLabel: String</code>',
      description: 'Page month label as specified by the <code>monthLabels</code> prop.'
    }, {
      propertyName: '<code>yearLabel: String</code>',
      description: 'Page year label in <i>YYYY</i> format.'
    }, {
      propertyName: '<code>yearLabel_2: String</code>',
      description: 'Page year label in <i>YY</i> format.'
    }, {
      propertyName: '<code>isLeapYear: String</code>',
      description: 'Indicator if page year is a leap year.'
    }, {
      propertyName: '<code>daysInMonth: Number</code>',
      description: 'Number of days in the page month.'
    }, {
      propertyName: '<code>firstWeekdayInMonth: Number</code>',
      description: 'Number of the first weekday in the page month.'
    }, {
      propertyName: '<code>thisMonthComps: Object</code>',
      description: 'Components <code>{ <i>days</i>, <i>month</i>, <i>year</i> }</code> for the today\'s month.'
    }, {
      propertyName: '<code>prevMonthComps: Object</code>',
      description: 'Components <code>{ <i>days</i>, <i>month</i>, <i>year</i> }</code> for the previous month.'
    }, {
      propertyName: '<code>nextMonthComps: Object</code>',
      description: 'Components <code>{ <i>days</i>, <i>month</i>, <i>year</i> }</code> for the next month.'
    }, {
      propertyName: '<code>move(<i>month</i>, <i>year</i>): Function</code>',
      description: 'Function that moves to a page with a specified month and year.'
    }, {
      propertyName: '<code>movePrevMonth(): Function</code>',
      description: 'Function that moves to the page for the previous month.'
    }, {
      propertyName: '<code>moveNextMonth(): Function</code>',
      description: 'Function that moves to the page for the next month.'
    }, {
      propertyName: '<code>moveThisMonth(): Function</code>',
      description: 'Function that moves to the page for this month.'
    }];
    return {
      props: props
    };
  }
});

/***/ }),
/* 310 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var props = [{
      name: '<code>month-labels: Array[String]</code>',
      description: 'Month labels displayed in header.',
      default: '<code>["January",...,"December"]</code>'
    }, {
      name: '<code>weekday-labels: Array[String]</code>',
      description: 'Weekday labels displayed in header. Start with Sunday, even if it isn\'t set as the first day of the week',
      default: '<code>["S", "M", "T", "W", "T", "F", "S", "S"]</code>'
    }, {
      name: '<code>first-day-of-week: Number</code>',
      description: 'Weekday number (1-7, Sun-Sat) to use as the first day of the week.',
      default: '<code>1</code>'
    }, {
      name: '<code>from-page: Object</code>',
      description: 'Active page for single paned calendar or the left pane for double paned calendar. Use the <code>.sync</code> modifier for two-way binding.',
      default: '<code>{ month: <i>thisMonth</i>, year: <i>thisMonthYear</i> }</code>'
    }, {
      name: '<code>to-page: Object</code>',
      description: 'Active page for the right pane for double paned calendar. Use the <code>.sync</code> modifier for two-way binding.',
      default: '<code>{ month: <i>nextMonth</i>, year: <i>nextMonthYear</i> }</code>'
    }, {
      name: '<code>min-page: Object</code>',
      description: 'Earliest page (<i>month</i>, <i>year</i>) that the user can navigate to.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>max-page: Object</code>',
      description: 'Latest page (<i>month</i>, <i>year</i>) that the user can navigate to.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>is-double-paned: Boolean</code>',
      description: 'Puts two calendars side by side.',
      default: '<code>false</code>'
    }, {
      name: '<code>wrap-panes: Boolean</code>',
      description: 'If calendar is double-paned, wrap the panes when constrained.',
      default: '<code>false</code>'
    }, {
      name: '<code>attributes: Array[Object]</code>',
      description: 'List of attributes to display in the calendar.',
      default: '<code>[]</code>'
    }, {
      name: '<code>indicators-offset: String',
      description: 'Offset margin of indicators from bottom of day cell.',
      default: '<code>"0"</code>'
    }, {
      name: '<code>class: Object</code>, <code>style: Object</code>',
      description: 'Typical class and style props. Used for calendar wrapper.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>header-style: Object</code>',
      description: 'Style for calendar header.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>arrow-style: Object</code>',
      description: 'Style for calendar header arrows.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>title-style: Object</code>',
      description: 'Style for calendar header title.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>title-transition: String</code>',
      description: 'Transition type for title when navigating to a new page: <code>"slide"</code>, <code>"fade"</code>, <code>"none"</code>',
      default: '<code>"slide"</code>'
    }, {
      name: '<code>weekday-style: Object</code>',
      description: 'Style for weekday labels.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>weeks-transition: String</code>',
      description: 'Transition type for weeks when navigating to a new page: <code>"slide"</code>, <code>"fade"</code>, <code>"none"</code>',
      default: '<code>"slide"</code>'
    }, {
      name: '<code>day-content-style: Object</code>',
      description: 'Style for day cell content.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>day-height: String</code>',
      description: 'Height of the day cell container. Should be large enough to contain content and highlights.',
      default: '<code>"2.2rem"</code>'
    }, {
      name: '<code>value: Date, Array[Date], Object</code>',
      description: '<span class="tag is-warning">Date Picker</span>Selected date, dates or date range.',
      default: '<code>null</code>'
    }, {
      name: '<code>select-mode: String</code>',
      description: '<span class="tag is-warning">Date Picker</span>Selection mode: <code>"single"</code>, <code>"multiple"</code>, <code>"range"</code>',
      default: '<code>"single"</code>'
    }, {
      name: '<code>disabled-dates: Array</code>',
      description: '<span class="tag is-warning">Date Picker</span>List of disabled dates or date range objects. Date ranges must specify <code>start</code> and <code>end</code> dates.',
      default: '<code>undefined</code>'
    }, {
      name: '<code>select-attribute: Object</code>',
      description: '<span class="tag is-warning">Date Picker</span>Attribute to use for the date selection in all modes.',
      default: '<code>\n          {\n            highlight: {\n              backgroundColor: \'#74a4a4\',\n              borderWidth: \'1px\',\n              borderColor: \'#65999a\'\n            },\n            contentStyle: {\n              color: \'#fafafa\'\n            }\n          }\n        </code>'
    }, {
      name: '<code>drag-attribute: Object</code>',
      description: '<span class="tag is-warning">Date Picker</span>Attribute to use for the dragged selection in <code>"range"</code> mode.',
      default: '<code>\n          {\n            highlight: {\n              backgroundColor: \'#c1d6d7\',\n              height: \'25px\'\n            },\n            contentStyle: {\n              color: \'#103456\'\n            }\n          }\n        </code>'
    }, {
      name: '<code>disabled-attribute: Object</code>',
      description: '<span class="tag is-warning">Date Picker</span>Attribute to use for disabled dates.',
      default: '<code>\n        {\n          order: 100,\n          contentStyle: {\n            color: \'red\',\n            textDecoration: \'line-through\',\n            cursor: \'not-allowed\'\n          }\n        }\n        </code>'
    }];
    return {
      props: props
    };
  }
});

/***/ }),
/* 311 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    // const movePrevMonthCode = '<code>movePrevMonth(): Function</code>';
    // const moveNextMonthCode = '<code>moveNextMonth(): Function</code>';
    // const moveThisMonthCode = '<code>moveThisMonth(): Function</code>';
    // const moveCode = '<code>move(<i>month</i>: Number, <i>year</i>: Number): Function</code>';
    var props = [{
      name: '<code>header</code>',
      description: 'Calendar header. Use slots below for specific header sections.',
      props: '<code>page: Object</code>'
    }, {
      name: '<code>header-title</code>',
      description: 'Calendar header title. This slot is animated if animations are enabled.',
      props: '<code>page: Object</code>'
    }, {
      name: '<code>header-left-button</code>',
      description: 'Calendar header button on the left side.',
      props: '<code>page: Object</code>'
    }, {
      name: '<code>header-right-button</code>',
      description: 'Calendar header button on the right side.',
      props: '<code>page: Object</code>'
    }];
    return {
      props: props
    };
  }
});

/***/ }),
/* 312 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(303);
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var _getExampleMonthComps = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* getExampleMonthComps */])(),
        thisMonth = _getExampleMonthComps.thisMonth,
        thisMonthYear = _getExampleMonthComps.thisMonthYear,
        nextMonth = _getExampleMonthComps.nextMonth,
        nextMonthYear = _getExampleMonthComps.nextMonthYear;

    return {
      attributes: [{
        // Red
        contentStyle: {
          color: '#ff3333',
          fontWeight: 600,
          fontSize: '1em'
        },
        dates: [{
          start: new Date(thisMonthYear, thisMonth, 1),
          end: new Date(thisMonthYear, thisMonth, 4)
        }, new Date(nextMonthYear, nextMonth, 6), new Date(nextMonthYear, nextMonth, 23)]
      }, {
        // Blue
        contentStyle: {
          color: '#0040ff',
          fontWeight: 600,
          fontStyle: 'italic'
        },
        dates: [new Date(thisMonthYear, thisMonth, 1), new Date(thisMonthYear, thisMonth, 10), new Date(thisMonthYear, thisMonth, 12), {
          start: new Date(nextMonthYear, nextMonth, 22),
          end: new Date(nextMonthYear, nextMonth, 26)
        }]
      }, {
        contentStyle: {
          // Orange
          color: '#ff8000',
          fontWeight: 600
        },
        dates: [new Date(thisMonthYear, thisMonth, 14), {
          start: new Date(thisMonthYear, thisMonth, 24),
          end: new Date(thisMonthYear, thisMonth, 25)
        }, new Date(thisMonthYear, thisMonth, 28), new Date(thisMonthYear, thisMonth + 1, 4), {
          start: new Date(nextMonthYear, nextMonth, 16),
          end: new Date(nextMonthYear, nextMonth, 17)
        }]
      }]
    };
  }
});

/***/ }),
/* 313 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(303);
//
//
//
//
//
//
//
//
//
//
//
//



var _getExampleMonthComps = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* getExampleMonthComps */])(),
    thisMonth = _getExampleMonthComps.thisMonth,
    thisMonthYear = _getExampleMonthComps.thisMonthYear,
    nextMonth = _getExampleMonthComps.nextMonth,
    nextMonthYear = _getExampleMonthComps.nextMonthYear;

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    isPopover: { type: Boolean, default: false },
    selectMode: { type: String, default: 'range' }
  },
  data: function data() {
    return {
      dayStyle: {
        hoverBorder: 'solid blue 3px',
        hoverBackgroundColor: 'red'
      },
      selectedValue: {
        start: new Date(thisMonthYear, thisMonth, 6),
        end: new Date(nextMonthYear, nextMonth, 25)
      },
      disabledDates: [{
        start: new Date(nextMonthYear, nextMonth, 26),
        end: new Date(nextMonthYear, nextMonth, 28)
      }]
    };
  },

  watch: {
    selectedValue: function selectedValue(val) {
      this.$emit('input', val);
    }
  },
  created: function created() {
    this.$emit('input', this.selectedValue);
  }
});

/***/ }),
/* 314 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(303);
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var _getExampleMonthComps = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* getExampleMonthComps */])(),
        thisMonth = _getExampleMonthComps.thisMonth,
        thisMonthYear = _getExampleMonthComps.thisMonthYear,
        nextMonth = _getExampleMonthComps.nextMonth,
        nextMonthYear = _getExampleMonthComps.nextMonthYear;

    return {
      attributes: [{
        highlight: {
          // Light red background
          backgroundColor: '#bd9999',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#ae8484'
        },
        contentStyle: {
          color: 'white'
        },
        dates: [
        // Use date ranges
        {
          start: new Date(thisMonthYear, thisMonth, 1),
          end: new Date(thisMonthYear, thisMonth, 4)
        },
        // Or single dates
        new Date(nextMonthYear, nextMonth, 6), new Date(nextMonthYear, nextMonth, 23)]
      }, {
        highlight: {
          // Light purple background
          backgroundColor: '#9999bd',
          borderWidth: '2px',
          borderColor: '#8484ae'
        },
        contentStyle: {
          color: 'white'
        },
        dates: [new Date(thisMonthYear, thisMonth, 1), new Date(thisMonthYear, thisMonth, 10), new Date(thisMonthYear, thisMonth, 12), {
          start: new Date(nextMonthYear, nextMonth, 22),
          end: new Date(nextMonthYear, nextMonth, 26)
        }]
      }, {
        highlight: {
          // Light tan background
          backgroundColor: '#bdb499',
          borderWidth: '2px',
          borderColor: '#aea484',
          borderRadius: '5px'
        },
        contentStyle: {
          color: 'white'
        },
        dates: [new Date(thisMonthYear, thisMonth, 14), {
          start: new Date(thisMonthYear, thisMonth, 24),
          end: new Date(thisMonthYear, thisMonth, 25)
        }, new Date(thisMonthYear, thisMonth, 28), new Date(thisMonthYear, thisMonth + 1, 4), {
          start: new Date(nextMonthYear, nextMonth, 16),
          end: new Date(nextMonthYear, nextMonth, 17)
        }]
      }]
    };
  }
});

/***/ }),
/* 315 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(303);
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var _getExampleMonthComps = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* getExampleMonthComps */])(),
        thisMonth = _getExampleMonthComps.thisMonth,
        thisMonthYear = _getExampleMonthComps.thisMonthYear,
        nextMonth = _getExampleMonthComps.nextMonth,
        nextMonthYear = _getExampleMonthComps.nextMonthYear;

    return {
      attributes: [{
        indicator: {
          // Red
          backgroundColor: '#ff3333'
        },
        dates: [new Date(thisMonthYear, thisMonth, 1), new Date(thisMonthYear, thisMonth, 10), new Date(thisMonthYear, thisMonth, 22), new Date(nextMonthYear, nextMonth, 6), new Date(nextMonthYear, nextMonth, 16)]
      }, {
        indicator: {
          // Blue
          backgroundColor: '#0040ff'
        },
        dates: [new Date(thisMonthYear, thisMonth, 4), new Date(thisMonthYear, thisMonth, 10), new Date(thisMonthYear, thisMonth, 15), new Date(nextMonthYear, nextMonth, 1), new Date(nextMonthYear, nextMonth, 12), {
          start: new Date(nextMonthYear, nextMonth, 20),
          end: new Date(nextMonthYear, nextMonth, 25)
        }]
      }, {
        indicator: {
          // Orange
          backgroundColor: '#ff8000'
        },
        dates: [new Date(thisMonthYear, thisMonth, 12), new Date(thisMonthYear, thisMonth, 26), new Date(thisMonthYear, thisMonth, 15), new Date(nextMonthYear, nextMonth, 9), new Date(nextMonthYear, nextMonth, 5), new Date(nextMonthYear, nextMonth, 6), new Date(nextMonthYear, nextMonth, 20), new Date(nextMonthYear, nextMonth, 25)]
      }]
    };
  }
});

/***/ }),
/* 316 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    isDoublePaned: { type: Boolean, default: false },
    titleTransition: { type: String, default: 'slide' },
    weeksTransition: { type: String, default: 'slide' }
  }
});

/***/ }),
/* 317 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SectionHeader__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SectionHeader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__SectionHeader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SectionIntro__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SectionIntro___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__SectionIntro__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SectionAttributes__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SectionAttributes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__SectionAttributes__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__SectionContentStyles__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__SectionContentStyles___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__SectionContentStyles__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__SectionHighlights__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__SectionHighlights___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__SectionHighlights__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SectionIndicators__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SectionIndicators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__SectionIndicators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SectionDatePicker__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SectionDatePicker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__SectionDatePicker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__SectionApi__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__SectionApi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__SectionApi__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__SectionUsage__ = __webpack_require__(359);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__SectionUsage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__SectionUsage__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__SectionFooter__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__SectionFooter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__SectionFooter__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */











/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    SectionHeader: __WEBPACK_IMPORTED_MODULE_0__SectionHeader___default.a,
    SectionIntro: __WEBPACK_IMPORTED_MODULE_1__SectionIntro___default.a,
    SectionAttributes: __WEBPACK_IMPORTED_MODULE_2__SectionAttributes___default.a,
    SectionContentStyles: __WEBPACK_IMPORTED_MODULE_3__SectionContentStyles___default.a,
    SectionHighlights: __WEBPACK_IMPORTED_MODULE_4__SectionHighlights___default.a,
    SectionIndicators: __WEBPACK_IMPORTED_MODULE_5__SectionIndicators___default.a,
    SectionDatePicker: __WEBPACK_IMPORTED_MODULE_6__SectionDatePicker___default.a,
    SectionApi: __WEBPACK_IMPORTED_MODULE_7__SectionApi___default.a,
    SectionUsage: __WEBPACK_IMPORTED_MODULE_8__SectionUsage___default.a,
    SectionFooter: __WEBPACK_IMPORTED_MODULE_9__SectionFooter___default.a
  }
});

/***/ }),
/* 318 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CalendarApiProps__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CalendarApiProps___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__CalendarApiProps__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CalendarApiEvents__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CalendarApiEvents___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__CalendarApiEvents__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CalendarApiSlots__ = __webpack_require__(344);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CalendarApiSlots___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__CalendarApiSlots__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CalendarApiAttribute__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CalendarApiAttribute___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__CalendarApiAttribute__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__CalendarApiHighlight__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__CalendarApiHighlight___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__CalendarApiHighlight__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CalendarApiIndicator__ = __webpack_require__(341);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CalendarApiIndicator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__CalendarApiIndicator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__CalendarApiPage__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__CalendarApiPage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__CalendarApiPage__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__CalendarApiDayInfo__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__CalendarApiDayInfo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__CalendarApiDayInfo__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//










/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    CalendarApiProps: __WEBPACK_IMPORTED_MODULE_0__CalendarApiProps___default.a,
    CalendarApiEvents: __WEBPACK_IMPORTED_MODULE_1__CalendarApiEvents___default.a,
    CalendarApiSlots: __WEBPACK_IMPORTED_MODULE_2__CalendarApiSlots___default.a,
    CalendarApiAttribute: __WEBPACK_IMPORTED_MODULE_3__CalendarApiAttribute___default.a,
    CalendarApiHighlight: __WEBPACK_IMPORTED_MODULE_4__CalendarApiHighlight___default.a,
    CalendarApiIndicator: __WEBPACK_IMPORTED_MODULE_5__CalendarApiIndicator___default.a,
    CalendarApiPage: __WEBPACK_IMPORTED_MODULE_6__CalendarApiPage___default.a,
    CalendarApiDayInfo: __WEBPACK_IMPORTED_MODULE_7__CalendarApiDayInfo___default.a
  },
  data: function data() {
    return {
      apiTabIndex: 0
    };
  },

  methods: {
    selectTab: function selectTab(tab) {
      this.apiTabIndex = ['props', 'events', 'slots', 'highlights', 'indicators', 'page', 'dayInfo'].indexOf(tab);
    }
  }
});

/***/ }),
/* 319 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExContentStyles__ = __webpack_require__(345);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExContentStyles___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ExContentStyles__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExContentStyles__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExContentStyles___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__raw_loader_ExContentStyles__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    ExContentStyles: __WEBPACK_IMPORTED_MODULE_0__ExContentStyles___default.a
  },
  data: function data() {
    return {
      exContentStylesCode: __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExContentStyles___default.a
    };
  }
});

/***/ }),
/* 320 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExDatePicker__ = __webpack_require__(346);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExDatePicker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ExDatePicker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExDatePicker__ = __webpack_require__(332);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExDatePicker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__raw_loader_ExDatePicker__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    ExDatePicker: __WEBPACK_IMPORTED_MODULE_0__ExDatePicker___default.a
  },
  data: function data() {
    return {
      exDatePickerCode: __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExDatePicker___default.a,
      isPopover: false,
      selectMode: 'range',
      selectedValue: null
    };
  }
});

/***/ }),
/* 321 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExHighlights__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExHighlights___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ExHighlights__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExHighlights__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExHighlights___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__raw_loader_ExHighlights__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    ExHighlights: __WEBPACK_IMPORTED_MODULE_0__ExHighlights___default.a
  },
  data: function data() {
    return {
      exHighlightsCode: __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExHighlights___default.a
    };
  }
});

/***/ }),
/* 322 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExIndicators__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExIndicators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ExIndicators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExIndicators__ = __webpack_require__(334);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExIndicators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__raw_loader_ExIndicators__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    ExIndicators: __WEBPACK_IMPORTED_MODULE_0__ExIndicators___default.a
  },
  data: function data() {
    return {
      exIndicatorsCode: __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExIndicators___default.a
    };
  }
});

/***/ }),
/* 323 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExIntro__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ExIntro___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ExIntro__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExIntro__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExIntro___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__raw_loader_ExIntro__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    ExIntro: __WEBPACK_IMPORTED_MODULE_0__ExIntro___default.a
  },
  props: {},
  data: function data() {
    return {
      exIntroCode: __WEBPACK_IMPORTED_MODULE_1__raw_loader_ExIntro___default.a,
      isDoublePaned: false,
      titleTransition: 'slide',
      weeksTransition: 'slide',
      transitions: ['slide', 'fade', 'none']
    };
  }
});

/***/ }),
/* 324 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      importCode: "\n        import Vue from 'vue';\n        import VCalendar from 'v-calendar';\n        import 'vcalendar/lib/vcalendar.css';\n\n        Vue.use(VCalendar);",
      componentCode: "\n        <template>\n          <v-calendar\n            is-double-paned>\n          </v-calendar>\n          <v-date-picker\n            mode='single'\n            v-model='mySelection'>\n          </v-date-picker>\n        </template>"
    };
  }
});

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(300)(true);
// imports


// module
exports.push([module.i, ".attribute-img[data-v-55747c6a]{max-height:300px;margin-top:-30px}", "", {"version":3,"sources":["/Users/nathan/Documents/Web/v-calendar/docs/components/SectionAttributes.vue"],"names":[],"mappings":"AACA,gCACE,iBAAkB,AAClB,gBAAkB,CACnB","file":"SectionAttributes.vue","sourcesContent":["\n.attribute-img[data-v-55747c6a] {\n  max-height: 300px;\n  margin-top: -30px;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(300)(true);
// imports


// module
exports.push([module.i, ".center-container{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.b-tabs .tabs{margin-bottom:10px}.column.is-example{margin-top:39px}", "", {"version":3,"sources":["/Users/nathan/Documents/Web/v-calendar/docs/components/Home.vue"],"names":[],"mappings":"AACA,kBACE,oBAAqB,AACrB,oBAAqB,AACrB,aAAc,AACd,wBAAyB,AACrB,qBAAsB,AAClB,sBAAwB,CACjC,AACD,cACE,kBAAoB,CACrB,AACD,mBACE,eAAiB,CAClB","file":"Home.vue","sourcesContent":["\n.center-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.b-tabs .tabs {\n  margin-bottom: 10px;\n}\n.column.is-example {\n  margin-top: 39px;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(300)(true);
// imports


// module
exports.push([module.i, ".tag.is-warning{margin-right:10px}", "", {"version":3,"sources":["/Users/nathan/Documents/Web/v-calendar/docs/components/CalendarApiProps.vue"],"names":[],"mappings":"AACA,gBACE,iBAAmB,CACpB","file":"CalendarApiProps.vue","sourcesContent":["\n.tag.is-warning {\n  margin-right: 10px;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(325);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(301)("df222006", content, true);

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(326);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(301)("6b443491", content, true);

/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(327);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(301)("cb73c8d0", content, true);

/***/ }),
/* 331 */
/***/ (function(module, exports) {

module.exports = "<template>\r\n  <v-calendar\r\n    :attributes='attributes'\r\n    is-double-paned>\r\n  </v-calendar>\r\n</template>\r\n\r\n<script>\r\nimport { getExampleMonthComps } from './utils';\r\n\r\nexport default {\r\n  data() {\r\n    const {\r\n      thisMonth,\r\n      thisMonthYear,\r\n      nextMonth,\r\n      nextMonthYear } = getExampleMonthComps();\r\n    return {\r\n      attributes: [\r\n        {\r\n          // Red\r\n          contentStyle: {\r\n            color: '#ff3333',\r\n            fontWeight: 600,\r\n            fontSize: '1em',\r\n          },\r\n          dates: [\r\n            {\r\n              start: new Date(thisMonthYear, thisMonth, 1),\r\n              end: new Date(thisMonthYear, thisMonth, 4),\r\n            },\r\n            new Date(nextMonthYear, nextMonth, 6),\r\n            new Date(nextMonthYear, nextMonth, 23),\r\n          ],\r\n        },\r\n        {\r\n          // Blue\r\n          contentStyle: {\r\n            color: '#0040ff',\r\n            fontWeight: 600,\r\n            fontStyle: 'italic',\r\n          },\r\n          dates: [\r\n            new Date(thisMonthYear, thisMonth, 1),\r\n            new Date(thisMonthYear, thisMonth, 10),\r\n            new Date(thisMonthYear, thisMonth, 12),\r\n            {\r\n              start: new Date(nextMonthYear, nextMonth, 22),\r\n              end: new Date(nextMonthYear, nextMonth, 26),\r\n            },\r\n          ],\r\n        },\r\n        {\r\n          contentStyle: {\r\n            // Orange\r\n            color: '#ff8000',\r\n            fontWeight: 600,\r\n          },\r\n          dates: [\r\n            new Date(thisMonthYear, thisMonth, 14),\r\n            {\r\n              start: new Date(thisMonthYear, thisMonth, 24),\r\n              end: new Date(thisMonthYear, thisMonth, 25),\r\n            },\r\n            new Date(thisMonthYear, thisMonth, 28),\r\n            new Date(thisMonthYear, thisMonth + 1, 4),\r\n            {\r\n              start: new Date(nextMonthYear, nextMonth, 16),\r\n              end: new Date(nextMonthYear, nextMonth, 17),\r\n            },\r\n          ],\r\n        },\r\n      ],\r\n    };\r\n  },\r\n};\r\n</script>\r\n"

/***/ }),
/* 332 */
/***/ (function(module, exports) {

module.exports = "<template>\r\n  <v-date-picker\r\n    :select-mode='selectMode'\r\n    :is-popover='isPopover'\r\n    :day-content-style='dayStyle'\r\n    :disabled-dates='disabledDates'\r\n    inputClass='input'\r\n    v-model='selectedValue'\r\n    is-double-paned>\r\n  </v-date-picker>\r\n</template>\r\n\r\n<script>\r\nimport { getExampleMonthComps } from './utils';\r\n\r\nconst { thisMonth, thisMonthYear, nextMonth, nextMonthYear } = getExampleMonthComps();\r\n\r\nexport default {\r\n  props: {\r\n    isPopover: { type: Boolean, default: false },\r\n    selectMode: { type: String, default: 'range' },\r\n  },\r\n  data() {\r\n    return {\r\n      dayStyle: {\r\n        hoverBorder: 'solid blue 3px',\r\n        hoverBackgroundColor: 'red',\r\n      },\r\n      selectedValue: {\r\n        start: new Date(thisMonthYear, thisMonth, 6),\r\n        end: new Date(nextMonthYear, nextMonth, 25),\r\n      },\r\n      disabledDates: [\r\n        {\r\n          start: new Date(nextMonthYear, nextMonth, 26),\r\n          end: new Date(nextMonthYear, nextMonth, 28),\r\n        },\r\n      ],\r\n    };\r\n  },\r\n  watch: {\r\n    selectedValue(val) {\r\n      this.$emit('input', val);\r\n    },\r\n  },\r\n  created() {\r\n    this.$emit('input', this.selectedValue);\r\n  },\r\n};\r\n</script>\r\n"

/***/ }),
/* 333 */
/***/ (function(module, exports) {

module.exports = "<template>\r\n  <v-calendar\r\n    :attributes='attributes'\r\n    is-double-paned>\r\n  </v-calendar>\r\n</template>\r\n\r\n<script>\r\nimport { getExampleMonthComps } from './utils';\r\n\r\nexport default {\r\n  data() {\r\n    const {\r\n      thisMonth,\r\n      thisMonthYear,\r\n      nextMonth,\r\n      nextMonthYear } = getExampleMonthComps();\r\n    return {\r\n      attributes: [\r\n        {\r\n          highlight: {\r\n            // Light red background\r\n            backgroundColor: '#bd9999',\r\n            borderWidth: '2px',\r\n            borderStyle: 'solid',\r\n            borderColor: '#ae8484',\r\n          },\r\n          contentStyle: {\r\n            color: 'white',\r\n          },\r\n          dates: [\r\n            // Use date ranges\r\n            {\r\n              start: new Date(thisMonthYear, thisMonth, 1),\r\n              end: new Date(thisMonthYear, thisMonth, 4),\r\n            },\r\n            // Or single dates\r\n            new Date(nextMonthYear, nextMonth, 6),\r\n            new Date(nextMonthYear, nextMonth, 23),\r\n          ],\r\n        },\r\n        {\r\n          highlight: {\r\n            // Light purple background\r\n            backgroundColor: '#9999bd',\r\n            borderWidth: '2px',\r\n            borderColor: '#8484ae',\r\n          },\r\n          contentStyle: {\r\n            color: 'white',\r\n          },\r\n          dates: [\r\n            new Date(thisMonthYear, thisMonth, 1),\r\n            new Date(thisMonthYear, thisMonth, 10),\r\n            new Date(thisMonthYear, thisMonth, 12),\r\n            {\r\n              start: new Date(nextMonthYear, nextMonth, 22),\r\n              end: new Date(nextMonthYear, nextMonth, 26),\r\n            },\r\n          ],\r\n        },\r\n        {\r\n          highlight: {\r\n            // Light tan background\r\n            backgroundColor: '#bdb499',\r\n            borderWidth: '2px',\r\n            borderColor: '#aea484',\r\n            borderRadius: '5px',\r\n          },\r\n          contentStyle: {\r\n            color: 'white',\r\n          },\r\n          dates: [\r\n            new Date(thisMonthYear, thisMonth, 14),\r\n            {\r\n              start: new Date(thisMonthYear, thisMonth, 24),\r\n              end: new Date(thisMonthYear, thisMonth, 25),\r\n            },\r\n            new Date(thisMonthYear, thisMonth, 28),\r\n            new Date(thisMonthYear, thisMonth + 1, 4),\r\n            {\r\n              start: new Date(nextMonthYear, nextMonth, 16),\r\n              end: new Date(nextMonthYear, nextMonth, 17),\r\n            },\r\n          ],\r\n        },\r\n      ],\r\n    };\r\n  },\r\n};\r\n</script>\r\n"

/***/ }),
/* 334 */
/***/ (function(module, exports) {

module.exports = "<template>\r\n  <v-calendar\r\n    :attributes='attributes'\r\n    is-double-paned>\r\n  </v-calendar>\r\n</template>\r\n\r\n<script>\r\nimport { getExampleMonthComps } from './utils';\r\n\r\nexport default {\r\n  data() {\r\n    const { thisMonth, thisMonthYear, nextMonth, nextMonthYear } = getExampleMonthComps();\r\n    return {\r\n      attributes: [\r\n        {\r\n          indicator: {\r\n            // Red\r\n            backgroundColor: '#ff3333',\r\n          },\r\n          dates: [\r\n            new Date(thisMonthYear, thisMonth, 1),\r\n            new Date(thisMonthYear, thisMonth, 10),\r\n            new Date(thisMonthYear, thisMonth, 22),\r\n            new Date(nextMonthYear, nextMonth, 6),\r\n            new Date(nextMonthYear, nextMonth, 16),\r\n          ],\r\n        },\r\n        {\r\n          indicator: {\r\n            // Blue\r\n            backgroundColor: '#0040ff',\r\n          },\r\n          dates: [\r\n            new Date(thisMonthYear, thisMonth, 4),\r\n            new Date(thisMonthYear, thisMonth, 10),\r\n            new Date(thisMonthYear, thisMonth, 15),\r\n            new Date(nextMonthYear, nextMonth, 1),\r\n            new Date(nextMonthYear, nextMonth, 12),\r\n            {\r\n              start: new Date(nextMonthYear, nextMonth, 20),\r\n              end: new Date(nextMonthYear, nextMonth, 25),\r\n            },\r\n          ],\r\n        },\r\n        {\r\n          indicator: {\r\n            // Orange\r\n            backgroundColor: '#ff8000',\r\n          },\r\n          dates: [\r\n            new Date(thisMonthYear, thisMonth, 12),\r\n            new Date(thisMonthYear, thisMonth, 26),\r\n            new Date(thisMonthYear, thisMonth, 15),\r\n            new Date(nextMonthYear, nextMonth, 9),\r\n            new Date(nextMonthYear, nextMonth, 5),\r\n            new Date(nextMonthYear, nextMonth, 6),\r\n            new Date(nextMonthYear, nextMonth, 20),\r\n            new Date(nextMonthYear, nextMonth, 25),\r\n          ],\r\n        },\r\n      ],\r\n    };\r\n  },\r\n};\r\n</script>\r\n"

/***/ }),
/* 335 */
/***/ (function(module, exports) {

module.exports = "<template>\r\n<v-calendar\r\n  :is-double-paned='isDoublePaned'\r\n  :title-transition='titleTransition'\r\n  :weeks-transition='weeksTransition'>\r\n</v-calendar>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  props: {\r\n    isDoublePaned: { type: Boolean, default: false },\r\n    titleTransition: { type: String, default: 'slide' },\r\n    weeksTransition: { type: String, default: 'slide' },\r\n  },\r\n};\r\n</script>\r\n"

/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/attribute.122938b.png";

/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(304),
  /* template */
  __webpack_require__(383),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(305),
  /* template */
  __webpack_require__(381),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(306),
  /* template */
  __webpack_require__(376),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(307),
  /* template */
  __webpack_require__(368),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(308),
  /* template */
  __webpack_require__(373),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(309),
  /* template */
  __webpack_require__(374),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(330)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(310),
  /* template */
  __webpack_require__(379),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(311),
  /* template */
  __webpack_require__(361),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(312),
  /* template */
  __webpack_require__(365),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(313),
  /* template */
  __webpack_require__(371),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(314),
  /* template */
  __webpack_require__(378),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(315),
  /* template */
  __webpack_require__(360),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(316),
  /* template */
  __webpack_require__(380),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(318),
  /* template */
  __webpack_require__(382),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(328)
}
var Component = __webpack_require__(0)(
  /* script */
  null,
  /* template */
  __webpack_require__(372),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-55747c6a",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(319),
  /* template */
  __webpack_require__(363),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(320),
  /* template */
  __webpack_require__(369),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  null,
  /* template */
  __webpack_require__(367),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  null,
  /* template */
  __webpack_require__(370),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(321),
  /* template */
  __webpack_require__(375),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(322),
  /* template */
  __webpack_require__(366),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(323),
  /* template */
  __webpack_require__(364),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(324),
  /* template */
  __webpack_require__(362),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 360 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('v-calendar', {
    attrs: {
      "attributes": _vm.attributes,
      "is-double-paned": ""
    }
  })
},staticRenderFns: []}

/***/ }),
/* 361 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('b-table', {
    attrs: {
      "data": _vm.props
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(props) {
        return [_c('b-table-column', {
          attrs: {
            "label": "Name"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.name)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Description"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.description)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Props (If Scoped)"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.props)
          }
        })])]
      }
    }])
  })
},staticRenderFns: []}

/***/ }),
/* 362 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section",
    attrs: {
      "id": "usage"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('h3', {
    staticClass: "title has-text-primary is-spaced"
  }, [_vm._v("Usage")]), _vm._v(" "), _c('b-message', {
    attrs: {
      "type": "is-warning"
    }
  }, [_c('a', {
    attrs: {
      "href": "https://vuejs.org",
      "target": "_blank"
    }
  }, [_vm._v("Vue.js")]), _vm._v(" version "), _c('strong', [_vm._v("2.4+")]), _vm._v(" is required.\r\n    ")]), _vm._v(" "), _c('article', {
    staticClass: "media"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "media-content"
  }, [_vm._m(1), _vm._v(" "), _c('figure', {
    staticClass: "highlight"
  }, [_c('pre', {
    directives: [{
      name: "highlight",
      rawName: "v-highlight"
    }]
  }, [_vm._m(2)])])])]), _vm._v(" "), _c('article', {
    staticClass: "media"
  }, [_vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "media-content"
  }, [_c('p', {
    staticClass: "title is-5"
  }, [_vm._v("Import into your project")]), _vm._v(" "), _c('figure', {
    staticClass: "highlight"
  }, [_c('pre', {
    directives: [{
      name: "highlight",
      rawName: "v-highlight"
    }]
  }, [_c('code', {
    staticClass: "javascript"
  }, [_vm._v(_vm._s(_vm._f("pre")(_vm.importCode)))])])]), _vm._v(" "), _vm._m(4)])]), _vm._v(" "), _c('article', {
    staticClass: "media"
  }, [_vm._m(5), _vm._v(" "), _c('div', {
    staticClass: "media-content"
  }, [_c('p', {
    staticClass: "title is-5"
  }, [_vm._v("Reference in your Vue component templates")]), _vm._v(" "), _c('figure', {
    staticClass: "highlight"
  }, [_c('pre', {
    directives: [{
      name: "highlight",
      rawName: "v-highlight"
    }]
  }, [_c('code', {
    staticClass: "html"
  }, [_vm._v(_vm._s(_vm._f("pre")(_vm.componentCode)))])])])])])], 1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "media-left"
  }, [_c('p', {
    staticClass: "title is-5"
  }, [_vm._v("1")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "title is-5"
  }, [_vm._v("Use "), _c('strong', [_vm._v("NPM")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('code', {
    staticClass: "bash"
  }, [_c('span', {
    staticClass: "is-unselectable"
  }, [_vm._v("$ ")]), _vm._v("npm install v-calendar")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "media-left"
  }, [_c('p', {
    staticClass: "title is-5"
  }, [_vm._v("2")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "content"
  }, [_vm._v("This gives you access to the "), _c('i', [_vm._v("v-calendar")]), _vm._v(", "), _c('i', [_vm._v("v-date-picker")]), _vm._v(", and "), _c('i', [_vm._v("v-popover")]), _vm._v(" components")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "media-left"
  }, [_c('p', {
    staticClass: "title is-5"
  }, [_vm._v("3")])])
}]}

/***/ }),
/* 363 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section",
    attrs: {
      "id": "content-styles"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('h4', {
    staticClass: "title is-4 has-text-grey-dark is-spaced"
  }, [_vm._v("Content Styles")]), _vm._v(" "), _c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column is-one-half"
  }, [_c('b-tabs', [_c('b-tab-item', {
    attrs: {
      "label": "Overview"
    }
  }, [_c('div', {
    staticClass: "content"
  }, [_c('ul', [_c('li', [_vm._v("Support for custom background, border and content")]), _vm._v(" "), _c('li', [_vm._v("Spans dates and date ranges")]), _vm._v(" "), _c('li', [_vm._v("Optionally animated on appearance or disappearance")])])])]), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Example Code"
    }
  }, [_c('pre', {
    directives: [{
      name: "highlight",
      rawName: "v-highlight"
    }]
  }, [_c('code', {
    staticClass: "html"
  }, [_vm._v(_vm._s(_vm.exContentStylesCode))])])])], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "column is-one-half is-example"
  }, [_c('ex-content-styles')], 1)])])])
},staticRenderFns: []}

/***/ }),
/* 364 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section",
    attrs: {
      "id": "intro"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('h3', {
    staticClass: "title has-text-primary is-spaced"
  }, [_vm._v("Calendar")]), _vm._v(" "), _c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column is-one-half"
  }, [_c('b-tabs', [_c('b-tab-item', {
    attrs: {
      "label": "Overview"
    }
  }, [_c('div', {
    staticClass: "content"
  }, [_c('ul', [_c('li', [_vm._v("Lightweight and dependency-free")]), _vm._v(" "), _c('li', [_vm._v("Single or double-paned")]), _vm._v(" "), _c('li', [_vm._v("Built-in support for various attributes including highlights, indicators and content styles")]), _vm._v(" "), _c('li', [_vm._v("Clean and lively design")])])])]), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Example Code"
    }
  }, [_c('pre', {
    directives: [{
      name: "highlight",
      rawName: "v-highlight"
    }]
  }, [_c('code', {
    staticClass: "html"
  }, [_vm._v(_vm._s(_vm.exIntroCode))])])]), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Options",
      "icon": "gear"
    }
  }, [_c('b-field', [_c('b-switch', {
    model: {
      value: (_vm.isDoublePaned),
      callback: function($$v) {
        _vm.isDoublePaned = $$v
      },
      expression: "isDoublePaned"
    }
  }, [_vm._v("\n                Double-Paned\n              ")])], 1), _vm._v(" "), _c('b-field', {
    attrs: {
      "label": "Title Transition"
    }
  }, [_c('b-select', {
    attrs: {
      "placeholder": "Title Transition"
    },
    model: {
      value: (_vm.titleTransition),
      callback: function($$v) {
        _vm.titleTransition = $$v
      },
      expression: "titleTransition"
    }
  }, _vm._l((_vm.transitions), function(transition) {
    return _c('option', {
      key: transition,
      domProps: {
        "value": transition
      }
    }, [_vm._v("\n                  " + _vm._s(transition) + "\n                ")])
  }))], 1), _vm._v(" "), _c('b-field', {
    attrs: {
      "label": "Weeks Transition"
    }
  }, [_c('b-select', {
    attrs: {
      "placeholder": "Weeks Transition"
    },
    model: {
      value: (_vm.weeksTransition),
      callback: function($$v) {
        _vm.weeksTransition = $$v
      },
      expression: "weeksTransition"
    }
  }, _vm._l((_vm.transitions), function(transition) {
    return _c('option', {
      key: transition,
      domProps: {
        "value": transition
      }
    }, [_vm._v("\n                  " + _vm._s(transition) + "\n                ")])
  }))], 1)], 1)], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "column is-one-half is-example"
  }, [_c('ex-intro', {
    attrs: {
      "is-double-paned": _vm.isDoublePaned,
      "title-transition": _vm.titleTransition,
      "weeks-transition": _vm.weeksTransition
    }
  })], 1)])])])
},staticRenderFns: []}

/***/ }),
/* 365 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('v-calendar', {
    attrs: {
      "attributes": _vm.attributes,
      "is-double-paned": ""
    }
  })
},staticRenderFns: []}

/***/ }),
/* 366 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section",
    attrs: {
      "id": "indicators"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('h4', {
    staticClass: "title is-4 has-text-grey-dark is-spaced"
  }, [_vm._v("Indicators")]), _vm._v(" "), _c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column is-one-half"
  }, [_c('b-tabs', [_c('b-tab-item', {
    attrs: {
      "label": "Overview"
    }
  }, [_c('div', {
    staticClass: "content"
  }, [_c('p', {
    staticClass: "subtitle"
  }), _vm._v(" "), _c('ul', [_c('li', [_vm._v("Support for custom color and size")]), _vm._v(" "), _c('li', [_vm._v("Spans dates and date ranges")]), _vm._v(" "), _c('li', [_vm._v("Optionally animated on appearance or disappearance")])])])]), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Example Code"
    }
  }, [_c('pre', {
    directives: [{
      name: "highlight",
      rawName: "v-highlight"
    }]
  }, [_c('code', {
    staticClass: "html"
  }, [_vm._v(_vm._s(_vm.exIndicatorsCode))])])])], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "column is-one-half is-example"
  }, [_c('ex-indicators')], 1)])])])
},staticRenderFns: []}

/***/ }),
/* 367 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('footer', {
    staticClass: "footer"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "content has-text-centered"
  }, [_c('p', [_c('strong', [_vm._v("V-Calendar")]), _vm._v(" by "), _c('a', {
    attrs: {
      "href": "http://nathanreyes.com"
    }
  }, [_vm._v("Nathan Reyes")]), _vm._v(". The source code is licensed "), _c('a', {
    attrs: {
      "href": "http://opensource.org/licenses/mit-license.php"
    }
  }, [_vm._v("MIT")]), _vm._v(".\r\n        The website content is licensed "), _c('a', {
    attrs: {
      "href": "http://creativecommons.org/licenses/by-nc-sa/4.0/"
    }
  }, [_vm._v("CC BY NC SA 4.0")]), _vm._v(".\r\n      ")]), _vm._v(" "), _c('p', [_c('a', {
    staticClass: "icon",
    attrs: {
      "href": "https://github.com/nathanreyes/v-calendar",
      "target": "_blank"
    }
  }, [_c('i', {
    staticClass: "fa fa-github"
  })])])])])])
}]}

/***/ }),
/* 368 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('b-table', {
    attrs: {
      "data": _vm.props
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(props) {
        return [_c('b-table-column', {
          attrs: {
            "label": "Property"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.propertyName)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Description"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.description)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Default"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.default)
          }
        })])]
      }
    }])
  })
},staticRenderFns: []}

/***/ }),
/* 369 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section",
    attrs: {
      "id": "datepicker"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('h3', {
    staticClass: "title has-text-primary is-spaced"
  }, [_vm._v("Date Picker")]), _vm._v(" "), _c('div', {
    staticClass: "columns is-centered"
  }, [_c('div', {
    staticClass: "column is-one-half"
  }, [_c('b-tabs', [_c('b-tab-item', {
    attrs: {
      "label": "Overview"
    }
  }, [_c('p', {
    staticClass: "subtitle"
  }, [_vm._v("\n              A "), _c('i', [_vm._v("v-date-picker")]), _vm._v(" is just a "), _c('i', [_vm._v("v-calendar")]), _vm._v(" wrapper.\n            ")]), _vm._v(" "), _c('p', {
    staticClass: "content"
  }, [_vm._v("\n              It supports all native calendar features, but also applies special attributes for dragged date and value selections.\n            ")]), _vm._v(" "), _c('p', {
    staticClass: "content"
  }, [_vm._v("\n              Supported selection modes include...\n              "), _c('ul', [_c('li', [_vm._v("Single date")]), _vm._v(" "), _c('li', [_vm._v("Multiple dates")]), _vm._v(" "), _c('li', [_vm._v("Date range")])])])]), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Example Code"
    }
  }, [_c('pre', {
    directives: [{
      name: "highlight",
      rawName: "v-highlight"
    }]
  }, [_c('code', {
    staticClass: "html"
  }, [_vm._v(_vm._s(_vm.exDatePickerCode))])])]), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Options",
      "icon": "gear"
    }
  }, [_c('b-field', {
    attrs: {
      "label": "Select Mode"
    }
  }, [_c('p', {
    staticClass: "control"
  }, [_c('b-radio', {
    attrs: {
      "native-value": "single"
    },
    model: {
      value: (_vm.selectMode),
      callback: function($$v) {
        _vm.selectMode = $$v
      },
      expression: "selectMode"
    }
  }, [_vm._v("Single")]), _vm._v(" "), _c('b-radio', {
    attrs: {
      "native-value": "multiple"
    },
    model: {
      value: (_vm.selectMode),
      callback: function($$v) {
        _vm.selectMode = $$v
      },
      expression: "selectMode"
    }
  }, [_vm._v("Multiple")]), _vm._v(" "), _c('b-radio', {
    attrs: {
      "native-value": "range"
    },
    model: {
      value: (_vm.selectMode),
      callback: function($$v) {
        _vm.selectMode = $$v
      },
      expression: "selectMode"
    }
  }, [_vm._v("Range")])], 1)]), _vm._v(" "), _c('b-field', {
    attrs: {
      "label": "Border Radius"
    }
  }, [_c('b-input')], 1), _vm._v(" "), _c('b-field', [_c('b-switch', {
    model: {
      value: (_vm.isPopover),
      callback: function($$v) {
        _vm.isPopover = $$v
      },
      expression: "isPopover"
    }
  }, [_vm._v("Popover")])], 1), _vm._v(" "), _c('b-field', {
    attrs: {
      "label": "Value"
    }
  }, [_c('pre', [_c('code', {
    staticClass: "html"
  }, [_vm._v(_vm._s(JSON.stringify(_vm.selectedValue, null, 2)))])])])], 1)], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "column is-one-half is-example"
  }, [_c('ex-date-picker', {
    attrs: {
      "is-popover": _vm.isPopover,
      "select-mode": _vm.selectMode
    },
    on: {
      "input": function($event) {
        _vm.selectedValue = $event
      }
    }
  })], 1)])])])
},staticRenderFns: []}

/***/ }),
/* 370 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "hero is-primary"
  }, [_c('div', {
    staticClass: "hero-body"
  }, [_c('div', {
    staticClass: "container has-text-centered"
  }, [_c('h1', {
    staticClass: "title"
  }, [_vm._v("V-Calendar")]), _vm._v(" "), _c('h2', {
    staticClass: "subtitle"
  }, [_vm._v("A clean & lively calendar for Vue.js")])])]), _vm._v(" "), _c('div', {
    staticClass: "hero-foot"
  }, [_c('nav', {
    staticClass: "tabs"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "#intro"
    }
  }, [_vm._v("Calendar")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "#attributes"
    }
  }, [_vm._v("Attributes")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "#datepicker"
    }
  }, [_vm._v("DatePicker")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "#api"
    }
  }, [_vm._v("API")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "#usage"
    }
  }, [_vm._v("Usage")])])])])])])])
}]}

/***/ }),
/* 371 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('v-date-picker', {
    attrs: {
      "select-mode": _vm.selectMode,
      "is-popover": _vm.isPopover,
      "day-content-style": _vm.dayStyle,
      "disabled-dates": _vm.disabledDates,
      "inputClass": "input",
      "is-double-paned": ""
    },
    model: {
      value: (_vm.selectedValue),
      callback: function($$v) {
        _vm.selectedValue = $$v
      },
      expression: "selectedValue"
    }
  })
},staticRenderFns: []}

/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section",
    attrs: {
      "id": "attributes"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('h3', {
    staticClass: "title has-text-primary is-spaced"
  }, [_vm._v("Attributes")]), _vm._v(" "), _c('div', {
    staticClass: "columns content"
  }, [_c('div', {
    staticClass: "column is-one-third"
  }, [_c('p', [_vm._v("\r\n          Attributes are used to apply adornments to the calendar. A single attribute may include one or many of the following types of objects:\r\n        ")]), _vm._v(" "), _c('ul', [_c('li', [_vm._v("highlight")]), _vm._v(" "), _c('li', [_vm._v("indicator")]), _vm._v(" "), _c('li', [_vm._v("content style")])]), _vm._v(" "), _c('p', [_vm._v("\r\n          A collection of dates or date ranges for which the attribute should be applied must also be specified .\r\n        ")])]), _vm._v(" "), _c('div', {
    staticClass: "column is-two-thirds is-centered"
  }, [_c('img', {
    staticClass: "attribute-img",
    attrs: {
      "src": __webpack_require__(336)
    }
  })])])])])
}]}

/***/ }),
/* 373 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('b-table', {
    attrs: {
      "data": _vm.props
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(props) {
        return [_c('b-table-column', {
          attrs: {
            "label": "Property"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.propertyName)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Description"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.description)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Default"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.default)
          }
        })])]
      }
    }])
  })
},staticRenderFns: []}

/***/ }),
/* 374 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('p', {
    staticClass: "content"
  }, [_vm._v("\r\n    Pages are used to construct calendar months. They appear in slot props and event arguments.\r\n  ")]), _vm._v(" "), _c('b-table', {
    attrs: {
      "data": _vm.props
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(props) {
        return [_c('b-table-column', {
          attrs: {
            "label": "Property"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.propertyName)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Description"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.description)
          }
        })])]
      }
    }])
  })], 1)
},staticRenderFns: []}

/***/ }),
/* 375 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section",
    attrs: {
      "id": "highlights"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('h4', {
    staticClass: "title is-4 has-text-grey-dark is-spaced"
  }, [_vm._v("Highlights")]), _vm._v(" "), _c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column is-one-half"
  }, [_c('b-tabs', [_c('b-tab-item', {
    attrs: {
      "label": "Overview"
    }
  }, [_c('div', {
    staticClass: "content"
  }, [_c('ul', [_c('li', [_vm._v("Custom background and border properties")]), _vm._v(" "), _c('li', [_vm._v("Smart layering for overlapping dates")]), _vm._v(" "), _c('li', [_vm._v("Optionally animated on appearance or disappearance")]), _vm._v(" "), _c('li', [_vm._v("Use a content style to properly display day content")])])])]), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Example Code"
    }
  }, [_c('pre', {
    directives: [{
      name: "highlight",
      rawName: "v-highlight"
    }]
  }, [_c('code', {
    staticClass: "html"
  }, [_vm._v(_vm._s(_vm.exHighlightsCode))])])])], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "column is-one-half is-example"
  }, [_c('ex-highlights')], 1)])])])
},staticRenderFns: []}

/***/ }),
/* 376 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('b-table', {
    attrs: {
      "data": _vm.props
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(props) {
        return [_c('b-table-column', {
          attrs: {
            "label": "Name"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.name)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Description"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.description)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Parameters"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.parameters)
          }
        })])]
      }
    }])
  })
},staticRenderFns: []}

/***/ }),
/* 377 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section-header'), _vm._v(" "), _c('section-intro'), _vm._v(" "), _c('section-attributes'), _vm._v(" "), _c('section-highlights'), _vm._v(" "), _c('section-indicators'), _vm._v(" "), _c('section-content-styles'), _vm._v(" "), _c('section-date-picker'), _vm._v(" "), _c('section-api'), _vm._v(" "), _c('section-usage'), _vm._v(" "), _c('section-footer')], 1)
},staticRenderFns: []}

/***/ }),
/* 378 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('v-calendar', {
    attrs: {
      "attributes": _vm.attributes,
      "is-double-paned": ""
    }
  })
},staticRenderFns: []}

/***/ }),
/* 379 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('b-table', {
    attrs: {
      "data": _vm.props,
      "row-class": function (row) { return row.class; }
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(props) {
        return [_c('b-table-column', {
          style: ({
            minWidth: "280px"
          }),
          attrs: {
            "label": "Name"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.name)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Description"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.description)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Default"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.default)
          }
        })])]
      }
    }])
  })], 1)
},staticRenderFns: []}

/***/ }),
/* 380 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('v-calendar', {
    attrs: {
      "is-double-paned": _vm.isDoublePaned,
      "title-transition": _vm.titleTransition,
      "weeks-transition": _vm.weeksTransition
    }
  })
},staticRenderFns: []}

/***/ }),
/* 381 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('p', {
    staticClass: "content"
  }, [_vm._v("\r\n    Pages are used to construct calendar months. They appear in slot props and event arguments.\r\n  ")]), _vm._v(" "), _c('b-table', {
    attrs: {
      "data": _vm.props
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(props) {
        return [_c('b-table-column', {
          attrs: {
            "label": "Property"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.propertyName)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Description"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.description)
          }
        })])]
      }
    }])
  })], 1)
},staticRenderFns: []}

/***/ }),
/* 382 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section",
    attrs: {
      "id": "api"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('h3', {
    staticClass: "title has-text-primary is-spaced"
  }, [_vm._v("API")]), _vm._v(" "), _c('b-message', {
    attrs: {
      "type": "is-warning"
    }
  }, [_c('span', {
    staticClass: "tag is-warning"
  }, [_vm._v("Date Picker")]), _vm._v(" Denotes API specific to "), _c('i', [_vm._v("v-date-picker")]), _vm._v(" components only.\n    ")]), _vm._v(" "), _c('b-tabs', [_c('b-tab-item', {
    attrs: {
      "label": "Props"
    }
  }, [_c('calendar-api-props')], 1), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Events"
    }
  }, [_c('calendar-api-events')], 1), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Slots"
    }
  }, [_c('calendar-api-slots')], 1), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Attribute"
    }
  }, [_c('b-tabs', [_c('b-tab-item', {
    attrs: {
      "label": "Attribute"
    }
  }, [_c('calendar-api-attribute')], 1), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Highlight"
    }
  }, [_c('calendar-api-highlight')], 1), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Indicator"
    }
  }, [_c('calendar-api-indicator')], 1)], 1)], 1), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Page"
    }
  }, [_c('calendar-api-page')], 1), _vm._v(" "), _c('b-tab-item', {
    attrs: {
      "label": "Day Info"
    }
  }, [_c('calendar-api-day-info')], 1)], 1)], 1)])
},staticRenderFns: []}

/***/ }),
/* 383 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('b-table', {
    attrs: {
      "data": _vm.props
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function(props) {
        return [_c('b-table-column', {
          attrs: {
            "label": "Property"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.propertyName)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Description"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.description)
          }
        })]), _vm._v(" "), _c('b-table-column', {
          attrs: {
            "label": "Default"
          }
        }, [_c('span', {
          domProps: {
            "innerHTML": _vm._s(props.row.default)
          }
        })])]
      }
    }])
  })
},staticRenderFns: []}

/***/ })
]));
//# sourceMappingURL=0.8975fa457f1c90119ca7.js.map