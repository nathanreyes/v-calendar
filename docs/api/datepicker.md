---
title: 'Date Picker'
sidebarDepth: 2
---

::: tip
`v-date-picker` supports all props, events and slots that are supported by `v-calendar` in addition to those listed below.
:::


## Props

### `value`

**Type:** Date, Array[Date], Object

**Description:** Selected date, dates or date range.

**Default Value:** `null`

### `mode`

**Type:** String

**Description:** Selection mode: `"single"`, `"multiple"`, `"range"`

**Default Value:** `"single"`

### `is-required`

**Type:** Boolean

**Description:** Prevents the **user** from clearing the selected value. Setting `value = null` still allowed through code.

**Default Value:** `false`

### `is-inline`

**Type:** Boolean

**Description:** Displays calendar inline instead of as a popover.

**Default Value:** `false`

### `min-date`

**Type:** Date

**Description:** Minimum date selectable by the user.

**Default Value:** `undefined`

### `max-date`

**Type:** Date

**Description:** Maximum date selectable by the user.

**Default Value:** `undefined`

### `disabled-dates`

**Type:** Array, Date, Object

**Description:** Disabled dates or date range objects.

**Default Value:** `undefined`

### `available-dates`

**Type:** Array, Date, Object

**Description:** Available dates or date range objects. All other dates are disabled.

**Default Value:** `undefined`

### `input-props`

**Type:** Object

**Description:** Object with props to apply to the input element. Not applicable for inline date pickers.

**Default Value:** [Reference code]()

### `update-on-input`

**Type:** Boolean

**Description:** Update the picker value after every `input` event.

**Default Value:** `true`

### `input-debounce`

**Type:** Number

**Description:** If `update-on-input` is enabled, the duration in milliseconds at which the `input` event is debounced when commiting a new date value.

**Default Value:** `1000`

### `tint-color`

**Type:** String

**Description:** Background color of the selected and dragged highlighted regions (`opacity: 0.5` for dragged). This setting is overridden by `select-attribute` and `drag-attribute` if specified.

**Default Value:** `"#66B3CC"`

### `select-attribute`

**Type:** Object

**Description:** Attribute to use for the date selection in all modes.

**Default Value:** [Reference code]()

### `drag-attribute`

**Type:** Object

**Description:** Attribute to use for the dragged selection in "range" mode.

**Default Value:** [Reference code]()

### `show-caps`

**Type:** Boolean

**Description:** Show caps and the end of the highlighted and dragged regions when `mode === "range"`

**Default Value:** `false`

### `show-popover`

**Type:** Boolean

**Description:** Show popover when selected or dragged date regions are hovered.

**Default Value:** `true`

### `popover-expanded`

**Type:** Boolean

**Description:** Popover wrapper for input or slot is expanded to the full width of it's container.

**Default Value:** `false`

### `popover-direction`

**Type:** String

**Description:** Direction that popover displays relative to input or slot element: `"bottom"`, `"top"`, `"left"`, `"right"`

**Default Value:** `"bottom"`

### `popover-align`

**Type:** String

**Description:** How the popover is aligned relative to input or slot element: `"left"`, `"right"`, `"top"`, `"bottom"`

**Default Value:** `"left"`

### `popover-visibility`

**Type:** Number

**Description:** Visibility state of the popover: `"hover"`, `"focus"`, `"hidden"`, `"visible"`

**Default Value:** `"hover"`

### `popover-content-offset`

**Type:** String

**Description:** Distance that the popover content is offset from the input or slot element.

**Default Value:** `"10px"`

### `popover-keep-visible-on-input`

**Type:** Boolean

**Description:** Keep the popover visible after a valid input has been selected

**Default Value:** `false`


<!-- 
### 

**Type:** 

**Description:** 

**Default Value:** 
-->

## Events

### `input`

**Description:** New date was selected.

**Params:** `value: Date, Array[Date], Object`

### `drag`

**Description:** Dragged selection was updated. Only valid when `mode === "range"`

**Params:** `range: Object`

<!-- 
### 

**Description:** 

**Params:** 
-->

## Scoped Slots

### *`default`*

**Description:** Default slot to use as the popover anchor for v-date-picker. <sup>[[1]](#dp-slots-note-1)</sup> Not applicable to inline date pickers.

**Props:** `inputValue: String`, `updateValue: Function`

::: tip
Reference [this example](../guide/datepicker.md#use-custom-slot) of using a custom slot.
:::