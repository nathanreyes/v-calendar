---
title: Attribute
sidebarDepth: 2
---

## Properties

### `key`

**Type:** String

**Description:** Keys uniquely identify an attribute and may determine how animations are applied.

**Default:** `index`

### `dates`

**Type:** Date, Object, Array[Date, Object]

**Description:** Date or date range objects (patterns supported) to include for the attribute.

**Default:** `undefined`

### `excludeDates`

**Type:** Date, Object, Array[Date, Object]

**Description:** Date or date range objects (patterns supported) to exclude. All other dates are included.

**Default:** `undefined`

### `customData`

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

### `highlight`

**Type:** Boolean, String, Object

**Description:** Configuration of higlight. If boolean, displays the highlight using the current color. If string, displays the highlight using the specified color. If object, uses the properties below.

**Default:** `undefined`

### `highlight.color`

**Type:** String

**Description:** Color.

**Default:** `undefined`

### `highlight.fillMode`

**Type:** String

**Description:** Color fill option (`solid`, `light`, `outline`)

:::warning
The `none` option for `fillMode` is still available but will be deprecated in the next major release in favor of the more descriptive `outline` option.
:::

**Default:** `solid`

### `highlight.class`

**Type:** String

**Description:** Class to apply to the highlight background element. |

**Default:** `''`

### `highlight.style`

**Type:** Object

**Description:** Style to apply to the highlight background element. |

**Default:** `undefined`

### `highlight.contentClass`

**Type:** String

**Description:** Class to apply to the highlight content element.

**Default:** `''`

### `highlight.style`

**Type:** Object

**Description:** Style to apply to the highlight content element. |

**Default:** `undefined`

### `highlight.contentStyle`

**Type:** Object

**Description:** Style to apply to the highlight content element. |

**Default:** `undefined`

### `dot`

**Type:** Boolean, String, Object

**Description:** Configuration of dot. If boolean, displays the dot using the current color. If string, displays the dot using the specified color. If object, uses the properties below.

**Default:** `undefined`

### `dot.color`

**Type:** String

**Description:** Color.

**Default:** `undefined`

### `dot.class`

**Type:** String

**Description:** Class to apply to the dot element.

**Default:** `undefined`

### `dot.style`

**Type:** Object

**Description:** Style to apply to the dot element.

**Default:** `undefined`

### `bar`

**Type:** Boolean, String, Object

**Description:** Configuration of bar. If boolean, displays the bar using the current color. If string, displays the bar using the specified color. If object, uses the properties below.

**Default:** `undefined`

### `bar.color`

**Type:** String

**Description:** Color.

**Default:** `undefined`

### `bar.class`

**Type:** String

**Description:** Class to apply to the bar element.

**Default:** `undefined`

### `bar.style`

**Type:** Object

**Description:** Style to apply to the bar element.

**Default:** `undefined`

### `popover`

**Type:** Object

### `popover.label`

**Type:** String

**Description:** Text string to display in the popover content row.

**Default:** `undefined`

### `popover.labelClass`

**Type:** String

**Description:** Class to apply to the label.

**Default:** `undefined`

### `popover.labelStyle`

**Type:** Object

**Description:** Style to apply to the label.

**Default:** `undefined`

### `popover.hideDelay`

*Introduced in `v2.1.0`*

**Type:** Number

**Description:** Number of milliseconds to delay the popover when hiding. After this delay, the popover transition will start if `popover.transition` is not `none` or ``.

**Default:** 110

### `popover.hideIndicator`

**Type:** Boolean

**Description:** Hides the indicator symbol on the left side of the popover content row.

**Default:** `false`

### `popover.isInteractive`

**Type:** Boolean

**Description:** Determines if the user can interract with the popover content. Logically 'OR'ed with other popovers on the same day.

**Default:** `false`

### `popover.modifiers`

**Type:** Array

**Description:** Modifiers used to modify the behavior of [`popper.js`](https://popper.js.org/docs/v2/modifiers/).

**Default:** `undefined`

### `popover.placement`

**Type:** String

**Description:** Default or suggested placement of the popover. This may change as the browser window dimensions change. Valid placements include `auto`, `top`, `right`, `bottom`, `left`. Each placement can have suffixed variations `-start` or `-end`.

**Default:** `bottom-start`

### `popover.positionFixed`

**Type:** Boolean

**Description:** Uses a `fixed` position when displaying the popover. Use this open when the calendar is placed within a container that has `overflow: hidden` style applied. Reference popper.js for more details.

**Default:** `false`

### `popover.showDelay`

*Introduced in `v2.1.0`*

**Type:** Number

**Description:** Number of milliseconds to delay the popover when showing. After this delay, the popover transition will start if `popover.transition` is not `none` or ``.

**Default:** 0

### `popover.transition`

*Introduced in `v2.1.0`*

**Type:** String

**Description:** Transition to use when displaying the popover (`slide-fade`, `fade`, `none` or ``).

**Default:** `slide-fade`

### `popover.visibility`

**Type:** String

**Description:** Visibility of the popover when this label or slot is displayed (`hover-focus`, `hover`, `focus`, `click`, `visible`, `hidden`).

**Default:** `"hover"`

<!-- 
### 

**Type:** 

**Description:** 

**Default:** 
-->