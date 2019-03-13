<template>
  <div class="example">
    <v-calendar :from-date="new Date(2018, 0, 1)" :attributes="attributes">
      <!--=========DAY POPOVER HEADER SLOT=========-->
      <div
        slot="day-popover-header"
        slot-scope="{ day, format }"
        class="text-center pb-1 mb-1 border-b mx-1"
        v-if="showHeader"
      >{{ format(day.date, "WWW, MMM D, YYYY") }}</div>
      <!--===============TODO ROW SLOT==============-->
      <div
        slot="todo-row"
        slot-scope="{ customData }"
        class="flex flex-no-wrap items-center w-full"
      >
        <!--Todo content-->
        <div class="flex-grow">
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
        <a @click.prevent="toggleTodoEdit(customData)" class="ml-2 cursor-pointer">
          <!--Edit button-->
          <svg
            v-if="editId !== customData.id"
            class="fill-current text-blue-4"
            viewBox="0 0 20 20"
            width="12"
            height="12"
          >
            <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z"></path>
          </svg>
          <!--Done button-->
          <svg v-else class="fill-current text-green-5" viewBox="0 0 20 20" width="12" height="12">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
          </svg>
        </a>
        <!--Delete button-->
        <a
          @click.prevent="deleteTodo(customData)"
          v-if="!editId || editId !== customData.id"
          class="ml-1 cursor-pointer"
        >
          <svg class="fill-current text-red-4" viewBox="0 0 20 20" width="12" height="12">
            <path
              d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
            ></path>
          </svg>
        </a>
      </div>
      <!--================ADD TODO ROW SLOT===============-->
      <div
        slot="add-todo"
        slot-scope="{ day }"
        class="text-center w-full cursor-pointer"
        v-if="showAddTodo"
      >
        <a @click="addTodo(day)">+ Add Todo</a>
      </div>
    </v-calendar>
  </div>
</template>

<script>
const color = '#ff8080';
const todos = [
  {
    id: 1,
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: new Date(2018, 0, 1),
  },
  {
    id: 2,
    description: 'Get some milks.',
    isComplete: false,
    dates: new Date(2018, 0, 5),
  },
  {
    id: 3,
    description: 'Pay the utility bill.',
    isComplete: false,
    dates: new Date(2018, 0, 19),
  },
  {
    id: 4,
    description: 'Pick up clothes from the cleaners.',
    isComplete: false,
    dates: new Date(2018, 0, 19),
  },
  {
    id: 5,
    description: 'Lunch with Leo.',
    isComplete: false,
    dates: new Date(2018, 0, 22),
  },
];

export default {
  data() {
    return {
      incId: todos.length,
      editId: 0,
      todos,
    };
  },
  props: {
    showHeader: Boolean,
    showAddTodo: Boolean,
  },
  computed: {
    attributes() {
      return [
        // Todo attributes
        ...this.todos.map(todo => ({
          key: todo.id,
          dates: todo.dates,
          customData: todo,
          order: todo.id,
          dot: {
            class: todo.isComplete ? 'opacity-25' : '',
          },
          popover: {
            slot: 'todo-row', // Matches slot from above
          },
        })),
        // 'Add Todo' attribute
        this.showAddTodo && {
          dates: {}, // All dates
          popover: {
            slot: 'add-todo',
            hideIndicator: true,
          },
        },
      ];
    },
  },
  methods: {
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
