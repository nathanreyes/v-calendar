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

**Description:** Selection mode: `"single"`, `"multiple"`, `"range"`

**Default Value:** `"single"`

### `value`

**Type:** Date, Array[Date], Object

**Description:** Selected date, dates or date range.

**Default Value:** `null`

### `is-required`

**Type:** Boolean

**Description:** Prevents the **user** from clearing the selected value.

**Default Value:** `false`

::: tip
Setting `value = null` still allowed through code.
:::

### `is-inline`

**Type:** Boolean

**Description:** Displays calendar inline instead of as a popover.

**Default Value:** `false`

### `input-props`

**Type:** Object

**Description:** Props to apply to the input DOM element.  Not applicable when `is-inline === true`.

**Default Value:** [Reference code]()

### `update-on-input`

**Type:** Boolean

**Description:** Update the picker value after every `input` event. Otherwise, value is just updated on `change` event.

**Default Value:** `true`

### `input-debounce`

**Type:** Number

**Description:** If `update-on-input` is enabled, the duration in milliseconds at which the `input` event is debounced before updating the date value.

**Default Value:** `1000`

### `drag-attribute`

**Type:** Object

**Description:** Attribute to use for the dragged selection in "range" mode. The `dates` property is ignored.

**Default Value:** [Reference code]()

### `select-attribute`

**Type:** Object

**Description:** Attribute to use for the value selection in all modes. The `dates` property is ignored.

**Default Value:** [Reference code]()

### `popover`

**Type:** Object

**Description:** Properties of the popover to apply for the calendar component. Not applicable when `is-inline === true`.

**Default Value:** [Reference code](./defaults.md)

| Property | Type | Description |
| --- | --- | --- |
| `visibility` | String | Visibility mode for the input/slot popover (`"hover-focus"`, `"hover"`, `"focus"`, `"visible"`, `"hidden"`) |
| `placement` | String | Default or suggested placement of the popover. This may change as the browser window dimensions change. [Valid placements](https://popper.js.org/popper-documentation.html#Popper.placements) include `auto`, `top`, `right`, `bottom`, `left`. Each placement can have suffixed variations `-start` or `-end`. |
| `positionFixed` | Boolean | Display the popover in `fixed` mode. Reference [`popper.js`](https://popper.js.org/popper-documentation.html#Popper.Defaults.positionFixed) for more details. |
| `modifiers` | Boolean | Modifiers used to modify the behavior of [`popper.js`](https://popper.js.org/popper-documentation.html#modifiers). |
| `keepVisibleOnInput` | Boolean | Keep the popover visible after a date is selected, until the `visibility` determines. |

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

:::warning
Popover events are only emitted when `is-inline === false`.
:::

<!-- 
### 

**Description:** 

**Params:** 
-->

## Scoped Slots

### *`default`*

**Description:** Default slot to use as the popover anchor for v-date-picker. <sup>[[1]](#dp-slots-note-1)</sup> Not applicable to inline date pickers.

**Props:**

Reference the section on using [custom slots](../guide/datepicker.md#use-custom-slot) for available props.
