---
title: Date Picker | Selection Modes
---

# Selection Modes

Use the `mode` prop to switch between 3 different date selection modes: `date`, `dateTime` and `time`.

## Date

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

## Date & Time

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

## Time

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

## 24-hr

When `mode` is `dateTime` or `time`, use the `is24hr` prop to use 24-hr selections.

<Example centered>
  <DateWithValue mode="dateTime" is24hr />
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" is24hr />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date())
</script>
```

## Time Accuracy

The `time-accuracy` prop can be used to limit what components are allowed for selection.

The time accuracy is a number mapping to the most accurate time component allowed (`1`: hours, `2`: minutes, `3`: seconds, `4`: milliseconds). The default value is `2`: minutes.

<Example centered>
  <DateTimeAccuracy />
</Example>

## Time Header

The time header may be hidden via the `hide-time-header` prop.

<Example centered>
  <DateWithValue mode="dateTime" hide-time-header />
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" hide-time-header />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date())
</script>
```

## Time Slot