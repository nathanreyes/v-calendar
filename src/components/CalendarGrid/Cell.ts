import { reactive } from 'vue';
import { CalendarDay } from '../../utils/locale';
import DateInfo from '../../utils/dateInfo';
import { Constraints } from './Constraints';
import { createGuid, roundTenth } from '../../utils/helpers';
import { roundDate } from '../../utils/dates';
import { PopoverOptions } from '../../utils/popovers';

interface ResizeOrigin {
  start: Date;
  end: Date;
  fromStart: boolean;
}

interface DragOrigin {
  position: number;
  start: Date;
  end: Date;
  durationMs: number;
  weekdayPosition: number;
}

const MS_PER_HOUR = 1000 * 60 * 60;

const DEFAULT_CONSTRAINTS = new Constraints([{ type: 'OUTSIDE_DAY' }]);

export class Cell {
  key = createGuid();
  label = '';
  color = 'indigo';
  day: CalendarDay;
  dateInfo: DateInfo;
  constraints: Constraints = DEFAULT_CONSTRAINTS;
  selected = false;
  draggable = true;
  dragging = false;
  resizing = false;
  editing = false;
  order = 0;
  position = 0;
  height = 0;
  snapMinutes = 15;
  pixelsPerHour = 48;
  minDurationMinutes = 15;
  maxDurationMinutes = 0;
  resizeOrigin: ResizeOrigin | null = null;
  dragOrigin: DragOrigin | null = null;
  style: Record<string, any> | null = null;
  class: string[] = [];
  popover: Partial<PopoverOptions> | null = null;

  static fromDateInfo(
    dateInfo: DateInfo,
    day: CalendarDay,
    data: Partial<Cell> = {},
  ) {
    return reactive(new Cell(dateInfo, day, data));
  }

  static fromDate(date: Date, day: CalendarDay, data: Partial<Cell> = {}) {
    const cell = this.fromDateInfo(
      DateInfo.from({ start: date, end: date }, { isAllDay: false }),
      day,
      data,
    );
    cell.resizeToConstraints();
    return cell;
  }

  constructor(dateInfo: DateInfo, day: CalendarDay, data: Partial<Cell> = {}) {
    Object.assign(this, data);
    this.dateInfo = dateInfo;
    this.day = day;
    this.init();
  }

  get isAllDay() {
    return (
      this.dateInfo.isAllDay ||
      this.startDate < this.day.range.start ||
      this.endDate > this.day.range.end
    );
  }

  get startDate() {
    return this.dateInfo.start!.date;
  }

  get startDateLabel() {
    return this.formatLabel(this.startDate);
  }

  get endDate() {
    return this.dateInfo.end!.date;
  }

  get endDateLabel() {
    return this.formatLabel(this.endDate);
  }

  get durationMinutes() {
    return (this.endDate.getTime() - this.startDate.getTime()) / (60 * 1000);
  }

  formatDate(date: Date, mask: string) {
    return this.day.locale.formatDate(date, mask);
  }

  formatLabel(date: Date) {
    if (!this.dateInfo) return '';
    return this.formatDate(date, 'h:mma');
  }

  get snapMs() {
    return this.snapMinutes * 60 * 1000;
  }

  get minDurationMs() {
    return this.minDurationMinutes * 60 * 1000;
  }

  get maxDurationMs() {
    return this.maxDurationMinutes * 60 * 1000;
  }

  get resizable() {
    return !this.isAllDay;
  }

  init() {
    this.updateLayout();
  }

  copy() {
    return Cell.fromDateInfo(this.dateInfo, this.day, this);
  }

  updateLayout() {
    this.position = this.getPosition();
    this.height = this.getHeight();
  }

  getPosition() {
    const { start } = this.dateInfo;
    const { range } = this.day;
    const dayStartTime = range.start.getTime();
    const yHours = (start!.dateTime - dayStartTime) / MS_PER_HOUR;
    return Math.max(roundTenth(yHours * this.pixelsPerHour), 0);
  }

  getHeight() {
    if (this.isAllDay) return 20;
    const { start, end } = this.dateInfo;
    const heightHours = (end!.dateTime - start!.dateTime) / MS_PER_HOUR;
    const fullHeight = 24 * this.pixelsPerHour;
    return Math.min(
      heightHours * this.pixelsPerHour,
      fullHeight - this.position,
    );
  }

  get size() {
    if (this.height <= 16) return 'collapsed';
    if (this.height <= 30) return 'constrained';
    if (this.height <= 48) return 'small';
    return 'normal';
  }

  get refSelector() {
    return `[data-cell-id="${this.key}"]`;
  }

  startResize(fromStart: boolean) {
    if (!this.resizable || this.resizing || this.dragging) return;
    this.resizing = true;
    this.resizeOrigin = {
      start: this.dateInfo.start!.date,
      end: this.dateInfo.end!.date,
      fromStart,
    };
  }

  updateResize(offsetMs: number) {
    if (!this.resizing || !this.resizeOrigin) return;
    let start: Date | null = null;
    let end: Date | null = null;
    if (this.resizeOrigin.fromStart) {
      start = roundDate(
        this.resizeOrigin.start.getTime() + offsetMs,
        this.snapMs,
      );
      end = this.resizeOrigin.end;
    } else {
      start = this.resizeOrigin.start;
      end = roundDate(this.resizeOrigin.end.getTime() + offsetMs, this.snapMs);
    }
    if (start! < this.day.range.start) return;
    if (end! > this.day.range.end) return;
    this.dateInfo = DateInfo.from({ start, end }, { isAllDay: false });
    this.resizeToConstraints();
  }

  stopResize() {
    this.resizing = false;
  }

  startDrag() {
    if (!this.draggable || this.dragging || this.resizing) return;
    this.dragging = true;
    this.dragOrigin = {
      position: this.position,
      start: this.dateInfo.start!.date,
      end: this.dateInfo.end!.date,
      durationMs: this.dateInfo.end!.dateTime - this.dateInfo.start!.dateTime,
      weekdayPosition: this.day.weekdayPosition,
    };
  }

  updateDrag(
    offsetMs: number,
    offsetDays: number,
    availableDays: CalendarDay[],
  ) {
    if (!this.dragging || !this.dragOrigin) return;
    const start = roundDate(
      this.dragOrigin.start.getTime() + offsetMs,
      this.snapMs,
    );
    const end = new Date(start.getTime() + this.dragOrigin.durationMs);
    const dayIndex = Math.min(
      Math.max(this.dragOrigin.weekdayPosition + offsetDays - 1, 0),
      availableDays.length - 1,
    );
    this.day = availableDays[dayIndex];
    if (start < this.day.range.start) return;
    if (end > this.day.range.end) return;
    this.dateInfo = DateInfo.from({ start, end }, { isAllDay: false });
    this.resizeToConstraints();
  }

  stopDrag() {
    this.dragging = false;
    this.dragOrigin = null;
  }

  resizeToConstraints() {
    const { start, end } = this.dateInfo;
    let startTime = start!.dateTime;
    let endTime = end!.dateTime;
    startTime = roundDate(startTime, this.snapMs).getTime();
    endTime = roundDate(endTime, this.snapMs).getTime();
    if (this.minDurationMs > 0 && endTime - startTime < this.minDurationMs) {
      endTime = startTime + this.minDurationMs;
    }
    if (this.maxDurationMs > 0 && endTime - startTime > this.maxDurationMs) {
      endTime = startTime + this.maxDurationMs;
    }
    this.dateInfo = DateInfo.from(
      {
        start: new Date(startTime),
        end: new Date(endTime),
      },
      { isAllDay: false },
    );
    this.updateLayout();
  }
}
