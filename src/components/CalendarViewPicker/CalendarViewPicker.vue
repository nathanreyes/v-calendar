<template>
  <div
    v-if="canMoveUp"
    class="vc-view-picker"
    :class="{ 'vc-disabled': !canMoveUp }"
    role="button"
    @click.stop="moveUp"
    @keydown.space.enter="moveUp"
  >
    {{ moveUpLabel }}
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useCalendar } from '../../use/calendar';
import { capitalize } from '../../utils/helpers';

const { locale, view, isDaily } = useCalendar();
const canMoveUp = computed(() => view.value !== 'monthly');

const moveUp = () => {
  if (view.value === 'daily') {
    view.value = 'weekly';
  } else if (view.value === 'weekly') {
    view.value = 'monthly';
  }
};

const moveUpLabel = computed(() => {
  if (view.value === 'monthly') return '';
  return capitalize(
    locale.value.relativeTimeNames[isDaily.value ? 'week' : 'month']!,
  );
});
</script>

<style lang="css">
@import './calendar-view-picker.css';
</style>
