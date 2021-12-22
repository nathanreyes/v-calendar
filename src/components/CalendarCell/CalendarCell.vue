<template>
  <div
    :data-cell-id="cell.key"
    class="vc-event-cell"
    :class="[
      cell.class,
      `vc-${cell.color}`,
      `is-${cell.size}`,
      {
        'is-all-day': cell.isAllDay,
        'is-dragging': cell.dragging,
        'is-selected': cell.selected,
        'is-resizing': cell.resizing,
      },
    ]"
    :style="cellStyle"
    :tabindex="1"
    @mousedown.prevent="onEventMouseDown($event, cell)"
    @touchstart.passive="onEventTouchStart($event, cell)"
    @touchmove.passive="onEventTouchMove($event, cell)"
    @touchend.passive="onEventTouchEnd($event, cell)"
  >
    <div class="vc-event-cell-content-wrapper">
      <div class="vc-event-cell-content" :style="cell.contentStyle">
        <div class="vc-event-cell-label">
          {{ cell.label }}
          <span v-if="cell.height <= 24">,</span>
        </div>
        <div class="vc-event-cell-label">
          {{ dateLabel }}
        </div>
      </div>
      <div
        v-if="resizable"
        class="vc-event-cell-resizer is-start"
        @click.prevent
        @mousedown="onEventResizeStartMouseDown($event, cell)"
        @touchstart.passive="onEventResizeStartTouchStart($event, cell)"
      />
      <div
        v-if="resizable"
        class="vc-event-cell-resizer is-end"
        @click.prevent
        @mousedown="onEventResizeEndMouseDown($event, cell)"
        @touchstart.passive="onEventResizeEndTouchStart($event, cell)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
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
  setup(props) {
    const {
      isMonthly,
      onEventMouseDown,
      onEventTouchStart,
      onEventTouchMove,
      onEventTouchEnd,
      onEventResizeStartMouseDown,
      onEventResizeEndMouseDown,
    } = useCalendarGridContext();
    const resizable = computed(() => {
      return props.cell.resizable && !isMonthly.value;
    });

    const cellStyle = computed(() => {
      const { day, height, position } = props.cell;
      if (isMonthly.value) {
        return {
          gridColumnStart: day.weekdayPosition,
          gridColumnEnd: day.weekdayPosition + 1,
        };
      } else if (props.cell.isAllDay) {
        return {
          gridColumnStart: day.weekdayPosition,
          gridColumnEnd: day.weekdayPosition + 1,
        };
      } else {
        return {
          top: `${position}px`,
          height: `${height}px`,
        };
      }
    });

    const dateLabel = computed(() => {
      if (props.cell.height > 24) {
        return `${props.cell.startDateLabel} - ${props.cell.endDateLabel}`;
      }
      return props.cell.startDateLabel;
    });

    return {
      resizable,
      cellStyle,
      dateLabel,
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
