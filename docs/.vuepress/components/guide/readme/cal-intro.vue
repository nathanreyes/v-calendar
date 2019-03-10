<template>
  <div class="example">
    <v-calendar :attributes="attributes" ref="calendar"></v-calendar>
  </div>
</template>

<script>
const { pageForThisMonth, pageForNextMonth } = require('@/utils/helpers');
let { month: thisMonth, year: thisMonthYear } = pageForThisMonth();
let { month: nextMonth, year: nextMonthYear } = pageForNextMonth();
thisMonth--;
nextMonth--;

const meetings = [
  {
    description: 'Bi-weekly staff meeting.',
    // Every other Monday morning :(
    dates: {
      weeklyInterval: 2,
      weekdays: 2,
    },
    color: '#55a8f6', // Blue
  },
  {
    description: 'Meeting to discuss the new project.',
    dates: {
      start: new Date(thisMonthYear, thisMonth, 8),
      span: 3,
    },
    color: '#f7906e', // Orange
  },
  {
    description: 'Out of town on business.',
    dates: {
      start: new Date(nextMonthYear, nextMonth, 3),
      span: 2,
    },
    color: '#f65555', // Red
  },
];

const todos = [
  {
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { weekdays: 6 }, // Every Friday
    color: '#ff8080', // Red
  },
  {
    description: 'Get some milks.',
    isComplete: false,
    dates: [
      new Date(thisMonthYear, thisMonth, 19),
      new Date(thisMonthYear, thisMonth, 23),
      new Date(nextMonthYear, nextMonth, 9),
    ],
    color: '#9f80ff', // Purple
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
        // Today attribute
        {
          contentStyle: {
            fontWeight: '700',
            fontSize: '.9rem',
          },
          dates: new Date(),
        },
        // Attributes for meetings
        ...this.meetings.map(
          ({ description, dates, color: backgroundColor }) => ({
            dates,
            highlight: {
              backgroundColor,
            },
            contentStyle: {
              color: '#fafafa',
            },
            popover: {
              label: description,
            },
          }),
        ),
        // Attributes for todos
        ...this.todos.map(todo => ({
          dates: todo.dates,
          dot: {
            backgroundColor: todo.color,
            opacity: todo.isComplete ? 0.3 : 1,
          },
          popover: {
            label: todo.description,
          },
        })),
      ];
    },
  },
};
</script>
