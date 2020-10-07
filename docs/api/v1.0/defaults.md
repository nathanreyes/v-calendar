---
title: 'Defaults'
sidebarDepth: 2
pageClass: docs-page
---

## Properties

### `componentPrefix`

**Type:** String

**Description:** Custom prefix to use for plugin components. Replace if `v-calendar` and `v-date-picker` interfere with other component libraries.

**Default:** `"v"`

### `titlePosition`

**Type:** String

**Description:** Position of the title in the header (`"left"`, `"center"`, `"right"`)

**Default:** `"center"`

### `navVisibility`

**Type:** String

**Description:** Visibility state for calendar navigation panel (`"focus"`, `"hover"`, `"visible"`, `"hidden"`)

**Default:** `"focus"`

### `transition`

**Type:** String

**Description:** Transition type for calendar panes when navigating to a new page (`"slide-h"`: Horizontal slide, `"slide-v"`: Vertical slide, `"fade"`, `"none"`).

**Default:** `"slide-h"` when `row === 1 && column === 1`, `"fade"` otherwise.

### `masks`

**Type:** Object

**Description:** Masks to use when display and parsing dates for various calendar sections.

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


### `screens`

**Type:** Object

**Description:** Screen size breakpoints to use to obtain responsive layouts by calling the `$screens` function.

**Default:**
```js
{
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px"
}
```

### `locale`

**Type:** String, Object

**Description:** Locale identification string in [*language-region*](https://lingohub.com/documentation/developers/supported-locales/language-designators-with-regions/) format, or set of locale configuration properties if object is provided.

**Default:** `undefined`

### `locales`

**Type:** Object

**Description:** Use this object if your locales are missing or you wish to override specific settings for existing locales. The key should match the locale identifier ('en-US') and the value may optionally include any of the following property settings:

| Setting | Description |
| --- | --- |
| `firstDayOfWeek` | The day the specified the first day of the week. This is a number from 1 to 7 (Sunday to Saturday, respectfully). |
| `masks` | Set of masks to use for common sections of the calendar including the title, weekday labels, month labels in the navigation pane and more. |

**Default:** 

### `datePicker`

**Type:** Object

**Description:** Defaults applied for date picker *only*.

**Default:** *Reference below for default values*

### `datePicker.updateOnInput`

**Type:** Boolean

**Description:** Update the picker value after every `input` event. Otherwise, value is just updated on `change` event.

**Default Value:** `true`

### `datePicker.inputDebounce`

**Type:** Number

**Description:** If `update-on-input` is enabled, the duration in milliseconds at which the `input` event is debounced before updating the date value.

**Default Value:** `1000`


### `datePicker.popover`

**Type:** Object

**Description:** Properties of the popover to apply for the calendar component. Not applicable for inline pickers.

**Default Value:** *Reference below for default values.*

### `datePicker.popover.visibility`

**Type:** String

**Description:** Visibility state of the popover (`"hover-focus"`, `"hover"`, `"focus"`, `"click"`, `"visible"`, `"hidden"`)

**Default:** `"hover-focus"`

### `datePicker.popover.keepVisibleOnInput`

**Type:** Boolean

**Description:** Keep the popover visible after a valid input has been selected

**Default:** `false`

### `datePicker.popover.placement`

**Type:** String

**Description:** Default or suggested placement of the popover. This may change as the browser window dimensions change.

**Default:** `"bottom"`

### `touch`

**Type:** Object

**Description:** Defaults applied for touch swipes

**Default:** *Reference below for default values*

### `touch.maxSwipeTime`

**Type:** Number

**Description:** Maximum time in milliseconds allowed for a swipe gesture to complete

**Default:** `300`

### `touch.minHorizontalSwipeDistance`

**Type:** Number

**Description:** Minimum distance in pixels allowed for a horizontal swipe gesture

**Default:** `60`

### `touch.maxVerticalSwipeDistance`

**Type:** Number

**Description:** Maximum distance in pixels allowed for a horizontal swipe gesture

**Default:** `80`

<!--
### 

**Type:** 

**Description:** 

**Default:** 
-->
