---
title: Date Picker | Time Rules
---

# Time Rules

Rules can be enforced for time components, including `hours`, `minutes`, `seconds` and `milliseconds`. Rules may be used for all selection mode types (`date`, `dateTime` and `time`) and may be applied for both 12 and 24-hour modes.

<BaseAlert warning>
Rules will adjust dates to the nearest allowed time component.
</BaseAlert>

For example, we could limit the hours to a specific list of 24-hour based numbers (15, 18, 20) and the minutes in increments of 5.

<DateRulesIntro />

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

A rule with a single number will limit selection to that value. For example, most often you might want to zero out seconds and milliseconds from the date value.

<DateRulesNumber />

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

## Number List Rules

A rule with an array of numbers will limit selection to values in the list.

<DateRulesArray />

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

<DateRulesObject />

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

## Date Selection Mode

Since rules can modify the bound date if it does not meet the rule requirements, they can be used in simple `date` selection mode.

<DateRulesDateMode />

### Minute Increments

Use the `minute-increment` prop to set custom intervals for the minute `select` options.

<!-- <guide-datepicker-minute-increment /> -->

```html
<v-date-picker v-model="date" mode="dateTime" :minute-increment="5" />
```

```js
export default {
  data() {
    let date = new Date();
    date.setMinutes(0, 0, 0);
    return {
      date,
    };
  },
};
```

<BaseAlert warning>
If the bound date does not match of the the minute options derived by the `minute-increment` amount, the accurate `minute` amount will be displayed, but this option will be disabled.
</BaseAlert>