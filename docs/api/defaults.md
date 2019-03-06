---
title: 'Defaults'
sidebarDepth: 2
pageClass: docs-page
---

## `locale`

**Type:** String

**Description:** Locale identification in [*language-region*](https://lingohub.com/documentation/developers/supported-locales/language-designators-with-regions/) format. Not all regions supported.

**Default:** `undefined`

## `componentPrefix`

**Type:** String

**Description:** Custom prefix to use for plugin components. Replace if `v-calendar` and `v-date-picker` interfere with other component libraries.

**Default:** `"v"`

## `firstDayOfWeek`

**Type:** Number

**Description:** Day number for the first day of the week (1: Sun - 7: Sat)

**Default:** `1`

## `formats`

**Type:** Object

**Description:** Formats to use when display and parsing dates for various calendar sections

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

## `navVisibility`

**Type:** String

**Description:** Visibility state for calendar navigation panel (`"focus"`, `"hover"`, `"visible"`, `"hidden"`)

**Default:** `"focus"`

## `titlePosition`

**Type:** String

**Description:** Position of the title in the header (`"left"`, `"center"`, `"right"`)

**Default:** `"center"`

## `transition`

**Type:** String

**Description:** Transition type for title when navigating to a new page (`"slide-h"`, `"slide-v"`, `"fade"`, `"none"`)

**Default:** `"slide-h"` for single-paned, `"fade"` for multi-paned

## `datePickerUpdateOnInput`

**Type:** Boolean

**Description:** Update the picker value after every `input` event.

**Default:** `false`

## `datePickerInputDebounce`

**Type:** Number

**Description:** If `update-on-input` is enabled, the duration in milliseconds at which the `input` event is debounced when commiting a new date value.

**Default:** `1000`

## `popoverExpanded`

**Type:** Boolean

**Description:** Popover wrapper for input or slot is expanded to the full width of its container.

**Default:** `false`

## `popoverDirection`

**Type:** String

**Description:** Direction that popover displays relative to input or slot element (`"bottom"`, `"top"`, `"left"`, `"right"`)

**Default:** `"bottom"`

## `popoverAlign`

**Type:** String

**Description:** How the popover is aligned relative to input or slot element (`"left"`, `"right"`, `"top"`, `"bottom"'`)

**Default:** `"left"`

## `popoverVisibility`

**Type:** String

**Description:** Visibility state of the popover (`"hover"`, `"focus"`, `"hidden"`, `"visible"`)

**Default:** `"hover"`

## `popoverContentOffset`

**Type:** String

**Description:** Distance that the popover content is offset from the input or slot element

**Default:** `"10px`

## `popoverKeepVisibleOnInput`

**Type:** Boolean

**Description:** Keep the popover visible after a valid input has been selected

**Default:** `false`

## `maxSwipeTime`

**Type:** Number

**Description:** Maximum time in milliseconds allowed for a swipe gesture to complete

**Default:** `300`

## `minHorizontalSwipeDistance`

**Type:** Number

**Description:** Minimum distance in pixels allowed for a horizontal swipe gesture

**Default:** `60`

## `maxVerticalSwipeDistance`

**Type:** Number

**Description:** Maximum distance in pixels allowed for a horizontal swipe gesture

**Default:** `80`

## `maxTapTolerance`

**Type:** Number

**Description:** Maximum distance in pixels allowed for a tap between `touchstart` and `touchend` events

**Default:** `0`

## `maxTapDuration`

**Type:** Number

**Description:** Maximum time in milliseconds allowed for a tap between `touchstart` and `touchend` events

**Default:** `200`

<!--
## 

**Type:** 

**Description:** 

**Default:** 
-->
