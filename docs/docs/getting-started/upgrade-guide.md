---
title: 'Upgrade Guide'
---

# Upgrade Guide

This document outlines how to upgrade VCalendar from v2 to v3.

Some changes introduced in versions previous to `3.0.0-alpha.8` have also been rolled back. They will be noted with the following warning:

<BaseAlert title="Pre 3.0.0-alpha.8" warning />

## Dark Mode

## Deprecated Screens Mixin

The included screens mixin that supplied the `$screens` function has been removed. Responsive calendar layouts are still possible using a dedicated screen utility plugin like [vue-screen-utils](https://github.com/nathanreyes/vue-screen-utils).

[Read more](/calendar/layouts#responsive-layouts)

## Calendar

### Deprecated `from-page`, `to-page`, `from-date`, and `to-date` props

Use the `initial-page` and `initial-page-position` props to correctly set the initial months for a calendar.

[Read more](/calendar/api#props)

### Deprecated Highlight Fill Mode

The `none` option for `attribute.highlight.fillMode` has been deprecated in favor of the more descriptive `outline` option.

[Read more](/calendar/attributes#highlights)

## DatePicker

### Deprecate `modelConfig` prop

To bind to numbers or strings, use the `number` and `string` model modifiers in favor of the `modelConfig` prop. Provide the `masks.modelValue` prop if a string mask is desired.

[Read more](/datepicker/basics#model-modifiers)

### Soft-Deprecate `is-range`

Using the `is-range` prop to bind to date ranges is soft-deprecated. To bind to date ranges, use the `range` model modifier.

[Read more](/datepicker/basics#date-ranges).

### Deprecate `minute-increment` and `valid-hours` props

<BaseAlert warning title="Pre 3.0.0-alpha.8" />

The `minute-increment` and `valid-hours` props have been deprecated in favor of using the `rules` prop.

[Read more](/datepicker/time-rules)