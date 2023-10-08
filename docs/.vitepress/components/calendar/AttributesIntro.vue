<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const date = new Date();
const thisMonth = date.getMonth();
const thisMonthYear = date.getFullYear();

const nextMonthDate = new Date(date);
nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
const nextMonth = nextMonthDate.getMonth();
const nextMonthYear = nextMonthDate.getFullYear();

const meetings = ref([
  {
    description: 'Bi-weekly staff meeting.',
    dates: [
      {
        start: new Date(2023, thisMonth, 6),
        repeat: {
          every: [2, 'weeks'],
          weekdays: 1,
        },
      },
    ],
    color: 'blue',
  },
  {
    description: 'Meeting to discuss the new project.',
    dates: {
      start: new Date(thisMonthYear, thisMonth, 9),
      span: 3,
    },
    color: 'red',
  },
  {
    description: 'Out of town on business.',
    dates: {
      start: new Date(thisMonthYear, thisMonth, 25),
      span: 2,
    },
    color: 'green',
  },
]);

const todos = ref([
  {
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { repeat: { weekdays: 6 } },
    color: 'orange',
  },
  {
    description: 'Get some milks.',
    isComplete: false,
    dates: [
      new Date(thisMonthYear, thisMonth, 19),
      new Date(thisMonthYear, thisMonth, 23),
      new Date(nextMonthYear, nextMonth, 9),
    ],
    color: 'purple',
  },
]);

const attributes = computed(() => [
  {
    content: {
      class: 'italic',
    },
    dates: new Date(),
    order: 100,
  },
  ...meetings.value.map(({ description, dates, color }) => ({
    dates,
    highlight: color,
    popover: {
      label: description,
    },
  })),
  ...todos.value.map(({ description, dates, color, isComplete }) => ({
    dates,
    dot: {
      color: color,
      class: isComplete ? 'opacity-25' : '',
    },
    popover: {
      label: description,
    },
  })),
]);
</script>
