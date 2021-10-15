<template>
  <div class="vc-weekly-container">
    <div class="vc-weekly-header">
      <div class="vc-weekly-header-nav">
        <div class="vc-arrow" role="button" @click="page.movePrevMonth()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        <div class="vc-arrow" role="button" @click="page.moveNextMonth()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        <span class="vc-weekly-title">{{ page.title }}</span>
      </div>
      <div class="vc-weekly-header-days">
        <template v-for="day in days" :key="day.id">
          <div class="vc-weekly-day" :class="{ 'is-today': day.isToday }">
            <div class="vc-weekly-day-label">
              {{ locale.format(day.date, 'WWW') }}
            </div>
            <span class="vc-weekly-day-number" @click="printDay(day)">{{
              day.day
            }}</span>
          </div>
        </template>
      </div>
    </div>
    <div
      class="vc-weekly-grid"
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
  props: {
    week: Number,
    days: { type: Array, required: true },
    page: Object,
    locale: Object,
  },
  setup(props) {
    console.log('Weekly props', props);
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

    const gridCells = computed(() => {
      const result = [];
      for (let hour = 0; hour < 24; hour++) {
        for (const day of props.days) {
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
      props.days.forEach((day, dayIndex) => {
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
        const date = props.days[0].dateFromTime(i, 0, 0);
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
        // console.log('dragenter', event.dataTransfer.effectAllowed);
      },
      onGridDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
        dragState.value.current = getPositionFromEvent(event);
        // console.log('dragover', dragState.value);
      },
      onGridDrop(event: DragEvent) {
        event.preventDefault();
      },
    };
  },
});
</script>

<style lang="css">
@import './calendar-week.css';
</style>
