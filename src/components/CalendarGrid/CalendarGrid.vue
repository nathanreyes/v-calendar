<template>
  <div
    v-if="weeks.length"
    class="vc-grid-container vc-theme"
    :class="[`vc-${theme.color}`]"
    ref="containerRef"
    @keydown="onKeydown"
  >
    <!--Calendar header-->
    <CalendarHeader :page="page" layout="pnt-u" is-2xl />
    <!--Grid header-->
    <div class="vc-grid-header">
      <div class="vc-grid-header-days">
        <div v-if="weeks[0].weeknumberDisplay" class="vc-grid-header-timezone">
          {{ weeks[0].weeknumberDisplay }}
        </div>
        <template v-for="day in weeks[0].days" :key="day.id">
          <div
            class="vc-grid-header-day"
            :class="{
              'is-today': day.isToday,
              'is-active': day.day === page.day,
              'is-inactive': page.day && day.day !== page.day,
            }"
          >
            <div class="vc-grid-header-day-label">
              {{ locale.formatDate(day.date, 'WWW') }}
            </div>
            <span
              tabindex="1"
              role="button"
              class="vc-grid-header-day-number vc-focusable"
              :class="`id-${day.id}`"
              @click="onDayNumberClick(day)"
              @keydown="onDayKeydown(day, $event)"
              @keydown.space.enter="onDayNumberClick(day)"
              >{{ day.day }}</span
            >
          </div>
        </template>
      </div>
    </div>
    <!--Grid content-->
    <div class="vc-grid">
      <Transition
        :name="`vc-${transitionName}`"
        @before-enter="onTransitionBeforeEnter"
        @after-enter="onTransitionAfterEnter"
      >
        <div class="vc-grid-inset" :key="page.id">
          <div
            class="vc-grid-content"
            :class="{
              'is-resizing': grid.resizing,
              'is-dragging': grid.dragging,
            }"
            tabindex="0"
            :style="gridStyle"
            @mousedown="onGridMouseDown"
            @mousemove="onGridMouseMove"
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
              <svg v-for="n in 25" :key="n" class="vc-grid-line-hour">
                <line x1="0%" y1="0" x2="100%" y2="0" />
              </svg>
            </div>
            <!--Hour labels-->
            <div class="vc-grid-layer">
              <div
                v-for="cell in labelCells"
                :key="cell.key"
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
                  tabindex="1"
                  @mousedown.prevent="onEventMouseDown($event, cell)"
                  @touchstart.passive="onEventTouchStart($event, cell)"
                  @touchmove.passive="onEventTouchMove($event, cell)"
                  @touchend.passive="onEventTouchEnd($event, cell)"
                >
                  <div class="vc-event-cell-layout">
                    <div
                      class="vc-event-cell-content"
                      :style="cell.contentStyle"
                    >
                      <div class="vc-event-cell-label">
                        {{ cell.label }}
                      </div>
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
      </Transition>
    </div>
  </div>
  <!--Nav popover-->
  <CalendarNavPopover />
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  watch,
  onMounted,
} from 'vue';
import CalendarNavPopover from '../CalendarNavPopover/CalendarNavPopover.vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import { Grid, GridStateEvent } from './Grid';
import { Cell } from './Cell';
import { CalendarDay, Page } from '../../utils/locale';
import { emits, props, useCalendar } from '../../utils/calendar';

export interface Point {
  x: number;
  y: number;
}

export default defineComponent({
  components: { CalendarNavPopover, CalendarHeader },
  emits: [
    ...emits,
    'day-header-click',
    'will-create-event',
    'did-create-event',
    'will-resize-event',
    'did-resize-event',
    'will-move-event',
    'did-move-event',
  ],
  props,
  setup(props, { emit }) {
    const {
      pages,
      containerRef,
      locale,
      onDayFocusin,
      move,
      onDayKeydown,
      theme,
      onKeydown,
      transitionName,
      onTransitionBeforeEnter,
      onTransitionAfterEnter,
    } = useCalendar(props, { emit });

    const gridEl = ref<HTMLElement>();
    const page = computed<Page>(() => pages.value[0]);
    const days = computed(() => page.value.viewDays);
    const weeks = computed(() => page.value.viewWeeks);

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

    const labelCells = computed<Partial<Cell>[]>(() => {
      const result: Partial<Cell>[] = [];
      if (!days.value.length) return result;
      for (let i = 0; i < 24; i++) {
        const date = days.value[0].dateFromTime(i, 0, 0, 0);
        const timeLabel = locale.value.formatDate(date, 'h A');
        if (i === 0) continue;
        result.push({
          key: `${i}-label`,
          label: timeLabel,
          style: {
            top: `${i * grid.pixelsPerHour}px`,
          },
        });
      }
      return result;
    });

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
      if (!event.type.startsWith('touch') && grid.isTouch) return;
      const eventName = (event.shiftKey
        ? `${stateEvent}_SHIFT`
        : stateEvent) as GridStateEvent;
      const position = getPositionFromUIEvent(event);
      const day = getDayFromPosition(position);
      grid.update(eventName, day, position.y, cell);
      if (stateEvent === 'GRID_CURSOR_DOWN') {
        onDayFocusin(day);
      }
    };

    return {
      containerRef,
      page,
      grid,
      days,
      weeks,
      gridEl,
      gridStyle,
      labelCells,
      transitionName,
      theme,
      locale,
      onTransitionBeforeEnter,
      onTransitionAfterEnter,
      onDayNumberClick(day: CalendarDay) {
        emit('day-header-click', day);
        move(day, { view: 'daily' });
      },
      onDayKeydown(day: CalendarDay, event: KeyboardEvent) {
        onDayKeydown(day, event);
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
      onEventResizeStartMouseDown(event: MouseEvent, cell: Cell) {
        updateGridState('EVENT_RESIZE_START_CURSOR_DOWN', event, cell);
      },
      onEventResizeEndMouseDown(event: MouseEvent, cell: Cell) {
        updateGridState('EVENT_RESIZE_END_CURSOR_DOWN', event, cell);
      },
      // Touch event handlers
      onGridTouchStart(event: TouchEvent) {
        grid.isTouch = true;
        updateGridState('GRID_CURSOR_DOWN', event);
      },
      onGridTouchMove(event: TouchEvent) {
        updateGridState('GRID_CURSOR_MOVE', event);
      },
      onGridTouchEnd(event: TouchEvent) {
        updateGridState('GRID_CURSOR_UP', event);
      },
      onEventTouchStart(event: TouchEvent, cell: Cell) {
        grid.isTouch = true;
        updateGridState('EVENT_CURSOR_DOWN', event, cell);
      },
      onEventTouchMove(event: TouchEvent, cell: Cell) {
        updateGridState('GRID_CURSOR_MOVE', event, cell);
      },
      onEventTouchEnd(event: TouchEvent, cell: Cell) {
        updateGridState('GRID_CURSOR_UP', event, cell);
      },
      onEventResizeStartTouchStart(event: TouchEvent, cell: Cell) {
        grid.isTouch = true;
        updateGridState('EVENT_RESIZE_START_CURSOR_DOWN', event, cell);
      },
      onEventResizeEndTouchStart(event: TouchEvent, cell: Cell) {
        grid.isTouch = true;
        updateGridState('EVENT_RESIZE_END_CURSOR_DOWN', event, cell);
      },
    };
  },
});
</script>

<style lang="css">
@import './calendar-grid.css';
</style>
