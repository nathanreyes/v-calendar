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
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: true,
    dates: new Date(),
  },
]);
</script>
```

We can also pass multiple dates in an array to highlight multiple dates in the calendar.

<Example centered>
  <DatesSimpleMultiple />
</Example>

```vue{11-16}
<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: true,
    dates: [
      new Date(2022, 10, 2),
      new Date(2022, 10, 7),
      new Date(2022, 10, 17),
      new Date(2022, 10, 23),
    ],
  },
]);
</script>
```

## Date ranges

Date ranges are also valid date expressions. They simply denote a range of dates from a start date to an end date.
### Range array

A range can be configured with an array of start/end dates.

<Example centered>
  <DatesRangeMultiple />
</Example>

```vue
<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: 'blue',
    dates: [
      new Date(2022, 10, 4),
      [new Date(2022, 10, 7), new Date(2022, 10, 9)],
    ],
  },
  {
    highlight: 'red',
    // Wrap lone date range in separate array to avoid rendering as multiple dates
    dates: [[new Date(2022, 10, 17), new Date(2022, 10, 19)]],
  },
  {
    highlight: 'green',
    dates: [[new Date(2022, 10, 20), new Date(2022, 10, 24)]],
  },
]);
</script>
```

### Range object

A range can also be configured as an object with the following definition.

```ts
type DateRangeConfig = Partial<{
  start: Date | null;
  end: Date | null;
  span: number;
  repeat: Partial<DateRepeatConfig>;
}>
```

#### Range span

Note from the definition above that the date range can be denoted with `start` and `end` dates or a `start` date and a `span` number of days added to compute the `end` date.

<Example centered>
  <DatesRangeSpan />
</Example>

```vue{11}
<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: 'blue',
    dates: [{ start: new Date(2022, 10, 7), span: 3 }],
  },
]);
</script>
```

#### Boundless dates

Also note that `start` and `end` dates can span forever backwards and forwards, respectively, by assigning `null` or `undefined` values.

Boundless dates probably make more sense when defining disabled date expressions.

<Example centered>
  <DatesDisabledBoundless />
</Example>

```vue{8}
<template>
  <VCalendar :disabled-dates="disabledDates" />
</template>

<script setup>
import { ref } from 'vue';

const disabledDates = ref([{ start: new Date(2022, 10, 7), end: null }]);
</script>
```

<BaseAlert warning>

Note how `disabled-dates` do not also disable navigation. Use the `min-date` or `max-date` props to disable dates and navigation.

</BaseAlert>

## Repeating dates

Use the `repeat` property of a date range object to create a repeating date or date range.

<Example centered>
  <DatesRepeat :example="0" />
</Example>

```vue
<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: true,
    dates: {
      start: new Date(2022, 10, 7),
      repeat: {
        every: [2, 'weeks'],
        weekdays: 2,
      },
    },
  },
]);
</script>
```

### Definitions

The `repeat` object follows the `DateRepeatConfig` interface below, which consists of key-value pairs of rules.

```ts
export interface DateRepeatConfig {
  every: RepeatIntervalShort | [number, RepeatInterval];
  until: Date;
  weekdays: SingleOrArray<DayOfWeek>;
  days: SingleOrArray<DayInMonth>;
  weeks: SingleOrArray<WeekInMonth>;
  months: SingleOrArray<MonthInYear>;
  years: SingleOrArray<number>;
  ordinalWeekdays: SingleOrArray<number>;
  on: SingleOrArray<DateRepeatFn | Partial<DateRepeatConfig>>;
}

type SingleOrArray<T> = T | T[];
type RepeatIntervalShort = 'day' | 'week' | 'month' | 'year';
type RepeatInterval = 'days' | 'weeks' | 'months' | 'years';
type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type DayInMonth = -31, -30 ... -1 | 1 | 2 ... | 31;
type WeekInMonth = -6 | -5 | -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4 | 5 | 6;
type MonthInYear = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
```

### Interval rules

Interval rules are defined using the `every` key.

```ts
{
  repeat: {
    every: 'month',
    days: 15
  }
}
```

Since the `repeat` above repeats over a single interval (1 month), the frequency (`day`, `week`, `month`, `year`) can be expressed as a simple string.

If repeating over 2 or more intervals, then an array is required to express the interval and frequency.

```ts
{
  repeat: {
    every: [2, 'months'],
    days: 15,
  }
}
```

Also, it is important to note that `week`, `month` and `year` interval rules must be paired with at least one component rule (`days` in the example above) or ordinal component rule.

<Example centered>
  <DatesRepeat :example="1" />
</Example>

```vue
<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: true,
    dates: [
      {
        start: new Date(2022, 10, 15),
        repeat: {
          every: 'month',
          days: 15,
        },
      },
    ],
  },
]);
</script>
```

### Component rules

Component rules are used to more specifically target repeating date ranges. They include the following keys of the `DateRepeatConfig` interface.

```ts
export interface DateRepeatConfig {
  // ...
  weekdays: SingleOrArray<DayOfWeek>;
  days: SingleOrArray<DayInMonth>;
  weeks: SingleOrArray<WeekInMonth>;
  months: SingleOrArray<MonthInYear>;
  years: SingleOrArray<number>;
  // ...
}

type SingleOrArray<T> = T | T[];
type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type DayInMonth = -31, -30 ... -1 | 1 | 2 ... | 31;
type WeekInMonth = -6 | -5 | -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4 | 5 | 6;
type MonthInYear = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
```

Component rule values can be expressed as a single number or an array of numbers. Also, note that the `days` and `weeks` rules may be expressed as negative numbers to offset from the end of the repeat interval.

In the example below, since repeating on multiple days of the month (15, 25), the `days` property must be an array.

<Example centered>
  <DatesRepeat :example="2" />
</Example>

```js
// ...
const attributes = ref([
  {
    highlight: true,
    dates: [
      {
        start: new Date(2022, 10, 15),
        repeat: {
          every: [2, 'months'],
          days: [15, 25],
        },
      },
    ],
  },
]);
```

### Ordinal component rules

Ordinal component rules target ordinal weekdays of the month. Such examples include

* First Sunday of the month
* Fifth Tuesday of the month
* Last Monday of the month
* Second to last Saturday of the month

```ts
export interface DateRepeatConfig {
  // ...
  ordinalWeekdays: SingleOrArray<number[]>;
}

type SingleOrArray<T> = T | T[];
```

The rule values are expressed as an array with the position first (-6 to -1, 1 to 6), followed by the weekdays to match (1 to 7).

```ts
{
  repeat: {
    every: 'month',
    ordinalWeekdays: [-1, 2], // Last Monday of the month
  }
}
```

Multiple weekdays can be appended to the end of the array.

```ts
{
  repeat: {
    every: 'month',
    ordinalWeekdays: [-1, 2, 6], // Last Monday or Friday of the month
  }
}
```

Multiple rules can be set by wrapping them in a separate array.

```ts
{
  repeat: {
    every: 'month',
    ordinalWeekdays: [
      [1, 1],     // First Sunday of the month
      [-1, 2],    // Last Monday or Friday of the month
    ]
  }
}
```

In the example below, we can apply this rule to a repeating date range.

<Example centered>
  <DatesRepeat :example="3" />
</Example>

```js
// ...
const attributes = ref([
  {
    highlight: true,
    dates: [
      {
        start: new Date(2022, 10, 7),
        end: new Date(2022, 10, 9),
        repeat: {
          every: 'month',
          ordinalWeekdays: [
            [1, 2], // First Monday of the month
            [-1, 2], // Last Monday of the month
          ],
        },
      },
    ],
  },
]);
```

### Nested group rules

Repeat objects can be nested for more complex matching logic. Until now, rules have been conditionally *and*-ed with each other by defining them in a single object.

Using the `on` property, we can use an array to group multiple rule objects that are conditionally *or*-ed instead of *and*ed.

```ts
export interface DateRepeatConfig {
  // ...
  on: SingleOrArray<Partial<DateRepeatConfig> | DateRepeatFn>;
}

type SingleOrArray<T> = T | T[];
```

For example, if we want to repeat every month on the 15th day or the last Monday, we might try to do something like this.

<Example centered>
  <DatesRepeat :example="4" />
</Example>

```js
// ...
const attributes = ref([
  {
    highlight: true,
    dates: [
      {
        start: new Date(2022, 10, 15),
        repeat: {
          every: 'month',
          days: 15,
          ordinalWeekdays: [-1, 2], // Last Monday of the month
        },
      },
    ],
  },
]);
```

As you can see, the date never repeats because the 15th is never the last Monday of the month. Instead, we can use the `on` property to combine the rules.

<Example centered>
  <DatesRepeat :example="5" />
</Example>

```js
// ...
const attributes = ref([
  {
    highlight: true,
    dates: [
      {
        start: new Date(2022, 10, 15),
        repeat: {
          every: 'month',
          on: [{ days: 15 }, { ordinalWeekdays: [-1, 2] }],
        },
      },
    ],
  },
]);
```

### Function rules

A custom function can be used instead of a configuration object to manually select which dates to repeat on. This function should return a `boolean` that indicates if the date or date range should start on the passed in `dayParts`.

```ts
type DateRepeatFn = (dayParts: DayParts) => boolean;

export interface DayParts {
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
}
```

For example, we can reimplement the previous example with a custom function.

<Example centered>
  <DatesRepeat :example="6" />
</Example>

```js
// ...
const attributes = ref([
  {
    highlight: true,
    dates: [
      {
        start: new Date(2022, 10, 15),
        repeat: {
          every: 'month',
          on: ({ weekdayOrdinalFromEnd, weekday, day }) =>
            (weekdayOrdinalFromEnd === 1 && weekday === 2) || day === 15,
        },
      },
    ],
  },
]);
```