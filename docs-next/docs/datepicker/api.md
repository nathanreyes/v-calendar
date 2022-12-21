---
title: 'API'
---

# API

## Props

<BaseAlert title="Prop Support">
`DatePicker` accepts all the same props as [Calendar](/calendar/api).
</BaseAlert>

| Name | Type | Default |
| --- | --- | --- |
| **mode** | 'date' \| 'dateTime' \| 'time' | 'date' |
| **model-value** | [DatePickerDate](#datepickerdate) | null |
| **rules** | 'auto' \| [DatePartsRules](#datepartsrules) | *undefined* |
| **is-required** | boolean | false |
| **is24hr** | boolean | true |
| **hide-time-header** | boolean | false |
| **time-accuracy** | number | 2 |
| **update-on-input** | boolean | true |
| **input-debounce** | number | 1000 |
| **popover** | true \| Partial<[PopoverOptions](#popoveroptions)> | [true](/datepicker/slot-content#default-behavior) |
| **drag-attribute** | [AttributeConfig](/calendar/api#attributeconfig) | *undefined* |
| **select-attribute** | [AttibuteConfig](/calendar/api#attributeconfig) | *undefined* |

## Events

| Event | Parameter Type |
| --- | --- |
| **update:modelValue** | [DatePickerDate](#datepickerdate) |
| **drag** | [SimpleDateRange](#simpledaterange) \| null |
| **dayclick**| [CalendarDay](#calendarday) |
| **daykeydown** | [CalendarDay](#calendarday) |
| **popover-will-show** | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) |
| **popover-did-show** | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) |
| **popover-will-hide** | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) |
| **popover-did-hide** | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) |

## Types

### DatePickerDate

```ts
type DatePickerDate = number | string | Date | null | {
  start?: number | string | Date | null,
  end?: number | string | Date | null
}
```

### SimpleDateRange

```ts
{
  start: Date;
  end: Date;
}
```
 
### ModelModifiers

```ts
interface ModelModifiers {
  number?: boolean;
  string?: boolean;
  range?: boolean;
}
```

### DatePartsRules

```ts
interface DatePartsRules {
  hours?: DatePartsRule;
  minutes?: DatePartsRule;
  seconds?: DatePartsRule;
  milliseconds?: DatePartsRule;
}

type DatePartsRule =
  | number
  | Array<number>
  | NumberRuleConfig
  | DatePartsRuleFunction;

interface NumberRuleConfig {
  min?: number;
  max?: number;
  interval?: number;
}
```

### PopoverOptions

```ts
interface PopoverOptions {
  visibility: PopoverVisibility; // When the popover appears
  placement: Placement; // Where the popover appears
  autoHide: boolean; // Auto-hide popover based on visibility
  showDelay: number; // Delay (ms) before popover is shown
  hideDelay: number; // Delay (ms) before popover is hidden
}

type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';
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