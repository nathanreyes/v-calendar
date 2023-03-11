---
title: Welcome
---

# VCalendar

Welcome to VCalendar, a calendar a date picker plugin for Vue.js.

Version 3.0 brings a host of feature improvements and bug fixes, including [weekly views](/calendar/layouts.html#weekly-view), a [simplified time picker](/datepicker/time-picker), [repeating date ranges](/calendar/dates.html#repeating-dates), [time rules](/datepicker/time-rules), and performance improvements.

If upgrading from version 2.0, be sure to view the [upgrade guide](/getting-started/upgrade-guide) for breaking changes.

<div class="flex space-x-4 not-prose">
  <BaseButton url="/getting-started/installation">
    <span>Get Started</span>
    <IconArrowRight class="w-4 h-4 text-accent-500 dark:text-gray-200" />
  </BaseButton>
  <BaseButton url="/getting-started/installation" light>
    View 2.0 Documentation
    <IconArrowRight class="w-4 h-4 text-accent-600" />
  </BaseButton>
</div>

## Theme

VCalendar provides attractive default styling based on simple colors and dark mode.

<Example centered>
  <ThemeColors show-dark-mode />
</Example>

Custom styling with class overrides and css variables are also available.

[Read more](/calendar/theme)

## Layouts

Calendars can be adapted to fit a variety of use cases, including weekly mode.

<Example centered>
  <HomeReminders />
</Example>

Calendars can also be configured for multi-row and multi-column calendar layouts.

<Example centered>
  <LayoutsResponsiveExpanded />
</Example>

[Read more](/calendar/layouts)

## Attributes