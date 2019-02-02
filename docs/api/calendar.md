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

### `from-page`

**Type:** Object

**Description:** The page for the first calendar pane located at row 0 and column 0. Use the `.sync` modifier for two-way binding.

**Default:** `undefined` *Resolves to current month if not provided.*

:::tip
Use the `.sync` modifier for two-way binding.
:::

### `to-page`

**Type:** Object

**Description:** Page for the last calendar pane located at row *n* and column *n*, where *n* is the max dimension.

**Default:** `undefined` *Resolves to **n** month if not provided, where `n = rows * columns`.*

:::tip
Use the `.sync` modifier for two-way binding.
:::

:::warning
To avoid erratic navigation behavior, do not try to assign both `from-page` and `to-page` at the same time (just pick one).
:::

### `from-date`

**Type:** Date

**Description:** Date used to compute `from-page`.

**Default:** `undefined`

:::warning
The `.sync` modifier does not work with this prop, unlike `from-page`.
:::

### `to-date`

**Type:** Date

**Description:** Date used to compute `to-page`.

**Default:** `undefined`

:::warning
The `.sync` modifier does not work with this prop, unlike `from-page`.
:::

### `min-page`

**Type:** Object

**Description:** Earliest page (month, year) that the user can navigate to.

**Default:** `undefined`

### `max-page`

**Type:** Object

**Description:** Latest page (month, year) that the user can navigate to.

**Default:** `undefined`

### `min-date`

**Type:** Date

**Description:** Date used to compute `min-page`.

**Default:** `undefined`

### `max-date`

**Type:** Date

**Description:** Date used to compute `max-page`.

**Default:** `undefined`

### `is-expanded`

**Type:** Boolean

**Description:** Expands calendar to fill the full width of its container.

**Default:** `false`

### `theme-styles`

**Type:** Object

**Description:** A variety of styles that are used to customize different components of the calendar.

**Default:** [Reference theme styles](./theme-styles.md)

### `title-position`

**Type:** String

**Description:** Position of the header title (`"left"`, `"center"`, `"right"`).

**Default:** `"center"`

### `transition`

**Type:** String

**Description:** Transition type for weeks when navigating to a new page (`"slide-h"`, `"slide-v"`, `"fade"`, `"none"`).

**Default:** `""`

### `nav-visibility`

**Type:** String

**Description:** Visibility state of the navigation panel. Use `"hover"` to automatically show when title is hovered on non-touch devices or tapped on touch devices. Use `"focus"` to automatically show when title enters or leaves focus. Use `"visible"` and `"hidden"` for manual control.

**Default:** `"focus"`

### `formats`

**Type:** Object

**Description:** Formats to use when display and parsing dates for various calendar sections.

**Default:**
```js
{
  title: 'MMMM YYYY',
  weekdays: 'W',
  navMonths: 'MMM',
  input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
  dayPopover: 'WWW, MMM D, YYYY',
  data: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
}
```

### `attributes`

**Type:** Array[Object]

**Description:** List of attributes to display in the calendar.

**Default:** `[]`

<!--
### 

**Type:** 

**Description:** 

**Default:** 
-->


## Events

### `update:frompage`

**Description:** Calendar left/single pane moved to a different page.

**Params:** [`page`](./page-object.md)

### `update:topage`

**Description:** Calendar right pane moved to a different page.

**Params:** [`page`](./page-object.md)

### `dayclick`

**Description:** Forwarded from the `mouseclick` event for the day content element.

**Params:** [`day`](./day-object.md)

### `daymouseenter`

**Description:** Forwarded from the `mouseenter` event for the day content element.

**Params:** [`day`](./day-object.md)

### `daymouseover`

**Description:** Forwarded from the `mouseover` event for the day content element.

**Params:** [`day`](./day-object.md)

### `daymouseleave`

**Description:** Forwarded from the `mouseleave` event for the day content element.

**Params:** [`day`](./day-object.md)

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

### `header-left-button`

**Description:** Calendar header button on the left side.

**Props:** [`page` props](./page-object.md)

### `header-right-button`

**Description:** Calendar header button on the right side.

**Props:** [`page` props](./page-object.md)

### `day-content`

**Description:** Calendar day content cell.

**Props:** [`day`](./day-object.md), `attributes: Array`, `contentStyle: Object`

### `day-popover-header`

**Description:** If popover content is visible, this slot displays as the header.

**Props:** [`day` props](./day-object.md)

### `day-popover-footer`

**Description:** If popover content is visible, this slot displays as the footer.

**Props:** [`day` props](./day-object.md)

### *`custom-name`*

**Description:** Any number of custom named slots that are referenced by attribute popovers.

**Props:** `attribute: Object`, [`day`](./day-object.md), `customData: Any`

<!--
### 

**Description:** 

**Props:** 
-->
