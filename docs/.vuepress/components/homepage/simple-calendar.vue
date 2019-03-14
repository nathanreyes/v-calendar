<template>
  <div class="section">
    <h2 class="h2">Simple Calendars</h2>
    <p
      class="text-lg font-medium text-grey-6 mb-6"
    >Show highlights, dots, bars and even custom popovers</p>
    <div class="flex flex-col items-center md:flex-row md:justify-around">
      <div class="mb-6">
        <h3 class="text-base semibold text-grey-7 mb-3">Highlights</h3>
        <v-calendar :attributes="highlights" ref="cal"/>
      </div>
      <div class="mb-6">
        <h3 class="text-base semibold text-grey-7 mb-3">Dots</h3>
        <v-calendar :attributes="dots"/>
      </div>
    </div>
    <div class="flex flex-col items-center md:flex-row md:justify-around mb-8">
      <div class="mb-6">
        <h3 class="text-base semibold text-grey-7 mb-3">Bars</h3>
        <v-calendar :attributes="bars"/>
      </div>
      <div class="mb-6">
        <h3 class="text-base semibold text-grey-7 mb-3">Popovers</h3>
        <v-calendar :attributes="popovers">
          <!--============HOW TO USE ROW SLOTS===========-->
          <!--
            STEP 1: Insert element with a unique slot name ('todo-row' in this example). Make sure slot-scope is assigned, even if not used.      
            STEP 2: In Javascript, assign that unique slot name to the 'slot' property of the attribute's popover object
          -->
          <!--===============TODO ROW SLOT==============-->
          <div
            slot="todo-row"
            slot-scope="{ customData, updateLayout }"
            class="flex flex-no-wrap items-center w-full"
          >
            <!--Todo content-->
            <div class="flex-grow text-left">
              <!--Show textbox when editing todo-->
              <input
                v-if="customData.id === editId"
                class="appearance-none bg-white border px-1"
                :style="{ minWidth: '220px' }"
                v-model="customData.description"
                @keyup.enter="editId = 0"
                v-focus-select
              >
              <!--Show status/description when not editing-->
              <span class="flex items-center" v-else>
                <!--Completed checkbox-->
                <input type="checkbox" v-model="customData.isComplete">
                <!--Description-->
                <span
                  class="ml-1 cursor-pointer"
                  :class="{ 'line-through': customData.isComplete }"
                  @click="toggleTodoComplete(customData)"
                >{{ customData.description }}</span>
              </span>
            </div>
            <!--Edit/Done buttons-->
            <a
              @click.prevent="toggleTodoEdit(customData, updateLayout)"
              class="ml-1 cursor-pointer"
            >
              <!--Edit button-->
              <svg
                v-if="editId !== customData.id"
                class="fill-current text-blue-5"
                viewBox="0 0 20 20"
                width="12"
                height="12"
              >
                <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z"></path>
              </svg>
              <!--Done button-->
              <svg
                v-else
                class="fill-current text-green-5"
                viewBox="0 0 20 20"
                width="12"
                height="12"
              >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
              </svg>
            </a>
            <!--Delete button-->
            <a
              @click.prevent="deleteTodo(customData, updateLayout)"
              v-if="!editId || editId !== customData.id"
              class="ml-1 cursor-pointer"
            >
              <svg class="fill-current text-red-6" viewBox="0 0 20 20" width="12" height="12">
                <path
                  d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
                ></path>
              </svg>
            </a>
          </div>
          <!--================ADD TODO ROW SLOT===============-->
          <div slot="add-todo" slot-scope="{ day }" class="text-center w-full cursor-pointer">
            <a @click="addTodo(day)">+ Add Todo</a>
          </div>
        </v-calendar>
      </div>
    </div>
  </div>
</template>

<script>
const { pageForThisMonth, pageForNextMonth } = require('@/utils/helpers');
let { month: thisMonth, year: thisMonthYear } = pageForThisMonth();
let { month: nextMonth, year: nextMonthYear } = pageForNextMonth(
  thisMonth,
  thisMonthYear,
);
thisMonth--;
nextMonth--;

export default {
  data() {
    return {
      highlights: [
        {
          highlight: 'red',
          contentStyle: {
            color: 'white',
          },
          dates: [
            // Use single dates
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 23),
            // ...or date ranges
            {
              start: new Date(thisMonthYear, thisMonth, 2),
              end: new Date(thisMonthYear, thisMonth, 4),
            },
            // ...or complex date patterns
            {
              start: new Date(thisMonthYear, thisMonth, 1),
              ordinalWeekdays: { [-1]: 7 }, // Last Saturday of the month
            },
          ],
        },
        {
          highlight: 'blue',
          contentStyle: {
            color: 'white',
          },
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            {
              start: new Date(thisMonthYear, thisMonth, 10),
              end: new Date(thisMonthYear, thisMonth, 12),
            },
            {
              start: new Date(nextMonthYear, nextMonth, 22),
              end: new Date(nextMonthYear, nextMonth, 26),
            },
          ],
        },
        {
          highlight: 'teal',
          contentStyle: {
            color: 'white',
          },
          dates: [
            new Date(thisMonthYear, thisMonth, 14),
            {
              start: new Date(thisMonthYear, thisMonth, 24),
              end: new Date(thisMonthYear, thisMonth, 25),
            },
            new Date(thisMonthYear, thisMonth, 28),
            new Date(nextMonthYear, nextMonth, 4),
            {
              start: new Date(nextMonthYear, nextMonth, 16),
              end: new Date(nextMonthYear, nextMonth, 17),
            },
          ],
        },
      ],
      dots: [
        {
          dot: 'red',
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 22),
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 16),
          ],
        },
        {
          dot: 'teal',
          dates: [
            new Date(thisMonthYear, thisMonth, 4),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 15),
            new Date(nextMonthYear, nextMonth, 1),
            new Date(nextMonthYear, nextMonth, 12),
            {
              start: new Date(nextMonthYear, nextMonth, 20),
              end: new Date(nextMonthYear, nextMonth, 25),
            },
          ],
        },
        {
          dot: 'blue',
          dates: [
            new Date(thisMonthYear, thisMonth, 12),
            new Date(thisMonthYear, thisMonth, 26),
            new Date(thisMonthYear, thisMonth, 15),
            new Date(nextMonthYear, nextMonth, 9),
            new Date(nextMonthYear, nextMonth, 5),
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 20),
            new Date(nextMonthYear, nextMonth, 25),
          ],
        },
      ],
      bars: [
        {
          bar: 'red',
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 22),
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 16),
          ],
        },
        {
          bar: 'teal',
          dates: [
            new Date(thisMonthYear, thisMonth, 4),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 15),
            new Date(nextMonthYear, nextMonth, 1),
            new Date(nextMonthYear, nextMonth, 12),
            {
              start: new Date(nextMonthYear, nextMonth, 20),
              end: new Date(nextMonthYear, nextMonth, 25),
            },
          ],
        },
        {
          bar: 'blue',
          dates: [
            new Date(thisMonthYear, thisMonth, 12),
            new Date(thisMonthYear, thisMonth, 26),
            new Date(thisMonthYear, thisMonth, 15),
            new Date(nextMonthYear, nextMonth, 9),
            new Date(nextMonthYear, nextMonth, 5),
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 20),
            new Date(nextMonthYear, nextMonth, 25),
          ],
        },
      ],
      incId: 5,
      editId: 0,
      todos: [
        {
          id: 1,
          description: 'Take Noah to basketball practice.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 1),
          color: 'blue',
        },
        {
          id: 2,
          description: 'Get some milks.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 5),
          color: 'red',
        },
        {
          id: 3,
          description: 'Pay the utility bill.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 19),
          color: 'orange',
        },
        {
          id: 4,
          description: 'Pick up clothes from the cleaners.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 19),
          color: 'purple',
        },
        {
          id: 5,
          description: 'Lunch with Leo.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 22),
          color: 'green',
        },
      ],
    };
  },
  computed: {
    popovers() {
      return [
        // Todo attributes
        ...this.todos.map(todo => ({
          key: todo.id,
          dates: todo.dates,
          customData: todo,
          order: todo.id,
          dot: {
            color: todo.color,
            class: todo.isComplete ? 'opacity-25' : '',
          },
          popover: {
            slot: 'todo-row', // Matches slot from above
            visibility: 'hover',
          },
        })),
        // 'Add todo' attribute
        {
          key: -1,
          dates: {},
          popover: {
            slot: 'add-todo',
            visibility: 'hover',
            hideIndicator: true,
          },
        },
      ];
    },
  },
  methods: {
    addTodo(day) {
      this.editId = ++this.incId;
      this.todos.push({
        id: this.editId,
        description: 'New todo',
        isComplete: false,
        dates: day.date,
      });
    },
    toggleTodoComplete(todo) {
      todo.isComplete = !todo.isComplete;
    },
    toggleTodoEdit(todo, updateLayout) {
      this.editId = this.editId === todo.id ? 0 : todo.id;
      updateLayout();
    },
    deleteTodo(todo, updateLayout) {
      this.todos = this.todos.filter(t => t !== todo);
      updateLayout();
    },
  },
  directives: {
    focusSelect: {
      inserted(el) {
        el.focus();
        el.select();
      },
    },
  },
};
</script>