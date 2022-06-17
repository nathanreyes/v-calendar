<template>
  <div class="vc-grid-week-cells" :style="weekCellsStyle">
    <CalendarCell v-for="cell in cells" :key="cell.key" :cell="cell" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'CalendarGridWeek',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import CalendarCell from '../CalendarCell/CalendarCell.vue';
import { useCalendarGridContext } from '../../use/calendarGrid';
import { createWeekCell } from '../../utils/calendar/cell';
import { Event } from '../../utils/calendar/event';
import { CalendarDay } from '../../utils/locale';

const props = defineProps<{
  days: CalendarDay[];
  events: Event[];
}>();

const { isDaily, isMonthly } = useCalendarGridContext();

const cells = computed(() => {
  if (!props.events) return [];
  return props.events.map(e =>
    createWeekCell(e, { days: props.days, isDaily, isMonthly }),
  );
});

const weekCellsStyle = computed(() => {
  const numDays = props.days.length;
  return { gridTemplateColumns: `repeat(${numDays}, 1fr)` };
});
</script>
