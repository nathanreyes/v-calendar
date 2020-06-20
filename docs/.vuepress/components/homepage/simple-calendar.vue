<template>
  <div class="section">
    <h2>Simple Calendars</h2>
    <h3>
      Show highlights, dots, bars and custom popovers
    </h3>
    <div class="flex flex-col items-center md:flex-row md:justify-around">
      <div class="mb-6">
        <h3 class="text-base semibold text-gray-700 mb-3">Highlights</h3>
        <v-calendar :attributes="highlights" ref="cal" />
      </div>
      <div class="mb-6">
        <h3 class="text-base semibold text-gray-700 mb-3">Dots</h3>
        <v-calendar :attributes="dots" />
      </div>
    </div>
    <div class="flex flex-col items-center md:flex-row md:justify-around mb-8">
      <div class="mb-6">
        <h3 class="text-base semibold text-gray-700 mb-3">Bars</h3>
        <v-calendar :attributes="bars" />
      </div>
      <div class="mb-6">
        <h3 class="text-base semibold text-gray-700 mb-3">Popovers</h3>
        <v-calendar :attributes="popovers">
          <div
            slot="day-popover"
            slot-scope="{ day, format, masks, attributes, updateLayout }"
          >
            <!--Day Header-->
            <span class="text-xs text-gray-3 font-semibold">{{
              format(day.date, masks.dayPopover)
            }}</span>
            <!--Todo Rows-->
            <popover-row
              v-for="{
                key,
                customData,
                highlight,
                dot,
                bar,
              } in attributes.filter(a => a.customData)"
              :key="key"
              :attribute="{ highlight, dot, bar }"
            >
              <div class="flex flex-no-wrap items-center w-full">
                <!--Todo content-->
                <div class="flex-grow text-left">
                  <!--Show textbox when editing todo-->
                  <input
                    v-if="customData.id === editId"
                    class="appearance-none bg-white border px-1 text-black"
                    :style="{ minWidth: '180px' }"
                    v-model="customData.description"
                    @keyup.enter="editId = 0"
                    v-focus-select
                  />
                  <!--Show status/description when not editing-->
                  <span class="flex items-center" v-else>
                    <!--Completed checkbox-->
                    <input type="checkbox" v-model="customData.isComplete" />
                    <!--Description-->
                    <span
                      class="ml-2 cursor-pointer"
                      :class="{ 'line-through': customData.isComplete }"
                      @click="toggleTodoComplete(customData)"
                      >{{ customData.description }}</span
                    >
                  </span>
                </div>
                <!--Edit/Done buttons-->
                <a
                  @click.prevent="toggleTodoEdit(customData, updateLayout)"
                  class="ml-2 cursor-pointer"
                >
                  <!--Edit button-->
                  <svg
                    v-if="editId !== customData.id"
                    class="fill-current text-blue-300"
                    viewBox="0 0 20 20"
                    width="12"
                    height="12"
                  >
                    <path
                      d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z"
                    ></path>
                  </svg>
                  <!--Done button-->
                  <svg
                    v-else
                    class="fill-current text-green-300"
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
                  <svg
                    class="fill-current text-red-300"
                    viewBox="0 0 20 20"
                    width="12"
                    height="12"
                  >
                    <path
                      d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
                    ></path>
                  </svg>
                </a>
              </div>
            </popover-row>
            <!--Add Todo Row-->
            <a
              @click="addTodo(day)"
              class="block text-center text-green-200 hover:text-green-300 font-semibold cursor-pointer px-1 mt-1"
              >+ Add Todo</a
            >
          </div>
        </v-calendar>
      </div>
    </div>
  </div>
</template>

<script>
const PopoverRow = require('@/components/PopoverRow').default;
const { pageForThisMonth, pageForNextMonth } = require('@/utils/helpers');

export default {
  components: {
    PopoverRow,
  },
  data() {
    return {
      pageForThisMonth: pageForThisMonth(),
      pageForNextMonth: pageForNextMonth(),
      incId: 5,
      editId: 0,
      todos: [],
    };
  },
  computed: {
    thisMonth() {
      return this.pageForThisMonth.month - 1;
    },
    thisMonthYear() {
      return this.pageForThisMonth.year;
    },
    nextMonth() {
      return this.pageForNextMonth.month - 1;
    },
    nextMonthYear() {
      return this.pageForNextMonth.year;
    },
    highlights() {
      return [
        {
          highlight: 'red',
          contentStyle: {
            color: 'white',
          },
          dates: [
            // Use single dates
            new Date(this.nextMonthYear, this.nextMonth, 6),
            new Date(this.nextMonthYear, this.nextMonth, 23),
            // ...or date ranges
            {
              start: new Date(this.thisMonthYear, this.thisMonth, 2),
              end: new Date(this.thisMonthYear, this.thisMonth, 4),
            },
            // ...or complex date patterns
            {
              start: new Date(this.thisMonthYear, this.thisMonth, 1),
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
            new Date(this.thisMonthYear, this.thisMonth, 1),
            {
              start: new Date(this.thisMonthYear, this.thisMonth, 10),
              end: new Date(this.thisMonthYear, this.thisMonth, 12),
            },
            {
              start: new Date(this.nextMonthYear, this.nextMonth, 22),
              end: new Date(this.nextMonthYear, this.nextMonth, 26),
            },
          ],
        },
        {
          highlight: 'teal',
          contentStyle: {
            color: 'white',
          },
          dates: [
            new Date(this.thisMonthYear, this.thisMonth, 14),
            {
              start: new Date(this.thisMonthYear, this.thisMonth, 24),
              end: new Date(this.thisMonthYear, this.thisMonth, 25),
            },
            new Date(this.thisMonthYear, this.thisMonth, 28),
            new Date(this.nextMonthYear, this.nextMonth, 4),
            {
              start: new Date(this.nextMonthYear, this.nextMonth, 16),
              end: new Date(this.nextMonthYear, this.nextMonth, 17),
            },
          ],
        },
      ];
    },
    dots() {
      return [
        {
          dot: 'red',
          dates: [
            new Date(this.thisMonthYear, this.thisMonth, 1),
            new Date(this.thisMonthYear, this.thisMonth, 10),
            new Date(this.thisMonthYear, this.thisMonth, 22),
            new Date(this.nextMonthYear, this.nextMonth, 6),
            new Date(this.nextMonthYear, this.nextMonth, 16),
          ],
        },
        {
          dot: 'teal',
          dates: [
            new Date(this.thisMonthYear, this.thisMonth, 4),
            new Date(this.thisMonthYear, this.thisMonth, 10),
            new Date(this.thisMonthYear, this.thisMonth, 15),
            new Date(this.nextMonthYear, this.nextMonth, 1),
            new Date(this.nextMonthYear, this.nextMonth, 12),
            {
              start: new Date(this.nextMonthYear, this.nextMonth, 20),
              end: new Date(this.nextMonthYear, this.nextMonth, 25),
            },
          ],
        },
        {
          dot: 'blue',
          dates: [
            new Date(this.thisMonthYear, this.thisMonth, 12),
            new Date(this.thisMonthYear, this.thisMonth, 26),
            new Date(this.thisMonthYear, this.thisMonth, 15),
            new Date(this.nextMonthYear, this.nextMonth, 9),
            new Date(this.nextMonthYear, this.nextMonth, 5),
            new Date(this.nextMonthYear, this.nextMonth, 6),
            new Date(this.nextMonthYear, this.nextMonth, 20),
            new Date(this.nextMonthYear, this.nextMonth, 25),
          ],
        },
      ];
    },
    bars() {
      return [
        {
          bar: 'red',
          dates: [
            new Date(this.thisMonthYear, this.thisMonth, 1),
            new Date(this.thisMonthYear, this.thisMonth, 10),
            new Date(this.thisMonthYear, this.thisMonth, 22),
            new Date(this.nextMonthYear, this.nextMonth, 6),
            new Date(this.nextMonthYear, this.nextMonth, 16),
          ],
        },
        {
          bar: 'teal',
          dates: [
            new Date(this.thisMonthYear, this.thisMonth, 4),
            new Date(this.thisMonthYear, this.thisMonth, 10),
            new Date(this.thisMonthYear, this.thisMonth, 15),
            new Date(this.nextMonthYear, this.nextMonth, 1),
            new Date(this.nextMonthYear, this.nextMonth, 12),
            {
              start: new Date(this.nextMonthYear, this.nextMonth, 20),
              end: new Date(this.nextMonthYear, this.nextMonth, 25),
            },
          ],
        },
        {
          bar: 'blue',
          dates: [
            new Date(this.thisMonthYear, this.thisMonth, 12),
            new Date(this.thisMonthYear, this.thisMonth, 26),
            new Date(this.thisMonthYear, this.thisMonth, 15),
            new Date(this.nextMonthYear, this.nextMonth, 9),
            new Date(this.nextMonthYear, this.nextMonth, 5),
            new Date(this.nextMonthYear, this.nextMonth, 6),
            new Date(this.nextMonthYear, this.nextMonth, 20),
            new Date(this.nextMonthYear, this.nextMonth, 25),
          ],
        },
      ];
    },
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
            visibility: 'click',
          },
        })),
        // 'Add todo' attribute
        {
          key: 'add-todo',
          dates: {},
          popover: true,
        },
      ];
    },
  },
  mounted() {
    this.refreshTodos();
  },
  methods: {
    refreshMonthData() {
      this.pageForThisMonth = pageForThisMonth();
      this.pageForNextMonth = pageForNextMonth();
    },
    refreshTodos() {
      this.todos = [
        {
          id: 1,
          description: 'Take Noah to basketball practice.',
          isComplete: false,
          dates: new Date(this.thisMonthYear, this.thisMonth, 1),
          color: 'blue',
        },
        {
          id: 2,
          description: 'Get some milks.',
          isComplete: false,
          dates: new Date(this.thisMonthYear, this.thisMonth, 5),
          color: 'red',
        },
        {
          id: 3,
          description: 'Pay the utility bill.',
          isComplete: false,
          dates: new Date(this.thisMonthYear, this.thisMonth, 19),
          color: 'orange',
        },
        {
          id: 4,
          description: 'Pick up clothes from the cleaners.',
          isComplete: false,
          dates: new Date(this.thisMonthYear, this.thisMonth, 19),
          color: 'purple',
        },
        {
          id: 5,
          description: 'Lunch with Leo.',
          isComplete: false,
          dates: new Date(this.thisMonthYear, this.thisMonth, 22),
          color: 'green',
        },
      ];
    },
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
      this.$nextTick(() => updateLayout());
    },
    deleteTodo(todo, updateLayout) {
      this.todos = this.todos.filter(t => t !== todo);
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
