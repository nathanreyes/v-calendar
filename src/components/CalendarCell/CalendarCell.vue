<template>
  <div
    :data-cell-id="cell.key"
    class="vc-grid-event"
    :class="[
      cell.class,
      `vc-${cell.color}`,
      `is-${cell.size}`,
      {
        [`is-${cell.fill}`]: cell.isAllDay || !isMonthly,
        'is-all-day': cell.isAllDay,
        'is-dragging': cell.dragging,
        'is-selected': cell.selected,
        'is-resizing': cell.resizing,
      },
    ]"
    :style="cell.style"
    :tabindex="1"
    @mousedown.prevent="onEventMouseDown($event, cell)"
    @touchstart.passive="onEventTouchStart($event, cell)"
    @touchmove.passive="onEventTouchMove($event, cell)"
    @touchend.passive="onEventTouchEnd($event, cell)"
  >
    <div class="vc-grid-event-content-wrapper">
      <div class="vc-grid-event-content" :style="cell.contentStyle">
        <span
          v-if="isMonthly && !cell.isAllDay"
          class="vc-grid-event-indicator"
        />
        <div class="vc-grid-event-label">{{ cell.label }}</div>
        <div v-if="!cell.isAllDay" class="vc-grid-event-date-label">
          {{ cell.dateLabel }}
        </div>
      </div>
      <!--Resize start-->
      <div
        v-if="cell.resizable"
        class="vc-grid-event-resizer is-start"
        @click.prevent
        @mousedown="onEventResizeStartMouseDown($event, cell)"
        @touchstart.passive="onEventResizeStartTouchStart($event, cell)"
      />
      <!--Resize end-->
      <div
        v-if="cell.resizable"
        class="vc-grid-event-resizer is-end"
        @click.prevent
        @mousedown="onEventResizeEndMouseDown($event, cell)"
        @touchstart.passive="onEventResizeEndTouchStart($event, cell)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { popoverDirective } from '../../utils/popovers';
import { useCalendarGridContext } from '../../use/calendarGrid';

export default {
  name: 'CalendarCell',
  directives: { popover: popoverDirective },
  props: {
    cell: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const {
      isMonthly,
      onEventMouseDown,
      onEventTouchStart,
      onEventTouchMove,
      onEventTouchEnd,
      onEventResizeStartMouseDown,
      onEventResizeEndMouseDown,
    } = useCalendarGridContext();
    return {
      isMonthly,
      onEventMouseDown,
      onEventTouchStart,
      onEventTouchMove,
      onEventTouchEnd,
      onEventResizeStartMouseDown,
      onEventResizeEndMouseDown,
    };
  },
};
</script>
