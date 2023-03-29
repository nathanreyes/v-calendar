---
title: 'API'
---

# API

## Props

| Name | Type | Default |
| --- | --- | --- |
| **view** | "weekly" \| "monthly"| "monthly" |
| **attributes** | [AttributeConfig](#attributeconfig)[] | *undefined* |
| **rows** | number | 1 |
| **columns** | number | 1 |
| **step** | number | *undefined* |
| **color** | string | "blue" |
| **is-dark** | boolean \| "system" \| [DarkModeClassConfig](#darkmodeclassconfig) | false |
| **expanded** | boolean | false |
| **borderless** | boolean | false |
| **transparent** | boolean | false |
| **first-day-of-week** | 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 | 1 |
| **nav-visibility** | "click" \| "hover" \| "hover-focus" \| "focus" | "click" |
| **title-position** | "center" \| "left" \| "right" | "center" |
| **transition** | "none" \| "fade" \| "slide-v" \| "slide-h" | "slide-h" |
| **masks** | Record<string, string \| string[]> | [Default masks](#defaults) |
| **locale** | string | *undefined* |
| **timezone** | string | *undefined* |
| **initial-page** | [PageAddress](#pageaddress) | *undefined* |
| **initial-page-position** | number | 1 |
| **min-page** | [PageAddress](#pageaddress) | *undefined* |
| **max-page** | [PageAddress](#pageaddress) | *undefined* |
| **min-date** | Date | *undefined* |
| **max-date** | Date | *undefined* |
| **disabled-dates** | [DateRangeSource](#daterangesource)[] | *undefined* |
| **show-weeknumbers** | boolean \| "left" \| "left-outside" \| "right" \| "right-outside| *undefined* |
| **show-iso-weeknumbers** | boolean \| "left" \| "left-outside" \| "right" \| "right-outside| *undefined* |
| **trim-weeks** | boolean | false |
| **disable-page-swipe** | boolean | false |

## Events

| Name | Parameter Type(s) |
| --- | --- |
| **dayclick** | [CalendarDay](#calendarday), [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) |
| **daymouseenter** | [CalendarDay](#calendarday), [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) |
| **daymouseleave** | [CalendarDay](#calendarday), [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) |
| **dayfocusin** | [CalendarDay](#calendarday), [FocusEvent](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) |
| **dayfocusout** | [CalendarDay](#calendarday), [FocusEvent](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) |
| **daykeydown** | [CalendarDay](#calendarday), [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) |
| **weeknumberclick** | [CalendarWeek](#calendarweek), [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) |
| **transition-start** | |
| **transition-end** | |
| **did-move** | [Page](#page)[] |
| **update:view** | "daily" \| "weekly" \| "monthly" |
| **update:pages** | [Page](#page)[] |

## Slots

| Name | Props |
| --- | --- |
| **header-title** | title: string |
| **header-prev-button** | move: () => Promise\<boolean\>, disabled: boolean |
| **header-next-button** | move: () => Promise\<boolean\>, disabled: boolean |
| **nav-prev-button** | move: () => Promise\<boolean\>, disabled: boolean |
| **nav-next-button** | move: () => Promise\<boolean\>, disabled: boolean |
| **day-content** | day: [CalendarDay](#calendarday), attributes: Attribute[], locale: Locale |

## Methods

| Name | Type |
| --- | --- |
| **canMove** | (target: [\<MoveTarget\>](#movetarget), opts?: Partial[\<MoveOptions\>](#moveoptions)) => boolean | 
| **canMoveBy** | (pages: number, opts?: Partial[\<MoveOptions\>](#moveoptions)) => boolean |
| **move** | (target: [MoveTarget](#movetarget), opts?: Partial[\<MoveOptions\>](#moveoptions)) => Promise\<boolean\> |
| **moveBy** | (pages: number, opts?: Partial[\<MoveOptions\>](#moveoptions)) => Promise\<boolean\> |
| **movePrev** | () => Promise\<boolean\> |
| **moveNext** | () => Promise\<boolean\> |
| **focusDate** | (date: Date, opts?: Partial[\<MoveOptions\>](#moveoptions)) => Promise\<boolean\> |

## Types

### AttributeConfig

```ts
interface AttributeConfig {
  key: string | number;
  content: string | Partial<Content | Profile<Partial<Content>>>;
  highlight: boolean | string | Partial<Highlight | Profile<Partial<Highlight>>>;
  dot: boolean | string | Partial<Dot | Profile<Partial<Dot>>>;
  bar: boolean | string | Partial<Bar | Profile<Partial<Bar>>>;
  popover: PopoverConfig;
  dates: DateRangeSource[];
  customData: any;
  order: number;
}

interface Profile<T> {
  start: T;
  base: T;
  end: T;
  startEnd?: T;
}

interface Content {
  key: string | number;
  color: string;
  class: string | any[];
  style: Record<string, any>;
}

interface Highlight {
  key: string | number;
  color: string;
  class: string | any[];
  style: Record<string, any>;
  contentClass: string | any[];
  contentStyle: Record<string, any>;
  fillMode: 'solid' | 'light' | 'outline';
}

interface Dot {
  key: string | number;
  color: string;
  class: string | any[];
  style: Record<string, any>;
}

interface Bar {
  key: string | number;
  color: string;
  class: string | any[];
  style: Record<string, any>;
}

type PopoverConfig = Partial<{
  label: string;
  customData: any;
  visibility: 'click' | 'hover' | 'hover-focus' | 'focus';
  placement: Placement;
  hideIndicator: boolean;
  isInteractive: boolean;
}>;
```

### CalendarDay

```ts
interface CalendarDay {
  id: string;
  dayIndex: number;
  day: number;
  dayFromEnd: number;
  weekday: number;
  weekdayOrdinal: number;
  weekdayOrdinalFromEnd: number;
  week: number;
  weekFromEnd: number;
  weeknumber: number;
  month: number;
  year: number;
  date: Date;
  position: number;
  label: string;
  ariaLabel: string;
  weekdayPosition: number;
  weekdayPositionFromEnd: number;
  weekPosition: number;
  isoWeeknumber: number;
  startDate: Date;
  noonDate: Date;
  endDate: Date;
  isToday: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
  isDisabled: boolean;
  isFocusable: boolean;
  inMonth: boolean;
  inPrevMonth: boolean;
  inNextMonth: boolean;
  onTop: boolean;
  onBottom: boolean;
  onLeft: boolean;
  onRight: boolean;
  classes: Array<string | Object>;
  locale: Locale;
}
```

### CalendarWeek

```ts
interface CalendarWeek {
  id: string;
  week: number;
  weekPosition: number;
  weeknumber: number;
  isoWeeknumber: number;
  weeknumberDisplay?: number;
  days: CalendarDay[];
  title: string;
}
```

### CalendarWeekday

```ts
interface CalendarWeekday {
  weekday: number;
  label: string;
}
```

### DarkModeClassConfig

```ts
interface DarkModeClassConfig {
  selector: string;
  darkClass: string;
}
```

### DateRangeSource

```ts
type DateRangeSource = DateRangeDate | [DateRangeDate, DateRangeDate] | Partial<DateRangeConfig>;

type DateRangeDate = Date | null;

interface DateRangeConfig {
  start: DateRangeDate;
  end: DateRangeDate;
  span: number;
  repeat: Partial<DateRepeatConfig>;
}
```

### DateSource

```ts
type DateSource = Date | string | number;
```

### MoveOptions

```ts
interface MoveOptions {
  position: number;
  view: CalendarView;
  transition: MoveTransition;
  force: boolean;
}

type MoveTransition = 'none' | 'fade' | 'slide-v' | 'slide-h';

```

### MoveTarget

```ts
type MoveTarget = DateSource | PageAddress;
```

### PageAddress

```ts
interface PageAddress {
  day?: number;
  week?: number;
  month: number;
  year: number;
}
```

### Page

```ts
interface Page {
  id: string;
  day?: number;
  week?: number;
  month: number;
  year: number;
  view: PageView;
  trimWeeks: boolean;
  position: number;
  row: number;
  rowFromEnd: number;
  column: number;
  columnFromEnd: number;
  showWeeknumbers: boolean;
  showIsoWeeknumbers: boolean;
  weeknumberPosition: string;
  monthTitle: string;
  weekTitle?: string;
  dayTitle?: string;
  title: string;
  titlePosition: TitlePosition;
  shortMonthLabel: string;
  monthLabel: string;
  shortYearLabel: string;
  yearLabel: string;
  monthComps: MonthParts;
  prevMonthComps: MonthParts;
  nextMonthComps: MonthParts;
  days: CalendarDay[];
  weeks: CalendarWeek[];
  weekdays: CalendarWeekday[];
  viewDays: CalendarDay[];
  viewWeeks: CalendarWeek[];
}
```

## Defaults

```js
{
  componentPrefix: 'V',
  color: 'blue',
  isDark: false,
  navVisibility: 'click',
  titlePosition: 'center',
  transition: 'slide-h',
  datePicker: {
    updateOnInput: true,
    inputDebounce: 1000,
    popover: {
      visibility: 'hover-focus',
      placement: 'bottom-start',
      isInteractive: true,
    },
  },
  masks: {
    title: 'MMMM YYYY',
    weekdays: 'W',
    navMonths: 'MMM',
    hours: 'h A',
    input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    inputDateTime: ['L h:mm A', 'YYYY-MM-DD h:mm A', 'YYYY/MM/DD h:mm A'],
    inputDateTime24hr: ['L HH:mm', 'YYYY-MM-DD HH:mm', 'YYYY/MM/DD HH:mm'],
    inputTime: ['h:mm A'],
    inputTime24hr: ['HH:mm'],
    dayPopover: 'WWW, MMM D, YYYY',
    data: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    model: 'iso',
    iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  }
}
```