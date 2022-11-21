---
title: 'Dates'
---

# Dates

Date expressions are used in VCalendar to display attributes and disable days in the calendar and date picker.

## Simple dates

For example, we can pass a single date to highlight today's date in the calendar.

<Example centered>
  <DatesSimpleSingle />
</Example>

```vue{11}
<template>
  <Calendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = [
  {
    highlight: true,
    dates: new Date(),
  },
];
</script>
```

We can also pass multiple dates in an array to highlight multiple dates in the calendar.

<Example centered>
  <DatesSimpleMultiple />
</Example>

```vue{11-16}
<template>
  <Calendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = [
  {
    highlight: true,
    dates: [
      new Date(2022, 10, 2),
      new Date(2022, 10, 7),
      new Date(2022, 10, 17),
      new Date(2022, 10, 23),
    ],
  },
];
</script>
```

## Date ranges

Date ranges are also valid date expressions. Use the `start` and `end` date properties to configure date ranges.

<Example centered>
  <DatesRangeMultiple />
</Example>

```vue
<template>
  <Calendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = [
  {
    highlight: 'blue',
    dates: [
      new Date(2022, 10, 4),
      { start: new Date(2022, 10, 7), end: new Date(2022, 10, 9) },
    ],
  },
  {
    highlight: 'red',
    dates: [{ start: new Date(2022, 10, 17), end: new Date(2022, 10, 19) }],
  },
  {
    highlight: 'green',
    dates: [{ start: new Date(2022, 10, 20), end: new Date(2022, 10, 24) }],
  },
];
</script>
```