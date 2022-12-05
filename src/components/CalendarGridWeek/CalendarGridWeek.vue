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
import { useCalendarGrid } from '../../use/calendarGrid';
import { Cell, createWeekCell } from '../../utils/calendar/cell';
import { DateRangeCell } from '../../utils/date/range';
import { Event } from '../../utils/calendar/event';
import { CalendarDay } from '../../utils/page';

const props = defineProps<{
  days: CalendarDay[];
}>();

const { isDaily, isMonthly, eventsContext } = useCalendarGrid();

const cells = computed(() => {
  const minDayIndex = props.days[0].dayIndex;
  const maxDayIndex = props.days[props.days.length - 1].dayIndex;
  const ctx = { minDayIndex, maxDayIndex, isDaily, isMonthly };

  const result: Cell[] = [];
  const added: Record<string, boolean> = {};

  props.days.forEach(day => {
    const cells = eventsContext.value.getCells(day.dayIndex);
    cells.forEach((cell: DateRangeCell<Event>) => {
      if ((!cell.data.isWeekly && !isMonthly.value) || added[cell.data.key]) {
        return;
      }
      result.push(createWeekCell(cell, ctx));
      added[cell.data.key] = true;
    });
  });

  return result;
});

const weekCellsStyle = computed(() => {
  const numDays = props.days.length;
  return { gridTemplateColumns: `repeat(${numDays}, 1fr)` };
});
</script>
