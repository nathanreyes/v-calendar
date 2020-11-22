# VCalendar Plugin for Vue 3

A Vue plugin for for attributed calendars date pickers.

**Technologies Used:**\
[Vuejs 3.0](https://github.com/vuejs/vue-next)\
[Typescript](https://github.com/microsoft/TypeScript)\
[Rollup](https://github.com/rollup/rollup)

### Install Plugin

```shell
yarn add v-calendar@next
```

### Use Plugin

```js
import { createApp } from 'vue';
import VCalendar from 'v-calendar';

// Create the app
const app = createApp();

// Use the plugin with optional defaults as 2nd paramter
app.use(VCalendar);
```

### Use Components

```html
<template>
  <Calendar />
  <DatePicker v-model="date" />
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
};
```

## Source setup

Please follow below mentioned step to run this project:

### Clone the repo

```shell
git clone https://github.com/nathanreyes/vue3-component-library
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Build Library

```
yarn build:js
```

### Build Library With Separate Css file

```
yarn build:js_css
```

### Lints and fixes files

```
yarn lint
```
