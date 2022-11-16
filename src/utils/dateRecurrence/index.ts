import { DayParts, DayOfWeek } from '../dates';
import { RuleConfig, GroupRule } from './rules';

export interface DateRecurrenceConfig extends RuleConfig {
  fromDate: Date | null;
  untilDate: Date | null;
  untilCount: number;
  firstDayOfWeek: DayOfWeek;
}

export class DateRecurrence {
  fromDate: Date | null = null;
  untilDate: Date | null = null;
  untilCount = NaN;
  firstDayOfWeek: DayOfWeek;
  rules: GroupRule;

  constructor(config: Partial<DateRecurrenceConfig>) {
    this.fromDate = config.fromDate || null;
    this.untilDate = config.untilDate || null;
    this.untilCount = config.untilCount || NaN;

    // Assign start of week
    if (config.firstDayOfWeek) {
      const firstDayOfWeek = config.firstDayOfWeek;
      if (firstDayOfWeek < 1 || firstDayOfWeek > 7) {
        throw Error('Start of week must be between 1 and 7.');
      }
      this.firstDayOfWeek = firstDayOfWeek;
    } else {
      // Default to Sunday as start of week
      this.firstDayOfWeek = 1;
    }

    this.rules = new GroupRule(this, config);
  }

  passes(dayParts: DayParts) {
    return this.rules.passes(dayParts);
  }
}
