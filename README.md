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

// Use the plugin with optional defaults as 2nd parameter
app.use(VCalendar, {});
```

### Use Components Globally

```js
import { createApp } from 'vue';
import { Calendar, DatePicker } from 'v-calendar';

// Create the app
const app = createApp();

// Use each component with optional defaults as 2nd parameter
app.use(Calendar).use(DatePicker);
```

## Source setup

Please follow below mentioned step to run this project:

### Clone the repo

```shell
git clone https://github.com/nathanreyes/v-calendar

// Move to directory
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

### Compiles and hot-reloads for development

```shell
yarn serve
```

### Compiles and minifies for production

```shell
yarn build
```

### Build Library

```shell
// ES
yarn build:es

// ES, CommonJS and IIFE
yarn build:lib

// ES, CommonJS, IIFE and CSS
yarn:build:lib_css
```

### Lints and fixes files

```shell
yarn lint
```
