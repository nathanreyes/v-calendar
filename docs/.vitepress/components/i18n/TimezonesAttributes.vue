<template>
  <Example centered>
    <VCalendar :attributes="attrs" :timezone="timezone" />
    <FullTimezonePicker v-model="timezone" />
  </Example>
</template>

<script setup>
import { ref, computed } from 'vue';

const timezone = ref('utc');
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
