<template>
  <div
    :data-cell-id="event.key"
    class="vc-grid-event"
    :class="[
      `vc-${event.color}`,
      {
        'is-all-day': event.allDay,
        'is-dragging': event.dragging,
        'is-selected': event.selected,
        'is-resizing': event.resizing,
      },
    ]"
    :tabindex="1"
    @mousedown.prevent="onEventMouseDown($event, event)"
    @touchstart.passive="onEventTouchStart($event, event)"
    @touchmove.passive="onEventTouchMove($event, event)"
    @touchend.passive="onEventTouchEnd($event, event)"
  >
    <div class="vc-grid-event-content-wrapper">
      <div class="vc-grid-event-content">
        <template v-if="event.isWeekly">
          <div class="vc-grid-event-summary">{{ event.summary }}</div>
        </template>
        <template v-else>
          <span v-if="isMonthly" class="vc-grid-event-indicator" />
          <div class="vc-grid-event-summary">{{ event.summary }}</div>
          <div class="vc-grid-event-start-date-label">
            {{ event.startTimeLabel }}
          </div>
          <div class="vc-grid-event-date-label">
            {{ event.timeLabel }}
          </div>
        </template>
      </div>
      <!--Resize start-->
      <div
        v-if="resizable"
        class="vc-grid-event-resizer is-start"
        :class="{
          'is-horizontal': resizableHorizontal,
          'is-vertical': resizableVertical,
        }"
        @click.prevent
        @mousedown="onEventResizeStartMouseDown($event, event)"
        @touchstart.passive="onEventResizeStartTouchStart($event, event)"
      />
      <!--Resize end-->
      <div
        v-if="resizable"
        class="vc-grid-event-resizer is-end"
        :class="{
          'is-horizontal': resizableHorizontal,
          'is-vertical': resizableVertical,
        }"
        @click.prevent
        @mousedown="onEventResizeEndMouseDown($event, event)"
        @touchstart.passive="onEventResizeEndTouchStart($event, event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { popoverDirective } from '../../utils/popovers';
import { DateRangeCell } from '../../utils/date/range';
import { Event } from '../../utils/calendar/event';

export default defineComponent({
  name: 'CalendarCell',
  directives: { popover: popoverDirective },
});
</script>

<script setup lang="ts">
import { useCalendarGrid } from '../../use/calendarGrid';

const props = defineProps<{
  cell: DateRangeCell<Event>;
}>();

const {
  isDaily,
  isMonthly,
  onEventMouseDown,
  onEventTouchStart,
  onEventTouchMove,
  onEventTouchEnd,
  onEventResizeStartMouseDown,
  onEventResizeEndMouseDown,
  onEventResizeStartTouchStart,
  onEventResizeEndTouchStart,
} = useCalendarGrid();

const event = computed(() => props.cell.data);

const resizable = computed(() => event.value.resizable);
const resizableHorizontal = computed(() => {
  if (!event.value.resizable) return false;
  if (isDaily.value) return false;
  if (isMonthly.value) return true;
  if (event.value.isWeekly) return true;
  return false;
});
const resizableVertical = computed(() => {
  if (!event.value.resizable) return false;
  if (isMonthly.value) return false;
  if (event.value.isWeekly) return false;
  return true;
});
</script>
