---
title: 'Upgrade Guide'
---

# Upgrade Guide

This document outlines how to upgrade V-Calendar from v2 to v3.

## New Component Prefix

The default component prefix of `v` has been removed when using [plugin](./installation#method-2-register-app-plugin) mode.

```html
<!-- Old -->
<v-calendar />
<v-date-picker />

<!-- New  -->
<Calendar />
<DatePicker />
```

## Dark Mode Updates

## Deprecated Screens Mixin

The included screens mixin that supplied the `$screens` function has been removed. Read more about how to achive [responsive calendar layouts](../calendar/layouts#responsive-layouts) using a [dedicated screen utility plugin](https://github.com/nathanreyes/vue-screen-utils).

## Deprecated Calendar Props

### `from-page`, `to-page`, `from-date`, and `to-date`

Use the `initial-page` and `initial-page-position` props to correctly initial the starting month for a calendar or date picker.

## Deprecated Highlight Fill Mode

The `none` option for `fillMode` has been deprecated in favor of the more descriptive `outline` option.