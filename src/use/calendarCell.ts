import { ComputedRef, reactive, computed, toRefs } from 'vue';
import { addDays } from 'date-fns';
import { DragOffset } from './calendarGrid';
import DateInfo from '../utils/dateInfo';
import { MS_PER_MINUTE, MS_PER_HOUR, roundDate } from '../utils/dates';
import { PopoverOptions } from '../utils/popovers';
import { default as Locale, CalendarDay } from '../utils/locale';
import { createGuid, roundTenth } from '../utils/helpers';
import { clamp } from '../utils/_';

type CellType = 'event' | 'label';
type CellSize = '2xs' | 'xs' | 'sm' | 'md';

export interface CellProps extends Partial<CellState> {
  days: ComputedRef<CalendarDay[]>;
  dayRows: ComputedRef<number>;
  dayColumns: ComputedRef<number>;
  isDaily: ComputedRef<boolean>;
  isMonthly: ComputedRef<boolean>;
  locale: ComputedRef<Locale>;
}

// constraints: Constraints = DEFAULT_CONSTRAINTS;
export interface CellState {
  key: string | number;
  type: CellType;
  label: string;
  color: string;
  fill: string;
  day: CalendarDay;
  dateInfo: DateInfo;
  selected: boolean;
  draggable: boolean;
  dragging: boolean;
  resizing: boolean;
  editing: boolean;
  order: number;
  snapMinutes: number;
  pixelsPerHour: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  popover: Partial<PopoverOptions> | null;
  resizeOrigin: ResizeOrigin | null;
  dragOrigin: DragOrigin | null;
}

interface ResizeOrigin {
  start: Date;
  end: Date;
  fromStart: boolean;
}

interface DragOrigin {
  position: number;
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

export function useCell(props: CellProps): CellContext {
  if (!props.day || !props.dateInfo) {
    throw new Error('Invalid day or date info provided for cell.');
  }
  const state = reactive<CellState>({
    key: createGuid(),
    day: props.day,
    dateInfo: props.dateInfo,
    type: 'event',
    label: '',
    color: 'indigo',
    fill: 'light',
    selected: false,
    draggable: true,
    dragging: false,
    resizing: false,
    editing: false,
    order: 0,
    minDurationMinutes: 15,
    maxDurationMinutes: 0,
    snapMinutes: 15,
    pixelsPerHour: 48,
    popover: null,
    resizeOrigin: null,
    dragOrigin: null,
    ...props,
  });

  function formatDate(date: Date, mask: string) {
    return props.locale.value.formatDate(date, mask);
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

  const position = computed(() => {
    const { start } = state.dateInfo;
    const { range } = state.day;
    const dayStartTime = range.start.getTime();
    const yHours = (start!.dateTime - dayStartTime) / MS_PER_HOUR;
    return Math.max(roundTenth(yHours * state.pixelsPerHour), 0);
  });

  const height = computed(() => {
    const { start, end } = state.dateInfo;
    const heightHours = (end!.dateTime - start!.dateTime) / MS_PER_HOUR;
    const fullHeight = 24 * state.pixelsPerHour;
    return Math.max(
      Math.min(heightHours * state.pixelsPerHour, fullHeight - position.value),
      0,
    );
  });

  const size = computed<CellSize>(() => {
    if (props.isMonthly.value || isAllDay.value) return '2xs';
    if (height.value <= 16) return '2xs';
    if (height.value <= 30) return 'xs';
    if (height.value <= 48) return 'sm';
    return 'md';
  });

  const is2xs = computed(() => ['2xs'].includes(size.value));
  const isXs = computed(() => ['2xs', 'xs'].includes(size.value));
  const isSm = computed(() => ['2xs', 'xs', 'sm'].includes(size.value));
  const isMd = computed(() => ['2xs', 'xs', 'sm', 'md'].includes(size.value));

  const resizable = computed(() => {
    if (props.isMonthly.value) return false;
    return !isAllDay.value;
  });

  const dateLabel = computed(() => {
    if (isXs.value) return startDateLabel.value;
    return `${startDateLabel.value} - ${endDateLabel.value}`;
  });

  const isSolid = computed(() => {
    return isAllDay.value || !props.isMonthly.value;
  });

  const style = computed(() => {
    if (props.isMonthly.value || isAllDay.value) {
      const start = props.isDaily.value ? 1 : state.day.weekdayPosition;
      return {
        gridColumnStart: start,
        gridColumnEnd: start + 1,
      };
    }
    return {
      top: `${position.value}px`,
      height: `${height.value}px`,
    };
  });

  // #region Resizing

  function startResize(fromStart: boolean) {
    if (!resizable.value || state.resizing || state.dragging) return;
    state.resizing = true;
    state.resizeOrigin = {
      start: state.dateInfo.start!.date,
      end: state.dateInfo.end!.date,
      fromStart,
    };
  }

  function updateResize(offsetMs: number) {
    if (!state.resizing || !state.resizeOrigin) return;
    let start: Date | null = null;
    let end: Date | null = null;
    if (state.resizeOrigin.fromStart) {
      start = roundDate(
        state.resizeOrigin.start.getTime() + offsetMs,
        snapMs.value,
      );
      end = state.resizeOrigin.end;
    } else {
      start = state.resizeOrigin.start;
      end = roundDate(
        state.resizeOrigin.end.getTime() + offsetMs,
        snapMs.value,
      );
    }
    if (start! < state.day.range.start) return;
    if (end! > state.day.range.end) return;
    state.dateInfo = DateInfo.from(
      { start, end },
      { isAllDay: isAllDay.value },
    );
    resizeToConstraints();
  }

  function stopResize() {
    state.resizing = false;
  }

  // #endregion Resizing

  // #region Dragging

  function startDrag() {
    if (!state.draggable || state.dragging || state.resizing) return;
    state.dragging = true;
    const start = state.dateInfo.start!.date;
    const end = state.dateInfo.end!.date;
    const durationMs =
      state.dateInfo.end!.dateTime - state.dateInfo.start!.dateTime;
    const minOffsetWeeks = props.isMonthly.value
      ? -state.day.weekPosition + 1
      : 0;
    const maxOffsetWeeks = props.isMonthly.value
      ? props.dayRows.value - state.day.weekPosition
      : 0;
    const minOffsetWeekdays = props.isDaily.value
      ? 0
      : -state.day.weekdayPosition + 1;
    const maxOffsetWeekdays = props.isDaily.value
      ? 0
      : props.dayColumns.value - state.day.weekdayPosition;
    const minOffsetMs = state.day.range.start.getTime() - start.getTime();
    const maxOffsetMs = state.day.range.end.getTime() - end.getTime();
    state.dragOrigin = {
      day: state.day,
      position: position.value,
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
      minOffsetWeekdays,
      maxOffsetWeekdays,
      minOffsetWeeks,
      maxOffsetWeeks,
      minOffsetMs,
      maxOffsetMs,
    } = state.dragOrigin;
    let { start, end } = state.dragOrigin;
    const { day, durationMs } = state.dragOrigin;
    const weeksToAdd = clamp(offset.weeks, minOffsetWeeks, maxOffsetWeeks);
    const weekdaysToAdd = clamp(
      offset.weekdays,
      minOffsetWeekdays,
      maxOffsetWeekdays,
    );
    const daysToAdd = weeksToAdd * props.dayColumns.value + weekdaysToAdd;
    // Set the new day
    const dayIndex = props.days.value.findIndex(d => d.id === day.id);
    state.day = props.days.value[dayIndex + daysToAdd];
    // Set the new date info
    start = addDays(start, daysToAdd);
    if (!props.isMonthly.value && !isAllDay.value) {
      const msToAdd = clamp(offset.ms, minOffsetMs, maxOffsetMs);
      start = roundDate(start.getTime() + msToAdd, snapMs.value);
    }
    end = new Date(start.getTime() + durationMs);
    state.dateInfo = DateInfo.from(
      { start, end },
      { isAllDay: isAllDay.value },
    );
    // resizeToConstraints();
  }

  function stopDrag() {
    state.dragging = false;
    state.dragOrigin = null;
  }

  // #endregion Dragging

  function resizeToConstraints() {
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
    state.dateInfo = DateInfo.from(
      {
        start: new Date(startTime),
        end: new Date(endTime),
      },
      { isAllDay: isAllDay.value },
    );
  }

  function compareTo(b: CellContext) {
    if (isAllDay.value && !b.isAllDay) return -1;
    if (!isAllDay.value && b.isAllDay) return 1;
    return startDate.value.getTime() - b.startDate.getTime();
  }

  return reactive({
    ...toRefs(state),
    refSelector,
    isAllDay,
    durationMs,
    durationMinutes,
    startDate,
    startDateLabel,
    endDate,
    endDateLabel,
    dateLabel,
    resizable,
    position,
    height,
    isSolid,
    style,
    is2xs,
    isXs,
    isSm,
    isMd,
    size,
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

export interface CellContext extends CellState {
  refSelector: string;
  isAllDay: boolean;
  durationMs: number;
  durationMinutes: number;
  startDate: Date;
  startDateLabel: string;
  endDate: Date;
  endDateLabel: string;
  dateLabel: string;
  resizable: boolean;
  isSolid: boolean;
  style: Record<string, any>;
  is2xs: boolean;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  size: CellSize;
  position: number;
  height: number;
  resizeToConstraints: () => void;
  formatDate: (date: Date, mask: string) => string;
  formatLabel: (date: Date) => string;
  startResize: (fromStart: boolean) => void;
  updateResize: (offsetMs: number) => void;
  stopResize: () => void;
  startDrag: () => void;
  updateDrag: (offset: DragOffset) => void;
  stopDrag: () => void;
  compareTo: (b: CellContext) => number;
}
