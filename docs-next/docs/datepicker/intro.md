---
title: Date Picker | Introduction
---

# Introduction

`DatePicker` is a feature-rich date picker component implemented as a wrapper for `Calendar`. Thus, it accepts all same props and emits all of the same events.

It supports binding to both single dates and dates ranges. It can be configured for date and time selection modes, and can bind to various date types including dates, strings, numbers and even object date configurations.

In short, it was built build to handle most date picker needs.

## Single Date

`DatePicker` can bind to single dates using the `v-model` directive.

<Example centered>
  <DateWithValue />
</Example>

```vue
<template>
  <DatePicker v-model="date" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

## Date Range

Bind to a date range with `start` and `end` dates by setting the `is-range` prop.

<Example centered>
  <DateWithValue is-range />
</Example>

```vue
<template>
  <DatePicker v-model="range" is-range />
</template>
<script setup>
import { ref } from 'vue';
const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10),
});
</script>
```