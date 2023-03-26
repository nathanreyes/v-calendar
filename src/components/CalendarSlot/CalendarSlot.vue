<template>
  <Component v-if="slots[name]" :is="slots[name]" v-bind="$attrs" />
  <slot v-else />
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { useCalendar } from '../../use/calendar';

type CalendarSlot =
  | 'header-title'
  | 'header-prev-button'
  | 'header-next-button'
  | 'nav-prev-button'
  | 'nav-next-button'
  | 'day-content';

defineProps<{
  name: CalendarSlot;
}>();

const { slots } = useCalendar();
</script>
