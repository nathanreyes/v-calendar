---
title: 'API'
---

# API

## Props

| Name | Type | Default |
| --- | --- | --- |
| **view** | "weekly" \| "monthly"| "monthly" |
| **rows** | number | 1 |
| **columns** | number | 1 |
| **step** | number | *undefined* |
| **color** | string | "blue" |
| **is-dark** | boolean \| "system" \| [DarkModeClassConfig](#darkmodeclassconfig) | false |
| **first-day-of-week** | 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 | 1 |
| **nav-visibility** | "click" \| "hover" \| "hover-focus" \| "focus" | "click" |
| **title-position** | "center" \| "left" \| "right" | "center" |
| **transition** | "none" \| "fade" \| "slide-v" \| "slide-h" | "slide-h" |
| **masks** | Record<string, string \| string[]> | [Default masks](#masks) |
| **locale** | string | *undefined* |
| **timezone** | string | *undefined* |
| **min-date** | Date | *undefined* |
| **max-date** | Date | *undefined* |
| **disabled-dates** | [DateRangeSource](#daterangesource)[] | *undefined* |
| **show-weeknumbers** | boolean \| "left" \| "left-outside" \| "right" \| "right-outside| *undefined* |
| **show-iso-weeknumbers** | boolean \| "left" \| "right" | *undefined* |

## Types

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