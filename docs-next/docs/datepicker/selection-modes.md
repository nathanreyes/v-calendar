---
title: Date Picker | Selection Modes
---

# Selection Modes

Use the `mode` prop to switch between 3 different date selection modes: `date`, `dateTime` and `time`.

## Date

To limit user selection to only date components (month, day, year), use `mode: 'date'`. This is the default prop value, so it isn't explicitly required.

<DateWithValue mode="date" />

```html
<DatePicker mode="date" v-model="date" />
```

## Date & Time

To allow user selection of date and time components, use `mode: 'dateTime'`. A time picker now appears below the calendar.

<BaseAlert info>
  Time components are set using the current timezone setting set by the `timezone` prop. By default, this value is `undefined`, which specifies the local timezone.
</BaseAlert>

<DateWithValue mode="dateTime" />

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

## Time

To limit user selection to only time components (hours, minutes, seconds), use `mode: 'time'`.

<DateWithValue mode="time" />

```vue
<template>
  <DatePicker mode="time" v-model="date" :timezone="timezone" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

## 24-hr

When `mode` is `time` or `dateTime`, use the `is24hr` prop to use 24-hr selections.

<DateWithValue mode="dateTime" is24hr />

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" is24hr />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date())
</script>
```

### Minute Increments

Use the `minute-increment` prop to set custom intervals for the minute `select` options.

<!-- <guide-datepicker-minute-increment /> -->

```html
<v-date-picker v-model="date" mode="dateTime" :minute-increment="5" />
```

```js
export default {
  data() {
    let date = new Date();
    date.setMinutes(0, 0, 0);
    return {
      date,
    };
  },
};
```

<BaseAlert warning>
If the bound date does not match of the the minute options derived by the `minute-increment` amount, the accurate `minute` amount will be displayed, but this option will be disabled.
</BaseAlert>