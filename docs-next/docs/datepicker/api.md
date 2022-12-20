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
| **drag-attribute** | [AttributeConfig](#attributeconfig) | *undefined* |
| **select-attribute** | [AttibuteConfig](#attributeconfig) | *undefined* |

## Prop Types

### DatePickerDate

```ts
type DatePickerDate = number | string | Date | null | {
  start?: number | string | Date | null,
  end?: number | string | Date | null
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

## Events

| Event | Parameter Type |
| --- | --- |
| **update:modelValue** | Model value |
| **drag** | Drag value |
| **dayclick**| `CalendarDay` |
| **daykeydown** | `CalendarDay` |
| **popover-will-show** | |
| **popover-did-show** | |
| **popover-will-hide** | |
| **popover-did-hide** | |