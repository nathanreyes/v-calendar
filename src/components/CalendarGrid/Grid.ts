import { CalendarDay } from '../../utils/locale';
import { Cell } from './Cell';
import { roundDate } from '../../utils/helpers';
import DateInfo from '../../utils/dateInfo';

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
  | 'GRID_CURSOR_LEAVE'
  | 'GRID_CURSOR_LEAVE_SHIFT'
  | 'EVENT_CURSOR_DOWN'
  | 'EVENT_CURSOR_DOWN_SHIFT'
  | 'EVENT_CURSOR_MOVE'
  | 'EVENT_CURSOR_MOVE_SHIFT'
  | 'EVENT_RESIZE_START_CURSOR_DOWN'
  | 'EVENT_RESIZE_START_CURSOR_DOWN_SHIFT'
  | 'EVENT_RESIZE_END_CURSOR_DOWN'
  | 'EVENT_RESIZE_END_CURSOR_DOWN_SHIFT'
  | 'ESCAPE';

const loggingEnabled = false;
function log(...args: any[]) {
  if (loggingEnabled) {
    console.log(...args);
  }
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

export interface GridSource {
  willCreateEvent(cell: Cell): void;
  didCreateEvent(cell: Cell): void;
  willResizeEvent(cells: Cell): void;
  didResizeEvent(cells: Cell): void;
  willMoveEvent(cells: Cell): void;
  didMoveEvent(cells: Cell): void;
}

export class Grid {
  days: CalendarDay[];
  source: GridSource;

  snapMinutes = 15;
  pixelsPerHour = 48;

  _state: GridState = 'NORMAL';
  refreshCount = 0;

  cells: Cell[] = [];
  dayCells: Cell[][] = [];

  createOrigin: CreateOriginState | null = null;

  resizing = false;
  resizeOrigin: ResizeOriginState | null = null;

  dragging = false;
  dragOrigin: DragOriginState | null = null;

  createTimer: number | undefined = undefined;
  createTimerDurationMs = 700;

  isTouch = false;

  constructor(days: CalendarDay[], source: GridSource) {
    this.days = days;
    this.source = source;
  }

  get state() {
    return this._state;
  }

  set state(value) {
    if (value === this._state) return;
    log('Move to state: ', value);
    this._state = value;
  }

  get active() {
    return this.resizing || this.dragging;
  }

  get hasSelected() {
    return this.selectedCount > 0;
  }

  get selectedCount() {
    return this.cells.filter(c => c.selected).length;
  }

  get snapMs() {
    return this.snapMinutes * 60 * 1000;
  }

  // #region State management

  update(
    event: GridStateEvent,
    day: CalendarDay,
    position: number,
    cell: Cell | undefined = undefined,
  ) {
    switch (this.state) {
      case 'NORMAL': {
        this.handleNormalEvent(event, day, position, cell);
        break;
      }
      case 'CREATE_MONITOR': {
        this.handleCreateMonitorEvent(event, day);
        break;
      }
      case 'RESIZE_MONITOR': {
        this.handleResizeMonitorEvent(event, day, position);
        break;
      }
      case 'DRAG_MONITOR': {
        this.handleDragMonitorEvent(event, day, position);
        break;
      }
    }
  }

  handleNormalEvent(
    event: GridStateEvent,
    day: CalendarDay,
    position: number,
    cell: Cell | undefined,
  ) {
    switch (event) {
      case 'GRID_CURSOR_DOWN':
      case 'GRID_CURSOR_DOWN_SHIFT': {
        this.createOrigin = {
          position,
          date: this.getDateFromPosition(position, day),
          day,
        };
        this.state = 'CREATE_MONITOR';
        this.createTimer = setTimeout(() => {
          if (this.state !== 'CREATE_MONITOR') return;
          this.handleCreateMonitorEvent('GRID_CURSOR_UP', day);
        }, this.createTimerDurationMs);
        break;
      }
      case 'EVENT_CURSOR_DOWN': {
        if (!cell) return;
        if (!cell.selected) this.deselectAllCells();
        this.startDraggingCells(position, day, cell);
        this.state = 'DRAG_MONITOR';
        break;
      }
      case 'EVENT_CURSOR_DOWN_SHIFT': {
        if (!cell) return;
        this.startDraggingCells(position, day, cell);
        this.state = 'DRAG_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_START_CURSOR_DOWN': {
        if (!cell) return;
        if (!cell.selected) this.deselectAllCells();
        this.startResizingCells(position, day, cell, true, false);
        this.state = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_START_CURSOR_DOWN_SHIFT': {
        if (!cell) return;
        this.startResizingCells(position, day, cell, true, false);
        this.state = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_END_CURSOR_DOWN': {
        if (!cell) return;
        if (!cell.selected) this.deselectAllCells();
        this.startResizingCells(position, day, cell, false, false);
        this.state = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_END_CURSOR_DOWN_SHIFT': {
        if (!cell) return;
        this.startResizingCells(position, day, cell, false, false);
        this.state = 'RESIZE_MONITOR';
        break;
      }
    }
  }

  handleCreateMonitorEvent(event: GridStateEvent, day: CalendarDay) {
    clearTimeout(this.createTimer);
    if (!this.createOrigin) return;

    switch (event) {
      case 'ESCAPE': {
        this.deselectAllCells();
        break;
      }
      case 'GRID_CURSOR_UP':
      case 'GRID_CURSOR_UP_SHIFT': {
        if (this.hasSelectedCells()) {
          this.deselectAllCells();
        } else {
          this.deselectAllCells();
          const newCell = this.createNewCell(this.createOrigin.position, day);
          newCell.selected = true;
          this.source.didCreateEvent(newCell);
        }
        this.state = 'NORMAL';
        break;
      }
      case 'EVENT_CURSOR_MOVE':
      case 'EVENT_CURSOR_MOVE_SHIFT':
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        if (this.isTouch) {
          this.state = 'NORMAL';
          return;
        }
        this.deselectAllCells();
        const cell = this.createNewCell(this.createOrigin.position, day);
        const position = cell.position + cell.height;
        this.startResizingCells(position, day, cell, false, true);
        this.updateResizingCells(position, day);
        this.state = 'RESIZE_MONITOR';
        break;
      }
    }
  }

  handleResizeMonitorEvent(
    event: GridStateEvent,
    day: CalendarDay,
    position: number,
  ) {
    if (!this.resizeOrigin) return;
    switch (event) {
      case 'EVENT_CURSOR_MOVE':
      case 'EVENT_CURSOR_MOVE_SHIFT':
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        this.updateResizingCells(position, day);
        break;
      }
      case 'GRID_CURSOR_UP': {
        if (position === this.resizeOrigin.position) {
          this.deselectAllCells();
          this.resizeOrigin.cell.selected = true;
        }
        this.stopResizingCells();
        this.state = 'NORMAL';
        break;
      }
      case 'GRID_CURSOR_UP_SHIFT': {
        this.stopResizingCells();
        this.state = 'NORMAL';
        break;
      }
    }
  }

  handleDragMonitorEvent(
    event: GridStateEvent,
    day: CalendarDay,
    position: number,
  ) {
    if (!this.dragOrigin) return;
    switch (event) {
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        this.updateDraggingCells(position, day);
        break;
      }
      case 'GRID_CURSOR_UP': {
        const dragOrigin = this.dragOrigin;
        this.stopDraggingCells();
        if (position === dragOrigin.position) {
          const select = !dragOrigin.cellSelected || this.selectedCount > 1;
          this.deselectAllCells();
          dragOrigin.cell.selected = select;
        }
        this.state = 'NORMAL';
        break;
      }
      case 'GRID_CURSOR_UP_SHIFT': {
        this.stopDraggingCells();
        this.state = 'NORMAL';
        break;
      }
    }
  }

  // #endregion State management

  // #region Resizing

  startResizingCells(
    position: number,
    day: CalendarDay,
    cell: Cell,
    fromStart = false,
    isNew = false,
  ) {
    if (this.active) return;
    this.resizing = true;
    cell.selected = true;
    this.resizeOrigin = {
      position,
      day,
      date: this.getDateFromPosition(position, day, 0, 0),
      cell,
      fromStart,
      isNew,
    };
    this.forSelectedCells(cell => {
      this.source.willResizeEvent(cell);
      cell.startResize(fromStart);
    });
  }

  updateResizingCells(position: number, day: CalendarDay) {
    if (!this.resizing || !this.resizeOrigin) return;
    const date = this.getDateFromPosition(position, day, 0, 0);
    const offsetMs = date.getTime() - this.resizeOrigin.date.getTime();
    this.forSelectedCells(cell => cell.updateResize(offsetMs));
    this.refreshDayCells();
  }

  stopResizingCells() {
    if (!this.resizing || !this.resizeOrigin) return;
    this.forSelectedCells(cell => {
      if (this.resizeOrigin!.isNew && cell === this.resizeOrigin!.cell) {
        this.source.didCreateEvent(cell);
      } else {
        this.source.didResizeEvent(cell);
      }
      cell.stopResize();
    });
    this.resizing = false;
    this.resizeOrigin = null;
  }

  // #endregion Resizing

  // #region Dragging

  startDraggingCells(position: number, day: CalendarDay, cell: Cell) {
    if (this.active) return;
    this.dragging = true;
    const cellSelected = cell.selected;
    cell.selected = true;
    const selectedCells = this.getSelectedCells();
    const indices = selectedCells.map(c =>
      this.days.findIndex(d => d.id === c.day.id),
    );
    const minOffsetDays = -Math.min(...indices);
    const maxOffsetDays = this.days.length - Math.max(...indices) - 1;
    this.dragOrigin = {
      position,
      date: this.getDateFromPosition(position, day, 0, 0),
      weekdayPosition: day.weekdayPosition,
      maxOffsetDays,
      minOffsetDays,
      day,
      cell,
      cellSelected,
    };
    selectedCells.forEach(cell => {
      this.source.willMoveEvent(cell);
      cell.startDrag();
    });
  }

  updateDraggingCells(position: number, day: CalendarDay) {
    if (!this.dragging || !this.dragOrigin) return;
    const date = this.getDateFromPosition(position, day, 0, 0);
    const offsetMs = date.getTime() - this.dragOrigin.date.getTime();
    const { minOffsetDays, maxOffsetDays, weekdayPosition } = this.dragOrigin;
    const offsetDays = day.weekdayPosition - weekdayPosition;
    if (offsetDays < minOffsetDays || offsetDays > maxOffsetDays) return;
    this.forSelectedCells(cell => {
      cell.updateDrag(offsetMs, offsetDays, this.days);
    });
    this.refreshDayCells();
  }

  stopDraggingCells() {
    if (!this.dragging) return;
    this.dragging = false;
    this.dragOrigin = null;
    this.forSelectedCells(cell => {
      this.source.didMoveEvent(cell);
      cell.stopDrag();
    });
  }

  // #endregion Dragging

  // #region Cell Operations

  getSelectedCells() {
    return this.cells.filter(c => c.selected);
  }

  hasSelectedCells() {
    return this.cells.some(c => c.selected);
  }

  forSelectedCells(fn: (cell: Cell) => void) {
    this.cells.forEach(cell => {
      if (cell.selected) {
        fn(cell);
      }
    });
  }

  deselectAllCells() {
    this.forSelectedCells(cell => (cell.selected = false));
  }

  createNewCell(position: number, day: CalendarDay) {
    const cell = Cell.fromDate(this.getDateFromPosition(position, day), day);
    this.source.willCreateEvent(cell);
    this.cells.push(cell);
    this.refreshDayCells();
    return cell;
  }

  // #endregion Cell Operations

  // #region Util

  refreshCells() {
    this.cells = this.getEventCells(this.days);
    this.refreshDayCells();
  }

  refreshDayCells() {
    this.dayCells = this.getCellsGroupedByDay(this.cells, this.days);
  }

  getEventCells(days: CalendarDay[]): Cell[] {
    const result: Cell[] = [];
    days.forEach((day: CalendarDay) => {
      Object.entries(day.attributesMap).forEach(([key, attr]) => {
        attr.dates.forEach((dateInfo: DateInfo) => {
          const existingCell = this.cells.find(c => c.key === attr.key);
          const cell = Cell.fromDateInfo(dateInfo, day, {
            key: attr.key,
            ...existingCell,
            ...attr.event,
          });
          result.push(cell);
        });
      });
    });
    return result;
  }

  getCellsGroupedByDay(cells: Cell[], days: CalendarDay[]): Cell[][] {
    const result: Cell[][] = days.map(() => []);
    cells.forEach(cell => {
      const idx = days.findIndex(d => d.id === cell.day.id);
      if (idx >= 0) result[idx].push(cell);
    });
    for (let i = 0; i < result.length; i++) {
      result[i] = result[i].sort((a, b) => a.position - b.position);
    }
    return result;
  }

  getDateFromPosition(
    position: number,
    day: CalendarDay,
    offsetMs = 0,
    snapMs = 0,
  ) {
    const ms = (position / this.pixelsPerHour) * 60 * 60 * 1000;
    return roundDate(day.range.start.getTime() + ms + offsetMs, snapMs);
  }

  // #endregion Util
}
