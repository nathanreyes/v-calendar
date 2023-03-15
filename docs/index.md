---
title: Welcome
---

# VCalendar

Welcome to VCalendar, a calendar a date picker plugin for Vue.js.

Version 3 brings a host of feature improvements and bug fixes, including [weekly views](/calendar/layouts.html#weekly-view), a [simplified time picker](/datepicker/time-picker), [repeating date ranges](/calendar/dates.html#repeating-dates), [time rules](/datepicker/time-rules), and performance improvements.

If upgrading from version 2.0, be sure to view the [upgrade guide](/getting-started/upgrade-guide) for breaking changes.

<div class="flex space-x-4 not-prose">
  <BaseButton url="/getting-started/installation">
    <span>Get Started</span>
    <IconArrowRight class="w-4 h-4 text-accent-500 dark:text-gray-200" />
  </BaseButton>
  <BaseButton url="https://v2.vcalendar.io" light>
    View 2.0 Documentation
    <IconArrowRight class="w-4 h-4 text-accent-600" />
  </BaseButton>
</div>

## Theme

VCalendar provides attractive default styling based on simple colors and dark mode.

<Example centered no-code>
  <ThemeColors show-dark-mode />
</Example>

Custom styling with class overrides and css variables are also available.

[Read more](/calendar/theme)

## Layouts

Calendars may be configured to adapt for multiple layouts. For example, weekly calendars can be used in constrained environments.

<Example centered no-code>
  <HomeReminders />
</Example>

Also, calendars can also be configured for multi-row and multi-column layouts.

<Example centered no-code>
  <LayoutsResponsiveExpanded />
</Example>

[Read more](/calendar/layouts)

## Attributes

Decorate calendars with attributes on specified dates or date ranges. They can even be displayed for repeating date patterns.

<Example centered no-code>
  <AttributesIntro />
</Example>

[Read more](/calendar/attributes)

## Date Picker

`VDatePicker` is a feature-rich date picker component implemented as a wrapper for `VCalendar`, which can easily bind to a variety of date formats.

<Example centered no-code>
  <DateWithValue mode="date" />
</Example>

[Read more](/datepicker/basics)

Even date ranges are supported

<Example centered>
  <ModelModifierRange />
</Example>

[Read more](/datepicker/basics#date-ranges)

Time selection is also supported with configurable hour, minute, second and millisecond accuracy.

<Example centered no-code>
  <DateWithValue mode="dateTime" is24hr />
</Example>

[Read more](/datepicker/time-picker)

Flexible rules can also be easily configured to dynamically limit time selection, like afternoon hours and 5-minute increments.

<Example centered no-code>
  <DateRulesObject />
</Example>

[Read more](/datepicker/time-rules)
