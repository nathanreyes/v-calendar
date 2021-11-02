<template>
  <div class="vc-grid-container vc-exclude">
    <div class="vc-grid-header">
      <div class="vc-grid-header-nav">
        <CalendarHeader
          :page="page"
          :title="page.title"
          layout="pnt-"
          :navPopoverId="navPopoverId"
          @move-prev="page.movePrevMonth"
          @move-next="page.moveNextMonth"
        />
      </div>

      <div class="vc-grid-header-days">
        <template v-for="day in page.weeks[0].days" :key="day.id">
          <div class="vc-grid-day" :class="{ 'is-today': day.isToday }">
            <div class="vc-grid-day-label">
              {{ locale.format(day.date, 'WWW') }}
            </div>
            <span class="vc-grid-day-number" @click="printDay(day)">{{
              day.day
            }}</span>
          </div>
        </template>
      </div>
    </div>
    <div
      class="vc-grid"
      :style="gridStyle"
      @dragenter="onGridDragEnter"
      @dragover="onGridDragOver"
      @drop="onGridDrop"
      ref="gridEl"
    >
      <div
        v-for="cell in gridCells"
        :key="cell.id"
        class="grid-cell"
        :class="cell.class"
        :style="cell.style"
      ></div>
      <div
        v-for="cell in labelCells"
        :key="cell.id"
        class="label-cell"
        :style="cell.style"
      >
        {{ cell.label }}
      </div>
      <div
        v-for="cell in eventCells"
        :key="cell.id"
        class="event-cell"
        :class="{ 'is-dragging': cell.dragging }"
        :style="cell.style"
        :draggable="cell.draggable"
        @dragstart="onEventCellDragStart(cell, $event)"
        @dragend="onEventCellDragEnd(cell, $event)"
      ></div>
      <div v-if="dragCell" class="drag-cell" :style="dragStyle" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref } from 'vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import { Page } from '../../utils/locale';

interface DragPoint {
  x: number;
  y: number;
}

interface DragPosition {
  y: number;
  column: number;
  width: number;
}

interface DragState {
  offset: DragPoint;
  start: DragPosition;
  current: DragPosition;
}

export default defineComponent({
  components: { CalendarHeader },
  props: {
    page: { type: Object, required: true },
    navPopoverId: String,
    locale: Object,
  },
  setup(props) {
    const { days } = props.page as Page;
    const pixelsPerHour = 48;
    const gridEl = ref<HTMLElement>();
    const getPositionFromEvent = (event: DragEvent) => {
      const rect = gridEl.value!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const column = Math.floor((7 * x) / rect.width) + 1;
      const width = rect.width / 7;
      return { x, y, column, width };
    };

    const dragCell = ref(null);
    const dragState = ref<DragState>({
      start: { y: 0, column: 0, width: 0 },
      offset: { x: 0, y: 0 },
      current: { y: 0, column: 0, width: 0 },
    });
    const dragStyle = computed(() => {
      const state = dragState.value;
      let top = state.current.y - state.offset.y;
      const increment = pixelsPerHour / 4;
      top = Math.floor(top / increment) * increment;
      top = Math.max(top, 0);
      return {
        top: `${top}px`,
        gridColumn: state.current.column,
        width: `${state.current.width}px`,
      };
    });

    const gridStyle = computed(() => {
      const columns = props.page.weeks[0].days.length;
      return {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      };
    });
    const gridCells = computed(() => {
      const result = [];
      for (let hour = 0; hour < 24; hour++) {
        for (const day of days) {
          result.push({
            id: `${day.id}-${hour}`,
            day,
            class: `vc-hour-${hour}`,
          });
        }
      }
      return result;
    });
    const eventCells = computed(() => {
      const result = [];
      days.forEach((day, dayIndex) => {
        Object.entries(day.attributesMap).forEach(([key, attr]) => {
          attr.dates.forEach(dateInfo => {
            const { startTime } = dateInfo;
            const { range } = day;
            const dayStartTime = range.start.getTime();
            const dayEndTime = range.end.getTime();
            const dayTimeRange = dayEndTime - dayStartTime;
            const startY = (startTime - dayStartTime) / dayTimeRange;
            const top = `${startY * 100}%`;
            const width = `${100 / 7}%`;
            const left = `${dayIndex * (100 / 7)}%`;
            const height = '20px';
            const backgroundColor = 'red';
            result.push(
              reactive({
                id: attr.id,
                day,
                attr,
                draggable: !attr.readonly,
                style: {
                  top,
                  left,
                  width,
                  height,
                  backgroundColor,
                },
              }),
            );
          });
        });
      });
      return result;
    });
    const labelCells = computed(() => {
      const result = [];
      for (let i = 0; i < 24; i++) {
        const date = days[0].dateFromTime(i, 0, 0);
        const timeLabel = props.locale.format(date, 'h A');
        if (i === 0) continue;
        result.push({
          id: `${i}-label`,
          label: timeLabel,
          style: {
            top: `${i * pixelsPerHour}px`,
          },
        });
      }
      return result;
    });

    return {
      gridEl,
      dragCell,
      dragStyle,
      gridStyle,
      gridCells,
      eventCells,
      labelCells,
      printDay(day) {
        console.log(day);
      },
      onEventCellDragStart(cell, event: DragEvent) {
        cell.dragging = true;
        dragCell.value = cell;

        const position = getPositionFromEvent(event);
        dragState.value = {
          start: position,
          offset: { x: event.offsetX, y: event.offsetY },
          current: position,
        };

        const dt = event.dataTransfer!;
        dt.effectAllowed = 'move';
        dt.dropEffect = 'move';
        dt.setData('text/plain', cell.id);
        // Set empty drag image
        const img = document.createElement('img');
        img.src =
          'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        dt.setDragImage(img, 0, 0);
      },
      onEventCellDragEnd(cell, event: DragEvent) {
        cell.dragging = false;
      },
      onGridDragEnter(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
      },
      onGridDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
        dragState.value.current = getPositionFromEvent(event);
      },
      onGridDrop(event: DragEvent) {
        event.preventDefault();
      },
    };
  },
});
</script>

<style lang="css">
@import './calendar-grid.css';
</style>
