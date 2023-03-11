---
title: Welcome
---

# VCalendar

Welcome to VCalendar, a calendar a date picker plugin for Vue.js.

Version 3.0 brings a host of feature improvements and bug fixes, including [weekly views](/calendar/layouts.html#weekly-view), a [simplified time picker](/datepicker/time-picker), [repeating date ranges](/calendar/dates.html#repeating-dates), [time rules](/datepicker/time-rules), and performance improvements.

If upgrading from version 2.0, be sure to view the [upgrade guide](/getting-started/upgrade-guide) for breaking changes.

<div class="flex space-x-4 vp-raw">
  <BaseButton url="/getting-started/installation">
    <span>Get Started</span>
    <IconArrowRight class="w-4 h-4 text-accent-500 dark:text-gray-200" />
  </BaseButton>
  <a href="/getting-started/installation"
    class="w-full sm:w-auto inline-flex justify-center items-center font-semibold space-x-2 text-sm px-4 py-2 rounded-lg text-white dark:text-white bg-accent-600 hover:bg-accent-200 dark:bg-accent-500 dark:hover:bg-accent-400"
    ><span>Get Started</span>
    <IconArrowRight class="w-4 h-4 text-accent-500 dark:text-gray-200" />
  </a>
    <a href="/getting-started/installation"
    class="w-full sm:w-auto inline-flex justify-center items-center font-semibold space-x-2 text-sm px-4 py-2 rounded-lg text-accent-800 dark:text-white bg-accent-100 hover:bg-accent-200 dark:bg-accent-500 dark:hover:bg-accent-400"
    ><span>View 2.0 Documentation</span>
    <IconArrowRight class="w-4 h-4 text-accent-500 dark:text-gray-200" />
  </a>
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