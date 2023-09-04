<template>
  <CalendarCell
    :cell="cell"
    :class="[
      'is-2xs',
      `is-${fill}`,
      {
        'is-2xs': true,
        'has-start': hasStart,
        'has-end': hasEnd,
      },
    ]"
    :style="style"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalendarGrid } from '../../use/calendarGrid';
import { Event } from '../../utils/calendar/event';
import { DateRangeCell } from '../../utils/date/range';
import CalendarCell from './CalendarCell.vue';

const props = defineProps<{
  cell: DateRangeCell<Event>;
  minDayIndex: number;
  maxDayIndex: number;
}>();

const { isMonthly } = useCalendarGrid();

const event = computed(() => props.cell.data);
const hasStart = computed(() => props.minDayIndex <= props.cell.startDay);
const hasEnd = computed(() => props.maxDayIndex >= props.cell.endDay);

const fill = computed(() => {
  if (isMonthly.value && !event.value.isWeekly) return 'transparent';
  return event.value.fill;
});

const style = computed(() => {
  const gridColumnStart = Math.max(
    props.cell.startDay - props.minDayIndex + 1,
    1,
  );
  const gridColumnEnd = Math.min(props.cell.endDay - props.maxDayIndex - 1, -1);
  return {
    gridColumnStart,
    gridColumnEnd,
  };
});
</script>
