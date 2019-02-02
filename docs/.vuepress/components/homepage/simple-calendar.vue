<template>
  <div class="text-center section">
    <h3>Simple Calendars</h3>
    <p>
      Build simple attributed calendars for displaying attributes like
      <a
        class="has-text-primary"
        href="#"
        @click.prevent="display = 'highlights'"
      >highlighted&nbsp;regions</a>,
      <a class="has-text-primary" href="#" @click.prevent="display = 'dots'">dots</a>,
      <a class="has-text-primary" href="#" @click.prevent="display = 'bars'">bars</a> and even
      <a class="has-text-primary" href="#" @click.prevent="display = 'popovers'">popovers</a>.
    </p>
    <div class="center">
      <v-calendar
        :attributes="attributes"
        :theme-styles="themeStyles"
        :from-page.sync="fromPage"
        :to-page.sync="toPage"
        popover-visibility="focus"
      >
        <!--=========POPOVER HEADER SLOT=========-->
        <div
          slot="day-popover-header"
          slot-scope="{ day }"
          class="text-center pb-1 mb-1 border-b mx-1"
        >{{ getPopoverHeaderLabel(day) }}</div>
        <!--============HOW TO USE ROW SLOTS===========-->
        <!--
          STEP 1: Insert element with a unique slot name ('todo-row' in this example). Make sure slot-scope is assigned, even if not used.      
          STEP 2: In Javascript, assign that unique slot name to the 'slot' property of the attribute's popover object
        -->
        <!--===============TODO ROW SLOT==============-->
        <div
          slot="todo-row"
          slot-scope="{ customData }"
          class="flex flex-no-wrap items-center w-full"
        >
          <!--Todo content-->
          <div class="flex-grow text-left">
            <!--Show textbox when editing todo-->
            <input
              class="appearance-none bg-white border p-1"
              :style="{ minWidth: '220px' }"
              v-if="customData.id === editId"
              v-model="customData.description"
              @keyup.enter="editId = 0"
              v-focus-select
            >
            <!--Show status/description when not editing-->
            <span v-else>
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
          <a @click.prevent="toggleTodoEdit(customData)" class="ml-1 cursor-pointer">
            <!--Edit button-->
            <svg
              v-if="editId !== customData.id"
              class="fill-current text-blue"
              viewBox="0 0 20 20"
              width="12"
              height="12"
            >
              <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z"></path>
            </svg>
            <!--Done button-->
            <svg v-else class="fill-current text-green" viewBox="0 0 20 20" width="12" height="12">
              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
            </svg>
          </a>
          <!--Delete button-->
          <a
            @click.prevent="deleteTodo(customData)"
            v-if="!editId || editId !== customData.id"
            class="ml-1 cursor-pointer"
          >
            <svg class="fill-current text-red" viewBox="0 0 20 20" width="12" height="12">
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
</template>

<script>
const { getThisMonthComps, getNextMonthComps } = require('@/utils/helpers');
let { month: thisMonth, year: thisMonthYear } = getThisMonthComps();
let { month: nextMonth, year: nextMonthYear } = getNextMonthComps(
  thisMonth,
  thisMonthYear,
);
thisMonth--;
nextMonth--;

const color = '#ff8080';
const hSpacing = '15px';

export default {
  data() {
    return {
      display: '',
      fromPage: null,
      toPage: null,
      highlights: [
        {
          highlight: {
            backgroundColor: '#ff8080', // Red
            borderColor: '#ff6666',
            borderWidth: '2px',
            borderStyle: 'solid',
          },
          contentStyle: {
            color: 'white',
          },
          dates: [
            // Use single dates
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 23),
            // ...or date ranges
            {
              start: new Date(thisMonthYear, thisMonth, 1),
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
          highlight: {
            backgroundColor: '#9f80ff', // Purple
            borderColor: '#8c66ff',
            borderWidth: '2px',
          },
          contentStyle: {
            color: 'white',
          },
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 12),
            {
              start: new Date(nextMonthYear, nextMonth, 22),
              end: new Date(nextMonthYear, nextMonth, 26),
            },
          ],
        },
        {
          highlight: {
            backgroundColor: '#66b3cc', // Turquoise
            borderColor: '#53a9c6',
            borderWidth: '2px',
            borderRadius: '5px',
          },
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
          dot: {
            backgroundColor: '#ff4d4d', // Red
          },
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 22),
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 16),
          ],
        },
        {
          dot: {
            backgroundColor: '#398fac', // Turquoise
          },
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
          dot: {
            backgroundColor: '#794dff', // Purple
          },
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
          bar: {
            backgroundColor: '#ff4d4d', // Red
          },
          dates: [
            new Date(thisMonthYear, thisMonth, 1),
            new Date(thisMonthYear, thisMonth, 10),
            new Date(thisMonthYear, thisMonth, 22),
            new Date(nextMonthYear, nextMonth, 6),
            new Date(nextMonthYear, nextMonth, 16),
          ],
        },
        {
          bar: {
            backgroundColor: '#398fac', // Turquoise
          },
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
          bar: {
            backgroundColor: '#794dff', // Purple
          },
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
        },
        {
          id: 2,
          description: 'Get some milks.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 5),
        },
        {
          id: 3,
          description: 'Pay the utility bill.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 19),
        },
        {
          id: 4,
          description: 'Pick up clothes from the cleaners.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 19),
        },
        {
          id: 5,
          description: 'Lunch with Leo.',
          isComplete: false,
          dates: new Date(thisMonthYear, thisMonth, 22),
        },
      ],
      themeStyles: null,
    };
  },
  computed: {
    attributes() {
      switch (this.display) {
        case 'highlights':
          return this.highlights;
        case 'dots':
          return this.dots;
        case 'bars':
          return this.bars;
        case 'popovers':
          return this.popovers;
        default:
          return null;
      }
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
            backgroundColor: color,
            opacity: todo.isComplete ? 0.3 : 1,
          },
          popover: {
            slot: 'todo-row', // Matches slot from above
            visibility: 'hover',
          },
        })),
        // 'Add todo' attribute
        {
          key: -1,
          contentHoverStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          },
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
  watch: {
    display() {
      this.resetPages();
    },
  },
  methods: {
    resetPages() {
      this.fromPage = { month: thisMonth + 1, year: thisMonthYear };
    },
    getPopoverHeaderLabel(day) {
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return day.date.toLocaleDateString(
        window.navigator.userLanguage || window.navigator.language,
        options,
      );
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
    toggleTodoEdit(todo) {
      this.editId = this.editId === todo.id ? 0 : todo.id;
    },
    deleteTodo(todo) {
      this.todos = this.todos.filter(t => t !== todo);
    },
    applyTheme() {
      this.themeStyles = this.themeStyles
        ? null
        : {
            wrapper: {
              border: '0',
              background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
              boxShadow:
                '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)',
              borderRadius: '5px',
            },
            verticalDivider: {
              borderLeft: 'solid rgba(255, 255, 255, 0.2) 1px',
            },
            header: {
              color: '#fafafa',
              padding: `20px ${hSpacing}`,
            },
            headerHorizontalDivider: {
              borderTop: 'solid rgba(255, 255, 255, 0.2) 1px',
              width: '80%',
            },
            weekdays: {
              color: '#6eded1',
              fontWeight: '600',
              padding: `20px ${hSpacing} 5px ${hSpacing}`,
            },
            weeks: {
              padding: `0 ${hSpacing} 10px ${hSpacing}`,
            },
            dayContent: {
              color: '#fafafa',
              fontSize: '0.9em',
            },
            dayContentHover: {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
            },
            bars: {
              marginBottom: '1px',
              width: '60%',
            },
          };
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