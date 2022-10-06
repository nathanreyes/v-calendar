---
title: 'Navigation'
sidebarDepth: 2
---

# Navigation

## User Interface

### Header

There are 2 primary methods for navigating the calendar within the header.

1. Navigation arrows to move forwards and backwards by a given [`step`](#month-steps) amount.
2. Navigation popover to more easily skip to a specific month/year.

<Example centered>
  <Calendar />
</Example>

```html
<Calendar />
```

### Month Steps

By default, the calendar will navigate to the month following the last current displayed month when navigating forwards. Conversely, it will navigate to the month preceding the first month when navigating backwards.

This default step amount is equal to the number of rows multiplied by the number of columns in a given layout (2 rows x 1 column = 2).

<Example centered>
  <Calendar :rows="2" />
</Example>

However, the `step` prop can be used to configure a custom month interval.

For example, instead of moving forward by 2 months in the previous example, we can instead force it move by 1 month.

<Example centered>
  <Calendar :rows="2" :step="1" />
</Example>

```html
<Calendar :rows="2" :step="1" />
```

### Min & Max Dates

If `min-date` or `max-date` props are assigned, this will disable navigation for the user beyond the dates provided.

#### Min Date

<Example centered>
  <Calendar :min-date="new Date()" />
</Example>

```html
<Calendar :min-date="new Date()" />
```

#### Max Date

<Example centered>
  <Calendar :max-date="new Date()" />
</Example>

```html
<Calendar :max-date="new Date()" />
```

## Key Commands

<BaseAlert warning>
  A calendar day must be in focus in order for key commands to be recognized
</BaseAlert>

Both `Calendar` and `DatePicker` now support the following key commands for navigation:

| Command | Action |
| --- | --- |
| **Left** | Move to the previous day |
| **Right** | Move to the next day |
| **Up** | Move to the previous week |
| **Down** | Move to the next week |
| **Home** | Move to the start of the current week |
| **End** | Move to the end of the current week |
| **PgUp** | Move to the same day of the previous month |
| **PgDown** | Move to the same day of the next month |
| ***Alt*** + **PgUp** | Move to the same month and day of the previous year |
| ***Alt*** + **PgDown** | Move to the same month and day of the next year |

## *Move* Method

The base calendar component contains a `move` method that provides more flexible options not provided by the user interface or keyboard navigation. This method is asynchronous which can be `await`ed when a transition is specified.

```ts
type move = async (target: MoveTarget, opts: MoveOptions) => Promise<boolean>;

type MoveTarget = number | string | Date | PageAddress;

interface MoveOptions {
  // Target month position for multi-row or multi-column configurations.
  // Negative numbers will offset from last position.
  position: number;
  view: CalendarView;
  // Target month position for multi-row or multi-column configurations. Negative numbers will offset from last position.
  transition: MoveTransition;
  // Force navigation even if the target months(s) are disabled
  force: boolean;
}

interface PageAddress {
  day?: number;
  week?: number;
  month: number;
  year: number;
}

type MoveTransition = 'none' | 'fade' | 'slide-v' | 'slide-h';
```

#### Returns
  
A **Promise** that *resolves* when the transition to the new set of month(s) is complete or *rejects* if target month(s) are disabled.

### Move by number of months

Moves a given number of months forwards or backwards.

Calling `move(num)` with a **positive** number will move **forwards** by a given number of months.

Calling `move(num)` with a **negative** number will move **backwards** by a given number of months.

<Example centered>
  <NavigationMoveMonths />
</Example>

```vue
<template>
  <Calendar ref="calendar">
</template>

<script setup>
import { ref } from 'vue';

const calendar = ref(null);

async function move() {
  // Move forwards 1 month (wait for transition)
  await calendar.value.move(1);
  // Move backwards 1 month (wait for transition)
  await calendar.value.move(-1);
}
</script>
```

### Move to month

Moves to a given month by calling `move(page)` with a page object with `month` and `year` keys.

```js
// ...
// Moves to January, 1983
await calendar.value.move({ month: 1, year: 1983 })
```

### Move to a date

Moves to a specified date.

Calling `move(date)` with a **Date** object will move to that date.

Calling `move(date)` with a **String** will move to the converted date.

```js
// ...
// Moves to today's date
await calendar.value.move(new Date())
// Moves to my birthday
await calendar.value.move(`1983-01-21`)
```

<BaseAlert warning>
  Calling `move(date)` will move to the month associated with that date. It will not focus on the date after the transition has occurred. To focus on the date, call `focusDate(date)` instead.
</BaseAlert>

<Example>
  <NavigationMove />
</Example>