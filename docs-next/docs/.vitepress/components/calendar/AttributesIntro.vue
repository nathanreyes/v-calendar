<template>
  <Calendar :attributes="attributes" />
</template>

<script lang="ts">
import Locale from '@plugin/utils/locale';
const locale = new Locale();
let { month: thisMonth, year: thisMonthYear } = locale.getThisMonthParts();
let { month: nextMonth, year: nextMonthYear } = locale.getNextMonthParts(
  thisMonth,
  thisMonthYear,
);
thisMonth--;
nextMonth--;

const meetings = [
  {
    description: 'Bi-weekly staff meeting.',
    dates: {
      weeklyInterval: 2,
      weekdays: 2,
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
          highlight: {
            fillMode: 'outline',
            color: 'purple',
            class: 'rounded-none bg-transparent',
          },
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
