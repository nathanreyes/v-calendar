<template>
  <Example centered>
    <div class="text-lg font-semibold mb-2 mt-0" v-if="visibility === 'focus'">
      Focus
    </div>
    <div class="text-lg font-semibold mb-2 mt-0" v-if="visibility === 'click'">
      Click
    </div>
    <VCalendar :attributes="attributes" />
  </Example>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  visibility: { type: String, default: 'hover' },
  hideIndicators: Boolean,
});

const todos = ref([
  {
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { repeat: { weekdays: 5 } }, // Every Friday
    color: 'red',
  },
]);

const attributes = computed(() => [
  // Attributes for todos
  ...todos.value.map(todo => ({
    dates: todo.dates,
    dot: {
      color: todo.color,
      class: todo.isComplete ? 'opacity-75' : '',
    },
    popover: {
      label: todo.description,
      visibility: props.visibility,
      hideIndicator: props.hideIndicators,
    },
  })),
]);
</script>
