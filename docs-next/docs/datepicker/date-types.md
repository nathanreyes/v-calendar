---
title: Date Picker | Date Types
---

# Date Types

`DatePicker` supports binding to different data types, including strings, dates and numbers via the `model-config` prop.

For example, if the date you provide is stored in a database as a string, this string value can be bound to directly, without any extra conversion logic required by your application.

In short, the `model-config` and `timezone` props help provide a no-hassle approach to working with your data.

## Strings

To bind to a string value, provide a `model-config` with the necessary `type: 'string'` property. In this example, the date is provided in ISO 8601 format with the Z designator (zero UTC offset).

<Example centered>
  <!-- <DateTypeString /> -->
</Example>

```vue
<template>
  <DatePicker v-model="date" :model-config="modelConfig" />
</template>
<script setup>
import { ref } from 'vue';
const date = ref('2000-01-01T12:00:00.000Z');
const modelConfig = ref({
  type: 'string',
});
</script>
```

If an alternate format is needed, provide the `mask` property with the desired format.

<Example centered>
  <!-- <DateTypeStringMask /> -->
</Example>

```vue
<template>
  <DatePicker
    v-model="customer.birthday"
    :model-config="modelConfig"
    is-required
  />
</template>
<script setup>
import { ref } from 'vue';
const customer = reactive({
  name: 'Nathan Reyes',
  birthday: '1983-01-21',
});
const modelConfig = ref({
  type: 'string',
  mask: 'YYYY-MM-DD',
});
</script>
```

## Numbers

To bind to a number value, provide a `model-config` with the necessary `type: 'number'` property. The number provided should be an integer value representing the number of milliseconds since January 1, 1970, 00:00:00 UTC (the ECMAScript epoch, equivalent to the UNIX epoch).

<Example centered>
  <DateTypeNumber />
</Example>

```vue
<template>
  <DatePicker v-model="date" :model-config="modelConfig" timezone="utc" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(0);
const modelConfig = ref({
  type: 'number',
});
</script>
```
