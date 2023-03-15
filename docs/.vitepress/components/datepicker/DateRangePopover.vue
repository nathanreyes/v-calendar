<template>
  <DateDisplay
    v-model.range="range"
    :select-attribute="selectDragAttribute"
    :drag-attribute="selectDragAttribute"
    @drag="dragValue = $event"
  >
    <template #day-popover="{ format }">
      <div class="text-sm">
        {{ format(dragValue ? dragValue.start : range.start, 'MMM D') }}
        -
        {{ format(dragValue ? dragValue.end : range.end, 'MMM D') }}
      </div>
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref, computed } from 'vue';

const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10),
});
const dragValue = ref(null);
const selectDragAttribute = computed(() => ({
  popover: {
    visibility: 'hover',
    isInteractive: false,
  },
}));
</script>
