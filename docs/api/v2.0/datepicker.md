---
title: 'Date Picker'
sidebarDepth: 2
---

::: tip
`v-date-picker` supports all props, events and slots that are supported by `v-calendar` in addition to those listed below.
:::


## Props

### `mode`

**Type:** String

**Description:** Selection mode: `"date"`, `"dateTime"`, `"time"`

**Default:** `"single"`

### `value`

**Type:** Date, Object

**Description:** Selected date or date range.

**Default:** `null`

### `is-range`

**Type:** Boolean

**Description:** Date value is a date range object.

**Default:** `false`

### `is24hr`

**Type:** Boolean

**Description:** Use 24-hr time picker and input format.

**Default:** `false`

### `minute-increment`

**Type:** Number

**Description:** Increment amount for the minute `select` options.

**Default:** 1

### `is-required`

**Type:** Boolean

**Description:** Prevents the **user** from clearing the selected value.

**Default:** `false`

::: tip
Setting `value = null` still allowed through code.
:::

### `update-on-input`

**Type:** Boolean

**Description:** Update the picker value after every `input` event. Otherwise, value is just updated on `change` event.

**Default:** `true`

### `input-debounce`

**Type:** Number

**Description:** If `update-on-input` is enabled, the duration in milliseconds at which the `input` event is debounced before updating the date value.

**Default:** `1000`

### `drag-attribute`

**Type:** Object

**Description:** Attribute to use for the dragged selection in "range" mode. The `dates` property is ignored.

**Default:** [Reference code]()

### `select-attribute`

**Type:** Object

**Description:** Attribute to use for the value selection in all modes. The `dates` property is ignored.

**Default:** [Reference code]()

### `popover`

**Type:** Object

**Description:** Properties of the popover to apply for the calendar component.

**Default:** [Reference code](./defaults.md)

### `popover.hideDelay`

*Introduced in `v2.1.0`*

**Type:** Number

**Description:** Amount of milliseconds to delay the popover when hiding. After this delay, the popover transition will start if `popover.transition` is not `none` or ``.

**Default:** 0

### `popover.keepVisibleOnInput`

**Type:** Boolean

**Description:** Keep the popover visible after a date is selected (only applies for `mode: 'date'`), until the `visibility` determines that it should hide again.

### `popover.modifiers`

**Type:** Array

**Description:** Modifiers used to modify the behavior of [`popper.js`](https://popper.js.org/docs/v2/modifiers/).

**Default:** `undefined`

### `popover.placement`

**Type:** String

**Description:** Default or suggested placement of the popover. This may change as the browser window dimensions change. [Valid placements](https://popper.js.org/docs/v2/constructors/#options) include `auto`, `top`, `right`, `bottom`, `left`. Each placement can have suffixed variations `-start` or `-end`.

**Default:** `bottom-start`

### `popover.positionFixed`

**Type:** Boolean

**Description:** Uses a `fixed` position when displaying the popover. Use this open when the calendar is placed within a container that has `overflow: hidden` style applied. Reference popper.js for more details.

**Default:** `false`

### `popover.showDelay`

*Introduced in `v2.1.0`*

**Type:** Number

**Description:** Amount of milliseconds to delay the popover when showing. After this delay, the popover transition will start if `popover.transition` is not `none` or ``.

**Default:** 0

### `popover.transition`

**Type:** String

**Description:** Transition to use when displaying the popover (`slide-fade`, `fade`, `none` or ``).

**Default:** `slide-fade`

### `popover.visibility`

**Type:** String

**Description:** Visibility mode for the input/slot popover (`hover-focus`, `hover`, `focus`, `visible`, `hidden`)

**Default:** `hover-focus`

## Methods

To call methods on a component, assign a ref and call the method any time on or after the `mounted` lifecycle hook.

```html
<v-date-picker ref="datepicker" />
```

```js
...
mounted() {
  // Get reference to the date picker component
  const datepicker = this.$refs.datepicker;
  // Call method of the component
  datepicker.move(new Date());
}
...
```

### `move(Number|String|Date|Object)`

#### Description

Asynchronously navigates by a given number of months, to a given month or to a given date.

This calls the [`Calendar.move`](./calendar.md#move-number-string-date-object) method under the hood.

```js
async move(arg, opts) => Promise
```

### `focusDate(String|Date)`

#### Description

Asynchronously navigates to the month for a given date and focuses on that day after transition is complete.

This calls the [`Calendar.focusDate`](./calendar.md#focusdate-string-date) method under the hood.

```js
async focusDate(date, opts) => Promise
```

<!-- 
### 

**Type:** 

**Description:** 

**Default:** 
-->

## Events

### `input`

**Description:** New date was selected.

**Params:** `value: Date, Array[Date], Object`

### `drag`

**Description:** Dragged selection was updated. Only valid when `mode === "range"`

**Params:** `range: Object`

### `popoverWillShow`

**Description:** Called just before picker popover transitions into view

**Params:** `Object`: Popover content root HTML element.

### `popoverDidShow`

**Description:** Called just after picker popover has transitioned into view

**Params:** `Object`: Popover content root HTML element.

### `popoverWillHide`

**Description:** Called just before picker popover transitions out of view

**Params:** `Object`: Popover content root HTML element.

### `popoverDidHide`

**Description:** Called just after picker popover has transitioned out of view

**Params:** `Object`: Popover content root HTML element.

<!-- 
### 

**Description:** 

**Params:** 
-->

## Scoped Slots

### *`default`*

**Description:** Default slot to use as the popover anchor for v-date-picker. <sup>[[1]](#dp-slots-note-1)</sup> Not applicable to inline date pickers.

**Props:**

Reference the section on using [custom slots](../datepicker.md#use-custom-slot) for available props.
