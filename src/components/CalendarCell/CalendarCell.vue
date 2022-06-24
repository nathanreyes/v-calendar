<template>
  <div
    :data-cell-id="cell.key"
    class="vc-grid-event"
    :class="[
      `vc-${cell.color}`,
      `is-${cell.size}`,
      `is-${cell.fill}`,
      {
        'is-all-day': cell.isAllDay,
        'is-dragging': cell.dragging,
        'is-selected': cell.selected,
        'is-resizing': cell.resizing,
      },
    ]"
    :style="cell.style"
    :tabindex="1"
    @mousedown.prevent="onEventMouseDown($event, cell.event)"
    @touchstart.passive="onEventTouchStart($event, cell.event)"
    @touchmove.passive="onEventTouchMove($event, cell.event)"
    @touchend.passive="onEventTouchEnd($event, cell.event)"
  >
    <div class="vc-grid-event-content-wrapper">
      <div class="vc-grid-event-content">
        <template v-if="cell.isWeekly">
          <div class="vc-grid-event-summary">{{ cell.summary }}</div>
        </template>
        <template v-else>
          <span v-if="isMonthly" class="vc-grid-event-indicator" />
          <div class="vc-grid-event-summary">{{ cell.summary }}</div>
          <div class="vc-grid-event-date-label">
            {{ cell.dateLabel }}
          </div>
        </template>
      </div>
      <!--Resize start-->
      <div
        v-if="cell.resizable"
        class="vc-grid-event-resizer is-start"
        :class="{
          'is-horizontal': cell.resizableHorizontal,
          'is-vertical': cell.resizableVertical,
        }"
        @click.prevent
        @mousedown="onEventResizeStartMouseDown($event, cell.event)"
        @touchstart.passive="onEventResizeStartTouchStart($event, cell.event)"
      />
      <!--Resize end-->
      <div
        v-if="cell.resizable"
        class="vc-grid-event-resizer is-end"
        :class="{
          'is-horizontal': cell.resizableHorizontal,
          'is-vertical': cell.resizableVertical,
        }"
        @click.prevent
        @mousedown="onEventResizeEndMouseDown($event, cell.event)"
        @touchstart.passive="onEventResizeEndTouchStart($event, cell.event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverDirective } from '../../utils/popovers';
import { Cell } from '../../utils/calendar/cell';

export default defineComponent({
  name: 'CalendarCell',
  directives: { popover: popoverDirective },
});
</script>

<script setup lang="ts">
import { useCalendarGridContext } from '../../use/calendarGrid';

defineProps<{
  cell: Cell;
}>();

const {
  isMonthly,
  onEventMouseDown,
  onEventTouchStart,
  onEventTouchMove,
  onEventTouchEnd,
  onEventResizeStartMouseDown,
  onEventResizeEndMouseDown,
  onEventResizeStartTouchStart,
  onEventResizeEndTouchStart,
} = useCalendarGridContext();
</script>
