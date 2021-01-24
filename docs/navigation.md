---
title: 'Navigation'
sidebarDepth: 2
---

## User Interface

### Header

There are 2 primary methods for navigating the calendar within the header.

1. Navigation arrows to move forwards and backwards by a given [`step`](#month-steps) amount.
2. Navigation popover to more easily skip to a specific month/year.

<div class="example">
  <v-calendar />
</div>

```html
<v-calendar />
```

### Month Steps

By default, the calendar will navigate to the month following the last current displayed month when navigating forwards. Conversely, it will navigate to the month preceding the first month when navigating backwards.

This default step amount is equal to the number of rows multiplied by the number of columns in a given layout (2 rows x 1 column = 2).

<div class="example">
  <v-calendar :rows="2" />
</div>

However, the `step` prop can be used to configure a custom month interval.

For example, instead of moving forward by 2 months in the previous example, we can instead force it move by 1 month.

<div class="example">
  <v-calendar :rows="2" :step="1" />
</div>

```html
<v-calendar :rows="2" :step="1" />
```

### Min & Max Dates

If `min-date` or `max-date` props are assigned, this will disable navigation for the user beyond the dates provided.

#### Min Date

<div class="example">
  <v-calendar :min-date="new Date()" />
</div>

```html
<v-calendar :min-date="new Date()" />
```

#### Max Date

<div class="example">
  <v-calendar :max-date="new Date()" />
</div>

```html
<v-calendar :max-date="new Date()" />
```

## Key Commands

Both `v-calendar` and `v-date-picker` now support the following key commands for navigation:

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

::: tip
A calendar day must be in focus in order for commands to be recognized
:::

## *Move* Method

The base calendar component contains a `move` method that provides more flexible options not provided by the user interface or keyboard navigation. This method is asynchronous which can be `await`ed when a transition is specified.

```js
async move(arg, opts) => Promise
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **arg** | **Number*, *Date*, *String* or Page *Object* | Target month criteria |
| **opts** | *Object* | Set of navigation options |
| **opts.position** | *Number* | Target month position for multi-row or multi-column configurations. Negative numbers will offset from last position. |
| **opts.transition** | *String* | Transition type (`slide-h`, `slide-v`, `fade`, `none`). Note that this will override the calendar `transition` prop. |
| **opts.force** | *Boolean* | Force navigation even if the target months(s) are disabled |

#### Returns
  
A **Promise** that *resolves* when the transition to the new set of month(s) is complete or *rejects* if target month(s) are disabled.

### Move by number of months

Moves a given number of months forwards or backwards.

Calling `move(num)` with a **positive** number will move **forwards** by a given number of months.

Calling `move(num)` with a **negative** number will move **backwards** by a given number of months.

```html
<v-calendar ref="calendar">
```

```js
// Get the calendar ref
const calendar = this.$refs.calendar

// Move forwards 5 months (wait for transition)
await calendar.move(5)

// Move backwards 5 months (wait for transition)
await calendar.move(-5)
```

### Move to month

Moves to a given month by calling `move(page)` with a page object with `month` and `year` keys.

```js
// Get the calendar ref
const calendar = this.$refs.calendar

// Moves to January, 1983
await calendar.move({ month: 1, year: 1983 })
```

### Move to a date

Moves to a specified date.

Calling `move(date)` with a **Date** object will move to that date.

Calling `move(date)` with a **String** will move to the converted date.

```js
// Get the calendar ref
const calendar = this.$refs.calendar

// Moves to today's date
await calendar.move(new Date())

// Moves to my birthday
await calendar.move(`1983-01-21`)
```

::: warning
Calling `move(date)` will move to the month associated with that date. It will not focus on the date after the transition has occurred. To focus on the date, call `focusDate(date)` instead.
:::

<guide-navigation-move />