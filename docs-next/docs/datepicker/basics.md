---
title: Date Picker | Basics
---

# Basics

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

When selecting dates, the default behavior is to allow the user to reset the date value to `null` be re-selecting it.

To prevent this, set the `is-required` prop.

<Example centered>
  <DateWithValue mode="dateTime" is-required />
</Example>

## String dates

To bind to a string value, set the `string` modifier. In this example, the date is provided in ISO-8601 format with the Z designator (zero UTC offset).

<Example centered>
  <ModelModifierString />
</Example>

```vue
<template>
  <DateDisplay v-model.string="date" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref('2000-01-01T12:00:00.000Z');
</script>
```

### Custom mask

If an alternate model format is needed, set the `masks.modelValue` property with the desired format.

<Example centered>
  <ModelModifierStringMask />
</Example>

```vue
<template>
  <DatePicker v-model.string="customer.birthday" :masks="masks" />
</template>

<script setup>
import { reactive, ref } from 'vue';

const customer = reactive({
  name: 'Nathan Reyes',
  birthday: '1983-01-21',
});
const masks = ref({
  modelValue: 'YYYY-MM-DD',
});
</script>
```

## Number dates

To bind to a number value, set the `number` modifier. The model value should be an integer value representing the number of milliseconds since January 1, 1970, 00:00:00 UTC (the ECMAScript epoch, equivalent to the UNIX epoch).

<Example centered>
  <ModelModifierNumber />
</Example>

```vue
<template>
  <DateDisplay v-model.number="dateNum" timezone="utc" />
</template>

<script setup>
import { ref } from 'vue';
const dateNum = ref(0);
</script>
```

## Date ranges

To bind to a date range with `start` and `end` dates, set the `range` modifier.

<BaseAlert title="Deprecation warning" warning>

The `is-range` prop will continue to be supported, but may be deprecated in a future release.
</BaseAlert>

<Example centered>
  <ModelModifierRange />
</Example>

```vue
<template>
  <DatePicker v-model.range="range" mode="dateTime" />
</template>

<script setup>
import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10),
});
</script>
```

## Combine modifiers

Modifiers may be combined. For example, we could bind to a date range with number dates.

<Example centered>
  <ModelModifiersRangeNumber />
</Example>

```vue
<template>
  <DatePicker v-model.range.number="range" />
</template>

<script setup>
import { ref, computed } from 'vue';
const range = ref({ start: 1578290400000, end: 1578636000000 });
</script>
```

## Disable dates

Use `disabled-dates` to disable the user from selecting dates or date ranges that intersect the disabled dates. Any dates specified will disable date and time selection for the the full day.

<Example centered>
  <DateDisabled />
</Example>