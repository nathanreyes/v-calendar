import { Ref, ComputedRef, ref, computed, provide, inject, watch } from 'vue';
import {
  CalendarProps,
  CalendarContext,
  emits as calendarEmits,
  useCalendar,
} from './calendar';
import { CalendarDay, CalendarWeek, Page } from '../utils/locale';
import { on } from '../utils/helpers';
import { CellContext as Cell, useCell } from './calendarCell';
import CalendarCellPopover from '../components/CalendarCellPopover/CalendarCellPopover.vue';
import { roundDate, MS_PER_HOUR } from '../utils/dates';
import DateInfo from '../utils/dateInfo';

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

export interface DragOffset {
  weekdays: number;
  weeks: number;
  ms: number;
}

interface DragOriginState {
  position: number;
  date: Date;
  day: CalendarDay;
  cell: Cell;
  cellSelected: boolean;
  minOffsetDays: number;
  maxOffsetDays: number;
  ms: number;
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
  ctx: any,
): CalendarGridContext {
  const { emit } = ctx;
  const calendar = useCalendar(props, ctx);
  const cellPopoverRef = ref<typeof CalendarCellPopover>();
  const dailyGridRef = ref<HTMLElement | null>(null);
  const weeklyGridRef = ref<HTMLElement | null>(null);
  let activeGridRef = ref<HTMLElement | null>(null);

  const {
    view,
    isDaily,
    isMonthly,
    dayAttributes,
    pages,
    firstPage,
    locale,
    move,
    onDayFocusin,
  } = calendar;

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

  const snapMinutes = ref(15);
  const snapMs = computed(() => snapMinutes.value * 60 * 10000);
  const pixelsPerHour = ref(50);

  const state = ref<GridState>('NORMAL');
  const fill = ref('light');

  const cells: Ref<Cell[]> = ref([]);
  const weekCells: Ref<Cell[][]> = ref([]);
  const dayCells: Ref<Cell[][]> = ref([]);
  const detailCell = ref<Cell | null>(null);

  const createOrigin = ref<CreateOriginState | null>(null);

  const resizing = ref(false);
  let resizeOrigin: ResizeOriginState | null = null;

  const dragging = ref(false);
  let dragOrigin: DragOriginState | null = null;

  const isTouch = ref(false);

  const active = computed(() => resizing.value || dragging.value);

  const selectedCells = computed(() => cells.value.filter(c => c.selected));

  const selectedCellsCount = computed(() => selectedCells.value.length);

  const hasSelectedCells = computed(() => selectedCellsCount.value > 0);

  const weekCellsStyle = computed(() => {
    const numDays = isDaily.value ? '1' : locale.value.daysInWeek;
    return { gridTemplateColumns: `repeat(${numDays}, 1fr)` };
  });

  function getCellContext() {
    return {
      locale,
      days,
      dayRows,
      dayColumns,
      isDaily,
      isMonthly,
      snapMinutes: snapMinutes.value,
      pixelsPerHour: pixelsPerHour.value,
    };
  }

  const gridStyle = computed(() => {
    return {
      height: `${24 * pixelsPerHour.value}px`,
    };
  });

  // #region Cell details

  function showCellPopover(cell: Cell) {
    if (isDaily.value || !cellPopoverRef.value) return;
    cellPopoverRef.value.show(cell);
  }

  function updateCellPopover(cell: Cell) {
    if (!cellPopoverRef.value) return;
    cellPopoverRef.value.update(cell);
  }

  function hideCellPopover() {
    if (isDaily.value || !cellPopoverRef.value) return;
    cellPopoverRef.value.hide();
  }

  // #endregion Cell details

  // #region Util

  function getEventCells(): Cell[] {
    const result: Cell[] = [];
    days.value.forEach((day: CalendarDay) => {
      const attributes = dayAttributes.value[day.id];
      if (!attributes) return;
      attributes.forEach(attr => {
        if (!attr.dates) return;
        attr.dates.forEach((dateInfo: DateInfo) => {
          const existingCell = cells.value.find(c => c.key === attr.key);
          const cell = useCell({
            key: attr.key,
            ...existingCell,
            ...attr.event,
            ...getCellContext(),
            day,
            dateInfo,
          });
          result.push(cell);
        });
      });
    });
    return result;
  }

  function refreshCells(deep: boolean) {
    const rWeekCells: Cell[][] = weeks.value.map(() => []);
    const rDayCells: Cell[][] = days.value.map(() => []);
    if (deep) cells.value = getEventCells();
    cells.value.forEach(cell => {
      if (cell.isAllDay || isMonthly.value) {
        const wIdx = weeks.value.findIndex(
          w => w.weeknumber === cell.day.weeknumber,
        );
        if (wIdx >= 0) {
          rWeekCells[wIdx].push(cell);
          cell.order = rWeekCells[wIdx].length;
        }
      } else if (!isMonthly.value) {
        const idx = days.value.findIndex(d => d.id === cell.day.id);
        if (idx >= 0) {
          rDayCells[idx].push(cell);
        }
      }
    });
    for (let i = 0; i < rWeekCells.length; i++) {
      rWeekCells[i] = rWeekCells[i].sort((a, b) => a.compareTo(b));
    }
    for (let i = 0; i < rDayCells.length; i++) {
      rDayCells[i] = rDayCells[i].sort((a, b) => a.compareTo(b));
    }
    weekCells.value = rWeekCells;
    dayCells.value = rDayCells;
  }

  watch([firstPage, dayAttributes], () => {
    refreshCells(true);
  });

  watch([view], () => {
    deselectAllCells();
  });

  function getMsFromPosition(position: number) {
    return (position / pixelsPerHour.value) * MS_PER_HOUR;
  }

  function getDateFromPosition(
    position: number,
    day: CalendarDay,
    offsetMs = 0,
    snapMs = 0,
  ) {
    return roundDate(
      day.range.start.getTime() + getMsFromPosition(position) + offsetMs,
      snapMs,
    );
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
    const dateInfo = DateInfo.from(getDateFromPosition(position, day), {
      isAllDay: isMonthly.value,
    });
    const cell = useCell({
      ...getCellContext(),
      day,
      dateInfo,
    });
    cell.resizeToConstraints();
    emit('will-create-event', cell);
    cells.value.push(cell);
    refreshCells(false);
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
    resizeOrigin = {
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
    if (!resizing.value || !resizeOrigin) return;
    const day = resizeOrigin.day;
    const date = getDateFromPosition(position, day, 0, 0);
    const offsetMs = date.getTime() - resizeOrigin.date.getTime();
    forSelectedCells(cell => cell.updateResize(offsetMs));
  }

  function stopResizingCells() {
    if (!resizing.value || !resizeOrigin) return;
    forSelectedCells(cell => {
      if (resizeOrigin!.isNew && cell === resizeOrigin!.cell) {
        emit('did-create-event', cell);
        showCellPopover(cell);
      } else {
        emit('did-resize-event', cell);
      }
      cell.stopResize();
    });
    resizing.value = false;
    resizeOrigin = null;
  }

  // #endregion Resizing

  // #region Dragging

  function startDraggingCells(position: number, day: CalendarDay, cell: Cell) {
    if (active.value) return;
    dragging.value = true;
    const date = getDateFromPosition(position, day, 0, 0);
    const cellSelected = cell.selected;
    cell.selected = true;
    const indices = selectedCells.value.map(c =>
      days.value.findIndex(d => d.id === c.day.id),
    );
    const minOffsetDays = -Math.min(...indices);
    const maxOffsetDays = days.value.length - Math.max(...indices) - 1;
    const ms = getMsFromPosition(position);
    dragOrigin = {
      position,
      date,
      day,
      cell,
      cellSelected,
      maxOffsetDays,
      minOffsetDays,
      ms,
    };
    selectedCells.value.forEach(cell => {
      emit('will-move-event', cell);
      cell.startDrag();
    });
  }

  function updateDraggingCells(position: number, day: CalendarDay) {
    if (!dragging.value || !dragOrigin) return;
    const offset = {
      weeks: day.weekPosition - dragOrigin.day.weekPosition,
      weekdays: day.weekdayPosition - dragOrigin.day.weekdayPosition,
      ms: getMsFromPosition(position) - dragOrigin.ms,
    };
    forSelectedCells(cell => {
      cell.updateDrag(offset);
    });
    refreshCells(false);
  }

  function stopDraggingCells() {
    if (!dragging.value) return;
    dragging.value = false;
    dragOrigin = null;
    forSelectedCells(cell => {
      emit('did-move-event', cell);
      cell.stopDrag();
    });
  }

  // #endregion Dragging

  const getPositionFromMouseEvent = (
    gridEl: HTMLElement,
    event: MouseEvent,
  ): Point => {
    const rect = gridEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  };

  const getPositionFromTouchEvent = (
    gridEl: HTMLElement,
    event: TouchEvent,
  ): Point => {
    const rect = gridEl.getBoundingClientRect();
    const touch = event.targetTouches[0] || event.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return { x, y };
  };

  const getPositionFromUIEvent = (
    gridEl: HTMLElement,
    event: UIEvent,
  ): Point => {
    if (event.type.startsWith('touch'))
      return getPositionFromTouchEvent(gridEl, event as TouchEvent);
    return getPositionFromMouseEvent(gridEl, event as MouseEvent);
  };

  const getDayFromPosition = (el: HTMLElement, { x, y }: any) => {
    if (!el) return days.value[0];
    const rect = el.getBoundingClientRect();
    const dayWidth = rect.width / dayColumns.value;
    const dayHeight = rect.height / dayRows.value;
    const xNorm = Math.max(Math.min(x, rect.width), 0);
    const yNorm = Math.max(Math.min(y, rect.height), 0);
    const xIdx = Math.min(Math.floor(xNorm / dayWidth), dayColumns.value - 1);
    const yIdx = Math.min(Math.floor(yNorm / dayHeight), dayRows.value - 1);
    const idx = xIdx + yIdx * dayColumns.value;
    return days.value[idx];
  };

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
        if (isTouch.value || isMonthly.value) {
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
    if (!resizeOrigin) return;
    switch (event) {
      case 'EVENT_CURSOR_MOVE':
      case 'EVENT_CURSOR_MOVE_SHIFT':
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        updateResizingCells(position);
        if (!resizeOrigin.isNew) {
          updateCellPopover(resizeOrigin.cell);
        }
        break;
      }
      case 'GRID_CURSOR_UP': {
        if (position === resizeOrigin.position) {
          deselectAllCells();
          resizeOrigin.cell.selected = true;
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
    if (!dragOrigin) return;
    switch (event) {
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        updateDraggingCells(position, day);
        updateCellPopover(dragOrigin.cell);
        break;
      }
      case 'GRID_CURSOR_UP': {
        const origin = dragOrigin;
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

  const setActiveGrid = (event: MouseEvent | TouchEvent) => {
    activeGridRef =
      [dailyGridRef, weeklyGridRef].find(
        ref => ref.value && ref.value.contains(event.currentTarget as Node),
      ) || ref(null);
  };

  const handleEvent = (
    stateEvent: GridStateEvent,
    event: MouseEvent | TouchEvent | KeyboardEvent,
    cell: Cell | undefined = undefined,
  ) => {
    if (!activeGridRef.value) return;
    if (event.type.startsWith('touch')) {
      isTouch.value = true;
    } else if (isTouch.value) {
      return;
    }
    const eventName = (
      event.shiftKey ? `${stateEvent}_SHIFT` : stateEvent
    ) as GridStateEvent;
    const position = getPositionFromUIEvent(activeGridRef.value, event);
    const day = getDayFromPosition(activeGridRef.value, position);
    updateState(eventName, day, position.y, cell);
    if (stateEvent === 'GRID_CURSOR_DOWN') {
      onDayFocusin(day);
    }
  };

  const startMonitoringGridMove = () => {
    const offMove = on(window, 'mousemove', event => {
      handleEvent('GRID_CURSOR_MOVE', event as MouseEvent);
    });
    const offUp = on(window, 'mouseup', event => {
      handleEvent('GRID_CURSOR_UP', event as MouseEvent);
      offMove();
      offUp();
    });
  };

  // #endregion State management

  const context = {
    ...calendar,
    dailyGridRef,
    weeklyGridRef,
    cellPopoverRef,
    dayColumns,
    dayRows,
    snapMinutes,
    snapMs,
    pixelsPerHour,
    isTouch,
    cells,
    selectedCells,
    weekCells,
    weekCellsStyle,
    dayCells,
    detailCell,
    resizing,
    dragging,
    gridStyle,
    fill,
    page,
    days,
    weeks,
    // Methods
    removeCell,
    // Event handlers
    onDayNumberClick(day: CalendarDay) {
      emit('day-header-click', day);
      move(day, { view: 'daily' });
    },
    onGridEscapeKeydown() {
      updateState('ESCAPE', days.value[0], 0);
    },
    // Mouse event handlers
    onGridMouseDown(event: MouseEvent) {
      setActiveGrid(event);
      handleEvent('GRID_CURSOR_DOWN', event);
      startMonitoringGridMove();
    },
    onEventMouseDown(event: MouseEvent, cell: Cell) {
      setActiveGrid(event);
      handleEvent('EVENT_CURSOR_DOWN', event, cell);
    },
    onEventResizeStartMouseDown(event: MouseEvent, cell: Cell) {
      setActiveGrid(event);
      handleEvent('EVENT_RESIZE_START_CURSOR_DOWN', event, cell);
    },
    onEventResizeEndMouseDown(event: MouseEvent, cell: Cell) {
      setActiveGrid(event);
      handleEvent('EVENT_RESIZE_END_CURSOR_DOWN', event, cell);
    },
    // Touch event handlers
    onGridTouchStart(event: TouchEvent) {
      setActiveGrid(event);
      handleEvent('GRID_CURSOR_DOWN', event);
    },
    onGridTouchMove(event: TouchEvent) {
      handleEvent('GRID_CURSOR_MOVE', event);
    },
    onGridTouchEnd(event: TouchEvent) {
      handleEvent('GRID_CURSOR_UP', event);
    },
    onEventTouchStart(event: TouchEvent, cell: Cell) {
      setActiveGrid(event);
      handleEvent('EVENT_CURSOR_DOWN', event, cell);
    },
    onEventTouchMove(event: TouchEvent, cell: Cell) {
      handleEvent('GRID_CURSOR_MOVE', event, cell);
    },
    onEventTouchEnd(event: TouchEvent, cell: Cell) {
      handleEvent('GRID_CURSOR_UP', event, cell);
    },
    onEventResizeStartTouchStart(event: TouchEvent, cell: Cell) {
      setActiveGrid(event);
      handleEvent('EVENT_RESIZE_START_CURSOR_DOWN', event, cell);
    },
    onEventResizeEndTouchStart(event: TouchEvent, cell: Cell) {
      setActiveGrid(event);
      handleEvent('EVENT_RESIZE_END_CURSOR_DOWN', event, cell);
    },
  };
  provide(contextKey, context);

  return context;
}

export interface CalendarGridContext extends CalendarContext {
  snapMinutes: Ref<number>;
  dayRows: ComputedRef<number>;
  dayColumns: ComputedRef<number>;
  snapMs: ComputedRef<number>;
  pixelsPerHour: Ref<number>;
  isTouch: Ref<boolean>;
  cells: Ref<Cell[]>;
  selectedCells: ComputedRef<Cell[]>;
  weekCells: Ref<Cell[][]>;
  weekCellsStyle: ComputedRef<Object>;
  dayCells: Ref<Cell[][]>;
  detailCell: Ref<Cell | null>;
  resizing: Ref<boolean>;
  dragging: Ref<boolean>;
  gridStyle: ComputedRef<Object>;
  page: ComputedRef<Page>;
  days: ComputedRef<CalendarDay[]>;
  weeks: ComputedRef<CalendarWeek[]>;
  removeCell: (cell: Cell) => void;
  onDayNumberClick: (day: CalendarDay) => void;
  onGridEscapeKeydown: () => void;
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
