# V-Calendar

> V-Calendar is a clean and lightweight plugin for building attributed calendars in Vue.js.

Visit https://vcalendar.netlify.com for demos and API reference. This plug-in is currently in beta state.

## Features

* Display clean and simple attributed calendars
* Built-in support for various attributes, including
  * highlighted regions
  * dot and bar indicators
  * day content styles (hovered and non-hovered)
* Apply attributes for multiple dates or date ranges (start & end dates)
* Semantic inspired popover navigation panel with month-level attribute indicators
* Date-picker supporting all native v-calendar props/events with various selection modes
  * single date
  * multiple dates
  * date range
* Extensive API with custom slot support
* Responsive and mobile-friendly
  * Handles taps for date selection
  * Handles swipes for month navigation

# Usage

## Calendar

All attributes for a calendar are supplied within an array.

A single attribute may consist of one of each of the following objects: higlights, dots, bars, content style, content hover style. Supply the attributes as an array for the `v-calendar` component.

Here is an example of a simple highlight with a content style.

```html
<v-calendar :attributes='attrs'>
</v-calendar>
```

```javascript
export const {
  data() {
    return {
      attrs: [
        {
          highlight: {
            backgroundColor: 'red',
            borderRadius: '5px'             // Only applied on highlighted end caps
          },
          contentStyle: {
            color: 'white'                  // Contrasts well with the red background
          },
          dates: [
            new Date(),                     // Use dates
            {                               // ...or date ranges
              start: new Date('1/21/83'),   // ...that start on my birthday :)
              end: new Date()
            }
          ]
          customData: myData                // Custom data to reference later
        }
      ]
    }
  }
};
```

The `dates` array specifies dates for which all components of the attribute appear. As you can see, both date objects and date range objects are allowed, where the latter requires start and end dates when needed. For date ranges, null values are allowed for infinite start and end dates, in which case those properties can be ommitted entirely.

### Date Patterns

One really neat feature is that you can target specific dates from within a parent range. This allows for creating complex date patterns that would be difficult to achieve otherwise.

For a simple example, let's say we want to display an attribute on the weekends. To do that, we configure the date like this:

```javascript
...
attrs: [
  {
    highlight: {...},
    contentStyle: {...},
    dates: [
      {
        start: null,      // From the beginning of time...
        end: null,        // ...to the end of time...
        weekdays: [1, 7]  // ...on Sundays and Saturdays
      }
    ]
  }
]
...
```

We can also target other specific day properties, like `days: [6, 15]` for the 6th and 15th of the month, `weeks: [-1]` for the last week of the month and even `ordinalWeekdays: { -1: [1] }` for the last Sunday of the month.

If supplying only a single numerical argument, like `weeks: [-1]`, we can nix the array and simplify to `weeks: -1`.

Additionally, if the date is applied over an infinite time scale (`start` and `end` dates are `null`) like the example before, we can remove `start` and `end` completely. And since our date object is the only one in the array, we can nix the array again like before.

```javascript
...
attrs: [
  {
    highlight: {...},
    contentStyle: {...},
    dates: { weekdays: [1, 7] } // Nice and tidy
  }
],
```

Let's consider another simple example of displaying dot indicators on the last Friday of every other month, starting on January 1st of 2018. We could do so like this.

```javascript
...
  attrs: [
    {
      dot: { backgroundColor: 'red' },
      dates: {
        start: new Date('1/1/2018'),
        monthlyInterval: 2,           // Every other month
        ordinalWeekdays: { [-1]: 6 }  // ...on the last Friday
      }
    }
  ]
...
```

Now, for some reason, we also want to display them on the 15th of every other month, so our first attempt might be to modify the dates to this:

```javascript
...
dates: {
  start: new Date('1/1/2018'),
  monthlyInterval: 2,           // Every other month
  ordinalWeekdays: { [-1]: 6 }, // ...on the last Friday
  days: 15                      // ...and on the 15th? (WRONG!)
},
...
```

But this would be **wrong**, because all component specifiers are conditionally *anded* with each other.

To evaluate a set of conditions *or* another set, we can break the sets of conditions out into an array assigned to the `on` property.

```javascript
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

Note how we kept the `monthlyInterval` condition outside of the others. Any conditions that should be **anded** with all the others can be extracted out of the array. This prevents unnecessary duplication of conditions within **or** subsets.

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



## Quick Start

[Vue.js](https://vuejs.org) version 2.5.0+ is required.

### 1 Install via npm

```bash
npm install v-calendar
```

### 2 Import and use VCalendar
```javascript
import Vue from 'vue';
import VCalendar from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';

// Use v-calendar, v-date-picker & v-popover components
Vue.use(VCalendar);
```

### 3 Reference in your component templates
```html
<template>
  <v-calendar
    is-double-paned>
  </v-calendar>
  <v-date-picker
    mode='single'
    v-model='selectedValue'>
  </v-date-picker>
</template>
```
```javascript
<script>
export default {
  data() {
    return {
      selectedValue: new Date(),
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

## License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, Nathan Reyes