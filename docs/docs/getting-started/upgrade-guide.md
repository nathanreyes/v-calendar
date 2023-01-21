---
title: 'Upgrade Guide'
---

# Upgrade Guide

This document outlines how to upgrade VCalendar from v2 to v3.

Some changes introduced in versions previous to `3.0.0-alpha.8` have also been rolled back. They will be noted with the following warning:

<BaseAlert title="Pre 3.0.0-alpha.8" warning />

## New Component Prefix

The default component prefix of `v` has been removed when using [plugin](./installation#method-2-register-app-plugin) mode.

```html
<!-- Old -->
<v-calendar />
<v-date-picker />

<!-- New  -->
<VCalendar />
<VDatePicker />
```

## Dark Mode Updates

## Deprecated Screens Mixin

The included screens mixin that supplied the `$screens` function has been removed. Read more about how to achive [responsive calendar layouts](../calendar/layouts#responsive-layouts) using a [dedicated screen utility plugin](https://github.com/nathanreyes/vue-screen-utils).

## Calendar

### Deprecated `from-page`, `to-page`, `from-date`, and `to-date` props

Use the `initial-page` and `initial-page-position` props to correctly set the current months for a calendar.

### Deprecated Highlight Fill Mode

The `none` option for `attribute.highlight.fillMode` has been deprecated in favor of the more descriptive `outline` option.

## DatePicker

### Deprecate `modelConfig` prop

To bind to numbers or strings, use the `number` and `string` model modifiers in favor of the `modelConfig` prop. Provide the `masks.modelValue` prop if a string mask is desired.

[Click here](../datepicker/basics#string-dates) for more details.

### Soft-Deprecate `is-range`

To bind to date ranges, use the `range` model modifier. More details [here](../datepicker/basics#date-range).

### Deprecate `minute-increment` and `valid-hours` props

<BaseAlert warning title="Pre 3.0.0-alpha.8" />

The `minute-increment` and `valid-hours` props have been deprecated in favor of using the `rules` prop.

[Click here](../datepicker/time-rules) for more details.