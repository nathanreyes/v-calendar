---
title: Date Picker | Selection Modes
---

# Selection Modes

Use the `mode` prop to switch between 3 different date selection modes: `date`, `dateTime` and `time`.

## Date

To limit user selection to only date components (month, day, year), use `mode: 'date'`. This is the default prop value, so it isn't explicitly required.

<DateWithValue mode="date" />

```vue
<template>
  <DatePicker v-model="date" mode="date" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
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
  <DatePicker v-model="date" mode="time" :timezone="timezone" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

## 24-hr

When `mode` is `dateTime` or `time`, use the `is24hr` prop to use 24-hr selections.

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

## Sub-minute

Use the `show-seconds` and `show-milliseconds` props to allow selection of `seconds` and `milliseconds`.

<DateWithValue mode="dateTime" is24hr show-seconds show-milliseconds />