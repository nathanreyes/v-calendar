# V-Calendar

> V-Calendar is a lightweight, dependency-free plugin for building attributed calendars in Vue.js.

Visit http://vcalendar.netlify.com for demos and API reference. This plug-in is currently in beta state.

## Features

* Display clean and simple attributed calendars
* Built-in support for various attributes, including
  * highlighted regions
  * indicators
  * day content styles (hovered and non-hovered)
* Apply attributes over multiple dates or date ranges (start & end dates)
* Date-picker supporting all native v-calendar props/events with various selection modes
  * single date
  * multiple dates
  * date range
* Extensive API with custom slot support
* Responsive and mobile-friendly
  * Handles taps for date selection
  * Handles swipes for month navigation

## Quick Start

[Vue.js](https://vuejs.org) version 2.4+ is required.

### 1 Install via npm

```bash
npm install v-calendar
```

### 2 Import and use VCalendar
```javascript
import Vue from 'vue';
import VCalendar from 'v-calendar';
import 'vcalendar/lib/vcalendar.min.css';

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