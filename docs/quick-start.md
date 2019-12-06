---
title: 'Quick Start'
sidebarDepth: 1
pageClass: quick-start
---

<homepage-banner/>

# V-Calendar

V-Calendar is a modern and flexible plugin for displaying simple, attributed calendars in Vue.js. It uses attributes to decorate the calendar with various visual indicators including highlighted date regions, dots, bars, content classes and even popovers for simple tooltips or custom slot content.

<guide-attributes-intro/>

Any of these indicators can be displayed for single dates, date ranges and even complex date patterns like the following:
* Every other Friday
* 15th of every month
* Last Friday of every other month.

A date picker is included out of the box with single date, multiple date and date range selection modes. Also, because `v-date-picker` is simply a wrapper for `v-calendar`, it supports the same props, slots and custom custom theme support,

And of course, V-Calendar is responsive and mobile friendly.

#### Calendar

`v-calendar` is the core component. By default, it has a neutral design that should blend nicely within any web application, with various layout configuration options: 
  * Responsive multi-row and multi-column layouts
  * Slot support for custom header and day content
  * Semantic-inspired navigation popover
  * Navigation transitions (horizontal slide, vertical slide, fade)

<guide-readme-cal-basic />

```html
<v-calendar />
```