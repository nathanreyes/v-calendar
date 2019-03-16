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

### `title-position`

**Type:** String

**Description:** Position of the header title (`"left"`, `"center"`, `"right"`).

**Default:** `"center"`

### `nav-visibility`

**Type:** String

**Description:** Visibility state for calendar navigation panel (`"focus"`, `"hover"`, `"visible"`, `"hidden"`)

**Default:** `undefined` [Resolved by defaults if not specified](./defaults.md#nav-visibility)

### `is-expanded`

**Type:** Boolean

**Description:** Expands calendar to fill the full width of its container.

**Default:** `false`

### `transition`

**Type:** String

**Description:** Transition type for calendar panes when navigating to a new page (`"slide-h"`: Horizontal slide, `"slide-v"`: Vertical slide, `"fade"`, `"none"`).

**Default:** `undefined` [Resolved by defaults if not specified](./defaults.md#transition)

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

### `from-date`

**Type:** Date

**Description:** Date used to compute `from-page`.

**Default:** `undefined`

:::warning
The `.sync` modifier does not work with this prop, unlike `from-page`.
:::

### `to-page`

**Type:** Object

**Description:** Page for the last calendar pane located at row *n* and column *n*, where *n* is the max dimension.

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

### `formats`

**Type:** Object

**Description:** Formats to use when display and parsing dates for various calendar sections.

**Default:** `undefined` [Resolved by defaults if not specified](./defaults.md#formats)

### `color`

**Type:** String

**Description:** Shortcut for specifying the theme color.

**Default:** `undefined` [Resolved by theme if not specified](#theme)

### `is-dark`

**Type:** Boolean

**Description:** Shortcut for activating theme dark mode.

**Default:** `undefed` [Resolved by theme if not specified](#theme)

### `theme`

**Type:** Object

**Description:** Theme settings used to customize the tint color, dark mode and classes for various calendar sections.

**Default:** `undefined` [Resolved by defaults if not completely specified](./defaults.md#theme)

### `firstDayOfWeek`

**Type:** Number

**Description:** Day number for the first day of the week (1: Sun - 7: Sat). Ignore setting this prop if you want to allow the locale to determine this setting.

**Default:** `undefined` [Resolved by locale if not specified](#locale)

### `locale`

**Type:** String, Object

**Description:** The locale identifier or locale configuration to use for displaying the calendar.

**Default:** `undefined` [Resolved by defaults or detected locale if not completely specified](./defaults.md#locale)

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
