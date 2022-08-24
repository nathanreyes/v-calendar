---
title: Date Picker | Introduction
---

# Introduction

`DatePicker` is a feature-rich date picker component implemented as a wrapper for `Calendar`. Thus, it accepts all same props and emits all of the same events.

It supports binding to both single dates and dates ranges. It can be configured for date and time selection modes, and can bind to various date types including dates, strings, numbers and even object date configurations.

In short, it was built build to handle most date picker needs.

## Selection modes

Use the `mode` prop to switch between 3 different date selection modes: `date`, `dateTime` and `time`.

### Date Mode

`DatePicker` can bind to single dates using the `v-model` directive.

To limit user selection to only date components (month, day, year), use `mode: 'date'`. This is the default prop value, so it isn't explicitly required.

<Example centered>
  <DateWithValue mode="date" />
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="date" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

### Date Time Mode

To allow user selection of date and time components, use `mode: 'dateTime'`. A time picker now appears below the calendar.

<BaseAlert info>
  Time components are set using the current timezone setting set by the `timezone` prop. By default, this value is `undefined`, which specifies the local timezone.
</BaseAlert>

<Example centered>
  <DateWithValue mode="dateTime" />
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

### Time Mode

To limit user selection to only time components (hours, minutes, seconds), use `mode: 'time'`.

<Example centered>
  <DateWithValue mode="time" />
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="time" :timezone="timezone" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

## Required date

When selecting dates, the default behavior is to allow the user to reset the date value to `null` be re-selecting a date.

To prevent this, set the `is-required` prop.

<Example centered>
  <DateWithValue mode="dateTime" is-required />
</Example>

## Date range

Bind to a date range with `start` and `end` dates by setting the `is-range` prop.

<Example centered>
  <DateWithValue mode="dateTime" is-range />
</Example>

```vue
<template>
  <DatePicker v-model="range" mode="dateTime" is-range />
</template>
<script setup>
import { ref } from 'vue';
const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10),
});
</script>
```