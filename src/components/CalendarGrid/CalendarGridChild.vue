<template>
  <div class="vc-grid-container">
    <CalendarHeader
      :page="page"
      layout="pnt-"
      :navPopoverId="navPopoverId"
      is-2xl
      @move-prev="page.movePrevMonth"
      @move-next="page.moveNextMonth"
    />
    <CustomTransition :name="transitionName">
      <div class="vc-grid" :key="page.id">
        <!--Grid header-->
        <div v-if="weeks[0].days.length > 1" class="vc-grid-header">
          <div class="vc-grid-header-days">
            <template v-for="day in weeks[0].days" :key="day.id">
              <div
                class="vc-grid-header-day"
                :class="{ 'is-today': day.isToday }"
              >
                <div class="vc-grid-header-day-label">
                  {{ locale.format(day.date, 'WWW') }}
                </div>
                <span
                  class="vc-grid-header-day-number"
                  @click="onDayNumberClick(day)"
                  >{{ day.day }}</span
                >
              </div>
            </template>
          </div>
        </div>
        <!--Grid content-->
        <div
          class="vc-grid-content"
          :class="{
            'is-resizing': grid.resizing,
            'is-dragging': grid.dragging,
          }"
          tabindex="0"
          :style="gridStyle"
          @mousemove="onGridMouseMove"
          @mousedown="onGridMouseDown"
          @mouseup="onGridMouseUp"
          @mouseleave="onGridMouseLeave"
          @touchstart.passive="onGridTouchStart"
          @touchmove.passive="onGridTouchMove"
          @touchend="onGridTouchEnd"
          @keydown.escape="onGridEscapeKeydown"
          ref="gridEl"
        >
          <!--Grid lines-->
          <div
            class="vc-grid-layer"
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: stretch;
            "
          >
            <svg
              v-for="n in 24"
              :key="n"
              xmlns="http://www.w3.org/2000/svg"
              class="vc-grid-line-hour"
            >
              <line x1="0%" y1="0" x2="100%" y2="0" />
            </svg>
          </div>
          <!--Hour labels-->
          <div class="vc-grid-layer">
            <div
              v-for="cell in labelCells"
              :key="cell.id"
              class="vc-grid-label-cell"
              :style="cell.style"
            >
              {{ cell.label }}
            </div>
          </div>
          <!--Event cells-->
          <div class="vc-grid-layer vc-events-layer">
            <div
              v-for="(cells, i) in grid.dayCells"
              :key="i"
              class="vc-grid-day"
            >
              <div
                v-for="cell in cells"
                :key="cell.key"
                class="vc-event-cell"
                :class="[
                  cell.class,
                  {
                    'is-dragging': cell.dragging,
                    'is-selected': cell.selected,
                    'is-resizing': cell.resizing,
                  },
                ]"
                :style="cell.style"
                tabindex="0"
                @focusin="onEventFocus($event, cell)"
                @mousedown.prevent="onEventMouseDown($event, cell)"
                @mousemove.prevent="onEventMouseMove($event, cell)"
                @mouseup.prevent="onEventMouseUp($event, cell)"
                @touchstart.passive.prevent="onEventTouchStart($event, cell)"
                @touchmove.passive.prevent="onEventTouchMove($event, cell)"
                @touchend.passive.prevent="onEventTouchEnd($event, cell)"
              >
                <div class="vc-event-cell-layout">
                  <div class="vc-event-cell-content" :style="cell.contentStyle">
                    <div class="vc-event-cell-label">{{ cell.label }}</div>
                    <div class="vc-event-cell-label">
                      {{ cell.startDateLabel }}-{{ cell.endDateLabel }}
                    </div>
                  </div>
                  <div
                    v-if="cell.resizable"
                    class="vc-event-cell-resizer is-start"
                    @mousedown="onEventResizeStartMouseDown($event, cell)"
                    @touchstart.passive="
                      onEventResizeStartTouchStart($event, cell)
                    "
                  />
                  <div
                    v-if="cell.resizable"
                    class="vc-event-cell-resizer is-end"
                    @mousedown="onEventResizeEndMouseDown($event, cell)"
                    @touchstart.passive="
                      onEventResizeEndTouchStart($event, cell)
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomTransition>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  toRefs,
  watch,
  onMounted,
} from 'vue';
import CustomTransition from '../CustomTransition/CustomTransition.vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import { CalendarDay } from '../../utils/locale';
import { getPageTransition } from '../../utils/helpers';
import { Grid, GridStateEvent } from './Grid';
import { Cell } from './Cell';

export interface Point {
  x: number;
  y: number;
}

export default defineComponent({
  components: { CustomTransition, CalendarHeader },
  props: {
    page: { type: Object, required: true },
    transition: String,
    navPopoverId: String,
    locale: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const transitionName = ref('none');
    const gridEl = ref<HTMLElement>();
    const { page } = toRefs(props);
    const days = computed(() => props.page.days);
    const weeks = computed(() => props.page.weeks);
    const weekdaysCount = computed(() => props.page.weeks[0].days.length);

    // Initialize grid
    const grid = reactive(
      new Grid(days.value, {
        willCreateEvent(cell: Cell) {
          emit('will-create-event', cell);
        },
        didCreateEvent(cell: Cell) {
          emit('did-create-event', cell);
        },
        willResizeEvent(cell: Cell) {
          emit('will-resize-event', cell);
        },
        didResizeEvent(cell: Cell) {
          emit('did-resize-event', cell);
        },
        willMoveEvent(cell: Cell) {
          emit('will-move-event', cell);
        },
        didMoveEvent(cell: Cell) {
          emit('did-move-event', cell);
        },
      }),
    );

    let refreshTimeout: number | undefined = undefined;
    const refreshGridCells = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        grid.days = days.value;
        grid.refreshCells();
      }, 50);
    };

    // Update grid any time it's dependencies change
    watch([days], () => refreshGridCells(), { deep: true });

    onMounted(() => {
      grid.refreshCells();
    });

    const gridStyle = computed(() => {
      return {
        height: `${24 * grid.pixelsPerHour}px`,
      };
    });

    const labelCells = computed(() => {
      const result = [];
      for (let i = 0; i < 24; i++) {
        const date = days.value[0].dateFromTime(i, 0, 0, 0);
        const timeLabel = props.locale.format(date, 'h A');
        if (i === 0) continue;
        result.push({
          id: `${i}-label`,
          label: timeLabel,
          style: {
            top: `${i * grid.pixelsPerHour}px`,
          },
        });
      }
      return result;
    });

    // Watch page updates to assign transition
    watch(
      () => page.value,
      (newPage, oldPage) => {
        transitionName.value = getPageTransition(
          newPage,
          oldPage,
          props.transition,
        );
      },
    );

    const getPositionFromMouseEvent = (event: MouseEvent): Point => {
      if (!gridEl.value) return { x: NaN, y: NaN };

      const rect = gridEl.value.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return { x, y };
    };

    const getPositionFromTouchEvent = (event: TouchEvent): Point => {
      if (!gridEl.value) return { x: NaN, y: NaN };

      const rect = gridEl.value.getBoundingClientRect();
      const touch = event.targetTouches[0] || event.changedTouches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      return { x, y };
    };

    const getPositionFromUIEvent = (event: UIEvent): Point => {
      if (event.type.startsWith('touch'))
        return getPositionFromTouchEvent(event as TouchEvent);
      return getPositionFromMouseEvent(event as MouseEvent);
    };

    const getDayFromPosition = ({ x }: any) => {
      const el = gridEl.value;
      if (!el) return days.value[0];

      const rect = el.getBoundingClientRect();
      const dayWidth = rect.width / days.value.length;
      const xNorm = Math.max(x, 0);
      const dayIndex = Math.floor(xNorm / dayWidth);
      return days.value[dayIndex];
    };

    const updateGridState = (
      stateEvent: GridStateEvent,
      event: MouseEvent | TouchEvent | KeyboardEvent,
      cell: Cell | undefined = undefined,
    ) => {
      const eventName = (event.shiftKey
        ? `${stateEvent}_SHIFT`
        : stateEvent) as GridStateEvent;
      const position = getPositionFromUIEvent(event);
      const day = cell?.day || getDayFromPosition(position);
      grid.update(eventName, day, position.y, cell);
    };

    return {
      grid,
      days,
      weeks,
      weekdaysCount,
      transitionName,
      gridEl,
      gridStyle,
      labelCells,
      onDayNumberClick(day: CalendarDay) {
        emit('day-header-click', day);
      },
      onEventFocus(event: FocusEvent, cell: Cell) {
        console.log('FOCUS', cell);
      },
      onGridEscapeKeydown() {
        console.log('fired');
        grid.update('ESCAPE', days.value[0], 0);
      },
      // Mouse event handlers
      onGridMouseDown(event: MouseEvent) {
        updateGridState('GRID_CURSOR_DOWN', event);
      },
      onGridMouseMove(event: MouseEvent) {
        updateGridState('GRID_CURSOR_MOVE', event);
      },
      onGridMouseUp(event: MouseEvent) {
        updateGridState('GRID_CURSOR_UP', event);
      },
      onGridMouseLeave(event: MouseEvent) {
        updateGridState('GRID_CURSOR_LEAVE', event);
      },
      onEventMouseDown(event: MouseEvent, cell: Cell) {
        updateGridState('EVENT_CURSOR_DOWN', event, cell);
      },
      onEventMouseMove(event: MouseEvent, cell: Cell) {
        updateGridState('EVENT_CURSOR_MOVE', event, cell);
      },
      onEventMouseUp(event: MouseEvent, cell: Cell) {
        updateGridState('EVENT_CURSOR_UP', event, cell);
      },
      onEventResizeStartMouseDown(event: MouseEvent, cell: Cell) {
        updateGridState('EVENT_RESIZE_START_CURSOR_DOWN', event, cell);
      },
      onEventResizeEndMouseDown(event: MouseEvent, cell: Cell) {
        updateGridState('EVENT_RESIZE_END_CURSOR_DOWN', event, cell);
      },
      // Touch event handlers
      onGridTouchStart(event: TouchEvent) {
        updateGridState('GRID_CURSOR_DOWN', event);
      },
      onGridTouchMove(event: TouchEvent) {
        updateGridState('GRID_CURSOR_MOVE', event);
      },
      onGridTouchEnd(event: TouchEvent) {
        updateGridState('GRID_CURSOR_UP', event);
      },
      onEventTouchStart(event: TouchEvent, cell: Cell) {
        updateGridState('EVENT_CURSOR_DOWN', event, cell);
      },
      onEventTouchMove(event: TouchEvent, cell: Cell) {
        updateGridState('EVENT_CURSOR_MOVE', event, cell);
      },
      onEventTouchEnd(event: TouchEvent, cell: Cell) {
        updateGridState('EVENT_CURSOR_UP', event, cell);
      },
      onEventResizeStartTouchStart(event: TouchEvent, cell: Cell) {
        updateGridState('EVENT_RESIZE_START_CURSOR_DOWN', event, cell);
      },
      onEventResizeEndTouchStart(event: TouchEvent, cell: Cell) {
        updateGridState('EVENT_RESIZE_END_CURSOR_DOWN', event, cell);
      },
    };
  },
});
</script>

<style lang="css">
@import './calendar-grid.css';
</style>
