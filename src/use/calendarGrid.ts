import { SetupContext, ref, computed, provide, inject, watch } from 'vue';
import {
  CalendarProps,
  CalendarContext,
  emits as calendarEmits,
  useCalendar,
} from './calendar';
import { CalendarDay, Page } from '../utils/locale';
import { on } from '../utils/helpers';
import { Cell } from '../components/CalendarGrid/Cell';
import CalendarCellPopover from '../components/CalendarCellPopover/CalendarCellPopover.vue';
import { roundDate } from '../utils/dates';
import DateInfo from '../utils/dateInfo';
import { logger } from '../utils/logger';

type GridState =
  | 'NORMAL'
  | 'CREATE_MONITOR'
  | 'DRAG_MONITOR'
  | 'RESIZE_MONITOR';

export type GridStateEvent =
  | 'GRID_CURSOR_DOWN'
  | 'GRID_CURSOR_DOWN_SHIFT'
  | 'GRID_CURSOR_MOVE'
  | 'GRID_CURSOR_MOVE_SHIFT'
  | 'GRID_CURSOR_UP'
  | 'GRID_CURSOR_UP_SHIFT'
  | 'EVENT_CURSOR_DOWN'
  | 'EVENT_CURSOR_DOWN_SHIFT'
  | 'EVENT_CURSOR_MOVE'
  | 'EVENT_CURSOR_MOVE_SHIFT'
  | 'EVENT_RESIZE_START_CURSOR_DOWN'
  | 'EVENT_RESIZE_START_CURSOR_DOWN_SHIFT'
  | 'EVENT_RESIZE_END_CURSOR_DOWN'
  | 'EVENT_RESIZE_END_CURSOR_DOWN_SHIFT'
  | 'ESCAPE';

export interface Point {
  x: number;
  y: number;
}

interface DragOriginState {
  position: number;
  date: Date;
  day: CalendarDay;
  weekdayPosition: number;
  cell: Cell;
  cellSelected: boolean;
  minOffsetDays: number;
  maxOffsetDays: number;
}

interface ResizeOriginState {
  position: number;
  date: Date;
  day: CalendarDay;
  cell: Cell;
  fromStart: boolean;
  isNew: boolean;
}

interface CreateOriginState {
  position: number;
  date: Date;
  day: CalendarDay;
}

export const emits = [
  ...calendarEmits,
  'day-header-click',
  'will-create-event',
  'did-create-event',
  'will-resize-event',
  'did-resize-event',
  'will-move-event',
  'did-move-event',
  'remove-event',
];

const contextKey = '__vc_grid_context__';

export function useCalendarGrid(
  props: CalendarProps,
  ctx: SetupContext,
): CalendarGridContext {
  const { emit } = ctx;
  const calendar = useCalendar(props, ctx);
  const gridRef = ref<HTMLElement | null>(null);
  const cellPopoverRef = ref<typeof CalendarCellPopover>();

  const { isMonthly, isDaily, pages, locale, move, onDayFocusin } = calendar;
  const page = computed<Page>(() => pages.value[0]);
  const days = computed(() => page.value.viewDays);
  const weeks = computed(() => page.value.viewWeeks);
  const dayColumns = computed(() => {
    if (isDaily.value) return 1;
    return weeks.value[0].days.length;
  });
  const dayRows = computed(() => {
    if (isMonthly.value) return weeks.value.length;
    return 1;
  });

  const snapMinutes = 15;
  const snapMs = snapMinutes * 60 * 1000;
  const pixelsPerHour = ref(48);

  const state = ref<GridState>('NORMAL');

  const cells = ref<Cell[]>([]);
  const dayCells = ref<Cell[][]>([]);
  const allDayCells = ref<Cell[]>([]);
  const weekCells = ref<Cell[][]>([]);

  const createOrigin = ref<CreateOriginState | null>(null);

  const resizing = ref(false);
  const resizeOrigin = ref<ResizeOriginState | null>(null);

  const dragging = ref(false);
  const dragOrigin = ref<DragOriginState | null>(null);

  const createTimer: number | undefined = undefined;
  // let createTimerDurationMs = 700;

  const isTouch = ref(false);

  const active = computed(() => resizing.value || dragging.value);

  const selectedCells = computed(() => cells.value.filter(c => c.selected));

  const selectedCellsCount = computed(() => selectedCells.value.length);

  const hasSelectedCells = computed(() => selectedCellsCount.value > 0);

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
          top: `${i * pixelsPerHour.value}px`,
        },
      });
    }
    return result;
  });

  const gridStyle = computed(() => {
    return {
      height: `${24 * pixelsPerHour.value}px`,
    };
  });

  // #region Cell popover

  function showCellPopover(cell: Cell) {
    if (!cellPopoverRef.value) return;
    cellPopoverRef.value.show(cell);
  }

  function updateCellPopover(cell: Cell) {
    if (!cellPopoverRef.value) return;
    cellPopoverRef.value.update(cell);
  }

  function hideCellPopover() {
    if (!cellPopoverRef.value) return;
    cellPopoverRef.value.hide();
  }

  // #endregion Event popover

  // #region Util

  function getCellOptions() {
    return {
      pixelsPerHour: pixelsPerHour.value,
      snapMinutes,
    };
  }

  function getEventCells(days: CalendarDay[]): Cell[] {
    const result: Cell[] = [];
    days.forEach((day: CalendarDay) => {
      Object.values(day.attributesMap).forEach(attr => {
        attr.dates.forEach((dateInfo: DateInfo) => {
          const existingCell = cells.value.find(c => c.key === attr.key);
          const cell = Cell.fromDateInfo(dateInfo, day, {
            key: attr.key,
            ...existingCell,
            ...attr.event,
            ...getCellOptions(),
          });
          result.push(cell);
        });
      });
    });
    return result;
  }

  function refreshDayCells() {
    const rWeekCells: Cell[][] = weeks.value.map(() => []);
    const rDayCells: Cell[][] = days.value.map(() => []);
    const rAllDayCells: Cell[] = [];
    cells.value.forEach(cell => {
      const wIdx = weeks.value.findIndex(
        w => w.weekPosition === cell.day.weekPosition,
      );
      if (wIdx >= 0) {
        rWeekCells[wIdx].push(cell);
        cell.order = rWeekCells[wIdx].length;
      }
      if (cell.isAllDay) {
        rAllDayCells.push(cell);
        return;
      }
      const idx = days.value.findIndex(d => d.id === cell.day.id);
      if (idx >= 0) {
        rDayCells[idx].push(cell);
      }
    });
    for (let i = 0; i < rDayCells.length; i++) {
      rDayCells[i] = rDayCells[i].sort((a, b) => a.position - b.position);
    }
    dayCells.value = rDayCells;
    allDayCells.value = rAllDayCells;
    weekCells.value = rWeekCells;
  }

  function doRefreshCells() {
    cells.value = getEventCells(days.value);
    refreshDayCells();
  }

  let refreshTimeout: number | undefined = undefined;
  function refreshCells() {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(doRefreshCells, 50);
  }

  watch(
    () => days,
    () => {
      refreshCells();
    },
    {
      deep: true,
    },
  );

  function getDateFromPosition(
    position: number,
    day: CalendarDay,
    offsetMs = 0,
    snapMs = 0,
  ) {
    const ms = (position / pixelsPerHour.value) * 60 * 60 * 1000;
    return roundDate(day.range.start.getTime() + ms + offsetMs, snapMs);
  }

  // #endregion Util

  // #region Cell Operations

  function forSelectedCells(fn: (cell: Cell) => void) {
    selectedCells.value.forEach(cell => {
      fn(cell);
    });
  }

  function deselectAllCells() {
    forSelectedCells(cell => (cell.selected = false));
  }

  function createNewCell(position: number, day: CalendarDay) {
    const cell = Cell.fromDate(
      getDateFromPosition(position, day),
      day,
      getCellOptions(),
    );
    emit('will-create-event', cell);
    cells.value.push(cell);
    refreshDayCells();
    return cell;
  }

  function removeCell(cell: Cell) {
    emit('remove-event', cell);
    hideCellPopover();
  }

  // #endregion Cell Operations

  // #region Resizing

  function startResizingCells(
    position: number,
    day: CalendarDay,
    cell: Cell,
    fromStart = false,
    isNew = false,
  ) {
    if (active.value) return;
    resizing.value = true;
    cell.selected = true;
    resizeOrigin.value = {
      position,
      day,
      date: getDateFromPosition(position, day, 0, 0),
      cell,
      fromStart,
      isNew,
    };
    forSelectedCells(selectedCell => {
      emit('will-resize-event', selectedCell);
      selectedCell.startResize(fromStart);
    });
  }

  function updateResizingCells(position: number) {
    if (!resizing.value || !resizeOrigin.value) return;
    const day = resizeOrigin.value.day;
    const date = getDateFromPosition(position, day, 0, 0);
    const offsetMs = date.getTime() - resizeOrigin.value.date.getTime();
    forSelectedCells(cell => cell.updateResize(offsetMs));
    refreshDayCells();
  }

  function stopResizingCells() {
    if (!resizing.value || !resizeOrigin.value) return;
    forSelectedCells(cell => {
      if (resizeOrigin.value!.isNew && cell === resizeOrigin.value!.cell) {
        emit('did-create-event', cell);
        showCellPopover(cell);
        // cell.editing = true;
      } else {
        emit('did-resize-event', cell);
      }
      cell.stopResize();
    });
    resizing.value = false;
    resizeOrigin.value = null;
  }

  // #endregion Resizing

  // #region Dragging

  function startDraggingCells(position: number, day: CalendarDay, cell: Cell) {
    if (active.value) return;
    dragging.value = true;
    const cellSelected = cell.selected;
    cell.selected = true;
    const indices = selectedCells.value.map(c =>
      days.value.findIndex(d => d.id === c.day.id),
    );
    const minOffsetDays = -Math.min(...indices);
    const maxOffsetDays = days.value.length - Math.max(...indices) - 1;
    dragOrigin.value = {
      position,
      date: getDateFromPosition(position, day, 0, 0),
      weekdayPosition: day.weekdayPosition,
      maxOffsetDays,
      minOffsetDays,
      day,
      cell,
      cellSelected,
    };
    selectedCells.value.forEach(cell => {
      emit('will-move-event', cell);
      cell.startDrag();
    });
  }

  function updateDraggingCells(position: number, day: CalendarDay) {
    if (!dragging.value || !dragOrigin.value) return;
    const date = getDateFromPosition(position, day, 0, 0);
    const offsetMs = date.getTime() - dragOrigin.value.date.getTime();
    const { minOffsetDays, maxOffsetDays, weekdayPosition } = dragOrigin.value;
    const offsetDays = day.weekdayPosition - weekdayPosition;
    if (offsetDays < minOffsetDays || offsetDays > maxOffsetDays) return;
    forSelectedCells(cell => {
      cell.updateDrag(offsetMs, offsetDays, days.value);
    });
    refreshDayCells();
  }

  function stopDraggingCells() {
    if (!dragging.value) return;
    dragging.value = false;
    dragOrigin.value = null;
    forSelectedCells(cell => {
      emit('did-move-event', cell);
      cell.stopDrag();
    });
  }

  // #endregion Dragging

  // #region State management

  function handleNormalEvent(
    event: GridStateEvent,
    day: CalendarDay,
    position: number,
    cell: Cell | undefined,
  ) {
    switch (event) {
      case 'GRID_CURSOR_DOWN':
      case 'GRID_CURSOR_DOWN_SHIFT': {
        createOrigin.value = {
          position,
          date: getDateFromPosition(position, day),
          day,
        };
        state.value = 'CREATE_MONITOR';
        hideCellPopover();
        // createTimer = setTimeout(() => {
        //   if (state.value !== 'CREATE_MONITOR') return;
        //   handleCreateMonitorEvent('GRID_CURSOR_UP', day);
        // }, createTimerDurationMs);
        break;
      }
      case 'EVENT_CURSOR_DOWN': {
        if (!cell) return;
        if (!cell.selected) deselectAllCells();
        startDraggingCells(position, day, cell);
        state.value = 'DRAG_MONITOR';
        break;
      }
      case 'EVENT_CURSOR_DOWN_SHIFT': {
        if (!cell) return;
        startDraggingCells(position, day, cell);
        state.value = 'DRAG_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_START_CURSOR_DOWN': {
        if (!cell) return;
        if (!cell.selected) deselectAllCells();
        startResizingCells(position, day, cell, true, false);
        state.value = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_START_CURSOR_DOWN_SHIFT': {
        if (!cell) return;
        startResizingCells(position, day, cell, true, false);
        state.value = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_END_CURSOR_DOWN': {
        if (!cell) return;
        if (!cell.selected) deselectAllCells();
        startResizingCells(position, day, cell, false, false);
        state.value = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_END_CURSOR_DOWN_SHIFT': {
        if (!cell) return;
        startResizingCells(position, day, cell, false, false);
        state.value = 'RESIZE_MONITOR';
        break;
      }
    }
  }

  function handleCreateMonitorEvent(event: GridStateEvent, day: CalendarDay) {
    clearTimeout(createTimer);
    if (!createOrigin.value) return;

    switch (event) {
      case 'ESCAPE': {
        deselectAllCells();
        break;
      }
      case 'GRID_CURSOR_UP':
      case 'GRID_CURSOR_UP_SHIFT': {
        if (hasSelectedCells.value) {
          deselectAllCells();
        } else {
          deselectAllCells();
          const newCell = createNewCell(createOrigin.value.position, day);
          newCell.selected = true;
          emit('did-create-event', newCell);
          showCellPopover(newCell);
        }
        state.value = 'NORMAL';
        break;
      }
      case 'EVENT_CURSOR_MOVE':
      case 'EVENT_CURSOR_MOVE_SHIFT':
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        if (isTouch.value) {
          state.value = 'NORMAL';
          return;
        }
        deselectAllCells();
        const cell = createNewCell(createOrigin.value.position, day);
        const position = cell.position + cell.height;
        startResizingCells(position, day, cell, false, true);
        updateResizingCells(position);
        state.value = 'RESIZE_MONITOR';
        break;
      }
    }
  }

  function handleResizeMonitorEvent(event: GridStateEvent, position: number) {
    if (!resizeOrigin.value) return;
    switch (event) {
      case 'EVENT_CURSOR_MOVE':
      case 'EVENT_CURSOR_MOVE_SHIFT':
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        updateResizingCells(position);
        if (!resizeOrigin.value.isNew) {
          updateCellPopover(resizeOrigin.value.cell);
        }
        break;
      }
      case 'GRID_CURSOR_UP': {
        if (position === resizeOrigin.value.position) {
          deselectAllCells();
          resizeOrigin.value.cell.selected = true;
        }
        stopResizingCells();
        state.value = 'NORMAL';
        break;
      }
      case 'GRID_CURSOR_UP_SHIFT': {
        stopResizingCells();
        state.value = 'NORMAL';
        break;
      }
    }
  }

  function handleDragMonitorEvent(
    event: GridStateEvent,
    day: CalendarDay,
    position: number,
  ) {
    if (!dragOrigin.value) return;
    switch (event) {
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        updateDraggingCells(position, day);
        updateCellPopover(dragOrigin.value.cell);
        break;
      }
      case 'GRID_CURSOR_UP': {
        const origin = dragOrigin.value;
        stopDraggingCells();
        if (position === origin.position) {
          deselectAllCells();
          origin.cell.selected = true;
          showCellPopover(origin.cell);
        }
        state.value = 'NORMAL';
        break;
      }
      case 'GRID_CURSOR_UP_SHIFT': {
        stopDraggingCells();
        state.value = 'NORMAL';
        break;
      }
    }
  }

  function updateState(
    event: GridStateEvent,
    day: CalendarDay,
    position: number,
    cell: Cell | undefined = undefined,
  ) {
    switch (state.value) {
      case 'NORMAL': {
        handleNormalEvent(event, day, position, cell);
        break;
      }
      case 'CREATE_MONITOR': {
        handleCreateMonitorEvent(event, day);
        break;
      }
      case 'RESIZE_MONITOR': {
        handleResizeMonitorEvent(event, position);
        break;
      }
      case 'DRAG_MONITOR': {
        handleDragMonitorEvent(event, day, position);
        break;
      }
    }
  }

  const getPositionFromMouseEvent = (event: MouseEvent): Point => {
    if (!gridRef.value) return { x: NaN, y: NaN };

    const rect = gridRef.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  };

  const getPositionFromTouchEvent = (event: TouchEvent): Point => {
    if (!gridRef.value) return { x: NaN, y: NaN };

    const rect = gridRef.value.getBoundingClientRect();
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

  const getDayFromPosition = ({ x, y }: any) => {
    const el = gridRef.value;
    if (!el) return days.value[0];
    const rect = el.getBoundingClientRect();
    const dayWidth = rect.width / dayColumns.value;
    const dayHeight = rect.height / dayRows.value;
    const xNorm = Math.max(x, 0);
    const yNorm = Math.max(y, 0);
    const idx =
      Math.floor(yNorm / dayHeight) * dayColumns.value +
      Math.floor(xNorm / dayWidth);
    return days.value[idx];
  };

  const handleEvent = (
    stateEvent: GridStateEvent,
    event: MouseEvent | TouchEvent | KeyboardEvent,
    cell: Cell | undefined = undefined,
  ) => {
    if (event.type.startsWith('touch')) {
      isTouch.value = true;
    } else if (isTouch.value) {
      return;
    }
    const eventName = (event.shiftKey
      ? `${stateEvent}_SHIFT`
      : stateEvent) as GridStateEvent;
    const position = getPositionFromUIEvent(event);
    const day = getDayFromPosition(position);
    updateState(eventName, day, position.y, cell);
    if (stateEvent === 'GRID_CURSOR_DOWN') {
      onDayFocusin(day);
    }
  };

  const startMonitoringGridMove = () => {
    const offMove = on(document.body, 'mousemove', event => {
      handleEvent('GRID_CURSOR_MOVE', event as MouseEvent);
    });
    const offUp = on(document.body, 'mouseup', event => {
      handleEvent('GRID_CURSOR_UP', event as MouseEvent);
      offMove();
      offUp();
    });
  };

  watch(
    () => state.value,
    val => logger.log('state change', val),
  );

  // #endregion State management

  const context = {
    ...calendar,
    gridRef,
    cellPopoverRef,
    isTouch,
    cells,
    weekCells,
    dayCells,
    allDayCells,
    resizing,
    dragging,
    labelCells,
    gridStyle,
    page,
    days,
    weeks,
    // Methods
    removeCell,
    // Event handlers
    onDayNumberClick(day: CalendarDay) {
      emit('day-header-click', day);
      if (isDaily.value) return;
      move(day, { view: isMonthly.value ? 'weekly' : 'daily' });
    },
    onGridEscapeKeydown() {
      console.log('fired');
      updateState('ESCAPE', days.value[0], 0);
    },
    // Mouse event handlers
    onGridMouseDown(event: MouseEvent) {
      handleEvent('GRID_CURSOR_DOWN', event);
      startMonitoringGridMove();
    },
    onEventMouseDown(event: MouseEvent, cell: Cell) {
      handleEvent('EVENT_CURSOR_DOWN', event, cell);
    },
    onEventResizeStartMouseDown(event: MouseEvent, cell: Cell) {
      handleEvent('EVENT_RESIZE_START_CURSOR_DOWN', event, cell);
    },
    onEventResizeEndMouseDown(event: MouseEvent, cell: Cell) {
      handleEvent('EVENT_RESIZE_END_CURSOR_DOWN', event, cell);
    },
    // Touch event handlers
    onGridTouchStart(event: TouchEvent) {
      handleEvent('GRID_CURSOR_DOWN', event);
    },
    onGridTouchMove(event: TouchEvent) {
      handleEvent('GRID_CURSOR_MOVE', event);
    },
    onGridTouchEnd(event: TouchEvent) {
      handleEvent('GRID_CURSOR_UP', event);
    },
    onEventTouchStart(event: TouchEvent, cell: Cell) {
      handleEvent('EVENT_CURSOR_DOWN', event, cell);
    },
    onEventTouchMove(event: TouchEvent, cell: Cell) {
      handleEvent('GRID_CURSOR_MOVE', event, cell);
    },
    onEventTouchEnd(event: TouchEvent, cell: Cell) {
      handleEvent('GRID_CURSOR_UP', event, cell);
    },
    onEventResizeStartTouchStart(event: TouchEvent, cell: Cell) {
      handleEvent('EVENT_RESIZE_START_CURSOR_DOWN', event, cell);
    },
    onEventResizeEndTouchStart(event: TouchEvent, cell: Cell) {
      handleEvent('EVENT_RESIZE_END_CURSOR_DOWN', event, cell);
    },
  };
  provide(contextKey, context);

  return context;
}

export interface CalendarGridContext extends CalendarContext {
  removeCell: (cell: Cell) => void;
  onDayNumberClick: (day: CalendarDay) => void;
  onGridMouseDown: (event: MouseEvent) => void;
  onEventMouseDown: (event: MouseEvent, cell: Cell) => void;
  onEventResizeStartMouseDown: (event: MouseEvent, cell: Cell) => void;
  onEventResizeEndMouseDown: (event: MouseEvent, cell: Cell) => void;
  onGridTouchStart: (event: TouchEvent) => void;
  onGridTouchMove: (event: TouchEvent) => void;
  onGridTouchEnd: (event: TouchEvent) => void;
  onEventTouchStart: (event: TouchEvent, cell: Cell) => void;
  onEventTouchMove: (event: TouchEvent, cell: Cell) => void;
  onEventTouchEnd: (event: TouchEvent, cell: Cell) => void;
  onEventResizeStartTouchStart: (event: TouchEvent, cell: Cell) => void;
  onEventResizeEndTouchStart: (event: TouchEvent, cell: Cell) => void;
}

export function useCalendarGridContext(): CalendarGridContext {
  const context = inject<CalendarGridContext>(contextKey);
  if (!context) {
    throw new Error(
      'Calendar context missing. Please verify this component is nested within a valid context provider.',
    );
  }
  return context;
}
