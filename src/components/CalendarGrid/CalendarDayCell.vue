<template>
  <CalendarCell
    :cell="cell"
    :class="[`is-${size}`, `is-${fill}`]"
    :style="style"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CalendarCell from './CalendarCell.vue';
import { useCalendarGrid } from '../../use/calendarGrid';
import { DateRangeCell } from '../../utils/date/range';
import { Event } from '../../utils/calendar/event';
import { MS_PER_HOUR } from '../../utils/date/helpers';
import { roundTenth } from '../../utils/helpers';

const props = defineProps<{
  cell: DateRangeCell<Event>;
}>();

const { pixelsPerHour } = useCalendarGrid();

const event = computed(() => props.cell.data);

const position = computed(() => {
  const { dayStartTime } = props.cell;
  const yHours = dayStartTime / MS_PER_HOUR;
  return Math.max(roundTenth(yHours * pixelsPerHour.value), 0);
});

const height = computed(() => {
  const { dayStartTime, dayEndTime } = props.cell;
  const heightHours = (dayEndTime - dayStartTime) / MS_PER_HOUR;
  const fullHeight = 24 * pixelsPerHour.value;
  return Math.max(
    Math.min(heightHours * pixelsPerHour.value, fullHeight - position.value),
    0,
  );
});

const size = computed(() => {
  if (height.value <= 16) return '2xs';
  if (height.value <= 30) return 'xs';
  if (height.value <= 48) return 'sm';
  return 'md';
});

const style = computed(() => {
  return {
    top: `${position.value}px`,
    height: `${height.value}px`,
  };
});

const fill = computed(() => event.value.fill);
</script>
