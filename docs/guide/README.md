---
title: 'Overview'
---

# Welcome to V-Calendar

V-Calendar is a clean and lightweight plugin for displaying simple, attributed calendars in Vue.js. It uses attributes to decorate the calendar with various visual indicators including highlighted date regions, dots, bars, content styles and classes, and even popovers for simple tooltips or custom slot content.

<guide-readme-cal-intro>
</guide-readme-cal-intro>

Any single attribute may contain one of each object and can be displayed for single dates, date ranges and even complex date patterns. Some examples of complex patterns include:
* Every other Friday
* 15th of every month
* Last Friday of every other month.

A date picker is included out of the box with single date, multiple date and date range selection modes. Because `v-date-picker` is simply a wrapper for `v-calendar`, both can be extensively customized using props, slots and theme styling, just like `v-calendar`. And of course, V-Calendar is responsive and mobile friendly. For example, it supports touch swipes for month navigation.

## Calendar

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

1. Specify a few screen sizes to monitor by providing a set of breakpoints (`sm`, `md`, `lg` and `xl`). [The screen size names and dimensions are configurable](#customizing-screen-sizes).

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
The `$screens` function is included as a mixin for all components when using V-Calendar. You can use it to make any of your props or computed properties responsive in any of your own components.
:::

### Customizing Screen Sizes

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

## Attributes

Attributes provide a powerful way to communicate visual information to your users quickly and effectively. Fortunately, they are also easy to configure. 

### Attribute Types

Attributes are the general term for different kinds of visual adornments to calendar day cells. The following attribute types are currently supported.

* Highlights (Highlighted Background Regions)
* Dot Indicators
* Bar Indicators
* Content Classes :new:
* Content Styles
* Popovers

For now, let's start by displaying a simple **highlight** on today's date.

```html
<v-calendar :attributes='attrs' />
```

```js
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#ff8080',
            // Other properties allowed, like `height` & `borderRadius`
          },
          // Single date or array of dates or date expressions
          dates: new Date(),
        },
      ],
    };
  },
};
```

<guide-readme-cal-highlight>
</guide-readme-cal-highlight>

As you can see, attributes are passed as an array of objects (each object is a separate attribute). For the simple example above, we use the following props to build the attribute:

* **`key`**: Uniquely identifies the attribute. This will come in handly later.
* **`highlight`**: A highlight is a background region displayed on the calendar day.
* **`dates`**: Specifies what dates the attribute should be displayed on.

With the highlight, the day label loses some contrast, which is not what we want. To add some contrast to the highlighted date, we can use a content style, which is simply a style object that gets applied to the day content text.

```js{11-14}
export default {
  data() {
    return {
      fromDate: date,
      attrs: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#ff8080',
          },
          // Just use a normal style
          contentStyle: {
            color: '#fafafa',
          },
          dates: new Date(),
        },
      ],
    };
  },
};
```

<guide-readme-cal-content-style>
</guide-readme-cal-content-style>

Finally, let's see how simple it is to add a popover label (or tooltip) to the calendar when this highlight is hovered over. To do that, we just need to add a popover object to our attribute.

```js{13-15}
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#ff8080',
          },
          contentStyle: {
            color: '#fafafa',
          },
          popover: {
            label: 'You just hovered over today\'s date!',
          },
          dates: new Date(),
        },
      ],
    };
  },
};
```

<guide-readme-cal-popover>
</guide-readme-cal-popover>

### Attribute Dates

The second aspect of attributes is specifying where to display them. In the previous example, we saw that all we had to do was use a simple date object assigned to the `dates` property. Note that we aren't limited to using single dates. We can also use an array of dates.

```js
  ...
  dates: [ new Date(2018, 0, 1), new Date(2018, 0, 15) ]
  ...
```

<guide-readme-cal-multiple-dates>
</guide-readme-cal-multiple-dates>

Or date ranges...

```js
  ...
  dates: [
    { start: new Date(2018, 0, 1), end: new Date(2018, 0, 5) },
    { start: new Date(2018, 0, 15), span: 5 } // # of days
  ]
  ...
```

<guide-readme-cal-date-ranges>
</guide-readme-cal-date-ranges>

Or date patterns.

```js
  ...
  dates: { weekdays: [1, 7] } // On the weekends
  ...
```

<guide-readme-cal-date-patterns>
</guide-readme-cal-date-patterns>

## Date Picker

The `v-date-picker` component is a flexible date picker component wrapper around `v-calendar`, which means it supports all props, slots and events that `v-calendar` does.

Using the `mode` prop, it is capable of 3 selection modes:
  * Single dates (`"single"`)
  * Multiple dates (`"multiple"`)
  * Date ranges (`"range"`)

Also, you can utilize 3 different methods of displaying the date picker:
* **Inline**: Displays inline as a single calendar
* **Native Input**: Displays a customizable built-in input as a trigger for the calendar popover
* **Custom Slot**: Use a scoped slot as a trigger for the calendar popover

### Inline

Use the `is-inline` prop to display the date picker inline.

```html
<v-date-picker
  v-model="date"
  is-inline
  />
```

```js
export default {
  data() {
    return {
      date: new Date(),
    }
  }
}
```

<guide-readme-dp-inline>
</guide-readme-dp-inline>

### Native Input

By default, `v-date-picker` uses an input element to natively format and parse dates entered by the user. The `input` element can be classed, styled or assigned attributes via the `input-props` prop.

```html
<div class='w-full max-w-xs'>
  <form
    class='bg-white shadow-md rounded px-8 pt-6 pb-8'
    @submit.prevent>
    <label
      class='block text-grey-darker text-sm font-bold mb-2'
      for='date'>
      Select Date
    </label>
    <v-date-picker
      :input-props='inputProps'
      v-model='date'>
    </v-date-picker>
  </form>
</div>
```

```js
export default {
  data() {
    return {
      date: new Date(),
      inputProps: {
        id: 'date',
        class:
          'shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      },
    };
  },
};
```

<guide-readme-dp-input>
</guide-readme-dp-input>

::: tip
Reference [TailwindCSS](https://tailwindcss.com/docs/what-is-tailwind/) for style definitions.
:::

### Custom Slot

Use a custom scoped slot to display your own input element or popover trigger. The `inputProps` and `inputEvents` scope variables are used to properly integrate your own input with the behavior provided by `v-date-picker`. [Click to learn more.](datepicker.md#use-custom-slot)

```html
<div class="w-full max-w-sm">
  <form
    class="bg-white shadow-md rounded px-8 pt-6 pb-8"
    @submit.prevent>
    <label
      class="block text-grey-darker text-sm font-bold mb-2"
      for="date">
      Select Date Range
    </label>
    <div class="flex w-full">
      <v-date-picker
        mode="range"
        v-model="date"
        show-caps>
        <input
          id="date"
          class="flex-grow shadow appearance-none border rounded-l w-full py-2 px-3 text-grey-darker"
          :class="{ 'border-red': errorMessage }"
          slot-scope="{ inputProps, inputEvents }"
          v-bind="inputProps"
          v-on="inputEvents"
        >
      </v-date-picker>
      <button
        type="button"
        class="bg-red-light hover:bg-red text-white font-bold py-2 px-4 rounded-r"
        @click="date = null">
        Clear
      </button>
    </div>
    <p class="text-red text-xs italic mt-1" v-if="errorMessage">{{ errorMessage }}</p>
    <p class="text-blue text-xs font-bold mt-1" v-else>We got it. Thanks!</p>
  </form>
</div>
```
```js
export default {
  data() {
    return {
      date: null,
    };
  },
  computed: {
    errorMessage() {
      if (!this.date) return 'Date is required.';
      return '';
    },
  },
};
```
<guide-readme-dp-custom-slot>
</guide-readme-dp-custom-slot>

### Disabling Dates

You can disable dates, date ranges and date patterns using the following methods:

  * Explicitly via `min-date` or `max-date`
    ```html
    <!--Set minimum date-->
    <v-date-picker
      v-model='date'
      :min-date='new Date()'
      is-inline>
    </v-date-picker>
    ```
    <guide-readme-dp-min-max-dates>
    </guide-readme-dp-min-max-dates>

  * Explicitly via `disabled-dates` (still works with `min-date` or `max-date`).
    ```html
    <!--Disable weekend selection-->
    <v-date-picker
      v-model='date'
      :disabled-dates='{ weekdays: [1, 7] }'
      is-inline>
    </v-date-picker>
    ```
    <guide-readme-dp-disabled-dates>
    </guide-readme-dp-disabled-dates>

  * Implicitly via `available-dates`. Any dates not included in `available-dates` are disabled.
    ```html
    <!--Today is the minimum date (null denotes infinite date)-->
    <v-date-picker
      :available-dates='{ start: new Date(), end: null }'
      v-model='date'
      is-inline>
    </v-date-picker>
    ```
    <guide-readme-dp-available-dates>
    </guide-readme-dp-available-dates>

::: warning
When using `disabled-dates` and `available-dates`, `v-calendar` will not automatically disable page navigation for you, whereas using `min-date` and `max-date` will disable pages that are before `min-date` and after `max-date`.

Use the `min-date`, `min-page`, `max-date` or `max-page` props to manually assign the page bounds when using `disabled-dates` or `available-dates`.
:::

## Formatting & Parsing

Dates are formatted and/or parsed for the following component sections:

| Property Name | Target Area | Default Format |
| ------------ | ----------- | -------------- |
| `title` | Formats calendar header title | `"MMMM YYYY"` |
| `weekdays` | Formats weekday headers | `"W"` |
| `navMonths` | Formats month labels in navigation dropdown | `"MMM"` |
| `input` | Formats and parses input element text when `is-inline === false`. (*`v-date-picker` only*) | `["L", "YYYY-MM-DD", "YYYY/MM/DD"]` |
| `dayPopover` | Formats date in day popover when user hovers selected date. (*`v-date-picker` only*) | `"WWW, MMM D, YYYY"` |
| `data` | Parses attribute dates, if needed | `["L", "YYYY-MM-DD", "YYYY/MM/DD"]` |

By default, `v-calendar` uses Javascript's Internalization API ([which is increasingly well supported](https://caniuse.com/#search=Intl)) to derive the month and weekday names for the user's locale. This helps keep the package size to a minimum while utilizing an API that should only improve with time. It also uses the most appropriate long date format (`L`) for that locale (derived from [moment.js](https://github.com/moment/moment/tree/develop/src/locale)).

To use your own custom formats, configure and pass the `formats` object
  * As a prop to `v-calendar` or  `v-date-picker`

```html
<v-date-picker
  :formats='formats'
  v-model='myDate'>
</v-date-picker>
```
```js
export default {
  data() {
    return {
      myDate: null,
      formats: {
        title: 'MMMM YYYY',
        weekdays: 'W',
        navMonths: 'MMM',
        input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'], // Only for `v-date-picker`
        dayPopover: 'L', // Only for `v-date-picker`
        data: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'] // For attribute dates
      }
    }
  }
}
```
  * As a default when using VCalendar

```js
import Vue from 'vue'
import VCalendar from 'v-calendar'

Vue.use(VCalendar, {
  formats: {
    title: 'MMMM YYYY',
    weekdays: 'W',
    navMonths: 'MMM',
    input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    dayPopover: 'L',
    data: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD']
  }
})
```

### Parsing using multiple formats

You'll notice an array was used to specify the `input` format for `v-date-picker`. This is because it uses the supplied format(s) to parse, as well as display, the selected date. The first supplied format is used to display the date selection, while all formats are used (from first to last) to parse the date string. The first successfully parsed date is used as the selected date. This provides more flexibility for the user when manually typing in dates.

By default, `v-date-picker` will first try and use the localized long date format to parse the date, but will also try to parse formats that are globally unambiguous (*YYYY-MM-DD* and *YYYY/MM/DD*). Furthermore, because `v-date-picker` uses its own parsing logic ([rather than relying on the browser's inconsistent `Date.parse` function](http://blog.dygraphs.com/2012/03/javascript-and-dates-what-mess.html)), it can properly parse ISO-8601 dates to the user's local time zone instead of converting to UTC. If you plan on targeting browsers from multiple locales, it is probably best to defer to the default format settings.

### Format Tokens

Use the following tokens to configure your custom formats:

| Category | Token | Output |
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

---

## I18n

VCalendar utilizes the [well supported](https://caniuse.com/#feat=internationalization) Internationalization API to derive month and weekday names and formatting. This helps keep the package size down, as well as supporting multiple locales in the most performant and isomorphic way.

At the moment, this API still cannot provide all recommended default settings per locale (such as 'first day of the week'), so those settings are provided out of the box for a reasonable number of locales, with a decent fallback for those locales that aren't included.

With all of this in mind, it is probably best that you rely on the the plugin's built-in methods for detecting the user's locale. However, if you would like to force a specific locale for all users, you may supply your own [default locale](#custom-defaults) using the [*language-region*](https://lingohub.com/documentation/developers/supported-locales/language-designators-with-regions/) format.

---

## Installation

[Vue.js](https://vuejs.org) version 2.5+ is required.

### 1 Install via npm

```bash
npm install v-calendar
```

### 2 Import and use VCalendar

#### 2A. Plugin Method (**Recommended**)

This is the most common use case.

```js
import Vue from 'vue';
import VCalendar from 'v-calendar';

// Use v-calendar, v-date-picker & v-popover components
Vue.use(VCalendar, {
  firstDayOfWeek: 2,  // Monday
  ...,                // ...other defaults
});

```

#### 2B. Components Method

Or, you can just import and use the calendar if you don't need the `v-date-picker` or `v-popover` components. Keep in mind that `setupCalendar` still needs to be called (passing optional defaults) using this method.

```js
import Vue from 'vue';
import { setupCalendar, Calendar} from 'v-calendar'

// Remember to setup calendar (passing in defaults if needed)
setupCalendar({
  firstDayOfWeek: 2,  // Monday,
  ...,                // ...other defaults
});

// Register component(s)
Vue.component('v-calendar', Calendar);
```

### 3 Reference in your component templates

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

### Or use a CDN
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

### Polyfill

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