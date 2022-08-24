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
  <DatePicker v-model="date" mode="dateTime" is24hr />
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

## Hide Header

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

## Rules

<BaseAlert warning>
Used in versions previous to v3.0-beta.0, the `minute-increment` and `valid-hours` props have been deprecated in favor of using `rules`.
</BaseAlert>

Rules can be enforced for time components, including `hours`, `minutes`, `seconds` and `milliseconds`. Rules may be used for all selection mode types (`date`, `dateTime` and `time`) and may be applied for both 12 and 24-hour modes.

For example, we could limit the hours to a specific list of 24-hour based numbers (15, 18, 20) and the minutes in increments of 5.

<Example centered>
  <DateRulesIntro /> 
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  hours: [15, 18, 20],
  minutes: {
    interval: 5,
  },
});
</script>
```

<BaseAlert warning>
Rules will adjust dates to the nearest allowed time component.
</BaseAlert>

### Rules Definition

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

### Number Rules

A rule with a single number will limit selection to that value. For example, most often you might want to zero out seconds and milliseconds from the date value.

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
  seconds: 0,
  milliseconds: 0,
});
</script>
```

### Number List Rules

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

### Object Rules

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

## Custom Slot

## Date Mode

Since rules can modify the bound date if it does not meet the rule requirements, they can be used in simple `date` selection mode.

<Example centered>
  <DateRulesDateMode />
</Example>