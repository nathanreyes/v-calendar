import { addDays } from 'date-fns';
import { type ComputedRef, computed, reactive, toRefs } from 'vue';
import type { DragOffset, ResizeOffset } from '../../use/calendarGrid';
import { MS_PER_MINUTE, roundDate } from '../date/helpers';
import { DateRange } from '../date/range';
import { clamp, omit } from '../helpers';
import Locale from '../locale';
import type { CalendarDay } from '../page';
import type { PopoverOptions } from '../popovers';

export interface ResizeOrigin {
  start: Date;
  end: Date;
  isStart: boolean;
}

export interface DragOrigin {
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

export interface EventConfig {
  key: PropertyKey;
  summary: string;
  description: string;
  start: Date;
  end: Date;
  range: DateRange;
  allDay: boolean;
  color: string;
  selected: boolean;
}

export interface EventState {
  key: any;
  summary: string;
  description: string;
  range: DateRange;
  allDay: boolean;
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

export interface EventContext {
  days: ComputedRef<CalendarDay[]>;
  dayRows: ComputedRef<number>;
  dayColumns: ComputedRef<number>;
  isDaily: ComputedRef<boolean>;
  isMonthly: ComputedRef<boolean>;
  locale: ComputedRef<Locale>;
}

export type Event = ReturnType<typeof createEvent>;

export function createEvent(config: Partial<EventConfig>, ctx: EventContext) {
  if (!config.key) throw new Error('Key required for events');

  const range = rangeFromConfig(config);
  if (!range) {
    throw new Error('Start and end dates required for events');
  }

  const state: EventState = reactive({
    key: config.key,
    range,
    allDay: false,
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
    ...omit(config, 'range', 'start', 'end'),
  });

  function rangeFromConfig({ range, start, end }: Partial<EventConfig>) {
    if (range != null) return range;
    if (!start || !end) {
      throw new Error('Start and end dates required for events');
    }
    return ctx.locale.value.range({ start, end });
  }

  function formatDate(date: Date, mask: string) {
    return locale.value.formatDate(date, mask);
  }

  function formatTime(date: Date) {
    if (!date) return '';
    return formatDate(date, 'h:mma');
  }

  const locale = computed(() => ctx.locale.value);

  const refSelector = computed(() => `[data-cell-id="${state.key}"]`);
  const minDurationMs = computed(
    () => state.minDurationMinutes * MS_PER_MINUTE,
  );
  const maxDurationMs = computed(
    () => state.maxDurationMinutes * MS_PER_MINUTE,
  );
  const snapMs = computed(() => state.snapMinutes * MS_PER_MINUTE);

  const startDate = computed(() => state.range.start!.date);
  const startDateTime = computed(() => startDate.value.getTime());
  const startTimeLabel = computed(() => formatTime(startDate.value));

  const endDate = computed(() => state.range.end!.date);
  const endDateTime = computed(() => endDate.value.getTime());
  const endTimeLabel = computed(() => formatTime(endDate.value));

  const timeLabel = computed(() => {
    return `${startTimeLabel.value} - ${endTimeLabel.value}`;
  });

  const durationMs = computed(
    () => endDate.value.getTime() - startDate.value.getTime(),
  );
  const durationMinutes = computed(() => durationMs.value / MS_PER_MINUTE);

  const isMultiDay = computed(() => state.range.isMultiDay);
  const isWeekly = computed(() => state.allDay || isMultiDay.value);

  const isSolid = computed(() => {
    return state.allDay || !ctx.isMonthly.value;
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
      start: state.range.start!.date,
      end: state.range.end!.date,
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
    state.range = locale.value.range({ start, end });
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
    const start = state.range.start!.date;
    const end = state.range.end!.date;
    const durationMs = state.range.end!.dateTime - state.range.start!.dateTime;
    const minOffsetWeeks = ctx.isMonthly.value ? -day.weekPosition + 1 : 0;
    const maxOffsetWeeks = ctx.isMonthly.value
      ? ctx.dayRows.value - day.weekPosition
      : 0;
    const minOffsetWeekdays = ctx.isDaily.value ? 0 : -day.weekdayPosition + 1;
    const maxOffsetWeekdays = ctx.isDaily.value
      ? 0
      : ctx.dayColumns.value - day.weekdayPosition;
    const minOffsetMs = day.startDate.getTime() - start.getTime();
    const maxOffsetMs = day.endDate.getTime() - end.getTime();
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
    state.range = locale.value.range({ start, end });
  }

  function stopDrag() {
    if (!state.dragging || !state.dragOrigin) return false;
    state.dragging = false;
    state.dragOrigin = null;
  }

  // #endregion Dragging

  function resizeToConstraints() {
    if (state.allDay) return;
    const { start, end } = state.range;
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
    state.range = locale.value.range({
      start: new Date(startTime),
      end: new Date(endTime),
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
    isMultiDay,
    isWeekly,
    durationMs,
    durationMinutes,
    startDate,
    startDateTime,
    startTimeLabel,
    endDate,
    endDateTime,
    endTimeLabel,
    timeLabel,
    isSolid,
    dragIsDirty,
    formatDate,
    formatTime,
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
