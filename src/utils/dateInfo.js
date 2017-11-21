export default class DateInfo {
  constructor(date, order = 0) {
    if (!date) return;
    const hasStart = !!date.start;
    const hasEnd = !!date.end;
    if (hasStart || hasEnd) {
      // Normalize start and end dates
      let start = new Date(date.start);
      let end = new Date(date.end);
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      // Assign start and end dates
      this.type = 'range';
      this.isRange = true;
      this.start = start;
      this.startTime = start.getTime();
      this.end = end;
      this.endTime = end.getTime();
    } else {
      this.type = 'date';
      this.isDate = true;
      this.date = new Date(date);
      this.date.setHours(0, 0, 0, 0);
      this.dateTime = this.date.getTime();
    }
    this.order = order;
    this.intersects = this.intersects.bind(this);
  }

  toRange() {
    if (this.isDate) {
      return {
        start: new Date(this.dateTime),
        startTime: this.dateTime,
        end: new Date(this.dateTime),
        endTime: this.dateTime,
      };
    }
    return {
      start: new Date(this.startTime),
      startTime: this.startTime,
      end: new Date(this.endTime),
      endTime: this.endTime,
    };
  }

  containsDate(date) {
    if (this.isDate) return this.dateTime === date.getTime();
    if (this.start && date < this.start) return false;
    if (this.end && date > this.end) return false;
    return true;
  }

  compare(other) {
    if (this.order !== other.order) return this.order - other.order;
    if (this.type !== other.type) return this.isDate ? 1 : -1;
    if (this.isDate) return 0;
    const diff = this.start - other.start;
    return diff !== 0 ? diff : this.end - other.end;
  }

  intersects(other) {
    if (this.isDate) {
      return other.isDate ? this.dateTime === other.dateTime : other.containsDate(this.date);
    }
    if (other.isDate) return this.containsDate(other.date);
    return this.start <= other.end && this.end >= other.start;
  }
}
