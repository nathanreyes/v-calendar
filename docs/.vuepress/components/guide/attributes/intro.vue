<template>
  <div class="example">
    <v-calendar :attributes="attributes" />
  </div>
</template>

<script>
const Locale = require('@/utils/locale').default;
const locale = new Locale();
let { month: thisMonth, year: thisMonthYear } = locale.getThisMonthComps();
let { month: nextMonth, year: nextMonthYear } = locale.getNextMonthComps(
  thisMonth,
  thisMonthYear,
);
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
];

const todos = [
  {
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { weekdays: 6 }, // Every Friday
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
        // Today attribute
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
        // Attributes for meetings
        ...this.meetings.map(({ description, dates, color }) => ({
          dates,
          highlight: color,
          popover: {
            label: description,
          },
        })),
        // Attributes for todos
        ...this.todos.map(todo => ({
          dates: todo.dates,
          dot: {
            color: todo.color,
            class: todo.isComplete ? 'opacity-25' : '',
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
