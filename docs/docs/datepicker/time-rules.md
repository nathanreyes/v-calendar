---
title: Date Picker | Time Rules
---

# Time Rules

## Introduction

Rules can be defined for time components, including `hours`, `minutes`, `seconds` and `milliseconds`. They can be used for all selection mode types (`date`, `dateTime` and `time`) and both 12 and 24-hour modes.

### Default bahavior

First, it's important to note that, with no rules present, `VDatePicker` will **not** apply any time modifications to a bound date during the mounting phase. This ensures data consistency throughout your web application.

After initial mount, if the user selects new dates in the calendar, only the year, month and day components are updated. If the user selects a new time component in the time picker, only those components are updated, respectively.

<Example centered>
  <DateRulesIntroDefault />
</Example>

```vue
<template>
  <DateModePicker v-model="mode" />
  <VDatePicker v-model="date" :mode="mode" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const mode = ref('date');
</script>
```

## Date Example

Let's start with a simple example to show how rules work. We can zero-out time components by setting a `rules` prop object with hard-coded values for the time component keys.

Note how the `Value` displayed below shows the zero-ed out time components. A date was passed in (`new Date()`) and the `VDatePicker` applied the rules on mount and re-emitted the new date value.

<Example centered>
  <DateRulesIntroDate />
</Example>

```vue
<template>
  <VDatePicker v-model="date" :rules="rules" />
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

<BaseAlert title="When are rules applied?">

Rules are applied to date values on initial mount **and** future updates.
</BaseAlert>

<BaseAlert title="Do timezones affect how rules are applied?">

Rules are applied respective of the browser's current timezone, unless the `timezone` prop is explicitly provided.
</BaseAlert>

<BaseAlert title="Do rules affect the time picker?">
Rules do limit what time component selections are available in the time picker.
</BaseAlert>

## Date Range Selection

For date ranges, we can normalize the start time to the start of day and the end time to the end of day. Pass an array of rule objects (`[startRules, endRules]`) to target start and end dates.

<Example centered>
  <DateRulesIntroDateRange />
</Example>

```vue
<template>
  <DateModePicker v-model="mode" />
  <VDatePicker v-model.range="range" :mode="mode" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10)
});
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

Now that we've briefly been introduced to a few simple rules, we can explore what kind of rules can be defined.

## Rules Definition

The `rules` prop is defined as an object with optional rules specified for each time component key.

```ts
interface DatePartsRules {
  hours?: DatePartsRule;
  minutes?: DatePartsRule;
  seconds?: DatePartsRule;
  milliseconds?: DatePartsRule;
}

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
  <VDatePicker v-model="date" mode="dateTime" :rules="rules" />
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
  <VDatePicker v-model="date" mode="dateTime" :rules="rules" />
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

A rule may be an object with the following definition.

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
  <VDatePicker v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const rules = ref({
  hours: { min: 12, max: 20 },
  minutes: { interval: 5 },
});
</script>
```

## Function Rules

Finally, a rule may be defined as a function that accepts the time component value along with a `DateParts` object and returns a boolean.

```ts
type DatePartsRuleFunction = (component: number, parts: DateParts) => boolean;

export interface DateParts {
  dayIndex: number;
  day: number;
  dayFromEnd: number;
  weekday: number;
  weekdayOrdinal: number;
  weekdayOrdinalFromEnd: number;
  week: number;
  weekFromEnd: number;
  weeknumber: number;
  month: number;
  year: number;
  date: Date;
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  time: number;
  dateTime: number;
  isValid: boolean;
  timezoneOffset: number;
  isPm?: boolean;
}
```

These are the most flexible type of rules. For example, we could limit time selection to morning hours on weekends.

<Example centered>
  <DateRulesFunction />
</Example>

```vue
<template>
  <VDatePicker v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  hours: (hour, { weekday }) => {
    // 8AM - 12PM on the weekends
    if ([1, 7].includes(weekday)) return hour >= 8 && hour <= 12;
    // Any hour otherwise
    return true;
  },
});
</script>
```

## Auto Rules

`VDatePicker` can make a "best guess" for what rules to apply based on the current date `mode` and `time-accuracy` props.

For example, using `mode: 'date'` will zero-out hours, minutes, seconds and milliseconds. Otherwise, the `time-accuracy` prop will only zero-out components more accurate than the current setting. Finally, more adjustments could be made when using the `range` modifier.

<Example centered>
  <DateRulesAuto />
</Example>

```vue
<template>
  <DateModePicker v-model="mode" />
  <TimeAccuracyPicker v-model="timeAccuracy" />
  <VDatePicker
    v-model="date"
    :mode="mode"
    :time-accuracy="timeAccuracy"
    rules="auto"
    />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const mode = ref('date');
const timeAccuracy = ref(2);
</script>
```