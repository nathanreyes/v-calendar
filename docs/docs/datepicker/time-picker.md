---
title: Date Picker | Time Picker
---

# Time Picker

## 24-hr

When `mode` is `dateTime` or `time`, use the `is24hr` prop to use 24-hr selections.

<Example centered>
  <DateWithValue mode="dateTime" is24hr />
</Example>

```vue
<template>
  <VDatePicker v-model="date" mode="dateTime" is24hr />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date())
</script>
```

## Hide Header

The time header may be hidden via the `hide-time-header` prop.

<Example centered>
  <DateWithValue mode="dateTime" hide-time-header />
</Example>

```vue
<template>
  <VDatePicker v-model="date" mode="dateTime" hide-time-header />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date())
</script>
```

## Accuracy

The `time-accuracy` prop can be used to limit what components are allowed for selection.

The time accuracy is a number mapping to the most accurate time component allowed (`1`: hours, `2`: minutes, `3`: seconds, `4`: milliseconds). The default value is `2`: minutes.

<Example centered>
  <DateTimeAccuracy />
</Example>

```vue
<template>
  <TimeAccuracyPicker v-model="timeAccuracy" />
  <VDatePicker v-model="date" mode="dateTime" :time-accuracy="timeAccuracy" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const timeAccuracy = ref(3);
</script>
```
