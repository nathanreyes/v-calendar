<template>
  <div class="vc-grid-week-cells" :style="weekCellsStyle">
    <template v-for="cell in cells" :key="cell.key">
      <CalendarWeekCell
        :cell="cell"
        :min-day-index="minDayIndex"
        :max-day-index="maxDayIndex"
      />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CalendarGridWeek',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import CalendarWeekCell from './CalendarWeekCell.vue';
import { useCalendarGrid } from '../../use/calendarGrid';
import { DateRangeCell } from '../../utils/date/range';
import { Event } from '../../utils/calendar/event';
import { CalendarDay } from '../../utils/page';

const props = defineProps<{
  days: CalendarDay[];
}>();

const { isMonthly, eventsContext } = useCalendarGrid();

const minDayIndex = computed(() => props.days[0].dayIndex);
const maxDayIndex = computed(() => props.days[props.days.length - 1].dayIndex);

const cells = computed(() => {
  const result: Array<DateRangeCell<Event>> = [];
  const added: Record<string, boolean> = {};

  props.days.forEach(day => {
    const cells = eventsContext.value.getCells(day);
    cells.forEach((cell: DateRangeCell<Event>) => {
      if ((!cell.data.isWeekly && !isMonthly.value) || added[cell.data.key]) {
        return;
      }
      result.push(cell);
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
