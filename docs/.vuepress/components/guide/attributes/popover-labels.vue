<template>
  <div class="example">
    <p class="text-lg text-gray-800 font-semibold mb-2 mt-0" v-if="visibility === 'focus'">Focus</p>
    <p class="text-lg text-gray-800 font-semibold mb-2 mt-0" v-if="visibility === 'click'">Click</p>
    <v-calendar :attributes="attributes"></v-calendar>
  </div>
</template>

<script>
export default {
  props: {
    visibility: { type: String, default: 'hover' },
    hideIndicators: Boolean,
  },
  data() {
    const todos = [
      {
        description: 'Take Noah to basketball practice.',
        isComplete: false,
        dates: { weekdays: 6 }, // Every Friday
        color: 'red',
      },
    ];
    return {
      incId: todos.length,
      todos,
    };
  },
  computed: {
    attributes() {
      return [
        // Attributes for todos
        ...this.todos.map(todo => ({
          dates: todo.dates,
          dot: {
            color: todo.color,
            class: todo.isComplete ? 'opacity-75' : '',
          },
          popover: {
            label: todo.description,
            visibility: this.visibility,
            hideIndicator: this.hideIndicators,
          },
        })),
      ];
    },
  },
};
</script>
