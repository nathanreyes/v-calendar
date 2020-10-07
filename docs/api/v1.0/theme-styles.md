---
title: 'Theme Styles'
sidebarDepth: 2
pageClass: docs-page
---

## `wrapper`

**Target Area:**  
Wrapper for both single and double-paned calendars.

**Default:**  
```js
{
  backgroundColor: '#fafafa',
  border: '1px solid #dadada'
}
```


## `verticalDivider`

**Target Area:**  
Vertical divider that appears between calendar panes.

**Default:**  
```js
{
  borderLeft: '1px solid #dadada'
}
```


## `horizontalDivider`

**Target Area:**  
Horizontal divider that appears between calendar panes.

**Default:**  
```js
{
  borderTop: '1px solid #dadada'
}
```


## `header`

**Target Area:**  
Header section that encapsulates arrows and title. <sup>[[1]](#themes-note-1)</sup>

**Default:**   
`null`


## `headerTitle`

**Target Area:**  
Header title. <sup>[[1]](#themes-note-1)</sup>

**Default:**  
`null`


## `headerArrows`
**Target Area:**  
Header arrows that can be styled just like a font. <sup>[[1]](#themes-note-1)</sup>

**Default:**  
`null`


## `headerHorizontalDivider`

**Target Area:**  
Horizontal divider that appears just below header section.

**Default:**  
`null`


## `weekdays`

**Target Area:**  
Weekday section that encapsulates all the weekday labels. <sup>[[1]](#themes-note-1)</sup>

**Default:**  
`null`


## `weekdaysHorizontalDivider`

**Target Area:**  
Horizontal divider that appears just below weekdays section.

**Default:**  
`null`


## `weeks`

**Target Area:**  
Weeks section that encapsulate all the days of the month. <sup>[[1]](#themes-note-1)</sup>

**Default:**  
`null`


## `dayCell`

**Target Area:**  
Day cell that contains day content and any associated attributes.

**Default:**  
`null`


## `dayContent`

**Target Area:**  
Content area within the day cell that contains the day of the month number. <sup>[[2]](#themes-note-2)</sup>

**Default:**  
`null`


## `dayPopoverContent`

**Target Area:**  
Popover container for attribute popover labels and slot content.

**Default:**  
```javascript
{
  color: '#333333',
  fontSize: '.8rem',
  whiteSpace: 'nowrap'
}
```


## `dots`

**Target Area:**  
Container for dot indicators.

**Default:**  
`null`


## `bars`

**Target Area:**  
Container for bar indicators.

**Default:**  
`null`


## `navHeader`

**Target Area:**  
Navigation pane header.

**Default:**  
`null`

## `navHeaderArrows`

**Target Area:**  
Navigation header arrows.

**Default:**  
`null`

## `navHeaderTitle`

**Target Area:**  
Navigation header title.

**Default:**  
`null`


## `navMonthCell`

**Target Area:**  
Navigation month cells. <sup>[[3]](#themes-note-3)</sup>

**Default:**  
`null`


## `navYearCell`

**Target Area:**  
Navigation year cells. <sup>[[3]](#themes-note-3)</sup>

**Default:**  
`null`
  
  
<!--
## 

**Target Area:**  


**Default:**  
-->

::: tip <a id='themes-note-1'>[1]</a>
As of v0.9.0, you can use functions to define the `header`, `headerTitle`, `headerArrows`, `weekdays` and `weeks` styles. Functions should accept a [`page`](./page-object.md) object and return a configured style.
:::

::: tip <a id='themes-note-2'>[2]</a>
As of v0.8.0, the `dayContentHover` style has been deprecated and you can optionally use a function to define the `dayContent` style. This function should accept an object parameter with the following properties (`isHovered`, `isFocused`, [`day`](./day-object.md)). This function should return the configured style.
:::

::: tip <a id='themes-note-3'>[3]</a>
As of v0.9.0, you can use functions to define the `navMonthCell` and `navYearCell` styles. Functions should accept a [`nav-month-item`](#nav-month-item-properties) object and [`nav-year-item`](#nav-year-item-properties) object, respectively.

#### `nav-month-item` Properties
| Name | Type | Description |
| ---- | ---- | ----------- |
| `month` | Number | Month number of the cell. |
| `label` | String | Formatted month label per the [`masks`](#calendar-props) prop. |
| `is-active` | Boolean | Month is selected, or active. |
| `is-disabled` | Boolean | Month is disabled (ie. not selectable). |

#### `nav-year-item` Properties
| Name | Type | Description |
| ---- | ---- | ----------- |
| `year` | Number | Year number of the cell. |
| `is-active` | Boolean | Year is selected, or active. |
| `is-disabled` | Boolean | Year is disabled (ie. not selectable). |
:::