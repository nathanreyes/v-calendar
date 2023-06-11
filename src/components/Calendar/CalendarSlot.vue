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

export type CalendarSlot =
  | 'header-title-wrapper'
  | 'header-title'
  | 'header-prev-button'
  | 'header-next-button'
  | 'nav'
  | 'nav-prev-button'
  | 'nav-next-button'
  | 'day-content'
  | 'page';

defineProps<{
  name: CalendarSlot;
}>();

const { slots } = useCalendar();
</script>
