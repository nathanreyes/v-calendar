# Time Rules

## Date with rules

<Example centered>
  <DateRules /> 
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date(2000, 0, 15));
const rules = {
  hours: 3,
  minutes: { interval: 5 },
  seconds: 4,
  milliseconds: 500,
};
</script>
```

## Date range with rules

<Example centered>
  <DateRangeRules /> 
</Example>

```vue
<template>
  <DatePicker v-model="date" mode="dateTime" :rules="rules" is-range />
</template>

<script setup>
import { ref } from 'vue';

const date = ref({
  start: new Date(2022, 7, 15),
  end: new Date(2022, 7, 19)
});
const rules = ref({
  hours: [2, 4, 7, 10, 14, 15, 16],
  minutes: { interval: 2 },
  milliseconds: 0,
});
</script>
```