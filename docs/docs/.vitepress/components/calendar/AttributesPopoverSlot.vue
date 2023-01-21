<template>
  <VCalendar :attributes="attributes">
    <template #day-popover="{ day, format, masks, dayTitle, attributes }">
      <div class="px-1">
        <div v-if="step === 1" class="text-xs text-gray-700 dark:text-gray-300">
          Using my own content now
        </div>
        <div
          class="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center"
          v-else-if="step >= 2"
        >
          {{ dayTitle }}
        </div>
        <ul v-if="step === 3">
          <li
            v-for="{ key, customData } in attributes"
            :key="key"
            class="block text-xs text-gray-500 dark:text-gray-400"
          >
            {{ customData.description }}
          </li>
        </ul>
      </div>
    </template>
  </VCalendar>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  visibility: { type: String, default: 'hover' },
  hideIndicators: Boolean,
  step: { type: Number, default: 1 },
});

const todos = ref([
  {
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { repeat: { weekdays: 6 } }, // Every Friday
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
    customData: todo,
  })),
]);
</script>
