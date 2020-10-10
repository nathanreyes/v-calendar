---
title: 'Calendar'
sidebarDepth: 2
---

## Props

### `rows`

**Type:** Number

**Description:** Number of calendar rows to display.

**Default:** `1`

### `columns`

**Type:** Number

**Description:** Number of calendar columns to display.

**Default:** `1`

### `step`

**Type:** Number

**Description:** Number of months to step when navigating forwards and backwards.

**Default:** `0` *Resolves to **n** if not provided, where `n = rows * columns`.*

### `title-position`

**Type:** String

**Description:** Position of the header title (`"left"`, `"center"`, `"right"`).

**Default:** `"center"`

### `is-expanded`

**Type:** Boolean

**Description:** Expands calendar to fill the full width of its container.

**Default:** `false`

### `nav-visibility`

**Type:** String

**Description:** Visibility state for calendar navigation panel (`"focus"`, `"hover"`, `"visible"`, `"hidden"`)

**Default:** `undefined` [Resolved by defaults if not specified](./defaults.md#nav-visibility)

### `transition`

**Type:** String

**Description:** Transition type for calendar panes when navigating to a new page (`"slide-h"`: Horizontal slide, `"slide-v"`: Vertical slide, `"fade"`, `"none"`).

**Default:** `undefined` [Resolved by defaults if not specified](./defaults.md#transition)

### `from-page`

**Type:** Object

**Description:** The page (month, year) for the first calendar pane located at row 0 and column 0. Use the `.sync` modifier for two-way binding.

**Default:** `undefined` *Resolves to current month if not provided.*

:::tip
Use the `.sync` modifier for two-way binding.
:::

### `from-date`

**Type:** Date

**Description:** Date used to compute `from-page`.

**Default:** `undefined`

:::warning
The `.sync` modifier does not work with this prop, unlike `from-page`.
:::

### `to-page`

**Type:** Object

**Description:** The page (month, year) for the last calendar pane located at row *n* and column *n*, where *n* is the max dimension.

**Default:** `undefined` *Resolves to **n** month if not provided, where `n = rows * columns`.*

::: tip
*Resolves to **n** month if not provided, where `n = rows * columns`.
:::

:::tip
Use the `.sync` modifier for two-way binding.
:::

:::warning
To avoid erratic navigation behavior, do not try to assign both `from-page` and `to-page` at the same time (just pick one).
:::

### `to-date`

**Type:** Date

**Description:** Date used to compute `to-page`.

**Default:** `undefined`

:::warning
The `.sync` modifier does not work with this prop, unlike `to-page`.
:::

### `min-page`

**Type:** Object

**Description:** Earliest page (month, year) that the user can navigate to.

**Default:** `undefined`

### `min-date`

**Type:** Date

**Description:** Date used to compute `min-page`.

**Default:** `undefined`

### `max-page`

**Type:** Object

**Description:** Latest page (month, year) that the user can navigate to.

**Default:** `undefined`

### `max-date`

**Type:** Date

**Description:** Date used to compute `max-page`.

**Default:** `undefined`

### `attributes`

**Type:** Array[Object]

**Description:** List of attributes to display in the calendar.

**Default:** `[]`

### `disabled-dates`

**Type:** Date that can be one of a Javascript date object, a date range object with `start`, `end`, `span` or [pattern tokens](./date-patterns.md)

**Description:** Dates that are disabled from user selection or navigation.

**Default:** `null`

### `available-dates`

**Type:** Date that can be one of a Javascript date object, a date range object with `start`, `end`, `span` or [pattern tokens](./date-patterns.md)

**Description:** Dates or date range objects that are available for selection or navigation. All other dates are disabled.

**Default Value:** `undefined`

### `masks`

**Type:** Object

**Description:** Masks to use when formatting and parsing dates for various calendar sections.

**Default:** `undefined` [Resolved by defaults if not specified](./defaults.md#masks)

### `color`

**Type:** String

**Description:** Color used for accents and attribute defaults.

**Default:** `"blue"`

### `is-dark`

**Type:** Boolean

**Description:** Dark mode setting.

**Default:** `false`

### `first-day-of-week`

**Type:** Number

**Description:** Day number for the first day of the week (1: Sun - 7: Sat). Ignore setting this prop if you want to allow the locale to determine this setting.

**Default:** `undefined` [Resolved by locale if not specified](#locale)

### `locale`

**Type:** String, Object

**Description:** The locale identifier or locale configuration to use for displaying the calendar.

**Default:** `undefined` [Resolved by defaults or detected locale if not completely specified](./defaults.md#locale)

### `disable-page-swipe`

**Type:** Boolean

**Description:** Disables swipe detection for navigating forwards and backwards.

**Default:** `undefined`

<!--
### 

**Type:** 

**Description:** 

**Default:** 
-->


## Events

### `update:from-page`

**Description:** Calendar left/single pane moved to a different page.

**Params:** [`page`](./page-object.md)

### `update:to-page`

**Description:** Calendar right pane moved to a different page.

**Params:** [`page`](./page-object.md)

### `dayclick`

**Description:** Forwarded from the `mouseclick` event for the day content element.

**Params:** [`day`](./day-object.md)

### `daymouseenter`

**Description:** Forwarded from the `mouseenter` event for the day content element.

**Params:** [`day`](./day-object.md)

### `daymouseleave`

**Description:** Forwarded from the `mouseleave` event for the day content element.

**Params:** [`day`](./day-object.md)

### `dayfocusin`

**Description:** Forwarded from the `focusin` event for the day content element.

**Params:** [`day`](./day-object.md)

### `dayfocusout`

**Description:** Forwarded from the `focusout` event for the day content element.

**Params:** [`day`](./day-object.md)

### `transition-start`

**Description:** Transition to new page has started.

### `transition-end`

**Description:** Transition to new page has ended.

## Methods

To call methods on a component, assign a ref and call the method any time on or after the `mounted` lifecycle hook.

```html
<v-calendar ref="calendar' />
```

```js
...
mounted() {
  // Get reference to the calendar component
  const calendar = this.$refs.calendar;
  // Call method of the component
  calendar.showPageRange(new Date());
}
...
```

### `move(Number|String|Date|Object)`

#### Description

Asynchronously navigates by a given number of months, to a given month or to a given date.

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

#### Move by number of months

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

#### Move to month

Moves to a given month by calling `move(month)` with an object with `month` and `year` keys.

```js
// Get the calendar ref
const calendar = this.$refs.calendar

// Moves to January, 1983
await calendar.move({ month: 1, year: 1983 })
```

#### Move to a date

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

### `focusDate(String|Date)`

#### Description

Asynchronously navigates to the month for a given date and focuses on that day after transition is complete.

```js
async focusDate(date, opts) => Promise
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **date** | *Date* | Target date |
| **opts** | *Object* | Set of navigation options |
| **opts.position** | *Number* | Target month position for multi-row or multi-column configurations. Negative numbers will offset from last position. |
| **opts.transition** | *String* | Transition type (`slide-h`, `slide-v`, `fade`, `none`). Note that this will override the calendar `transition` prop. |

#### Returns
  
A **Promise** that *resolves* when the transition is complete or *rejects* if target month(s) are disabled.


### `showPageRange(Date|Object)`

**Description:** Navigates to the calendar page(s) that best displays a given date range.

```js
  ...
  const date = new Date(2020, 0, 1); // January, 2020
  const page = { month: 2, year: 2020 }; // February, 2020
  // Pass a date
  calendar.showPageRange(date);
  // Pass a page ({ month, year })
  calendar.showPageRange(page);
  // From a date or page
  calendar.showPageRange({ from: date });
  // To a date or page
  calendar.showPageRange({ to: page });
  // From a date or page to a date or page
  calendar.showPageRange({ from: date, to: page })
```

<!--
### 

**Description:** 

**Params:** 
-->

## Scoped Slots

### `header`

**Description:** Calendar header. Use slots below for specific header sections.

**Props:** [`page` props](./page-object.md)

### `header-title`

**Description:** Calendar header title. This slot is animated if `title-transition` is assigned.

**Props:** [`page` props](./page-object.md)

### `day-content`

**Description:** Calendar day content cell.

**Props:**

| Props | Type | Description |
| --- | --- | --- |
| `day` | [Day Object](./day-object.md) | Day object. |
| `dayEvents` | Object | Events that should get mapped to your custom content DOM element. |
| `attributes` | Array | List of ordered attributes for the day. |
| `attributesMap` | Object | Object map of the attributes using their designated key. |

### `day-popover`

**Description:** Custom popover content for attributes.

**Props:**

| Props | Type | Description |
| --- | --- | --- |
| `day` | [Day Object](./day-object.md) | Day object. |
| `attributes` | Array | List of ordered attributes with an assigned popover for the day. |
| `masks` | Object | Resolved locale masks |
| `format` | Function | Call to format a custom date and mask |
| `dayTitle` | String | Pre-formatted string using the `dayPopover` mask |
| `updateLayout` | Function | Call to forcefully update the popover layout (such as when content changes are made) |
| `hide` | Function | Call to forcefully hide the popover |

### `header-left-button`

**Description:** Calendar header button on the left side for moving to the previous page(s).

### `header-right-button`

**Description:** Calendar header button on the right side for moving to the next page(s).

### `nav-left-button`

**Description:** Calendar navigation header button on the left side for moving to the previous page(s).

### `nav-right-button`

**Description:** Calendar navigation header button on the right side for moving to the next page(s).

<!--
### 

**Description:** 

**Props:** 
-->
