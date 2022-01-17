<template>
  <Popover
    :id="navPopoverId"
    :class="[
      'vc-nav-popover-container',
      'vc-theme',
      `vc-${theme.color}`,
      { 'vc-is-dark': theme.isDark },
    ]"
    ref="navPopoverRef"
  >
    <template #default="{ data }">
      <CalendarNav
        :value="data.page"
        :validator="e => canMove(e, { position: data.page.position })"
        @input="move"
      />
    </template>
  </Popover>
</template>

<script>
import { defineComponent } from 'vue';
import Popover from '../Popover/Popover.vue';
import CalendarNav from '../CalendarNav/CalendarNav.vue';
import { useCalendarContext } from '../../use/calendar';

export default defineComponent({
  components: { Popover, CalendarNav },
  setup() {
    const {
      navPopoverId,
      theme,
      navPopoverRef,
      canMove,
      move,
    } = useCalendarContext();
    return { navPopoverId, theme, navPopoverRef, canMove, move };
  },
});
</script>
