import { ComputedRef, computed, reactive, toRefs } from 'vue';
import { addDays } from 'date-fns';
import { DragOffset, ResizeOffset } from '../../use/calendarGrid';
import { default as Locale, CalendarDay } from '../locale';
import { PopoverOptions } from '../popovers';
import DateInfo from '../dateInfo';
import { DateSource, MS_PER_MINUTE, roundDate } from '../dates';
import { clamp, defaults } from '../_';

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

export interface IDate {
  date?: DateSource;
  dateTime?: DateSource;
  timezone?: string;
}

export interface EventConfig {
  key?: any;
  summary?: string;
  description?: string;
  start?: IDate;
  end?: IDate;
  isAllDay?: boolean;
  dateInfo?: DateInfo;
  color?: string;
}

export interface EventState {
  key: any;
  summary: string;
  description: string;
  dateInfo: DateInfo;
  color: string;
  fill: string;
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
  isWeekly: boolean;
  durationMs: number;
  durationMinutes: number;
  startDate: Date;
  startDateTime: number;
  startDateLabel: string;
  endDate: Date;
  endDateTime: number;
  endDateLabel: string;
  resizable: boolean;
  isSolid: boolean;
  dragIsDirty: boolean;
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

export function createEvent(config: EventConfig, ctx: EventContext): Event {
  if (!config.key) throw new Error('Key required for events');
  let { start, end, isAllDay: allDay = false, dateInfo } = config;
  if (!start && !end && !dateInfo) {
    throw new Error('Start and end dates required for events');
  }
  dateInfo = dateInfo ?? DateInfo.from({ start, end, isAllDay: allDay });
  const state = reactive<EventState>(
    defaults(config, {
      key: config.key,
      dateInfo,
      summary: 'New Event',
      description: '',
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
    }),
  );

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
  const startDateTime = computed(() => startDate.value.getTime());
  const startDateLabel = computed(() => formatLabel(startDate.value));
  const endDate = computed(() => state.dateInfo.end!.date);
  const endDateTime = computed(() => endDate.value.getTime());
  const endDateLabel = computed(() => formatLabel(endDate.value));
  const durationMs = computed(
    () => endDate.value.getTime() - startDate.value.getTime(),
  );
  const durationMinutes = computed(() => durationMs.value / MS_PER_MINUTE);

  const isAllDay = computed(() => state.dateInfo.isAllDay);
  const isMultiDay = computed(() => state.dateInfo.isMultiDay);
  const isWeekly = computed(() => isAllDay.value || isMultiDay.value);

  const isSolid = computed(() => {
    return isAllDay.value || !ctx.isMonthly.value;
  });

  const dragIsDirty = computed(() => {
    const { dragging, dragOrigin } = state;
    if (!dragging || !dragOrigin) return false;
    return (
      dragOrigin.start.getTime() !== startDateTime.value ||
      dragOrigin.end.getTime() !== endDateTime.value
    );
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
    const { resizeOrigin } = state;
    let { start, end } = resizeOrigin;
    const weeksToAdd = offset.weeks;
    const weekdaysToAdd = offset.weekdays;
    const daysToAdd = weeksToAdd * ctx.dayColumns.value + weekdaysToAdd;
    const msToAdd = offset.ms;
    if (resizeOrigin.isStart) {
      if (daysToAdd !== 0) {
        start = addDays(resizeOrigin.start, daysToAdd);
      }
      if (msToAdd !== 0) {
        start = new Date(resizeOrigin.start.getTime() + msToAdd);
      }
    } else {
      if (daysToAdd !== 0) {
        end = addDays(resizeOrigin.end, daysToAdd);
      }
      if (msToAdd !== 0) {
        end = new Date(resizeOrigin.end.getTime() + msToAdd);
      }
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
    if (!ctx.isMonthly.value && !isWeekly.value) {
      const msToAdd = clamp(offset.ms, minOffsetMs, maxOffsetMs);
      start = roundDate(start.getTime() + msToAdd, snapMs.value);
    }
    end = new Date(start.getTime() + durationMs);
    state.dateInfo = DateInfo.from({ start, end, isAllDay: isAllDay.value });
  }

  function stopDrag() {
    if (!state.dragging || !state.dragOrigin) return false;
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
    if (state.selected !== b.selected) return state.selected ? -1 : 1;
    if (isWeekly.value && !b.isWeekly) return isWeekly.value ? -1 : -1;
    return startDate.value.getTime() - b.startDate.getTime();
  }

  return reactive({
    ...toRefs(state),
    refSelector,
    isAllDay,
    isMultiDay,
    isWeekly,
    durationMs,
    durationMinutes,
    startDate,
    startDateTime,
    startDateLabel,
    endDate,
    endDateTime,
    endDateLabel,
    isSolid,
    dragIsDirty,
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
