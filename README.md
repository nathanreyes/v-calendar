# Welcome to V-Calendar

V-Calendar is a clean and lightweight plugin for displaying simple, attributed calendars in Vue.js. It uses attributes to decorate the calendar with various visual indicators including highlighted date regions, dots, bars, content styles and popovers for simple tooltips and even custom slot content.

<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/welcome-1.png' title='Calendar with attributes' width='500'>
</p>

Any single attribute may contain one of each object and can be displayed for single dates, date ranges and even complex date patterns like every other Friday, the 15th of every month or the last Friday of every other month.

It has date picker support out of the box with single date, multiple date and date range selection modes. Because `v-date-picker` is simply a wrapper for `v-calendar`, both can be extensively customized using props, slots and theme styling, just like `v-calendar`. And of course, V-Calendar is responsive and mobile friendly. For example, it supports touch swipes for month navigation.

## Calendar

`v-calendar` is the core component. By default, it has a neutral design that should blend nicely within any web application, with various options for configuring the basic layout: 
  * Single or double paned
  * Can be expanded to fill the width of its container
  * Header can be left, right or center-aligned
  * Slot support for custom headers and arrows
  * Navigation transitions (horizontal slide, vertical slide, fade)

Along with the calendar panes, `v-calendar` employs a semantic-inspired navigation pane when the header title is hovered or focused by the user.

<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/calendar-1.png' title='Calendar with attributes' width='250'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/calendar-2.png' title='Calendar with attributes' width='250'>
</p>

### Attributes
Attributes are the most important concept to understand. They provide a powerful way to communicate visual information to your users quickly and effectively. Fortunately, they are also easy to specify. 

#### What to display

The first thing to understand about attributes is what they are capable of displaying.

* Highlights
* Dot Indicators
* Bar Indicators
* Popovers
* Content Styles
* Content Hover Styles (applied on hover state)

For now, let's just start by displaying a simple highlight on today's date.

```html
<template>
  <v-calendar :attributes='attrs'>
  </v-calendar>
</template>
```
```javascript
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#ff8080',
            // Other properties are available too, like `height` & `borderRadius`
          },
          dates: new Date(2018, 0, 1)
        }
      ],
    };
  },
};
```
<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/attributes-1.png' width='250'>
</p>

To add some contrast to the highlighted date, we can use a content style, which is simply a style object that gets applied to the day content text.

```javascript
export default {
  data() {
    return {
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
          dates: new Date(2018, 0, 1)
        },
      ],
    };
  },
};
```

<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/attributes-2.png' width='250'>
</p>

Finally, let's see how simple it is to add a popover label (or tooltip) to the calendar when this highlight is hovered over. To do that, we just need to add a popover section to our attribute.

```javascript
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          dates: new Date(2018, 0, 1),
          highlight: {
            backgroundColor: '#ff8080',
          },
          // Just use a normal style
          contentStyle: {
            color: '#fafafa',
          },
          // Our new popover here
          popover: {
            label: 'You just hovered over today\'s date!',
          }
        },
      ],
    };
  },
};
```

<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/attributes-3.png' width='330'>
</p>

#### Where to display

The second aspect of attributes is specifying where to display them. In the previous example, we saw that all we had to do was use a simple date object assigned to the `dates` property. Note that we aren't limited to using single date or date range objects. We can also use an array of dates.

```javascript
  ...
  dates: [ new Date(2018, 0, 1), new Date(2018, 0, 15) ]
  ...
```

<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/attributes-4.png' width='250'>
</p>

Or date ranges...

```javscript
  ...
  dates: [
    { start: new Date(2018, 0, 1), end: new Date(2018, 0, 5) },
    { start: new Date(2018, 0, 15), span: 5 } // Span is number of days
  ]
  ...
```

<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/attributes-5.png' width='250'>
</p>

Or date patterns.

```javascript
  ...
  dates: { weekdays: [1, 7] } // On the weekends
  ...
```

<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/attributes-6.png' width='250'>
</p>

## Date Picker

The `v-date-picker` component is a flexible date picker component wrapper around `v-calendar`, which means it supports all props and events that `v-calendar` does. Using the `mode` prop, it is capable of 3 selection modes:
  * Single dates
  * Multiple dates
  * Date ranges

Date pickers can be displayed inline or as a popover for an input element which can be classed or styled.

```html
<v-date-picker
  mode='range'
  v-model='selectedDate'
  show-caps>
</v-date-picker>
```
```javascript
export default {
  data() {
    return {
      selectedDate: {
        start: new Date(2018, 0, 9),
        end: new Date(2018, 0, 18)
      }
    };
  },
};
```
<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/date-picker-1.png' width='260'>
</p>

Also, a custom slot element can be used to display your own input element. This example uses [Buefy](https://buefy.github.io) for a custom styled input component.

```html
<v-date-picker
  mode='single'
  v-model='selectedDate'>
  <b-field :type='inputState.type' slot-scope='props'>
    <b-input
      type='text'
      icon='calendar'
      :value='props.inputValue'
      :placeholder='inputState.message'
      @change.native='props.updateValue($event.target.value)'
      expanded>
    </b-input>
    <p
      class='control'
      v-if='selectedValue'>
      <a
        :class='["button", inputState.type]'
        @click='selectedValue = null'>
        Clear
      </a>
    </p>
  </b-field>
</v-date-picker>
```
```javascript
export default {
  data() {
    return {
      selectedDate: new Date(2018, 0, 10)
    };
  },
  computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: 'is-danger',
          message: 'Date required.',
        };
      }
      return {
        type: 'is-primary',
        message: '',
      };
    },
  },
};
```
<p align='center'>
  <img src='https://raw.githubusercontent.com/nathanreyes/v-calendar-docs/master/gitbook/images/README/date-picker-2.png' width='300'>
</p>

You can disable dates, date ranges and date patterns using the following props:
  * Explicitly via `disabled-dates`.
    ```html
    <!--Disable weekend selection-->
    <v-date-picker
      :mode='single'
      :disabled-dates='{ weekdays: [1, 7] }'
      v-model='selectedDate'>
    </v-date-picker>
    ```
  * Implicitly via `available-dates`. Any dates not included in `available-dates` are disabled.
    ```html
    <!--Today is the minimum date (null denotes infinite date)-->
    <v-date-picker
      :mode='single'
      :available-dates='{ start: new Date(), end: null }'
      v-model='selectedDate'>
    </v-date-picker>
    ```
---

# Installation

[Vue.js](https://vuejs.org) version 2.5+ is required.

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

## Custom Defaults

Custom defaults can be provided on initialization. Note that almost all of these defaults can be overridden by props on `v-calendar` or `v-date-picker` components.

```javascript
Vue.use(VCalendar, {
  firstDayOfWeek: 1, // Set first day of week to Sunday
  ...
})
```

| Property Name | Type | Description | Default |
| ------------- | ---- | ----------- | ------- |
| `componentPrefix` | String | Custom prefix to use for plugin components | `"v"` |
| `firstDayOfWeek` | Number | Day number for the first day of the week (1: Sun - 7: Sat) | `1` |
| `monthLabels` | Array | Month labels displayed in header (localized) | `["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]` |
| `weekdayLabels` | Array | Weekday labels displayed in header. Start with Sunday, even if Sunday isn\'t set as the first day of the week. (localized) | `["S", "M", "T", "W", "T", "F", "S"]` |
| `navVisibility` | String | Visibility state for calendar navigation panel (`"focus"`, `"hover"`, `"visible"`, `"hidden"`) | `"focus"` |
| `titlePosition` | String | Position of the title in the header (`"left"`, `"center"`, `"right"`) | `"center"` |
| `titleTransition` | String | Transition type for title when navigating to a new page (`"slide-h"`, `"slide-v"`, `"fade"`, `"none"`) | `"slide-h"` |
| `weeksTransition` | String | Transition type for weeks when navigating to a new page (`"slide-h"`, `"slide-v"`, `"fade"`, `"none"`) | `"slide-h"` |
| `dateFormatter` | Function | Converts date object to preferred text format | `d => d.toLocaleDateString()` |
| `dateParser` | Function | Converts string to date object | `s => new Date(Date.parse(s))` |
| `datePickerInputClass` | String | Class to apply to input element. Not applicable for inline date-pickers. | `undefined` |
| `datePickerInputStyle` | Object | Style to apply to input element. Not applicable for inline date-pickers. | `undefined` |
| `datePickerInputPlaceholder` | String | Placeholder for input element. Not applicable for inline date pickers. | `undefined` |
| `datePickerSelectColor` | String | Background color of the highlighted select region. | `"#66B3CC"` |
| `datePickerDragColor` | String | Background color of the highlighted drag region. Only valid when `mode === "range"` | `""#9FCFDF""` |
| `datePickerShowCaps` | Boolean | Show caps and the end of the highlighted and dragged regions when `mode === "range"` | `false` |
| `datePickerShowPopover` | Boolean | Show popover for dragged and selected regions | `true` |
| `popoverExpanded` | Boolean | Popover wrapper for input or slot is expanded to the full width of its container. | `false` |
| `popoverDirection` | String | Direction that popover displays relative to input or slot element (`"bottom"`, `"top"`, `"left"`, `"right"`) | `"bottom"` |
| `popoverAlign` | String | How the popover is aligned relative to input or slot element (`"left"`, `"right"`, `"top"`, `"bottom"'`) | `"left"` |
| `popoverVisibility` | String | Visibility state of the popover (`"hover"`, `"focus"`, `"hidden"`, `"visible"`) | `"hover"` |
| `popoverContentOffset` | String | Distance that the popover content is offset from the input or slot element | `"10px` |
| `popoverKeepVisibleOnInput` | Boolean | Keep the popover visible after a valid input has been selected | `false` |
| `maxSwipeTime` | Number | Maximum time in milliseconds allowed for a swipe gesture to complete | `300` |
| `minHorizontalSwipeDistance` | Number | Minimum distance in pixels allowed for a horizontal swipe gesture | `60` |
| `maxVerticalSwipeDistance` | Number | Maximum distance in pixels allowed for a horizontal swipe gesture | `80` |
| `maxTapTolerance` | Number | Maximum distance in pixels allowed for a tap between `touchstart` and `touchend` events | `0` |
| `maxTapDuration` | Number | Maximum time in milliseconds allowed for a tap between `touchstart` and `touchend` events | `200` |