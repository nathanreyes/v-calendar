---
title: Attribute
sidebarDepth: 2
---

:::warning
This page is currently being updated.
:::

## Properties

### `key`

**Type:** String

**Description:** Keys uniquely identify an attribute and may determine how animations are applied.

**Default:** `index`

### `highlight`

**Type:** Object, Function

**Description:** Highlight to associate with an attribute that may be defined as an [object](#highlight-object) or a [function](../guide/attributes.md#using-functions) that returns an object.

**Default:** `undefined`

### `dot`

**Type:** Object, Function

**Description:** Dot to associate with an attribute that may be defined as an [object](#dot-object) or a [function](../guide/attributes.md#using-functions) that returns an object.

**Default:** `undefined`

### `bar`

**Type:** Object, Function

**Description:** Bar to associate with an attribute that may be defined as an [object](#bar-object) or a [function](../guide/attributes.md#using-functions) that returns an object.

**Default:** `undefined`

### `popover`

**Type:** Object, Function

**Description:** Popover to associate with an attribute that may be defined as an [object](#popover-object) or a [function](../guide/attributes.md#using-functions) that returns an object.

**Default:** `undefined`

### `contentClass`

**Type:** String

**Description:** Class to apply to day content that may be defined as a string or a [function](../guide/attributes.md#using-functions) that returns a string.

### `contentStyle`

**Type:** Object, Function

**Description:** Style to apply to day content that may be defined as an [object](#content-style-object) or a [function](../guide/attributes.md#using-functions) that returns an object.

**Default:** `undefined`

### `dates`

**Type:** Date, Object, Array[Date, Object]

**Description:** Date or date range objects (patterns supported) to include for the attribute.

**Default:** `undefined`

### `excludeDates`

**Type:** Date, Object, Array[Date, Object]

**Description:** Date or date range objects (patterns supported) to exclude. All other dates are included.

**Default:** `undefined`

### `customObject`

**Type:** Any

**Description:** Assign any custom data to this property for easy access within event handlers.

**Default:** `undefined`

### `order`

**Type:** Number

**Description:** Order that the attribute should be displayed. Higher numbers take precedence in appearance.

**Default:** `0`

<!-- 
### 

**Type:** 

**Description:** 

**Default:** 
-->

## Highlight Object

### `animated`

**Type:** Boolean

**Description:** Highlight is animated on appearing, disappearing or range change.

**Default:** `true`

### `height`

**Type:** String

**Description:** Height of highlighted region.

**Default:** `"1.8rem"`

### `backgroundColor`

**Type:** String

**Description:** Background color of highlighted region.

**Default:** `"rgba(0, 0, 0, 0.5)"`

### `borderColor`

**Type:** String

**Description:** Border color of highlighted region.

**Default:** `undefined`

### `borderWidth`

**Type:** String

**Description:** Border width of highlighted region.

**Default:** `"0"`

### `borderStyle`

**Type:** String

**Description:** Border style of highlighted region.

**Default:** `"solid"`

### `borderRadius`

**Type:** String

**Description:** Border radius of highlighted region.

**Default:** `"1.8rem"`

### `opacity`

**Type:** Number

**Description:** Opacity of highlighted region.

**Default:** `1`

<!-- 
### 

**Type:** 

**Description:** 

**Default:** 
-->

## Dot Object

### `diameter`

**Type:** String

**Description:** Diameter of dot.

**Default:** `"5px"`

### `backgroundColor`

**Type:** String

**Description:** Background color of dot.

**Default:** `"rgba(0, 0, 0, 0.5)"`

### `borderColor`

**Type:** String

**Description:** Border color of dot.

**Default:** `undefined`

### `borderWidth`

**Type:** String

**Description:** Border width of dot.

**Default:** `0`

### `borderStyle`

**Type:** String

**Description:** Border style of dot.

**Default:** `"solid"`

### `borderRadius`

**Type:** String

**Description:** Border radius of dot.

**Default:** `"50%"`

### `opacity`

**Type:** Number

**Description:** Opacity of dot.

**Default:** `1`

<!-- 
### 

**Type:** 

**Description:** 

**Default:** 
-->

## Bar Object

### `height`

**Type:** String

**Description:** Height of bar.

**Default:** `"5px"`

### `backgroundColor`

**Type:** String

**Description:** Background color of bar.

**Default:** `"rgba(0, 0, 0, 0.5)"`

### `borderColor`

**Type:** String

**Description:** Border color of bar.

**Default:** `undefined`

### `borderWidth`

**Type:** String

**Description:** Border width of bar.

**Default:** `0`

### `backgroundColor`

**Type:** String

**Description:** Background color of bar.

**Default:** `undefined`

### `opacity`

**Type:** Number

**Description:** Opacity of bar.

**Default:** `1`

<!-- 
### 

**Type:** 

**Description:** 

**Default:** 
-->

## Popover Object

### `label`

**Type:** String, Function

**Description:** Text string to display in the popover content row.

**Default:** `undefined`

### `labelStyle`

**Type:** Object, Function

**Description:** Style to apply for label.

**Default:** `undefined`

### `hideIndicator`

**Type:** Boolean

**Description:** Hides the indicator symbol on the left side of the popover content row.

**Default:** `false`

### `slot`

**Type:** String

**Description:** Name of slot to use to display the popover content row.

**Default:** `undefined`

### `visibility`

**Type:** String

**Description:** Visibility of the popover when this label or slot is displayed (`"hover`, `"focus"`, `"visible"`, `"hidden"`).

**Default:** `"hover"`

### `isInteractive`

**Type:** Boolean

**Description:** Determines if the user can interract with the popover content. Logically 'OR'ed with other popovers on the same day.

**Default:** `false`

<!-- 
### 

**Type:** 

**Description:** 

**Default:** 
-->

## Content Style Object

Content style is just a style object. All normal style properties apply.


## Content Hover Style (Deprecated)

::: warning
As of *v0.8.0*, the `contentHoverStyle` property has been deprecated in favor of using a function to define the `contentStyle` property. This functions accepts an object parameter with the following properties (`isHovered`, `isFocused`, [`day`](./day-object.md)). This function should return the configured style.
:::