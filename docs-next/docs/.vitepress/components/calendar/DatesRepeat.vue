<template>
  <div class="flex flex-col items-center space-y-3">
    <h4 class="font-bold text-center">{{ title }}</h4>
    <VCalendar :attributes="attributes" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  example: { type: Number, required: true },
});

const dates = ref([
  {
    title: 'Every 2 weeks on Monday',
    start: new Date(2022, 10, 7),
    repeat: {
      every: [2, 'weeks'],
      weekdays: 2,
    },
  },
  {
    title: 'Every month on the 15th',
    start: new Date(2022, 10, 15),
    repeat: {
      every: 'month',
      days: 15,
    },
  },
  {
    title: 'Every other month on the 15th or the 25th',
    start: new Date(2022, 10, 15),
    repeat: {
      every: [2, 'months'],
      days: [15, 25],
    },
  },
  {
    title: 'Every other month on the first or last Monday',
    start: new Date(2022, 10, 7),
    end: new Date(2022, 10, 9),
    repeat: {
      every: [2, 'months'],
      ordinalWeekdays: [
        [1, 2], // First Monday of the month
        [-1, 2], // Last Monday of the month
      ],
    },
  },
  {
    title: 'Every month on the 15th and the last Monday',
    start: new Date(2022, 10, 15),
    repeat: {
      every: 'month',
      days: 15,
      ordinalWeekdays: [-1, 2], // Last Monday of the month
    },
  },
  {
    title: 'Every month on the 15th or the last Monday',
    start: new Date(2022, 10, 15),
    repeat: {
      every: 'month',
      on: [{ days: 15 }, { ordinalWeekdays: [-1, 2] }],
    },
  },
  {
    title: 'Every month on the 15th or the last Monday',
    start: new Date(2022, 10, 15),
    repeat: {
      every: 'month',
      on: ({ weekdayOrdinalFromEnd, weekday, day }) =>
        (weekdayOrdinalFromEnd === 1 && weekday === 2) || day === 15,
    },
  },
]);

const title = computed(() => dates.value[props.example]?.title);

const attributes = ref([
  {
    highlight: true,
    dates: dates.value[props.example],
  },
]);
</script>
