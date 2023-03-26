## 3.0.0-alpha.7

### Bug Fixes

* Fix defaults when using plugin
* Fix `iso` mask
* Fix broken navigation state when using `max-date`
* Fix double arrows appearing in time picker when using Tailwind reset styles

### Improvements

* Add `valid-hours` prop for time picker

## 3.0.0-alpha.8

### Bug Fixes

* Fix `valid-hours` and `minute-increment` props for input slot usage
* Fix bug where date picker would reset `null` dates

### Improvements

* Allow separate `valid-hours` and `minute-increment` for range dates

## 3.0.0

### Calendar

* Add `view` prop to display weekly calendars
* Add `initial-page` and `initial-page-position` props
* Deprecate `from-page`, `from-date`, `to-page`, `to-date` props in lieu of `initial-page`
* Add `moveBy` method to move by number of pages
* Emit native `event` as 2nd argument for day and week events (`dayclick`, `daymouseenter`, `daymouseleave`, `dayfocusin`, `dayfocusout`, `daykeydown`, `weeknumberclick`)
* Rename `SetupCalendar` export to `setupCalendar`

### Date Picker

* Add `rules` prop for limiting `hours`, `minutes`, `seconds` and `milliseconds`
* Deprecate `valid-hours` and `minute-increment` props in lieu of `rules`
* Deprecate `modelConfig` prop in lieu of `number` and `string` model modifiers
* Soft deprecate `is-range` prop in lieu of `range` model modifier
* Add `time-accuracy` prop to allow selecting seconds and milliseconds components in time picker
* Major redesign of `TimePicker` to fit more time component selections
* Deprecate `update-layout` slot prop as it is no longer needed

## 3.0.1

### Calendar

* Add missing `type=button` attribute to navigation buttons

## 3.0.2

### Bug Fixes

* Include `attributes` within day event objects
* Fix date normalization bug when clearing input fields
* Fix `day-content` slot
