<template>
  <Popover
    :id="navPopoverId"
    :class="[
      'vc-nav-popover-container',
      `vc-${theme.color}`,
      `vc-${theme.displayMode}`,
    ]"
    ref="navPopoverRef"
  >
    <template #default="{ data }">
      <CalendarNav :value="data.page" @input="move" />
    </template>
  </Popover>
</template>

<script setup>
import Popover from '../Popover/Popover.vue';
import CalendarNav from '../CalendarNav/CalendarNav.vue';
import { useCalendar } from '../../use/calendar';

const { navPopoverId, theme, navPopoverRef, move } = useCalendar();
</script>
