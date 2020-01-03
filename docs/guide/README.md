---
title: 'V-Calendar'
sidebarDepth: 2
---

# V-Calendar

V-Calendar is a modern and flexible plugin for displaying simple, attributed calendars in Vue.js. It uses attributes to decorate the calendar with various visual indicators including highlighted date regions, dots, bars, content classes and even popovers for simple tooltips or custom slot content.

<guide-attributes-intro/>

Any of these indicators can be displayed for single dates, date ranges and even complex date patterns like the following:
* Every other Friday
* 15th of every month
* Last Friday of every other month.

A date picker is included out of the box with single date, multiple date and date range selection modes. Also, because `v-date-picker` is simply a wrapper for `v-calendar`, it supports the same props, slots and custom custom theme support,

And of course, V-Calendar is responsive and mobile friendly.

## Component

`v-calendar` is the core component. By default, it has a neutral design that should blend nicely within any web application, with various layout configuration options: 
  * Responsive multi-row and multi-column layouts
  * Slot support for custom header and day content
  * Semantic-inspired navigation popover
  * Navigation transitions (horizontal slide, vertical slide, fade)

<guide-readme-cal-basic />

```html
<v-calendar />
```

### Colors & Dark Mode

You can apply a theme color or dark mode by using the `color` and `is-dark` props.

:::tip
The following colors are provided out of the box: **gray**, **red**, **orange**, **yellow**, **green**, **teal**, **blue**, **indigo**, **purple**, **pink**.
:::

<guide-readme-cal-configure />

<div class="example is-dark">
  <v-date-picker
    mode="range"
    :value="null"
    color="red"
    is-dark
    is-inline
    />
</div>

```html
<v-date-picker
  mode="range"
  :value="null"
  color="red"
  is-dark
  is-inline
  />
```

## Layouts

### Full Width

To expand the component to the full width of its container, set the `is-expanded` prop.

<guide-readme-cal-expanded />

```html
<v-calendar is-expanded />
```

### Title Positioning

To make the title header left or right aligned, use the `title-position` prop.

#### Left Aligned

<guide-readme-cal-title-position title-position="left" />

```html
<v-calendar title-position="left" />
```

#### Right Aligned

<guide-readme-cal-title-position title-position="right" />

```html
<v-calendar title-position="right" />
```

### Multiple Rows & Columns

Use the `rows` and `columns` props to create multi-row and multi-column static layouts.

<guide-readme-cal-rows-columns />

```html
<v-calendar :rows="2" />
```

### Responsive Layouts

V-Calendar allows you build responsive designs for multiple screen sizes.

The basic approach can be described in two steps:

1. Specify a few screen sizes to monitor by providing a set of breakpoints (`sm`, `md`, `lg` and `xl`). [The screen size names and dimensions are configurable](#screen-sizes).

2. Call the `$screens` function to assign props or create computed properties based on the current screen size. This function automatically re-evaluates behind the scenes any time the window crosses a breakpoint border.

V-Calendar takes a mobile-first approach, where each screen represents a minimum viewport width. Any values you assign at smaller screen sizes are also applied to larger sizes, unless explicity overridden.

For example, suppose we wish to display a single column on mobile. Then, at the large size, we wish to expand the calendar to two columns.

<guide-readme-cal-responsive />

```html
<v-calendar :columns="$screens({ default: 1, lg: 2 })" />
```

When calling the `$screens` function to target multiple screens, pass an object to specify the screen-to-value relationships with target screen sizes as the key. Use the `default` key to target the default mobile layout.

Alternatively, we can pass the default value as a second parameter to the `$screens` function.

```html
<!--Same as before, just passing default value as second parameter-->
<v-calendar :columns="$screens({ lg: 2 }, 1)" />
```

Let's add to the previous example so that a new row is added for large screens. Also, we would also like to expand the pane width to fill its container on mobile when only one column and row is displayed.

<guide-readme-cal-responsive-expanded />

```html
<v-calendar
  :columns="$screens({ default: 1, lg: 2 })"
  :rows="$screens({ default: 1, lg: 2 })"
  :is-expanded="$screens({ default: true, lg: false })"
  />
```

We could rework the previous example to make it a bit more intuitive by creating a comprehensive `layout` computed property that just calls the `$screens` function once.

```html
<v-calendar
  :columns="layout.columns"
  :rows="layout.rows"
  :is-expanded="layout.isExpanded"
  />
```

```js
export default {
  computed: {
    layout() {
      return this.$screens(
        {
          // Default layout for mobile
          default: {
            columns: 1,
            rows: 1,
            isExpanded: true,
          },
          // Override for large screens
          lg: {
            columns: 2,
            rows: 2,
            isExpanded: false,
          },
        },
      );
    }
  }
}
```

:::tip
The `$screens` function is included as a lightweight mixin for all components when using V-Calendar. You can use it to make any of your props or computed properties responsive in any of your own components.
:::

### Screen Sizes

There are 4 screen sizes provided by default:
```js
{
  "sm": "640px",  // (min-width: 640px)
  "md": "768px",  // (min-width: 768px)
  "lg": "1024px", // (min-width: 1024px)
  "xl": "1280px"  // (min-width: 1280px)
}
```

You may use any number of custom named screens. Just pass the your own custom `screens` object as part of the defaults when using VCalendar.

```js
import VCalendar from 'v-calendar';

Vue.use(VCalendar, {
  // ...some defaults
  screens: {
    tablet: '576px',
    laptop: '992px',
    desktop: '1200px',
  },
  // ...other defaults
})
```

Then, reference your custom screens when calling the `$screens` function.

```html
<v-calendar
  :columns="$screens({ default: 1, laptop: 2 })"
  />
```

---

## Working With Dates

Understanding how to configure date expressions is a critical part to using VCalendar. Specifically, they are used for the following purposes:

- Determining where and how attributes are displayed
- Disabling date selection by the user
- Setting the selected date(s) for `v-date-picker`

In this guide, a **date expression** may be used to denote any of the following:

* Single Dates
* Date Ranges
* Date Patterns
* Collection of any of the above

### Single Dates

The first type of date expression is a simple native Javascript date object.

Here is an example of using a date to display a simple attribute. We'll get into how to configure attributes in more detail later, but for now we can just focus on the `dates` expression below:

<guide-attributes-highlight/>

```js{8}
...
data() {
  return {
    attributes: [
      {
        key: 'today',
        highlight: true,
        dates: new Date()
      }
    ]
  }
}
```

:::tip
The `dates` key implies that an array should be used. While arrays are allowed, if you pass a single date object, it will get wrapped in an array for you.
:::

### Date Ranges

Date ranges define a range of contiguous dates. They are expressed as a simple object with the following properties:

| Property | Description |
| --- | --- |
| `start` | Start of the date range |
| `end` | End of the date range (optional) |
|`span` | Number of days to extend the range after the start date (optional). This may be used instead of the `end` date. |

<guide-readme-cal-date-ranges/>

```js
  ...
  dates: [
    { start: new Date(2018, 0, 1), end: new Date(2018, 0, 5) },
    { start: new Date(2018, 0, 15), span: 5 } // # of days
  ]
  ...
```

A `null` value denotes an infinite start or end date.

<guide-readme-cal-date-range-no-start/>

```js
  ...
  dates: {
    start: null, // From the beginning of time
    end: new Date() // Until today
  }
  ...
```

Optionally, if using `null` dates, you can omit them entirely.

```js
...
dates: {
  end: new Date() // Same as before
}
...
```

Thus, an empty object is a valid date expression...

<guide-readme-cal-date-range-no-start-end/>

```js
  ...
  // From the beginning of time until the end of time
  dates: {},
  ...
```

### Date Patterns

Date patterns are an extension of date ranges. They can target dates that would be incredibly difficult, if not impossible, to do otherwise with simple dates or date ranges. To configure a date pattern, let's first start with a simple date range.

```js
  ...
  dates: {
    start: new Date(2018, 0, 1),  // Jan 1st, 2018
    end: new Date(2019, 0, 1)     // Jan 1st, 2019
  },
  ...
```

The only thing we need to do to convert this date range into a date pattern is to start adding patterns to it. For this example, we'll just target the weekends.

<guide-readme-cal-date-patterns/>

```js
  ...
  dates: {
    start: new Date(2018, 0, 1),  // Jan 1st, 2018
    end: new Date(2019, 0, 1),    // Jan 1st, 2019
    weekdays: [1, 7]              // ...on Sundays and Saturdays
  },
  ...
```

We can also target other specific day properties, like `days: [6, 15]` for the 6th and 15th of the month, `weeks: [-1]` for the last week of the month and even `ordinalWeekdays: { [-1]: 1 }` for the last Sunday of the month.

For the next example, let's display dot indicators on the last Friday of every other month, starting on January 1st of 2018.

<guide-readme-cal-date-patterns-1 />

```js
...
  attrs: [
    {
      dot: 'red',
      dates: {
        start: new Date('1/1/2018'),
        monthlyInterval: 2,           // Every other month
        ordinalWeekdays: { [-1]: 6 }  // ...on the last Friday
      }
    }
  ]
...
```

*Pretty cool!!* :ok_hand:

Now, for some reason, we also want to target the 15th of every other month (in addition to the last Friday), so this might be our first attempt:

```js{6}
...
dates: {
  start: new Date('1/1/2018'),
  monthlyInterval: 2,           // Every other month
  ordinalWeekdays: { [-1]: 6 }, // ...on the last Friday
  days: 15                      // ...and on the 15th? (WRONG!)
},
...
```

But this would be **wrong**, because all component specifiers are conditionally *anded* with each other. In other words, this would only target the last Friday of every other month that also happened to be on the 15th of the month (which would never occur).

To evaluate a set of conditions *or* another set, we can break the sets of conditions out into an array assigned to the `on` property.

```js{5-8}
...
dates: {
  start: new Date('1/1/2018'),
  monthlyInterval: 2,                 // Every other month
  on: [                               // ...on...
    { ordinalWeekdays: { [-1]: 6 } }, // ...the last Friday
    { days: 15 }                      // ...or the 15th of the month
  ]
}
...
```

Note how we kept the `monthlyInterval` condition outside of the array. Any conditions that should be **anded** with all the others can be extracted out of the array. This prevents unnecessary duplication of conditions within the array.

Here is a complete reference of date component specifiers available.

| Property | Type | Description | Range |
| --- | --- | --- | --- |
| `days` | Number, Array | Day number from the start or end of the month. | 1 to 31, -1 to -31 |
| `weekdays` | Number, Array | Day of the week. | 1: Sun to 7: Sat |
| `ordinalWeekdays` | Object (key: Number / value: Number, Array) | Weekday ordinal position from the start or end of the month. | key: 1 to 6, -1 to -6 / value: 1: Sun to 7: Sat |
| `weeks` | Number, Array | Week number from the start or end of the month. | 1 to 6, -1 to -6 |
| `months` | Number, Array | Months of the year. | 1 to 12 |
| `years` | Number, Array | Year numbers. | 4-digit integer |
| `dailyInterval` | Number | Interval number of days from the start date (or today when no start date provided). | n > 0 |
| `weeklyInterval` | Number | Interval number of weeks from the start date (or today). | n > 0 |
| `monthlyInterval` | Number | Interval number of months from the start date (or today). | n > 0 |
| `yearlyInterval` | Number | Interval number of years from the start date (or today). | n > 0 |

### Collections

Any of the previously mentioned singular date expressions may be combined using an array.

<guide-attributes-multiple-dates/>

```js
  ...
  dates: [
    new Date(2018, 0, 1),
    {
      start: new Date(2018, 0, 10),
      end: new Date(2018, 0, 12)
    },
    new Date(2018, 0, 15),
  ],
  ...
```

### Disabling Dates

:::tip
In pre-v1 versions, dates could only be disabled for `v-date-picker`. Disabling dates are now supported for `v-calendar` as well.
:::

As mentioned earlier, date expressions are not only used to define attributes. They can also be used to "disable" calendar days. Disabled dates have the following effects:

* Day text color has less contrast than normal day cells
* If using `min-date` navigation is disabled for months before specified date
* If using `max-date` navigation is disabled for months after specified date
* Hover, focus and click events are still active for disabled dates

::: tip
Use the `dayContentDisabled` and `dayDisabled` theme settings to customize how disabled days look and behave. For example, a class applied with `pointer-events: none` could disable interaction with disabled dates.
:::

You can disable dates, date ranges and date patterns using the following methods:

#### 1. Explicitly via `min-date`

<guide-readme-dp-min-max-dates is-min />

```html
<v-date-picker
  v-model='date'
  :min-date='new Date()'
  is-inline
  />
```

:::tip
When using `min-date`, this also prevents the user from navigating to pages before the date specified.
:::

#### 2. Explicitly via `max-date`

<guide-readme-dp-min-max-dates />

```html
<v-date-picker
  v-model='date'
  :max-date='new Date()'
  is-inline
  />
```

:::tip
When using `max-date`, this also prevents the user from navigating to pages after the date specified.
:::

#### 3. Explicitly via `disabled-dates`

When using `disabled-dates`, you can use a full date expression to specify a set of disabled dates. That is, a date object, date range object, date pattern or an array of either of these may be used. 

:::tip
`disabled-dates` may be used in combination with the `min-date` and `max-date` props.
:::

<guide-readme-dp-disabled-dates />

```html
<!--Disable weekend selection-->
<v-date-picker
  mode='range'
  v-model='date'
  :disabled-dates='{ weekdays: [1, 7] }'
  is-inline
  />
```

#### 4. Implicitly via `available-dates`.

Any dates not included in `available-dates` are disabled.

<guide-readme-dp-available-dates />

```html
<v-date-picker
  :available-dates='{ start: new Date(), end: null }'
  v-model='date'
  is-inline
  />
```

::: warning
When using `disabled-dates` and `available-dates`, `v-calendar` will not automatically disable page navigation for you, whereas using `min-date` and `max-date` will disable pages that are before `min-date` and after `max-date`.

Use the `min-date`, `min-page`, `max-date` or `max-page` props to manually assign the page bounds when using `disabled-dates` or `available-dates`.
:::

### Include vs Exclude Dates

Currently, there are four places where date expressions are used:
* [`attribute.dates`](/api/attribute.md#dates): Date(s) to display attributes .
* [`attribute.excludeDates`](/api/attribute.html#exclude-dates): Date(s) to NOT display attributes. All other dates are displayed.
* [`disabled-dates`](/api/datepicker.html#disabled-dates) Date(s) to disable for `v-calendar` & `v-date-picker`.
* [`available-dates`](/api/datepicker.html#available-dates) Date(s) to enable for `v-calendar` & `v-date-picker`. All other dates are disabled.

In all places where date expressions are used, you'll notice that they come in pairs. One expression is for the explicit form (`dates`, `disabled-dates`), and the other expression is for the implicit form (`excludeDates`, `available-dates`).

The explicit form is the most direct form of expressing what dates to target.

However, it might be more efficient to express what dates you would like to exclude, or avoid. For example, in `v-date-picker`, if you only want to allow date selections in the month of January of 2018, both of these expressions would work just fine:

```html
<v-date-picker
  v-model='myDate'
  :disabled-dates='[
    {
      start: null,
      end: new Date(2017, 11, 31)
    },
    {
      start: new Date(2018, 1, 1),
      end: null
    }
  ]'
  />
```

```html
<v-date-picker
  v-model='myDate'
  :available-dates='{
    start: new Date(2018, 0, 1),
    end: new Date(2018, 0, 31)
  }'
  />
```

The second expression is more terse and declarative than the first. It even performs slighly better. The point is, just take a second to consider which method is best suited for your application.

## i18n

VCalendar utilizes the [well supported](https://caniuse.com/#feat=internationalization) Internationalization API to derive month and weekday names and formatting. This helps keep the package size down, as well as supporting multiple locales in the most performant and isomorphic way.

### Locales

A locale includes multiple settings that are typically assigned on a per region basis. This currently includes the following:

| Setting | Description |
| --- | --- |
| `firstDayOfWeek` | The day the specified the first day of the week. This is a number from 1 to 7 (Sunday to Saturday, respectfully). |
| `masks` | Set of masks to use for common sections of the calendar including the title, weekday labels, month labels in the navigation pane and more. |
| `dayNames` | Full length identifiers for the days of the week. |
| `dayNamesShort` | 3-character identifiers for the days of the week. |
| `dayNamesShorter` | 2-character identifiers for the days of the week. |
| `dayNamesNarrow` | 1-character identifiers for the days of the week. |
| `monthNames` | Full length identifiers for the months of the year. |
| `monthNamesShort` | Abbreviated identifiers for the months of the year. |

There are multiple ways which you can configure the locale for a specific calendar. Locales may be configured globally via the defaults object as well as on a per-calendar basis with the `locale` prop.

#### **No specified locale**

```html
<v-calendar />
```

With no locale specified, the locale detected by the Internationalization API is used.

#### **No specified locale w/ override props**

```html
<v-calendar :first-day-of-week="2" :masks="{ title: 'MMM YYYY' }" />
```

<div class="example">
  <v-calendar :first-day-of-week="2" :masks="{ title: 'MMM YYYY' }" />
</div>

Uses the detected locale with customized `firstDayOfWeek` or `masks` that will override the built-in locale settings. When using a customized `masks` prop, the default masks will supply any masks that are missing, so you are free to provide single overrides.

#### **String Locale**

```html
<v-calendar locale="es" />
```

<div class="example">
  <v-calendar locale="es" />
</div>

With a string locale, the locale with the matching identifier is used. The Internationalization API is used to generate the `dayNames`, `dayNamesShort`, `dayNamesShorter`, `dayNamesNarrow`, `monthNames` and `monthNamesShort` properties. Because the API does not provide common values for the `firstDayOfWeek` or `masks` these are loaded from the plugin defaults (unless specifically provided via props).

#### **Object Locale**

```html
<v-calendar :locale="{ id: 'da', firstDayOfWeek: 2, masks: { weekdays: 'WW' } }" />
```

<div class="example">
  <v-calendar :locale="{ id: 'da', firstDayOfWeek: 2, masks: { weekdays: 'WW' } }" />
</div>

With an object locale, you can simply provide all the settings you need together in a single object.
Note that `firstDayOfWeek` and `masks` props will override this object.

#### **Providing default locales for all calendars**

More conveniently, you may override or provide missing locale information via the `locales` property of the defaults object when using VCalendar. This should be an object with the locale identifier as the key and an object with the locale settings.

```js
import Vue from 'vue'
import VCalendar from 'v-calendar'

Vue.use(VCalendar, {
  locales: {
    'pt-PT': {
      firstDayOfWeek: 1,
      masks: {
        L: 'YYYY-MM-DD',
        // ...optional `title`, `weekdays`, `navMonths`, etc
      }
    }
  }
});
```

Then, all you need to do is reference your locale when using the calendar component.

```html
<v-calendar locale="pt-PT" />
```

<div class="example">
  <v-calendar locale="pt-PT" />
</div>

### Formatting & Parsing Dates

As mentioned before, the locale masks are used to properly format and/or parse dates for the following calendar sections:

| Property Name | Target Area | Default Mask |
| ------------ | ----------- | -------------- |
| `title` | Calendar header title | `"MMMM YYYY"` |
| `weekdays` | Weekday headers | `"W"` |
| `navMonths` | Month labels in navigation dropdown | `"MMM"` |
| `dayPopover` | Date in day popover when user hovers selected date. | `"WWW, MMM D, YYYY"` |
| `input` | Input element text when `is-inline === false`. (*`v-date-picker` only*) | `["L", "YYYY-MM-DD", "YYYY/MM/DD"]` |
| `data` | Parses attribute dates, if needed | `["L", "YYYY-MM-DD", "YYYY/MM/DD"]` |

#### Parsing using multiple masks

You'll notice an array was used to specify the `input` mask for `v-date-picker`. This is because it uses the supplied masks(s) to parse, as well as display, the selected date. The first supplied mask is used to display the date selection, while all masks are used (from first to last) to parse the date string. The first successfully parsed date is used as the selected date. This provides more flexibility for the user when manually typing in dates.

By default, `v-date-picker` will first try and use the localized long date mask to parse the date, but will also try to parse masks that are globally unambiguous (*YYYY-MM-DD* and *YYYY/MM/DD*). Furthermore, because `v-date-picker` uses its own parsing logic ([rather than relying on the browser's inconsistent `Date.parse` function](http://blog.dygraphs.com/2012/03/javascript-and-dates-what-mess.html)), it can properly parse ISO-8601 dates to the user's local time zone instead of converting to UTC. If you plan on targeting browsers from multiple locales, it is probably best to defer to the default mask settings.

### Mask Tokens

Use the following tokens to configure your custom masks:

| | Token | Output |
| -------- | ----- | ------ |
| **Month** | `M` | 1, 2, ..., 12 |
| | `MM` | 01, 02, ..., 12 |
| | `MMM` | Jan, Feb, ..., Dec |
| | `MMMM` | January, February, ..., December |
| **Day of Month** | `D` | 1, 2, ..., 31 |
| | `DD` | 01, 02, ..., 31 |
| | `Do` | 1st, 2nd, ..., 31st |
| **Day of Week** | `d` | 1, 2, ..., 7 |
| | `d` | 1, 2, ..., 7 |
| | `dd` | 01, 02, ..., 07 |
| | `W` | S, M, ..., S |
| | `WW` | Su, Mo, ..., Sa |
| | `WWW` | Sun, Mon, ..., Sat |
| | `WWWW` | Sunday, Monday, ..., Saturday |
| **Year** | `YY` | 70, 71, ... 69 |
| | `YYYY` | 1970, 1971, ..., 2069 |
| **Long Date** | `L` | 01/21/1983 (en-US), 21/01/1983 (en-GB), ..., 1983/01/21 (*civilized*) |

With all of this in mind, it is probably best that you rely on the the plugin's built-in methods for detecting the user's locale. However, if you would like to force a specific locale for all users, you may supply your own [default locale](#custom-defaults) using the [*language-region*](https://lingohub.com/developers/supported-locales/language-designators-with-regions/) format.

---

## Installation

[Vue.js](https://vuejs.org) version 2.5+ is required.

### NPM

#### 1 Install via npm

```bash
npm install v-calendar@next
```

#### 2 Import and use VCalendar

##### 2A. Plugin Method (**Recommended**)

This is the most common use case.

```js
import Vue from 'vue';
import VCalendar from 'v-calendar';

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
  ...,                // ...other defaults
});

```

##### 2B. Components Method

You can also just import components separately.

```js
import Calendar from 'v-calendar/lib/components/calendar.umd'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

// Register components in your 'main.js'
Vue.component('calendar', Calendar)
Vue.component('date-picker', DatePicker)

// Or just use in separate component
export default {
  components: {
    Calendar,
    DatePicker
  }
  ...
}
```

If you would still like to provide [plugin defaults](../api/defaults.md), call `setupCalendar` before using any components.

```js
import { setupCalendar} from 'v-calendar'

// main.js
setupCalendar({
  componentPrefix: 'vc',
  ...,
});
```

### CDN
```html
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <meta http-equiv='x-ua-compatible' content='ie=edge'>
    <!-- IMPORTANT: No CSS link needed as of v1 Beta (@next) - It's all inlined -->
    <!-- Pre v1.0.0 versions need the minified css -->
    <!-- <link rel='stylesheet' href='https://unpkg.com/v-calendar/lib/v-calendar.min.css'> -->
  </head>
  <body>
    <div id='app'>
      <v-calendar></v-calendar>
      <v-date-picker :mode='mode' v-model='selectedDate' />
    </div>

    <!-- 1. Link Vue Javascript -->
    <script src='https://unpkg.com/vue/dist/vue.js'></script>

    <!-- 2. Link VCalendar Javascript (Plugin automatically installed) -->
    <!-- @next v1 Beta  -->
    <script src='https://unpkg.com/v-calendar@next'></script>
    <!-- Latest stable (Right now, this is very different from the v1 Beta)-->
    <!-- <script src='https://unpkg.com/v-calendar'></script> -->
    <!-- Hardcoded version -->
    <!-- <script src='https://unpkg.com/v-calendar@1.0.0-beta.14/lib/v-calendar.umd.min.js'></script> -->

    <!--3. Create the Vue instance-->
    <script>
      new Vue({
        el: '#app',
        data: {
          // Data used by the date picker
          mode: 'single',
          selectedDate: null,
        }
      })
    </script>
  </body>
</html>
```

<!-- ### Polyfills

`v-calendar` is transpiled for ES5, but it still needs a polyfill for `Array.prototype.find` (<= IE11) or even `Intl` (Javascript's internationalization object, <= IE10) if you wish to target older browsers. Two options for accomplishing this are:
1. **Easy way:**
  Insert the following script into your html before loading `v-calendar`. The polyfill will get loaded automatically *only if* the browser needs it.

  `<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.prototype.find,Intl" />`

2. In Node/Browserify/Webpack environments, use [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) to insert the polyfill for you. -->

## Custom Defaults

Custom defaults can be provided on initialization. Note that almost all of these defaults can be overridden by props on `v-calendar` or `v-date-picker` components.

```js
Vue.use(VCalendar, {
  componentPrefix: 'vc', // Now use vc-calendar and vc-date-picker
  ...
})
```

[Click here to see all defaults.](../api/defaults.md)