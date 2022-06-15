import { ComputedRef, computed, reactive, toRefs } from 'vue';
import { addDays } from 'date-fns';
import { DragOffset, ResizeOffset } from '../../use/calendarGrid';
import { CellType } from './cell';
import { default as Locale, CalendarDay } from '../locale';
import { PopoverOptions } from '../popovers';
import { createGuid } from '../helpers';
import DateInfo from '../dateInfo';
import { MS_PER_MINUTE, roundDate } from '../dates';
import { clamp } from '../_';

interface ResizeOrigin {
  day: CalendarDay;
  start: Date;
  end: Date;
  isStart: boolean;
}

interface DragOrigin {
  day: CalendarDay;
  start: Date;
  end: Date;
  minOffsetWeeks: number;
  maxOffsetWeeks: number;
  minOffsetWeekdays: number;
  maxOffsetWeekdays: number;
  minOffsetMs: number;
  maxOffsetMs: number;
  durationMs: number;
}

export interface EventState {
  key: string | number;
  type: CellType;
  label: string;
  color: string;
  fill: string;
  dateInfo: DateInfo;
  selected: boolean;
  draggable: boolean;
  dragging: boolean;
  resizable: boolean;
  resizing: boolean;
  editing: boolean;
  order: number;
  snapMinutes: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  popover: Partial<PopoverOptions> | null;
  resizeOrigin: ResizeOrigin | null;
  dragOrigin: DragOrigin | null;
}

export interface Event extends EventState {
  refSelector: string;
  isAllDay: boolean;
  isMultiDay: boolean;
  durationMs: number;
  durationMinutes: number;
  startDate: Date;
  startDateLabel: string;
  endDate: Date;
  endDateLabel: string;
  resizable: boolean;
  isSolid: boolean;
  resizeToConstraints: () => void;
  formatDate: (date: Date, mask: string) => string;
  formatLabel: (date: Date) => string;
  startResize: (day: CalendarDay, isStart: boolean) => void;
  updateResize: (offset: ResizeOffset) => void;
  stopResize: () => void;
  startDrag: (day: CalendarDay) => void;
  updateDrag: (offset: DragOffset) => void;
  stopDrag: () => void;
  compareTo: (b: Event) => number;
}

export interface EventContext {
  days: ComputedRef<CalendarDay[]>;
  dayRows: ComputedRef<number>;
  dayColumns: ComputedRef<number>;
  isDaily: ComputedRef<boolean>;
  isMonthly: ComputedRef<boolean>;
  locale: ComputedRef<Locale>;
}

export function createEvent(config: Partial<Event>, ctx: EventContext): Event {
  if (!config.dateInfo) {
    throw new Error('Invalid date info provided for cell.');
  }
  const state = reactive<EventState>({
    key: createGuid(),
    dateInfo: config.dateInfo,
    type: 'event',
    label: '',
    color: 'indigo',
    fill: 'light',
    selected: false,
    draggable: true,
    dragging: false,
    resizable: true,
    resizing: false,
    editing: false,
    order: 0,
    minDurationMinutes: 15,
    maxDurationMinutes: 0,
    snapMinutes: 15,
    popover: null,
    resizeOrigin: null,
    dragOrigin: null,
    ...config,
  });

  function formatDate(date: Date, mask: string) {
    return ctx.locale.value.formatDate(date, mask);
  }

  function formatLabel(date: Date) {
    if (!date) return '';
    return formatDate(date, 'h:mma');
  }

  const refSelector = computed(() => `[data-cell-id="${state.key}"]`);
  const minDurationMs = computed(
    () => state.minDurationMinutes * MS_PER_MINUTE,
  );
  const maxDurationMs = computed(
    () => state.maxDurationMinutes * MS_PER_MINUTE,
  );
  const snapMs = computed(() => state.snapMinutes * MS_PER_MINUTE);
  const startDate = computed(() => state.dateInfo.start!.date);
  const startDateLabel = computed(() => formatLabel(startDate.value));
  const endDate = computed(() => state.dateInfo.end!.date);
  const endDateLabel = computed(() => formatLabel(endDate.value));
  const durationMs = computed(
    () => endDate.value.getTime() - startDate.value.getTime(),
  );
  const durationMinutes = computed(() => durationMs.value / MS_PER_MINUTE);

  const isAllDay = computed(() => state.dateInfo.isAllDay);
  const isMultiDay = computed(() => state.dateInfo.isMultiDay);

  const isSolid = computed(() => {
    return isAllDay.value || !ctx.isMonthly.value;
  });

  // #region Resizing

  function startResize(day: CalendarDay, isStart: boolean) {
    if (!state.resizable || state.resizing || state.dragging) return;
    state.resizing = true;
    state.resizeOrigin = {
      day,
      start: state.dateInfo.start!.date,
      end: state.dateInfo.end!.date,
      isStart,
    };
  }

  function updateResize(offset: ResizeOffset) {
    if (!state.resizing || !state.resizeOrigin) return;
    let start: Date | null = null;
    let end: Date | null = null;
    const { resizeOrigin } = state;
    if (ctx.isMonthly.value) {
      const weeksToAdd = offset.weeks;
      const weekdaysToAdd = offset.weekdays;
      const daysToAdd = weeksToAdd * ctx.dayColumns.value + weekdaysToAdd;
      if (state.resizeOrigin.isStart) {
        if (daysToAdd > 0) return;
        start = addDays(state.resizeOrigin.start, daysToAdd);
        end = state.resizeOrigin.end;
      } else {
        if (daysToAdd < 0) return;
        start = state.resizeOrigin.start;
        end = addDays(state.resizeOrigin.end, daysToAdd);
      }
    } else {
      if (resizeOrigin.isStart) {
        start = roundDate(
          resizeOrigin.start.getTime() + offset.ms,
          snapMs.value,
        );
        end = resizeOrigin.end;
      } else {
        start = resizeOrigin.start;
        end = roundDate(resizeOrigin.end.getTime() + offset.ms, snapMs.value);
      }

      if (start! < resizeOrigin.day.range.start) return;
      if (end! > resizeOrigin.day.range.end) return;
    }
    state.dateInfo = DateInfo.from({ start, end, isAllDay: isAllDay.value });
    resizeToConstraints();
  }

  function stopResize() {
    state.resizing = false;
  }

  // #endregion Resizing

  // #region Dragging

  function startDrag(day: CalendarDay) {
    if (!state.draggable || state.dragging || state.resizing) return;
    state.dragging = true;
    const start = state.dateInfo.start!.date;
    const end = state.dateInfo.end!.date;
    const durationMs =
      state.dateInfo.end!.dateTime - state.dateInfo.start!.dateTime;
    const minOffsetWeeks = ctx.isMonthly.value ? -day.weekPosition + 1 : 0;
    const maxOffsetWeeks = ctx.isMonthly.value
      ? ctx.dayRows.value - day.weekPosition
      : 0;
    const minOffsetWeekdays = ctx.isDaily.value ? 0 : -day.weekdayPosition + 1;
    const maxOffsetWeekdays = ctx.isDaily.value
      ? 0
      : ctx.dayColumns.value - day.weekdayPosition;
    const minOffsetMs = day.range.start.getTime() - start.getTime();
    const maxOffsetMs = day.range.end.getTime() - end.getTime();
    state.dragOrigin = {
      day,
      start,
      end,
      durationMs,
      minOffsetWeeks,
      maxOffsetWeeks,
      minOffsetWeekdays,
      maxOffsetWeekdays,
      minOffsetMs,
      maxOffsetMs,
    };
  }

  function updateDrag(offset: DragOffset) {
    if (!state.dragging || !state.dragOrigin) return;
    const {
      durationMs,
      minOffsetWeekdays,
      maxOffsetWeekdays,
      minOffsetWeeks,
      maxOffsetWeeks,
      minOffsetMs,
      maxOffsetMs,
    } = state.dragOrigin;
    let { start, end } = state.dragOrigin;
    const weeksToAdd = clamp(offset.weeks, minOffsetWeeks, maxOffsetWeeks);
    const weekdaysToAdd = clamp(
      offset.weekdays,
      minOffsetWeekdays,
      maxOffsetWeekdays,
    );
    const daysToAdd = weeksToAdd * ctx.dayColumns.value + weekdaysToAdd;
    // Set the new date info
    start = addDays(start, daysToAdd);
    if (!ctx.isMonthly.value && !isAllDay.value) {
      const msToAdd = clamp(offset.ms, minOffsetMs, maxOffsetMs);
      start = roundDate(start.getTime() + msToAdd, snapMs.value);
    }
    end = new Date(start.getTime() + durationMs);
    state.dateInfo = DateInfo.from({ start, end, isAllDay: isAllDay.value });
  }

  function stopDrag() {
    state.dragging = false;
    state.dragOrigin = null;
  }

  // #endregion Dragging

  function resizeToConstraints() {
    if (isAllDay.value) return;
    const { start, end } = state.dateInfo;
    let startTime = start!.dateTime;
    let endTime = end!.dateTime;
    startTime = roundDate(startTime, snapMs.value).getTime();
    endTime = roundDate(endTime, snapMs.value).getTime();
    if (minDurationMs.value > 0 && endTime - startTime < minDurationMs.value) {
      endTime = startTime + minDurationMs.value;
    }
    if (maxDurationMs.value > 0 && endTime - startTime > maxDurationMs.value) {
      endTime = startTime + maxDurationMs.value;
    }
    state.dateInfo = DateInfo.from({
      start: new Date(startTime),
      end: new Date(endTime),
      isAllDay: isAllDay.value,
    });
  }

  function compareTo(b: Event) {
    if (isAllDay.value && !b.isAllDay) return -1;
    if (!isAllDay.value && b.isAllDay) return 1;
    return startDate.value.getTime() - b.startDate.getTime();
  }

  return reactive({
    ...toRefs(state),
    refSelector,
    isAllDay,
    isMultiDay,
    durationMs,
    durationMinutes,
    startDate,
    startDateLabel,
    endDate,
    endDateLabel,
    isSolid,
    formatDate,
    formatLabel,
    resizeToConstraints,
    startResize,
    updateResize,
    stopResize,
    startDrag,
    updateDrag,
    stopDrag,
    compareTo,
  });
}
