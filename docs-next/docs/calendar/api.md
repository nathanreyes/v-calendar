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
| **is-expanded** | boolean | false |
| **first-day-of-week** | 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 | 1 |
| **nav-visibility** | "click" \| "hover" \| "hover-focus" \| "focus" | "click" |
| **title-position** | "center" \| "left" \| "right" | "center" |
| **transition** | "none" \| "fade" \| "slide-v" \| "slide-h" | "slide-h" |
| **masks** | Record<string, string \| string[]> | [Default masks](#masks) |
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

### PageAddress
```ts
interface PageAddress {
  day?: number;
  week?: number;
  month: number;
  year: number;
}
```

## Defaults

### Masks
```json
{
  "title": "MMMM YYYY",
  "weekdays": "W",
  "navMonths": "MMM",
  "hours": "h A",
  "input": ["L", "YYYY-MM-DD", "YYYY/MM/DD"],
  "inputDateTime": ["L h:mm A", "YYYY-MM-DD h:mm A", "YYYY/MM/DD h:mm A"],
  "inputDateTime24hr": ["L HH:mm", "YYYY-MM-DD HH:mm", "YYYY/MM/DD HH:mm"],
  "inputTime": ["h:mm A"],
  "inputTime24hr": ["HH:mm"],
  "dayPopover": "WWW, MMM D, YYYY",
  "data": ["L", "YYYY-MM-DD", "YYYY/MM/DD"],
  "model": "iso",
  "iso": "YYYY-MM-DDTHH:mm:ss.SSSZ"
}
```