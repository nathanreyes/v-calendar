import { ComputedRef, Ref, computed, reactive, ref } from 'vue';
import { roundTenth } from '../helpers';
import { MS_PER_HOUR } from '../date/helpers';
import { DateRangeCell } from '../date/range';
import { Event } from './event';

export type CellSize = '2xs' | 'xs' | 'sm' | 'md';

interface CellContext {
  isMonthly: ComputedRef<boolean>;
  isDaily: ComputedRef<boolean>;
}

interface DayCellContext extends CellContext {
  dayIndex: number;
  pixelsPerHour: Ref<number>;
}

interface WeekCellContext extends CellContext {
  minDayIndex: number;
  maxDayIndex: number;
}

export interface Cell {
  event: Event;
  key: string | number;
  color: string;
  fill: string;
  allDay: boolean;
  isMultiDay: boolean;
  isWeekly: boolean;
  selected: boolean;
  resizable: boolean;
  resizableHorizontal: boolean;
  resizableVertical: boolean;
  size: CellSize;
  is2xs: boolean;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  style: any;
  summary: string;
  dateLabel: string;
  resizing: boolean;
  dragging: boolean;
}

function createCell(
  rangeCell: DateRangeCell<Event>,
  size: Ref<CellSize>,
  ctx: CellContext,
) {
  const event = rangeCell.data;
  const key = computed(() => event.key);
  const color = computed(() => event.color);

  const allDay = computed(() => event.allDay);
  const isMultiDay = computed(() => event.isMultiDay);
  const isWeekly = computed(() => event.isWeekly);

  const summary = computed(() => event.summary);
  const dateLabel = computed(() => {
    if (isXs.value) return event.startDateLabel;
    return `${event.startDateLabel} - ${event.endDateLabel}`;
  });

  const selected = computed(() => event.selected);

  const resizable = computed(() => event.resizable);
  const resizableHorizontal = computed(() => {
    if (!event.resizable) return false;
    if (ctx.isDaily.value) return false;
    if (ctx.isMonthly.value) return true;
    if (event.isWeekly) return true;
    return false;
  });
  const resizableVertical = computed(() => {
    if (!event.resizable) return false;
    if (ctx.isMonthly.value) return false;
    if (event.isWeekly) return false;
    return true;
  });

  const is2xs = computed(() => ['2xs'].includes(size.value));
  const isXs = computed(() => ['2xs', 'xs'].includes(size.value));
  const isSm = computed(() => ['2xs', 'xs', 'sm'].includes(size.value));
  const isMd = computed(() => ['2xs', 'xs', 'sm', 'md'].includes(size.value));

  const resizing = computed(() => event.resizing);
  const dragging = computed(() => event.dragging);

  return {
    event,
    key,
    color,
    allDay,
    isMultiDay,
    isWeekly,
    summary,
    dateLabel,
    selected,
    resizable,
    resizableHorizontal,
    resizableVertical,
    is2xs,
    isXs,
    isSm,
    isMd,
    resizing,
    dragging,
  };
}

export function createDayCell(
  rangeCell: DateRangeCell<Event>,
  ctx: DayCellContext,
) {
  const { pixelsPerHour } = ctx;
  const event = rangeCell.data;

  const position = computed(() => {
    const { dayStartTime } = rangeCell;
    const yHours = dayStartTime / MS_PER_HOUR;
    return Math.max(roundTenth(yHours * pixelsPerHour.value), 0);
  });

  const height = computed(() => {
    const { dayStartTime, dayEndTime } = rangeCell;
    const heightHours = (dayEndTime - dayStartTime) / MS_PER_HOUR;
    const fullHeight = 24 * pixelsPerHour.value;
    return Math.max(
      Math.min(heightHours * pixelsPerHour.value, fullHeight - position.value),
      0,
    );
  });

  const size = computed<CellSize>(() => {
    if (height.value <= 16) return '2xs';
    if (height.value <= 30) return 'xs';
    if (height.value <= 48) return 'sm';
    return 'md';
  });

  const style = computed(() => {
    return {
      top: `${position.value}px`,
      height: `${height.value}px`,
    };
  });

  const fill = computed(() => event.fill);

  return reactive({
    ...createCell(rangeCell, size, ctx),
    event,
    size,
    style,
    fill,
  });
}

export function createWeekCell(
  rangeCell: DateRangeCell<Event>,
  ctx: WeekCellContext,
): Cell {
  const { data: event, startDay, endDay } = rangeCell;
  const { minDayIndex, maxDayIndex } = ctx;

  const size = ref<CellSize>('2xs');

  const style = computed(() => {
    const gridColumnStart = Math.max(startDay - minDayIndex + 1, 1);
    const gridColumnEnd = Math.min(endDay - maxDayIndex - 1, -1);
    return {
      gridColumnStart,
      gridColumnEnd,
    };
  });

  const fill = computed(() => {
    if (ctx.isMonthly && !event.isWeekly) return 'transparent';
    return event.fill;
  });

  return reactive({
    ...createCell(rangeCell, size, ctx),
    size,
    style,
    fill,
  });
}
