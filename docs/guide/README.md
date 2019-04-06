---
title: 'V-Calendar'
sidebarDepth: 2
---

# V-Calendar

V-Calendar is a clean and lightweight plugin for displaying simple, attributed calendars in Vue.js. It uses attributes to decorate the calendar with various visual indicators including highlighted date regions, dots, bars, content classes and even popovers for simple tooltips or custom slot content.

<guide-attributes-intro/>

Any of these indicators can be displayed for single dates, date ranges and even complex date patterns like the following:
* Every other Friday
* 15th of every month
* Last Friday of every other month.

A date picker is included out of the box with single date, multiple date and date range selection modes. Also, because `v-date-picker` is simply a wrapper for `v-calendar`, both can be extensively customized using props, slots and custom custom theme support,

And of course, V-Calendar is responsive and mobile friendly.

## Component

`v-calendar` is the core component. By default, it has a neutral design that should blend nicely within any web application, with various layout configuration options: 
  * Responsive multi-row and multi-column layouts
  * Slot support for custom header and day content
  * Semantic-inspired navigation popover
  * Navigation transitions (horizontal slide, vertical slide, fade)

```html
<v-calendar />
```

<guide-readme-cal-basic />

## Layouts

### Full Width

To expand the component to the full width of its container, set the `is-expanded` prop.

```html
<v-calendar is-expanded />
```

<guide-readme-cal-expanded />

### Multiple Rows & Columns

Use the `rows` and `columns` props to create multi-row and multi-column static layouts.

```html
<v-calendar :rows="2" />
```

<guide-readme-cal-rows-columns />

### Responsive Layouts

V-Calendar allows you build responsive designs for multiple screen sizes.

The basic approach can be described in two steps:

1. Specify a few screen sizes to monitor by providing a set of breakpoints (`sm`, `md`, `lg` and `xl`). [The screen size names and dimensions are configurable](#screen-sizes).

2. Call the `$screens` function to assign props or create computed properties based on the current screen size. This function automatically re-evaluates behind the scenes any time the window crosses a breakpoint border.

V-Calendar takes a mobile-first approach, where each screen represents a minimum viewport width. Any values you assign at smaller screen sizes are also applied to larger sizes, unless explicity overridden.

For example, suppose we wish to display a single column on mobile. Then, at the large size, we wish to expand the calendar to two columns.

```html
<v-calendar :columns="$screens({ default: 1, lg: 2 })" />
```

<guide-readme-cal-responsive />

As you can see, we use the `$screens` function to target multiple screens. We pass an object to specify the screen-to-value relationships with target screen sizes as the key. Use the `default` key to target the default mobile layout.

Alternatively, we can pass the default value as a second parameter to the `$screens` function.

```html
<!--Same as before, just passing default value as second parameter-->
<v-calendar :columns="$screens({ lg: 2 }, 1)" />
```

Let's add to the previous example so that a new row is added for large screens. Also, we would also like to expand the pane width to fill its container on mobile when only one column and row is displayed.

```html
<v-calendar
  :columns="$screens({ default: 1, lg: 2 })"
  :rows="$screens({ default: 1, lg: 2 })"
  :is-expanded="$screens({ default: true, lg: false })"
  />
```

<guide-readme-cal-responsive-expanded />

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
screens: {
  sm: '576px',  // (min-width: 576px)
  md: '768px',  // (min-width: 768px)
  lg: '992px',  // (min-width: 992px)
  xl: '1200px'  // (min-width: 1200px)
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

## i18n

VCalendar utilizes the [well supported](https://caniuse.com/#feat=internationalization) Internationalization API to derive month and weekday names and formatting. This helps keep the package size down, as well as supporting multiple locales in the most performant and isomorphic way.

### Locales

A locale includes multiple settings that are typically assigned on a per region basis. This currently includes the following:

| Setting | Description |
| --- | --- |
| `firstDayOfWeek` | The day the specified the first day of the week. This is a number from 1 to 7 (Sunday to Saturday, respectfully). |
| `masks` | Set of masks to use for common sections of the calendar including the title, weekday labels, month labels in the navigation pane and more. |
| `L` | Common tokens used to represent the common single date expression. (`'MM/DD/YYYY'` for *en-US*) |
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
<v-calendar :first-day-of-week="1" :masks="{ L: 'YYYY-MM-DD' }" />
```

Uses the detected locale with a customized `firstDayOfWeek` or `masks` that will override the built-in locale settings. When using a customized `masks` prop, the default masks will supply any masks that are missing, so you are free to provide single overrides.

#### **String Locale**

```html
<v-calendar locale="es" />
```

With a string locale, the locale with the matching identifier is used. The Internationalization API is used to generate the `dayNames`, `dayNamesShort`, `dayNamesShorter`, `dayNamesNarrow`, `monthNames` and `monthNamesShort` properties. Because the API does not provide common values for the `firstDayOfWeek` or `masks` these are loaded from the plugin defaults (unless specifically provided via props).

#### **Object Locale**

```html
<v-calendar locale="{ id: 'pt-PT', firstDayOfWeek: 1, masks: { L: 'YYYY-MM-DD' } }" />
```

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

### Formatting & Parsing Using Masks

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
  componentPrefix: 'vc-',  // Use <vc-calendar /> instead of <v-calendar />
  ...,                // ...other defaults
});

```

##### 2B. Components Method

Or, you can just import and use the calendar if you don't need the `v-date-picker` or `v-popover` components. Keep in mind that `setupCalendar` still needs to be called (passing optional defaults) using this method.

```js
import Vue from 'vue';
import { setupCalendar, Calendar} from 'v-calendar'

// Remember to setup calendar (passing in defaults if needed)
setupCalendar({
  componentPrefix: 'vc-',
  ...,
});

// Register component(s)
Vue.component('v-calendar', Calendar);
```

#### 3 Reference in your component templates

```html
<template>
  <v-calendar>
  </v-calendar>
  <v-date-picker
    mode='single'
    v-model='date'>
  </v-date-picker>
</template>
```

```js
<script>
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
```

### CDN
```html
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <meta http-equiv='x-ua-compatible' content='ie=edge'>
    <!--1. Link VCalendar CSS-->
    <link rel='stylesheet' href='https://unpkg.com/v-calendar/lib/v-calendar.min.css'>
  </head>
  <body>
    <div id='app'>
      <v-calendar></v-calendar>
      <v-date-picker :mode='mode' v-model='selectedDate'></v-date-picker>
    </div>
    <!--2. Link Vue Javascript-->
    <script src='https://unpkg.com/vue/dist/vue.js'></script>
    <!--3. Link VCalendar Javascript (Plugin automatically installed)-->
    <script src='https://unpkg.com/v-calendar'></script>
    <!--4. Create the Vue instance-->
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

### Polyfills

`v-calendar` is transpiled for ES5, but it still needs a polyfill for `Array.prototype.find` (<= IE11) or even `Intl` (Javascript's internationalization object, <= IE10) if you wish to target older browsers. Two options for accomplishing this are:
1. **Easy way:**
  Insert the following script into your html before loading `v-calendar`. The polyfill will get loaded automatically *only if* the browser needs it.

  `<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.prototype.find,Intl" />`

2. In Node/Browserify/Webpack environments, use [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) to insert the polyfill for you.

## Custom Defaults

Custom defaults can be provided on initialization. Note that almost all of these defaults can be overridden by props on `v-calendar` or `v-date-picker` components.

```js
Vue.use(VCalendar, {
  firstDayOfWeek: 2, // Set first day of week to Monday
  ...
})
```

[Click here to see all defaults.](../api/defaults.md)