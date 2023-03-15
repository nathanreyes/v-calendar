---
title: 'Installation'
---

# Installation

<BaseAlert title="Dependencies" hide-title>

[Vue.js](https://vuejs.org) 3.2+, [Popper.js](https://popper.js.org/docs/v2/) 2.0+ are required.
</BaseAlert>

## Install Plugin

::: code-group

```shell [npm]
npm install v-calendar@next @popperjs/core
```

```shell [yarn]
yarn add v-calendar@next @popperjs/core
```

:::

## Use Plugin

<BaseAlert title="CSS import">

**As of `v3.0.0-alpha.7`, all installation methods require manual import of component styles. This is due to Vite build restrictions in libary mode.**
</BaseAlert>

```js
import 'v-calendar/style.css';
```

### Method 1: Use Globally

::: code-group

```js [main.js]
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

// Use plugin with optional defaults
app.use(VCalendar, {})
```

```html [MyComponent.vue]
<template>
  <VCalendar />
  <VDatePicker v-model="date" />
</template>
```

:::

### Method 2: Use Components Globally

::: code-group

```js [main.js]
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

// Use plugin defaults (optional)
app.use(setupCalendar, {})

// Use the components
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
```

```html [MyComponent.vue]
<template>
  <VCalendar />
  <VDatePicker v-model="date" />
</template>
```

:::

### Method 3: Use Components As Needed

::: code-group

```js [main.js]
import { setupCalendar } from 'v-calendar';

// Use calendar defaults (optional)
app.use(setupCalendar, {})
```

```vue [MyComponent.vue]
<template>
  <Calendar />
  <DatePicker v-model="date">
</template>

<script>
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

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
</script>
```

:::

### Plugin Defaults

As referenced above, custom defaults can be provided when using the plugin, but still can be overridden by props on `VCalendar` or `VDatePicker` components.

[Reference defaults](/calendar/api#defaults)

## Use from CDN

```html
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <meta http-equiv='x-ua-compatible' content='ie=edge'>
  </head>
  <body>
    <div id='app'>
      <VCalendar />
      <VDatePicker v-model='selectedDate' />
    </div>

    <!-- Vue  -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <!-- VCalendar (automatically installed) -->
    <script src="https://unpkg.com/v-calendar"></script>

    <script>
      const { createApp } = Vue

      createApp({
        data() {
          return {
            selectedDate: null,
          }
        }
      }).mount('#app')
    </script>
  </body>
</html>
```
