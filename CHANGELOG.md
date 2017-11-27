## 0.3.1
* Fix application of styling for date pickers when not inline. Closes #17.

## 0.3.0
* Add support for accepting various defaults when calling Vue.use(VCalendar, { ...defaults... })
* Set default calendar pages to best show date picker values
* Fix issue where inline date picker would not respond to is-expanded. Fixes #8.
* Dismiss popovers on navigation month select and date selection. Fixes #9.
* Fix issue where popover content not properly layered. Fixes #10.
* Add locale detection and support user-supplied locales for month/weekday labels. Fixes #11.

## 0.2.2
* Fix bug where is-expanded prop not working for calendar component

## 0.2.1
* Fix layout bug with navigation panel in Firefox

## 0.2.0
* Simplify header title layout
* Add navigation panel popover with indicators
* Add passive event modifiers for touch events
* Add 'go to today' with header title click
* Add 'hover' as visibility option for popovers
* Redesign popovers to display caret arrows
* Move DateInfo class into separate file
* Fix date logic for range intersections

## 0.1.1
* Add documentation for custom theming
* Restructure docs component hierarchy
* Remove lib files from git tracking
* Fix layout bug in calendar pane
* Fix event forwarding for date picker

## 0.1.0
* Add navigation pickers in calendar headers

## 0.0.9
* Add support for more flexible month/year navigation
* Fix popover visibility bug
* Fix styling bug in date example

## 0.0.8
* Add support for installing via CDN
* Add licensing and copyright to README
* Fix vertically centering header title
* Fix styling bug with date picker
* Fix setup instructions

## 0.0.7
* Add 'theme-styles' prop to calendar for theming
* Remove a number of '...-style' replaced by theme-styles object
* Renamed 'select-mode' prop to 'mode' for datepicker

## 0.0.6
* Fix README

## 0.0.5

* Add tap to dismiss popover
* Add tint color (with blending) for easy date picker styling
* Add support for custom title position (left, center, right)

## 0.0.4

* Fix lib subfolder not published
* Add license declaration
* Add CHANGELOG file