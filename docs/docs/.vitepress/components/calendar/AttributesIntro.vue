<template>
  <VCalendar :attributes="attributes" />
</template>

<script lang="ts">
const date = new Date();
const thisMonth = date.getMonth();
const thisMonthYear = date.getFullYear();

const nextMonthDate = new Date(date);
nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
const nextMonth = nextMonthDate.getMonth();
const nextMonthYear = nextMonthDate.getFullYear();

const meetings = [
  {
    description: 'Bi-weekly staff meeting.',
    dates: {
      start: new Date(thisMonthYear, thisMonth, 6),
      repeat: {
        every: [2, 'weeks'],
        weekdays: 1,
      },
    },
    color: 'blue',
    order: 10,
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
];

const todos = [
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
];

export default {
  data() {
    return {
      incId: todos.length,
      meetings,
      todos,
    };
  },
  computed: {
    attributes() {
      return [
        {
          content: {
            class: 'italic',
          },
          dates: new Date(),
          order: 100,
        },
        ...this.meetings.map(({ description, dates, color, order }) => ({
          dates,
          highlight: color,
          popover: {
            label: description,
          },
          order: order || 0,
        })),
        ...this.todos.map(
          ({ description, dates, color, order, isComplete }) => ({
            dates: dates,
            dot: {
              color: color,
              class: isComplete ? 'opacity-25' : '',
            },
            popover: {
              label: description,
            },
            order: order || 0,
          }),
        ),
      ];
    },
  },
};
</script>
