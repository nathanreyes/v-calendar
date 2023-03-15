---
title: 'API'
---

# API

## Props

<BaseAlert title="Prop Support">

`VDatePicker` accepts all the same props as [VCalendar](/calendar/api#props).
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

<BaseAlert title="Event Support">

`VDatePicker` accepts all the same events as [Calendar](/calendar/api#events).
</BaseAlert>

| Event | Parameter Type |
| --- | --- |
| **update:modelValue** | [DatePickerDate](#datepickerdate) |
| **drag** | [SimpleDateRange](#simpledaterange) \| null |
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