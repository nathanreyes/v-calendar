---
title: 'Timezones'
---

# Timezones

To assign a timezone, pass the `timezone: String` prop with the desired timezone setting for either `VDatePicker` or `VCalendar`.

Reference this [stack overflow](https://stackoverflow.com/questions/38399465/how-to-get-list-of-all-timezones-in-javascript) question for guidance on obtaining a base list of available timezones. In addition to the timezones supported, `UTC` may be used for the Coordinated Universal Time setting.

By default, the `timezone` prop is `undefined`, which defaults to using the browser's local timezone.

## Calendar Attributes

The `timezone` prop is used to set the beginning and ending time boundaries for each calendar day. As a result, a calendar attribute that displays for a user in one timezone may display differently in another timezone.

<TimezonesAttributes />

```vue
<template>
  <TimezonePicker v-model="timezone" />
  <VCalendar :attributes="attrs" :timezone="timezone" />
</template>

<script setup>
import { ref, computed } from 'vue';

const timezone = ref('UTC');
const attrs = ref([
  {
    highlight: true,
    dates: { start: '2020-10-05T10:00:00Z', end: '2020-10-09T09:00:00Z' },
  },
  {
    dot: 'pink',
    dates: '2020-10-01T18:00:00Z',
  },
  {
    dot: 'indigo',
    dates: '2020-10-11T19:00:00Z',
  },
  {
    dot: 'indigo',
    dates: '2020-10-15T01:00:00Z',
  },
  {
    dot: 'red',
    dates: '2020-10-21T05:00:00Z',
  },
  {
    dot: 'green',
    dates: '2020-10-21T00:00:00Z',
  },
  {
    dot: 'blue',
    dates: '2020-10-29T03:00:00Z',
  },
]);
</script>
```

## Date Picker

When using the `timezone` prop with `VDatePicker`, the displayed time will reflect the time associated with the date in the specified timezone.

<TimezonesPickerTime />

```vue
<template>
  <TimezonePicker v-model="timezone" />
  <VDatePicker mode="dateTime" v-model.range="range" :timezone="timezone" />
</template>

<script>
import { ref, computed } from 'vue';

const timezone = ref('UTC');
const range = {
  start: Date.UTC(2020, 0, 6),
  end: Date.UTC(2020, 0, 10),
};
</script>
```

## Time Rules

Assigned `rules` will respect the assigned `timezone`, or the local browser's timezone otherwise.

<Example centered>
  <TimezonesRules />
</Example>

```vue
<template>
  <VDatePicker v-model.range="range" :rules="rules" timezone="UTC" />
</template>

<script setup>
import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10),
});
const rules = ref({
  hours: 12,
  minutes: 0,
  seconds: 0,
});
</script>
```