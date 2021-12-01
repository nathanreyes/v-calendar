import { reactive } from 'vue';
import { CalendarDay } from '../../utils/locale';
import DateInfo from '../../utils/dateInfo';
import { Constraints } from './Constraints';
import { createGuid, roundDate, roundTenth } from '../../utils/helpers';

interface ResizeOrigin {
  dateInfo: DateInfo;
  fromStart: boolean;
}

interface DragOrigin {
  position: number;
  dateInfo: DateInfo;
  durationMs: number;
  weekdayPosition: number;
}

const MS_PER_HOUR = 1000 * 60 * 60;

const DEFAULT_CONSTRAINTS = new Constraints([{ type: 'OUTSIDE_DAY' }]);

export class Cell {
  key = createGuid();
  label = '';
  day: CalendarDay;
  dateInfo: DateInfo;
  constraints: Constraints = DEFAULT_CONSTRAINTS;
  selected = false;
  draggable = true;
  dragging = false;
  resizable = true;
  resizing = false;
  position = 0;
  height = 0;
  snapMinutes = 15;
  resizeOrigin: ResizeOrigin | null = null;
  dragOrigin: DragOrigin | null = null;
  color = 'indigo';
  style: Record<string, any> | null = null;
  class: string[] = [];
  pixelsPerHour = 48;
  minDurationMinutes = 15;
  maxDurationMinutes = 0;

  static fromDateInfo(
    dateInfo: DateInfo,
    day: CalendarDay,
    data: Partial<Cell> = {},
  ) {
    return reactive(new Cell(dateInfo, day, data));
  }

  static fromDate(date: Date, day: CalendarDay, data: Partial<Cell> = {}) {
    const cell = this.fromDateInfo(
      new DateInfo({ startOn: date, endOn: date }),
      day,
      data,
    );
    cell.resizeToConstraints();
    return cell;
  }

  get startDate() {
    return this.dateInfo.start;
  }

  get startDateLabel() {
    return this.formatLabel(this.startDate);
  }

  get endDate() {
    return this.dateInfo.end;
  }

  get endDateLabel() {
    return this.formatLabel(this.endDate);
  }

  get durationMinutes() {
    return (this.endDate - this.startDate) / (60 * 1000);
  }

  formatLabel(date: Date) {
    if (!this.dateInfo) return '';
    const format = 'h:mma';
    return this.dateInfo.locale.format(date, format);
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

  constructor(dateInfo: DateInfo, day: CalendarDay, data: Partial<Cell> = {}) {
    this.dateInfo = dateInfo;
    this.day = day;
    Object.assign(this, data);
    this.init();
  }

  init() {
    this.updateLayout();
  }

  copy() {
    return Cell.fromDateInfo(this.dateInfo, this.day, this);
  }

  updateLayout() {
    const { startTime, endTime } = this.dateInfo;
    const { range } = this.day;
    const dayStartTime = range.start.getTime();
    const yHours = (startTime - dayStartTime) / MS_PER_HOUR;
    this.position = Math.max(roundTenth(yHours * this.pixelsPerHour), 0);
    const heightHours = (endTime - startTime) / MS_PER_HOUR;
    const fullHeight = 24 * this.pixelsPerHour;
    this.height = Math.min(
      heightHours * this.pixelsPerHour,
      fullHeight - this.position,
    );
    this.style = {
      top: `${this.position}px`,
      height: `${this.height}px`,
    };
    this.class = [`vc-${this.color}`, this.getClassForHeight(this.height)];
  }

  getClassForHeight(height: number) {
    if (height <= 15) return 'is-collapsed';
    if (height <= 30) return 'is-constrained';
    if (height <= 48) return 'is-small';
    return '';
  }

  startResize(fromStart: boolean) {
    if (!this.resizable || this.resizing || this.dragging) return;
    this.resizing = true;
    this.resizeOrigin = {
      dateInfo: this.dateInfo,
      fromStart,
    };
  }

  updateResize(offsetMs: number) {
    if (!this.resizing || !this.resizeOrigin) return;
    if (this.resizeOrigin.fromStart) {
      const startOn = roundDate(
        this.resizeOrigin.dateInfo.start.getTime() + offsetMs,
        this.snapMs,
      );
      const endOn = this.resizeOrigin.dateInfo.end;
      this.dateInfo = new DateInfo({ startOn, endOn });
    } else {
      const startOn = this.resizeOrigin.dateInfo.start;
      const endOn = roundDate(
        this.resizeOrigin.dateInfo.end.getTime() + offsetMs,
        this.snapMs,
      );
      this.dateInfo = new DateInfo({ startOn, endOn });
    }
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
      dateInfo: this.dateInfo,
      durationMs: this.dateInfo.endTime - this.dateInfo.startTime,
      weekdayPosition: this.day.weekdayPosition,
    };
  }

  updateDrag(
    offsetMs: number,
    offsetDays: number,
    availableDays: CalendarDay[],
  ) {
    if (!this.dragging || !this.dragOrigin) return;
    const startOn = roundDate(
      this.dragOrigin.dateInfo.start.getTime() + offsetMs,
      this.snapMs,
    );
    const endOn = new Date(startOn.getTime() + this.dragOrigin.durationMs);
    this.dateInfo = new DateInfo({ startOn, endOn });
    const dayIndex = Math.min(
      Math.max(this.dragOrigin.weekdayPosition + offsetDays - 1, 0),
      availableDays.length - 1,
    );
    this.day = availableDays[dayIndex];
    this.resizeToConstraints();
  }

  stopDrag() {
    this.dragging = false;
    this.dragOrigin = null;
  }

  resizeToConstraints() {
    let { startTime, endTime } = this.dateInfo;
    startTime = roundDate(startTime, this.snapMs).getTime();
    endTime = roundDate(endTime, this.snapMs).getTime();
    if (this.minDurationMs > 0 && endTime - startTime < this.minDurationMs) {
      endTime = startTime + this.minDurationMs;
    }
    if (this.maxDurationMs > 0 && endTime - startTime > this.maxDurationMs) {
      endTime = startTime + this.maxDurationMs;
    }

    // const dayStart = this.day.range.start.getTime();
    // const dayEnd = this.day.range.end.getTime();
    // startTime = Math.max(startTime, dayStart);
    // endTime = Math.min(endTime, dayEnd);

    this.dateInfo = new DateInfo({
      startOn: new Date(startTime),
      endOn: new Date(endTime),
    });
    this.updateLayout();
  }
}
