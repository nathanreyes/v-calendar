---
title: 'Installation'
---

# Installation

<BaseAlert title="Requirement">

  [Vue.js](https://vuejs.org) version 3.2+ is required.
</BaseAlert>

<BaseAlert title="CSS">

**As of `v3.0.0-alpha.7`, all installation methods require manual import of component styles. This is due to Vite build restrictions in libary mode.**
</BaseAlert>

```js
import 'v-calendar/style.css';
```

## Install Plugin

::: code-group

```shell [npm]
npm install v-calendar
```

```shell [yarn]
yarn add v-calendar
```

:::

## Use Plugin

### Option 1: Use Globally

```js
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

// Use plugin with optional defaults
app.use(VCalendar, {})
```

```html
<!-- Component.vue template -->
<template>
  <VCalendar />
  <VDatePicker v-model="date" />
</template>
```

### Option 2: Use Components Globally

```js
// main.js
import { SetupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

// Use plugin defaults (optional)
app.use(SetupCalendar, {})

// Use the components
app.component('Calendar', Calendar)
app.component('DatePicker', DatePicker)
```

```html
<!-- Component.vue template -->
<template>
  <VCalendar />
  <VDatePicker v-model="date" />
</template>
```

### Option 3: Use Components As Needed

```js
// main.js
import { SetupCalendar } from 'v-calendar';

// Use calendar defaults (optional)
app.use(SetupCalendar, {})
```

```html
<!-- Component.vue template -->
<template>
  <VCalendar />
  <VDatePicker v-model="date">
</template>
```

```js
// Component.vue script
import { Calendar, DatePicker } from 'v-calendar';

export default {
  components: {
    Calendar,
    DatePicker,
  },
  data() {
    return {
      date: new Date(),
    };
  },
}
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
      <VCalendar />
      <VDatePicker v-model='selectedDate' />
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
