# VCalendar Plugin for Vue 3

A Vue plugin for for attributed calendars date pickers using Vue 3, Typescript and Rollup.

### Install Plugin

```shell
yarn add v-calendar@next
```

### Use Plugin
#### Method 1: Use Globally

```js
import { createApp } from 'vue';
import VCalendar from 'v-calendar';

// Method 1
import VCalendar from 'v-calendar';
// Create the app
createApp(App)
  // Use the plugin with optional defaults
  .use(VCalendar, {})
  // Mount the app
  .mount('#app');
```

```html
<template>
  <v-calendar />
  <v-date-picker v-model="date" />
</template>
```

### Method 2: Use Components Globally

```js
import { createApp } from 'vue';
import { SetupCalendar, Calendar, DatePicker } from 'v-calendar';

// Create the app
createApp(App)
  // Setup the plugin with optional defaults
  .use(SetupCalendar, {})
  // Use the components
  .component('Calendar', Calendar)
  .component('DatePicker', DatePicker)
  // Mount the app
  .mount('#app');
```

```html
<template>
  <Calendar />
  <DatePicker v-model="date" />
</template>
```

### Method 3: Use Components As Needed

```html
<template>
  <Calendar />
  <DatePicker v-model="date">
</template>
```

```js
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

## Source setup

Please follow below mentioned step to run this project:

### Clone the repo

```shell
git clone https://github.com/nathanreyes/v-calendar

# Move to directory
cd v-calendar
```

### Install dependencies

```shell
yarn
```

### Switch to `/next` branch

```shell
git checkout next
```

### Compile and hot-reload for development

```shell
yarn serve
```

### Compile and minify for production

```shell
yarn build
```

### Build Library

```shell
# ES
yarn build:es

# ES, CommonJS and IIFE
yarn build:lib

# ES, CommonJS, IIFE and CSS
yarn:build:lib_css
```

### Lint and fix files

```shell
yarn lint
```
