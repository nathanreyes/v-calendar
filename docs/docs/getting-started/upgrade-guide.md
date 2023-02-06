---
title: 'Upgrade Guide'
---

# Upgrade Guide

This document outlines how to upgrade VCalendar from v2 to v3.

Some changes introduced in versions previous to `3.0.0-alpha.9` have also been rolled back. They will be noted with the following warning:

<BaseAlert title="Pre 3.0.0-alpha.9" warning />

## Deprecated Screens Mixin

The included screens mixin that supplied the `$screens` function has been removed. Responsive calendar layouts are still possible using a dedicated screen utility plugin like [vue-screen-utils](https://github.com/nathanreyes/vue-screen-utils).

[Read more](/calendar/layouts#responsive-layouts)

## Calendar

### Replace `from-page`, `to-page`, `from-date`, and `to-date` props

Use the `initial-page` and `initial-page-position` props to correctly set the initial months for a calendar.

[Read more](/calendar/api#props)

### Replace `is-expanded` prop

The `expanded` prop should now be used in lieu of `is-expanded` to set full-width calendars.

### Replace Highlight Fill Mode

The `none` option for `attribute.highlight.fillMode` has been deprecated in favor of the more descriptive `outline` option.

[Read more](/calendar/attributes#highlights)

### Repeating dates config

When using repeating dates with date expressions, repeat rules must now be nested within a `repeat` object. This change was made to support repeating date ranges, which was not possible in v2.

Also, the separate repeat interval keys (`dailyInterval`, `weeklyInterval`, `monthlyInterval`, `yearlyInterval`) have been deprecated in favor of the `every` key.

```vue{13-16}
<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: true,
    dates: {
      start: new Date(2022, 10, 7),
      repeat: {
        every: [2, 'weeks'],
        weekdays: 2,
      },
    },
  },
]);
</script>
```

[Read more](/calendar/dates#repeating-dates)

### Added `moveBy`

Any direct calls of the `move` function on the calendar to move forward and back by *n* number of months should now use `moveBy`.

[Read more](/calendar/navigation#move-by-number-of-pages)

## DatePicker

### Deprecate `modelConfig` prop

Use the `number` and `string` model modifiers in favor of the `modelConfig` prop. Provide the `masks.modelValue` prop if a string mask is needed.

[Read more](/datepicker/basics#model-modifiers)

### Soft-Deprecate `is-range`

Using the `is-range` prop to bind to date ranges is soft-deprecated. To bind to date ranges, use the `range` model modifier.

[Read more](/datepicker/basics#date-ranges).

### Deprecate `minute-increment` and `valid-hours` props

<BaseAlert warning title="Pre 3.0.0-alpha.9" />

The `minute-increment` and `valid-hours` props have been deprecated in favor of using the `rules` prop.

[Read more](/datepicker/time-rules)