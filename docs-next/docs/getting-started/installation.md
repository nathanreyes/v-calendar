---
title: 'Installation'
---

# Installation

<BaseAlert title="Requirement">
  [Vue.js](https://vuejs.org) version 3.2+ is required.
</BaseAlert>

## NPM

```shell
npm install v-calendar
```

## Usage

### Method 1. Use In Components

```vue
<template>
  <Calendar />
  <DatePicker />
</template>

<script setup>
import { Calendar, DatePicker } from 'v-calendar';
</script>
```

If you would still like to provide [plugin defaults](../api/defaults.md), call `setupCalendar` before using any components.

### Method 2. Register App Plugin

```js
// main.js
import { createApp } from 'vue';
import VCalendar from 'v-calendar';

// Create app
const app = createApp({});

// Use plugin w/ defaults
app.use(VCalendar, {})
```

### Method 3. Register App Components

```js
// main.js
import { createApp } from 'vue';
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';

// Create app
const app = createApp({});

// Use defaults
setupCalendar({
  componentPrefix: 'vc',
  ...,
});

// Register components
app.component('Calendar', Calendar)
app.component('DatePicker', DatePicker)

```

## CDN (TODO: Fix)

```html
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <meta http-equiv='x-ua-compatible' content='ie=edge'>
    <!-- IMPORTANT: No CSS link needed as of v1 - It's all inlined -->
    <!-- Pre v1.0.0 versions need the minified css -->
    <!-- <link rel='stylesheet' href='https://unpkg.com/v-calendar/lib/v-calendar.min.css'> -->
  </head>
  <body>
    <div id='app'>
      <Calendar />
      <DatePicker v-model='selectedDate' />
    </div>

    <!-- 1. Link Vue Javascript -->
    <script src='https://unpkg.com/vue/dist/vue.js'></script>

    <!-- 2. Link VCalendar Javascript (Plugin automatically installed) -->
    <script src='https://unpkg.com/v-calendar'></script>

    <!--3. Create the Vue instance-->
    <script>
      new Vue({
        el: '#app',
        data: {
          selectedDate: null,
        }
      })
    </script>
  </body>
</html>
```
