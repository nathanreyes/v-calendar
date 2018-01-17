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