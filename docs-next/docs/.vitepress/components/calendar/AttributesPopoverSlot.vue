<template>
  <Calendar :attributes="attributes">
    <template #day-popover="{ day, format, masks, dayTitle, attributes }">
      <div class="px-1">
        <div v-if="step === 1" class="text-xs text-gray-700 dark:text-gray-300">
          Using my own content now
        </div>
        <div
          class="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center"
          v-else-if="step === 2"
        >
          {{ format(day.date, `${masks.dayPopover}`) }}
        </div>
        <div
          class="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center"
          v-else-if="step >= 3"
        >
          {{ dayTitle }}
        </div>
        <ul v-if="step === 3">
          <li
            v-for="{ key, customData } in attributes"
            :key="key"
            class="text-gray-900 dark:text-gray-100"
          >
            {{ customData.description }}
          </li>
        </ul>
      </div>
    </template>
  </Calendar>
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
    dates: { repeats: { weekdays: 6 } }, // Every Friday
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
