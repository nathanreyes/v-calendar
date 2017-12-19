<template>
  <v-calendar
    :attributes='attributes'
    is-double-paned>
  </v-calendar>
</template>

<script>
import { getExampleMonthComps } from '@/utils/helpers';

const {
  thisMonth,
  thisMonthYear,
  nextMonth,
  nextMonthYear,
} = getExampleMonthComps();

const todos = [
  {
    id: 1,
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { weekdays: 6 },
    excludeDates: [new Date(thisMonthYear, thisMonth, 22)],
    color: '#ff8080', // Red
  },
  {
    id: 2,
    description: 'Get some milks.',
    isComplete: false,
    dates: [
      new Date(thisMonthYear, thisMonth, 19),
      new Date(thisMonthYear, thisMonth, 29),
    ],
    color: '#9f80ff', // Purple
  },
];

export default {
  data() {
    return {
      todos,
    };
  },
  computed: {
    attributes() {
      return this.todos.map(todo => ({
        key: todo.id,
        dates: todo.dates,
        excludeDates: todo.excludeDates,
        dot: {
          backgroundColor: todo.isComplete ? '#dadada' : todo.color,
        },
        popover: {
          label: todo.description,
          labelStyle: todo.isComplete && { textDecoration: 'line-through' },
          onSelect: () => {
            this.todos = this.todos.map(t => {
              if (t === todo) t.isComplete = !t.isComplete;
              return t;
            });
          },
          onDelete: (attr, dayInfo) => {
            this.todos = this.todos.map(t => {
              if (t === todo) {
                const excludeDates = t.excludeDates || [];
                const ed = excludeDates.find(ed => ed.getTime() === dayInfo.dateTime);
                if (!ed) excludeDates.push(dayInfo.date);
                t.excludeDates = excludeDates;
              }
              return t;
            });
          },
        },
      }));
    },
  },
};
</script>
