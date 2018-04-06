# v0.9.2
## Bug Fixes
### `v-calendar`
* Fixes bug where detected locale getting overwritten by 'en-US' in some cases. Closes #101.

## Improvements
### `v-calendar`
* Adds support for importing individual components along with a method to `setupCalendar`. Closes #60. Closes #105.
* Includes full `page` object with `update:frompage` and `update:topage` events. Closes #120.

# v0.9.1
## Bug Fixes
### `v-calendar`
* Removes global css
* Removes 'clever' container size detection

# v0.9.0
## Bug Fixes
### `v-calendar`
* Fixes Turkish locale identifier
* Fixes weekday formatting by using UNC dates with `Intl.DateTimeFormat`. Closes #104.
* Other small bug fixes

### `v-date-picker`
* Fixes glitch with highlight cap animation when `mode === "range"`
* Fixes bug with `themeStyles.dayContent` style getting ignored. Closes #115.

## Improvements
### `v-calendar`
* Adds `min-date` prop as a convenient alternative to `min-page`
* Adds `max-date` prop as a convenient alternative to `max-page`
* Adds `is-linked` prop to link panes to consecutive months when `is-double-paned` is set. Closes #80.
* Adds `is-vertical` prop for vertical calendar orientation when `is-double-paned` is set. Closes #89.

### `v-date-picker`
* `min-date` and `max-date` props are now forwarded to `v-calendar`. Closes #78.

### Defaults
Theme styles modifications. Closes #93.

| Style | Modification | Description |
| ----- | ------------ | ----- |
| `horizontalDivider` | Add | Horizontal divider when calendars are in vertical orientation (`is-vertical`) |
| `navHeader` | Add | Navigation pane header. |
| `navHeaderTitle` | Add | Navigation pane header title. |
| `navHeaderArrows` | Add | Navigation pane header arrows. |
| `navMonthCell` | Add | Navigation pane month cells. |
| `navYearCell` | Add | Navigation pane year cells. |
| `header` | Edited | Supports use of function that accepts a [`page`](https://docs.vcalendar.io/api#page-object) object and return a style |
| `headerTitle` | Edit | Supports use of function that accepts a [`page`](https://docs.vcalendar.io/api#page-object) object and return a style |
| `headerArrows` | Edit | Supports use of function that accepts a [`page`](https://docs.vcalendar.io/api#page-object) object and return a style |
| `headerHorizontalDivider` | Edit | Supports use of function that accepts a [`page`](https://docs.vcalendar.io/api#page-object) object and return a style |
| `weekdays` | Edit | Supports use of function that accepts a [`page`](https://docs.vcalendar.io/api#page-object) object and return a style |
| `weekdaysHorizontalDivider` | Edit | Supports use of function that accepts a [`page`](https://docs.vcalendar.io/api#page-object) object and return a style |
| `weeks` | Edit | Supports use of function that accepts a [`page`](https://docs.vcalendar.io/api#page-object) object and return a style |
| ~~`headerVerticalDivider`~~ | Remove | *Reference note below* |
| ~~`weekdaysVerticalDivider`~~ | Remove | *Reference note below* |
| ~~`weeksVerticalDivider`~~ | Remove | *Reference note below* |

* Styles removed in favor of defining functions for the `header`, `weekdays` and `weeks` styles like so...

```html
<template>
  <v-calendar :theme-styles='themeStyles'>
  </v-calendar>
</template>
```

```javascript
export default {
  data() {
    return {
      themeStyles: {
        // Use page position to set left border for the 2nd pane header
        // NOTE: You can use the `verticalDivider` style to apply a single border. Just use this technique to apply different border styles for specific sections (header, weekdays, weeks)
        header({ position }) {
          return (position === 2) && {
            borderLeft: '1px solid #dadada'
          };
        }
      }
    }
  }
}
```

# v0.8.0
## Bug Fixes
### `v-date-picker`
* Fixes `select-attribute` and `drag-attribute` props getting written over. Closes #75.

## Improvements
### `v-calendar`
* Attribute types (highlight, bar, dot, contentStyle, popover) can now be defined as functions that accept an object parameter with the following properties and return an object. Closes #81.

| Property Name | Type    | Description |
| ------------- | ------- | ----------- |
| `day` | Object | Object with specific information about the day displaying the attribute. |
| `targetDate` | Object | Date info object. |
| `isHovered` | Boolean | Day element is currently hovered over. |
| `isFocused` | Boolean | Day element is currently focused. Only applies when a popover is configured. |
| `onStart` | Boolean | Day lies on the first day of the attribute's `targetDate`. |
| `onEnd` | Boolean | Day lies on the last day of the attributes's `targetDate`. |

* The `attribute.contentHoverStyle` property has been deprecated in favor of using a function for `attribute.contentStyle`.
* The `dayContentHover` theme style has been deprecated in favor of using a function to define the `contentStyle`.
* Support use of a `formats.data` parser to parse attribute dates

### `v-date-picker`
* Add `popoverShowClearMargin` prop to apply clear margin when popover appears. Closes #47.
* Add events for `popover-will-appear`, `popover-did-appear`, `popover-will-disappear` and `popover-did-disappear`
* `show-popover` prop renamed to `show-day-popover` to avoid confusion with input popover
* `popoverContentOffset` prop converted to number instead of a string

`defaults`
* `formats.data` supported for parsing attribute dates
* `date-picker-show-popover` renamed to `date-picker-show-day-popover`
* `popover-content-offset` is converted to number instead of a string

# v0.7.5
## Bug Fixes
* Remove console.log statement. Closes #85.

# v0.7.4
## Bug Fixes
* Redress issue introduced by v0.7.3.

# v0.7.3
## Bug Fixes
* Fix scoped slot usage in `v-date-picker` render function. Closes #83.

# v0.7.2
## Bug Fixes
* Fix event collision when using render functions. Closes #82.
* Fix date formatting bug in Safari.

# v0.7.1
## Bug Fixes
* Fix setup crash when not manually specifying a locale

# v0.7.0
## Bug Fixes
`v-calendar`
* Fix animation bug when `weeks-transition` or `title-transition` is `"none"`. Closes #70.

`v-date-picker`
* Disabling dates on drag can invalidate current selected range. Closes #67.

## Improvements
`v-calendar`
* Uses Javascript's `Intl.DateTimeFormat` API to supply month and day names for to 35 languages with minimal bundle size.
* Transitioned top level calendar component to render function for improved slot support.
* Supports a new `formats` prop object where you can specify custom formats for title, weekdays and navigation months.
* Deprecate `month-labels` and `weekday-labels` props in favor of using `formats` prop.
* Improved handling of svg icons for smaller bundle size.

`v-date-picker`
* Transitioned all date picker components to render functions. This allows using all slots that `v-calendar` supports. Closes #49.
* Supports a new `formats` prop object where you can specify custom formats for input element and date selection popovers.
* Deprecate `dateFormatter` and `dateParser` props in favor of using `formats` prop.

# v0.6.3
## Bug Fixes
Use svg icons for left and right year group arrows in navigation pane. Closes #69.

# v0.6.2
## Bug Fixes
`v-calendar`
Fix bug when using `max-page` with single-paned calendars. Closes #64.

`v-date-picker`
Force delay when navigating pages to prevent display of empty calendars. Closes #52.
Fix bug when using supplying default `dateFormatter` and `dateParser`. Closes #62.
Fix bug resulting in date selections getting ignored. Closes #66.

## Improvements
Replace icon fonts with svg icons. Closes #59.

# v0.6.1
## Bug Fixes
`v-date-picker`
* Prevent bug causing infinite update cycle loop and locking the browser when using `disabled-dates`. Closes #61.

## Improvements
`v-calendar`
* Improve efficiency of date intersection detection logic.

# v0.6.0
## Bug Fixes
`v-date-picker`
* Bug: `fromPage` and `toPage` not updating when new date was assigned or selected.
  Fix: `fromPage` and `toPage` are updated when new value is assigned, if needed. Closes #51.
* Bug: When clearing out input element, infinite start and end dates selected.
  Fix: When clearing out input element, date is cleared or reverts to previous value, depending on `is-required` prop or if dragging in `"range"` mode. Closes #54.

## Improvements
* Add Finnish translation to locales
`v-calendar`
### Slots
* Rename `popover-header` slot name to `day-popover-header` to more clearly identify slot target
* Add `day-popover-footer` slot for day popover footers
* `day-popover-header`, `day-popover-footer` and custom popover slots accept `day` prop instead of `day-info` prop
### Events
* Rename `dayselect` calendar event to `dayclick` to more clearly indicate DOM event source
* Modify parameter structure for day events (`dayclick`, `daymouseenter`, `daymouseover`, `daymouseleave`). Instead of passing multiple parameters in order (and having to remember the right order), there is now a single object parameter with the following properties.

  | Property | Type | Description |
  | -------- | ---- | ----------- |
  | `day` | Number | Day number (1 - 31). |
  | `dayFromEnd` | Number | Day number from the end of the month (1 - 31). |
  | `weekday` | Number | Day weekday number (1:Sun - 7:Sat). |
  | `weekdayOrdinal` | Number | Weekday ordinal position from the start of the month (1 - 6). |
  | `weekdayOrdinalFromEnd` | Number | Weekday ordinal position from the end of the month (1 - 6). |
  | `week` | Number | Week number form the start of the month (1 - 6). |
  | `weekFromEnd` | Number | Week number from the end of the month (1 - 6). |
  | `month` | Number | Month number (1 - 12). |
  | `year` | Number | Year number. |
  | `date` | Date | Date for this day. |
  | `dateTime` | Number | Result of calling `date.getTime()` for this day. |
  | `inMonth` | Boolean | Day lies in the currently active month. |
  | `inPrevMonth` | Boolean | Day lies in the month before the currently active month. |
  | `inNextMonth` | Boolean | Day lies in the month after the currently active month. |
  | `attributes` | Array | List of attributes for the day involved with the event. |
  | `attributesMap` | Object | Object map of the attributes using their designated key. |
  | `event` | Object | Original trigger event. |

`v-date-picker`
### Props
* Add `is-required` prop to `v-date-picker` to prevent null date selections. Closes #45.
* Replace input related props (`input...`) with `input-props` object as a catch all for all props to apply to input element.
* Replace `select-color` and `drag-color` props with `tint-color`. Opacity is set to `0.5` when `tint-color` is applied to `drag-attribute`.
* Add `disabled-attribute` prop.
### Defaults
* Replace input related defaults (`datePickerInput...`) with `input-props` as a configurable default function or object.
  
# v0.5.5
## Bug Fixes
* Fix miscalculation of day numbers for previous months when `firstDayOfWeek !== 1`. Closes #44.

# v0.5.4
## Bug Fixes
* Pass missing `page` attribute to `header-title` slot
* Fade input text when dragging date ranges in `v-date-picker`

## Improvements
* Add `pane-width` prop to `v-calendar` for setting pane width manually
* Add `pane-width` as a configurable default setting
* Add `shortMonthLabel` and `shortYearLabel` properties to `page` objects
* Disable pointer events for day cells not in month if `opacity: 0` in `theme-styles.dayCellNotInMonth` style

# v0.5.3
## Bug Fixes
* Detect date range intersections with `disabled-dates`. Closes #12.

## Improvements
* Added `componentPrefix` constructor option when using plugin. Closes #37.
* Redesigned popover for selected and dragged regions in `v-date-picker`.
* Input elements in `v-date-packer` no longer require `readonly` attribute when using date patterns with `disabled-dates` or `available-dates`.
* Popovers for selected and dragged regions can be hidden via `show-popover` prop in `v-date-picker`.
* Use custom component for popover attributes via the `component` property.
* Testing framework moved to Jest. Added tests for detecting date collisions.
* Update README for more clear introduction guide.

# v0.5.2
## Bug Fixes
* Fix bug for wrong/missing parameters passed on day events. Closes #33.

## Improvements
* Allow for custom cap styling for highlight and content style attributes.
* Add `show-caps` prop for date pickers
* Add Swedish translation.

# v0.5.1
## Bug Fixes
* Fix layout bugs in navigation popover

## Improvements
* Reorganize css variables. Improve default styling.

# v0.5.0
## Bug Fixes
* Day content more vertically centered with `line-height: 1`
* Strip unused component props

## Improvements
* Support day popovers for attributes (custom slots supported). Closes #13.
* Support `dayPopoverContent` theme style
* Support multiple visibility options for navigation header ('hover', 'focus', 'visible', 'hidden')
* Simplified popover visibility state transitions
* Support `span` (day length) in place of `end` date for date ranges
* Add `targetDate` property to attributes passed in event handlers
* Extract touch handlers to separate state functions
* Require Vue v2.5.0+

# v0.4.3
* Fix bug for duplicated weekday label keys. Closes #28.

# v0.4.2
* Convert event names to all lowercase to support in-DOM templates. Closes #26.

# v0.4.1
* Use local nextTick reference, deleting Vue scope dependency.
* Fix null attribute bug in date picker.

# v0.4.0
* Fix weekday labels not always having same exact width
* Add support for complex attribute dates. Closes #7 and #12.
* Add support for attribute `excludeDates`, date picker `availableDates`. Closes #19.
* Add support for endless date ranges using null for start/end dates. Closes #20.
* Add support for attaching custom data to attributes via `customData` property. Closes #21.
* Add Turkish locale.

# v0.3.3
* Fix duplicate input event for inline date picker

# v0.3.2
* Fix styling bug introduced by v0.3.1.

# v0.3.1
* Fix bug with duplicate events being fired. Closes #15.
* Fix application of styling for date pickers when not inline. Closes #17.

# v0.3.0
* Add support for accepting various defaults when calling Vue.use(VCalendar, { ...defaults... })
* Set default calendar pages to best show date picker values
* Fix issue where inline date picker would not respond to is-expanded. Fixes #8.
* Dismiss popovers on navigation month select and date selection. Fixes #9.
* Fix issue where popover content not properly layered. Fixes #10.
* Add locale detection and support user-supplied locales for month/weekday labels. Fixes #11.

# v0.2.2
* Fix bug where is-expanded prop not working for calendar component

# v0.2.1
* Fix layout bug with navigation panel in Firefox

# v0.2.0
* Simplify header title layout
* Add navigation panel popover with indicators
* Add passive event modifiers for touch events
* Add 'go to today' with header title click
* Add 'hover' as visibility option for popovers
* Redesign popovers to display caret arrows
* Move DateInfo class into separate file
* Fix date logic for range intersections

# v0.1.1
* Add documentation for custom theming
* Restructure docs component hierarchy
* Remove lib files from git tracking
* Fix layout bug in calendar pane
* Fix event forwarding for date picker

# v0.1.0
* Add navigation pickers in calendar headers

# v0.0.9
* Add support for more flexible month/year navigation
* Fix popover visibility bug
* Fix styling bug in date example

# v0.0.8
* Add support for installing via CDN
* Add licensing and copyright to README
* Fix vertically centering header title
* Fix styling bug with date picker
* Fix setup instructions

# v0.0.7
* Add 'theme-styles' prop to calendar for theming
* Remove a number of '...-style' replaced by theme-styles object
* Renamed 'select-mode' prop to 'mode' for datepicker

# v0.0.6
* Fix README

# v0.0.5

* Add tap to dismiss popover
* Add tint color (with blending) for easy date picker styling
* Add support for custom title position (left, center, right)

# v0.0.4

* Fix lib subfolder not published
* Add license declaration
* Add CHANGELOG file