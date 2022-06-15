import { Ref, ComputedRef, ref, computed, provide, inject, watch } from 'vue';
import {
  CalendarProps,
  CalendarContext,
  emits as calendarEmits,
  useCalendar,
} from './calendar';
import { CalendarDay, CalendarWeek, Page } from '../utils/locale';
import { on } from '../utils/helpers';
import { Event, createEvent as _createEvent } from '../utils/calendar/event';
import { Cell, createDayCell } from '../utils/calendar/cell';
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

export interface ResizeOffset {
  weekdays: number;
  weeks: number;
  ms: number;
}

interface DragOriginState {
  position: number;
  date: Date;
  day: CalendarDay;
  event: Event;
  eventSelected: boolean;
  ms: number;
}

interface ResizeOriginState {
  position: number;
  date: Date;
  day: CalendarDay;
  event: Event;
  isStart: boolean;
  isNew: boolean;
  ms: number;
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

const SNAP_MINUTES = 15;
const PIXELS_PER_HOUR = 50;
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

  const snapMinutes = ref(SNAP_MINUTES);
  const snapMs = computed(() => snapMinutes.value * 60 * 10000);
  const pixelsPerHour = ref(PIXELS_PER_HOUR);

  const state = ref<GridState>('NORMAL');
  const fill = ref('light');

  const eventsMap = ref<Record<any, Event>>({});
  const events = computed(() => Object.values(eventsMap.value));
  const weekEvents: Ref<Event[][]> = ref([]);
  const dayCells: Ref<Cell[][]> = ref([]);
  const detailEvent = ref<Event | null>(null);

  const createOrigin = ref<CreateOriginState | null>(null);

  const resizing = ref(false);
  let resizeOrigin: ResizeOriginState | null = null;

  const dragging = ref(false);
  let dragOrigin: DragOriginState | null = null;

  const isTouch = ref(false);

  const active = computed(() => resizing.value || dragging.value);

  const selectedEvents = computed(() => events.value.filter(e => e.selected));

  const selectedEventsCount = computed(() => selectedEvents.value.length);

  const hasSelectedEvents = computed(() => selectedEventsCount.value > 0);

  function getEventContext() {
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

  // #region Event details

  function showCellPopover(event: Event) {
    setTimeout(() => {
      if (isDaily.value || !cellPopoverRef.value) return;
      cellPopoverRef.value.show(event);
    }, 10);
  }

  function updateCellPopover(event: Event) {
    if (!cellPopoverRef.value) return;
    cellPopoverRef.value.update(event);
  }

  function hideCellPopover() {
    if (isDaily.value || !cellPopoverRef.value) return;
    cellPopoverRef.value.hide();
  }

  function popoverVisible() {
    return !!cellPopoverRef.value && cellPopoverRef.value.isVisible();
  }

  // #endregion Cell details

  // #region Util

  function createEvent(key: string, event: any, dateInfo: DateInfo) {
    const existingEvent = events.value.find(e => e.key === key);
    return _createEvent(
      {
        key,
        ...existingEvent,
        ...event,
        dateInfo,
      },
      getEventContext(),
    );
  }

  function sortEvents(e: Event[][]) {
    for (let i = 0; i < e.length; i++) {
      e[i] = e[i].sort((a, b) => a.compareTo(b));
    }
    return e;
  }

  function sortCells(e: Cell[][]) {
    for (let i = 0; i < e.length; i++) {
      e[i] = e[i].sort((a, b) => a.event.compareTo(b.event));
    }
    return e;
  }

  function getEventsFromAttrs() {
    const map: Record<string, Event> = {};
    const groupedList = days.value.map(day => {
      const group: { day: CalendarDay; events: Event[] } = { day, events: [] };
      const attrs = dayAttributes.value[day.id];
      if (!attrs) return group;
      attrs.forEach(attr => {
        if (!attr.dates) return;
        attr.dates.forEach((dateInfo: DateInfo) => {
          const key = attr.key?.toString() ?? '';
          map[key] = map[key] || createEvent(key, attr.event, dateInfo);
          group.events.push(map[key]);
        });
      });
      return group;
    });
    return { map, groupedList };
  }

  function getExistingEvents() {
    const map = eventsMap.value;
    const groupedList = days.value.map(day => {
      const group: { day: CalendarDay; events: Event[] } = { day, events: [] };
      events.value.forEach(event => {
        if (event.dateInfo.intersectsDay(day)) {
          const key = event.key;
          map[key] = eventsMap.value[key];
          if (map[key]) group.events.push(map[key]);
        }
      });
      return group;
    });
    return { map, groupedList };
  }

  function refreshEventCells(fromAttrs = false) {
    const rWeekEvents: Set<Event>[] = weeks.value.map(() => new Set());
    const rDayCells: Cell[][] = days.value.map(() => []);
    const weeknumber: number = weeks.value[0].weeknumber;
    const { map, groupedList } = fromAttrs
      ? getEventsFromAttrs()
      : getExistingEvents();
    groupedList.forEach(({ day, events: evts }, dayIdx) => {
      evts.forEach(event => {
        if (
          isMonthly.value ||
          event.dateInfo.isAllDay ||
          event.dateInfo.isMultiDay
        ) {
          const wIdx = day.weeknumber - weeknumber;
          rWeekEvents[wIdx].add(event);
        } else {
          rDayCells[dayIdx].push(
            createDayCell(event, { day, isMonthly, isDaily, pixelsPerHour }),
          );
        }
      });
    });
    eventsMap.value = map;
    weekEvents.value = sortEvents(rWeekEvents.map(wc => [...wc]));
    dayCells.value = sortCells(rDayCells);
  }

  watch(
    [firstPage, dayAttributes],
    () => {
      refreshEventCells(true);
    },
    { immediate: true },
  );

  watch([view], () => {
    deselectAllEvents();
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
    const startTime = day.range.start.getTime();
    const ms = getMsFromPosition(position);
    return roundDate(startTime + ms + offsetMs, snapMs);
  }

  // #endregion Util

  // #region Cell Operations

  function forSelectedEvents(fn: (event: Event) => void) {
    selectedEvents.value.forEach(e => fn(e));
  }

  function deselectAllEvents() {
    forSelectedEvents(cell => (cell.selected = false));
  }

  function createNewEvent(position: number, day: CalendarDay) {
    const date = getDateFromPosition(position, day);
    const isAllDay = isMonthly.value;
    const dateInfo = DateInfo.from({ start: date, end: date, isAllDay });
    const event = _createEvent(
      {
        dateInfo,
      },
      getEventContext(),
    );
    if (!isAllDay) event.resizeToConstraints();
    emit('will-create-event', event);
    eventsMap.value[event.key] = event;
    refreshEventCells(false);
    return event;
  }

  function removeEvent(event: Event) {
    emit('remove-event', event);
    hideCellPopover();
  }

  // #endregion Cell Operations

  // #region Resizing

  function startResizingCells(
    position: number,
    day: CalendarDay,
    event: Event,
    isStart = false,
    isNew = false,
  ) {
    if (active.value) return;
    resizing.value = true;
    event.selected = true;
    const date = isMonthly.value
      ? isStart
        ? day.range.start
        : day.range.end
      : getDateFromPosition(position, day, 0, 0);
    const ms = getMsFromPosition(position);
    resizeOrigin = {
      position,
      day,
      date,
      event,
      isStart,
      isNew,
      ms,
    };
    forSelectedEvents(selectedCell => {
      emit('will-resize-event', selectedCell);
      selectedCell.startResize(day, isStart);
    });
  }

  function updateResizingEvents(position: number, day: CalendarDay) {
    if (!resizing.value || !resizeOrigin) return;
    const offset = {
      weeks: day.weekPosition - resizeOrigin.day.weekPosition,
      weekdays: day.weekdayPosition - resizeOrigin.day.weekdayPosition,
      ms: getMsFromPosition(position) - resizeOrigin.ms,
    };
    forSelectedEvents(cell => cell.updateResize(offset));
  }

  function stopResizingEvents() {
    if (!resizing.value || !resizeOrigin) return;
    forSelectedEvents(event => {
      if (resizeOrigin!.isNew && event === resizeOrigin!.event) {
        emit('did-create-event', event);
        showCellPopover(event);
      } else {
        emit('did-resize-event', event);
      }
      event.stopResize();
    });
    resizing.value = false;
    resizeOrigin = null;
  }

  // #endregion Resizing

  // #region Dragging

  function startDraggingEvents(
    position: number,
    day: CalendarDay,
    event: Event,
  ) {
    if (active.value) return;
    dragging.value = true;
    const date = getDateFromPosition(position, day, 0, 0);
    const eventSelected = event.selected;
    event.selected = true;
    const ms = getMsFromPosition(position);
    dragOrigin = {
      position,
      date,
      day,
      event,
      eventSelected,
      ms,
    };
    selectedEvents.value.forEach(event => {
      emit('will-move-event', event);
      event.startDrag(day);
    });
  }

  function updateDraggingEvents(position: number, day: CalendarDay) {
    if (!dragging.value || !dragOrigin) return;
    const offset = {
      weeks: day.weekPosition - dragOrigin.day.weekPosition,
      weekdays: day.weekdayPosition - dragOrigin.day.weekdayPosition,
      ms: getMsFromPosition(position) - dragOrigin.ms,
    };
    forSelectedEvents(event => {
      event.updateDrag(offset);
    });
    refreshEventCells(false);
  }

  function stopDraggingEvents() {
    if (!dragging.value) return;
    dragging.value = false;
    dragOrigin = null;
    forSelectedEvents(cell => {
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
    gse: GridStateEvent,
    day: CalendarDay,
    position: number,
    evt: Event | undefined,
  ) {
    switch (gse) {
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
        if (!evt) return;
        if (!evt.selected) deselectAllEvents();
        startDraggingEvents(position, day, evt);
        state.value = 'DRAG_MONITOR';
        break;
      }
      case 'EVENT_CURSOR_DOWN_SHIFT': {
        if (!evt) return;
        startDraggingEvents(position, day, evt);
        state.value = 'DRAG_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_START_CURSOR_DOWN': {
        if (!evt) return;
        if (!evt.selected) deselectAllEvents();
        startResizingCells(position, day, evt, true, false);
        state.value = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_START_CURSOR_DOWN_SHIFT': {
        if (!evt) return;
        startResizingCells(position, day, evt, true, false);
        state.value = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_END_CURSOR_DOWN': {
        if (!evt) return;
        if (!evt.selected) deselectAllEvents();
        startResizingCells(position, day, evt, false, false);
        state.value = 'RESIZE_MONITOR';
        break;
      }
      case 'EVENT_RESIZE_END_CURSOR_DOWN_SHIFT': {
        if (!evt) return;
        startResizingCells(position, day, evt, false, false);
        state.value = 'RESIZE_MONITOR';
        break;
      }
    }
  }

  function handleCreateMonitorEvent(gse: GridStateEvent, day: CalendarDay) {
    if (!createOrigin.value) return;

    switch (gse) {
      case 'ESCAPE': {
        deselectAllEvents();
        break;
      }
      case 'GRID_CURSOR_UP':
      case 'GRID_CURSOR_UP_SHIFT': {
        deselectAllEvents();
        if (!popoverVisible()) {
          const evt = createNewEvent(createOrigin.value.position, day);
          evt.selected = true;
          emit('did-create-event', evt);
          showCellPopover(evt);
        }
        state.value = 'NORMAL';
        break;
      }
      case 'EVENT_CURSOR_MOVE':
      case 'EVENT_CURSOR_MOVE_SHIFT':
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        // if (isTouch.value || isMonthly.value) {
        // if (isTouch.value) {
        //   state.value = 'NORMAL';
        //   return;
        // }
        deselectAllEvents();
        const { position } = createOrigin.value;
        const evt = createNewEvent(position, day);
        startResizingCells(position, day, evt, false, true);
        updateResizingEvents(position, day);
        state.value = 'RESIZE_MONITOR';
        break;
      }
    }
  }

  function handleResizeMonitorEvent(
    event: GridStateEvent,
    position: number,
    day: CalendarDay,
  ) {
    if (!resizeOrigin) return;
    switch (event) {
      case 'EVENT_CURSOR_MOVE':
      case 'EVENT_CURSOR_MOVE_SHIFT':
      case 'GRID_CURSOR_MOVE':
      case 'GRID_CURSOR_MOVE_SHIFT': {
        updateResizingEvents(position, day);
        if (!resizeOrigin.isNew) {
          updateCellPopover(resizeOrigin.event);
        }
        break;
      }
      case 'GRID_CURSOR_UP': {
        if (position === resizeOrigin.position) {
          deselectAllEvents();
          resizeOrigin.event.selected = true;
        }
        stopResizingEvents();
        state.value = 'NORMAL';
        break;
      }
      case 'GRID_CURSOR_UP_SHIFT': {
        stopResizingEvents();
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
        updateDraggingEvents(position, day);
        updateCellPopover(dragOrigin.event);
        break;
      }
      case 'GRID_CURSOR_UP': {
        const origin = dragOrigin;
        stopDraggingEvents();
        if (position === origin.position) {
          deselectAllEvents();
          origin.event.selected = true;
          showCellPopover(origin.event);
        }
        state.value = 'NORMAL';
        break;
      }
      case 'GRID_CURSOR_UP_SHIFT': {
        stopDraggingEvents();
        state.value = 'NORMAL';
        break;
      }
    }
  }

  function updateState(
    gse: GridStateEvent,
    day: CalendarDay,
    position: number,
    evt: Event | undefined = undefined,
  ) {
    switch (state.value) {
      case 'NORMAL': {
        handleNormalEvent(gse, day, position, evt);
        break;
      }
      case 'CREATE_MONITOR': {
        handleCreateMonitorEvent(gse, day);
        break;
      }
      case 'RESIZE_MONITOR': {
        handleResizeMonitorEvent(gse, position, day);
        break;
      }
      case 'DRAG_MONITOR': {
        handleDragMonitorEvent(gse, day, position);
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
    evt: Event | undefined = undefined,
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
    updateState(eventName, day, position.y, evt);
    if (stateEvent === 'GRID_CURSOR_DOWN') {
      onDayFocusin(day, null);
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
    events,
    eventsMap,
    selectedEvents,
    weekEvents,
    dayCells,
    detailEvent,
    resizing,
    dragging,
    gridStyle,
    fill,
    page,
    days,
    weeks,
    // Methods
    removeEvent,
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
    onEventMouseDown(event: MouseEvent, evt: Event) {
      setActiveGrid(event);
      handleEvent('EVENT_CURSOR_DOWN', event, evt);
    },
    onEventResizeStartMouseDown(event: MouseEvent, evt: Event) {
      setActiveGrid(event);
      handleEvent('EVENT_RESIZE_START_CURSOR_DOWN', event, evt);
    },
    onEventResizeEndMouseDown(event: MouseEvent, evt: Event) {
      setActiveGrid(event);
      handleEvent('EVENT_RESIZE_END_CURSOR_DOWN', event, evt);
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
    onEventTouchStart(event: TouchEvent, evt: Event) {
      setActiveGrid(event);
      handleEvent('EVENT_CURSOR_DOWN', event, evt);
    },
    onEventTouchMove(event: TouchEvent, evt: Event) {
      handleEvent('GRID_CURSOR_MOVE', event, evt);
    },
    onEventTouchEnd(event: TouchEvent, evt: Event) {
      handleEvent('GRID_CURSOR_UP', event, evt);
    },
    onEventResizeStartTouchStart(event: TouchEvent, evt: Event) {
      setActiveGrid(event);
      handleEvent('EVENT_RESIZE_START_CURSOR_DOWN', event, evt);
    },
    onEventResizeEndTouchStart(event: TouchEvent, evt: Event) {
      setActiveGrid(event);
      handleEvent('EVENT_RESIZE_END_CURSOR_DOWN', event, evt);
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
  events: Ref<Event[]>;
  eventsMap: Ref<Record<string | number, Event>>;
  selectedEvents: ComputedRef<Event[]>;
  weekEvents: Ref<Event[][]>;
  dayCells: Ref<Cell[][]>;
  detailEvent: Ref<Event | null>;
  resizing: Ref<boolean>;
  dragging: Ref<boolean>;
  gridStyle: ComputedRef<Object>;
  page: ComputedRef<Page>;
  days: ComputedRef<CalendarDay[]>;
  weeks: ComputedRef<CalendarWeek[]>;
  removeEvent: (evt: Event) => void;
  onDayNumberClick: (day: CalendarDay) => void;
  onGridEscapeKeydown: () => void;
  onGridMouseDown: (event: MouseEvent) => void;
  onEventMouseDown: (event: MouseEvent, evt: Event) => void;
  onEventResizeStartMouseDown: (event: MouseEvent, evt: Event) => void;
  onEventResizeEndMouseDown: (event: MouseEvent, evt: Event) => void;
  onGridTouchStart: (event: TouchEvent) => void;
  onGridTouchMove: (event: TouchEvent) => void;
  onGridTouchEnd: (event: TouchEvent) => void;
  onEventTouchStart: (event: TouchEvent, evt: Event) => void;
  onEventTouchMove: (event: TouchEvent, evt: Event) => void;
  onEventTouchEnd: (event: TouchEvent, evt: Event) => void;
  onEventResizeStartTouchStart: (event: TouchEvent, evt: Event) => void;
  onEventResizeEndTouchStart: (event: TouchEvent, evt: Event) => void;
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
