---
title: Date Picker | Time Rules
---

# Time Rules

## Date Selection

Rules can be enforced for time components, including `hours`, `minutes`, `seconds` and `milliseconds`. There are no restriction for their use, including all selection mode types (`date`, `dateTime` and `time`) and may be applied for both 12 and 24-hour modes.

### Default bahavior

First, it would be good to discuss the default behavior of `DatePicker` with no rules applied.

To ensure data consistency, `DatePicker` will **not** apply any time modifications to the initially bound date. 

If the user selects new dates in the calendar, only the year, month and day components are updated. 

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

However, we can normalize (or zero-out) the time components by setting a `rules` prop object with hard-coded values for the time component keys.

<BaseAlert title="When are rules applied?">
Rules are applied to date values on initial mount **and** future updates.
</BaseAlert>

<BaseAlert title="What timezone are rules applied">
Rules are applied respective of the current timezone, unless the `timezone` prop is explicitly provided.
</BaseAlert>

<Example centered>
  <DateRulesIntroDate />
</Example>

```vue
<template>
  <DatePicker v-model="date" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
// Remember, rules are applied in the browser's local timezone!
const rules = ref({
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});
</script>

```
<BaseAlert title="Time picker">
Rules can limit what time component selections are available in the time picker.
</BaseAlert>

## Date Range Selection

For date ranges, we could normalize the start time to the start of day and the end time to the end of day. Pass an array of rule objects (`[startRules, endRules]`) to target start and end dates.

<Example centered>
  <DateRulesIntroDateRange />
</Example>

```vue
<template>
  <DateModePicker v-model="mode" />
  <DatePicker v-model.range="range" :mode="mode" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const range = ref({ start: new Date(2020, 0, 6), end: new Date(2020, 0, 10) });
const mode = ref('date');
const rules = ref([
  {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  },
  {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  },
]);
</script>
```

## Rules Definition

The `rules` prop is defined as an object with optional rules specified for each time component key.

```ts
interface DatePartsRules {
  hours?: DatePartsRule;
  minutes?: DatePartsRule;
  seconds?: DatePartsRule;
  milliseconds?: DatePartsRule;
}
```

A rule can be defined in multiple ways.

```ts
type DatePartsRule =
  | number
  | Array<number>
  | NumberRuleConfig
  | DatePartsRuleFunction;
```

## Number Rules

A rule with a single number will limit selection to that value. For example, maybe you'd like to limit time selection within a specific hour.

<Example centered>
  <DateRulesNumber />
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  hours: 12,
  seconds: 0,
  milliseconds: 0,
});
</script>
```

## Number List Rules

A rule with an array of numbers will limit selection to values in the list.

<Example centered>
  <DateRulesArray />
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  hours: [12, 15, 18, 22],
});
</script>
```

## Object Rules

Finally, a rule may be an object with the following definition.

```ts
interface NumberRuleConfig {
  min?: number;
  max?: number;
  interval?: number;
}
```

All of the properties are optional and may be used in any combination. For example, we could limit selection to afternoon hours and 5-minute increments.

<Example centered>
  <DateRulesObject />
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  hours: { min: 12 },
  minutes: { interval: 5 },
});
</script>
```

## Auto Rules

If accounting for date modes, date ranges and time accuracy is too much, pass `rules: 'auto'`, and `DatePicker` will make a "best guess" for what rules to apply.

For example, for `mode: 'date'`, then hours, minutes, seconds and milliseconds will zero-out. Otherwise, the `time-accuracy` prop will only zero-out components more accurate than the current setting. Finally, more adjustments could be made when using the `range` modifier.

<Example centered>
  <DateRulesAuto />
</Example>