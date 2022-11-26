import { isArray, isObject, isString } from '../helpers';
import {
  DateSource,
  DayOfWeek,
  DayInMonth,
  WeekInMonth,
  DayParts,
  DateParts,
  getDateParts,
} from './helpers';
import {
  Rule,
  RuleType,
  GroupRuleType,
  IntervalRuleType,
  IntervalRule,
  ComponentRuleType,
  ComponentRule,
  OrdinalComponentRuleType,
  OrdinalComponentRule,
  OrdinalObjectConfig,
  OrdinalArrayConfig,
} from './rules';

export type RepeatIntervalShort = 'day' | 'week' | 'month' | 'year';

enum RepeatInterval {
  Days = 'days',
  Weeks = 'weeks',
  Months = 'months',
  Years = 'years',
}

export interface DateRepeatConfig {
  every: RepeatIntervalShort | [number, RepeatInterval];
  from: DateSource;
  until: DateSource;
  weekdays: DayOfWeek | DayOfWeek[];
  days: DayInMonth | DayInMonth[];
  weeks: WeekInMonth | WeekInMonth[];
  years: number | number[];
  ordinalWeekdays: OrdinalObjectConfig | OrdinalArrayConfig;
  on: DateRepeatConfig[];
}

export interface DateRepeatOptions {
  firstDayOfWeek: DayOfWeek;
  timezone?: string;
}

export class DateRepeat implements Rule<GroupRuleType> {
  config: Partial<DateRepeatConfig>;
  type = GroupRuleType.Any;
  from: DateParts | undefined;
  until: DateParts | undefined;
  rules: Rule<RuleType>[] = [];
  options: DateRepeatOptions = { firstDayOfWeek: 1 };

  constructor(
    config: Partial<DateRepeatConfig>,
    options?: Partial<DateRepeatOptions>,
    private parent?: DateRepeat,
  ) {
    this.config = config;

    // Assign local options
    Object.assign(this.options, options);
    const { firstDayOfWeek } = this.options;
    if (!firstDayOfWeek || firstDayOfWeek < 1 || firstDayOfWeek > 7) {
      throw Error('Start of week must be between 1 and 7.');
    }

    if (config.from) {
      const from = normalizeDate(config.from);
      this.from = getDateParts(from, this.firstDayOfWeek, this.timezone);
    } else {
      this.from = parent?.from;
    }

    if (config.until) {
      const until = normalizeDate(config.until);
      this.until = getDateParts(until, this.firstDayOfWeek, this.timezone);
    } else {
      this.until = parent?.until;
    }

    this.validate();

    this.rules = this.normalizeRules(config);
  }

  get firstDayOfWeek() {
    return this.options.firstDayOfWeek;
  }

  get timezone() {
    return this.options.timezone;
  }

  validate() {
    if (isObject(this.config) || isArray(this.config)) return;
    throw Error('Rule group configuration must be an object or an array.');
  }

  normalizeRules(config: any) {
    if (isArray(config)) {
      this.type = GroupRuleType.Any;
      return config.map(c => new DateRepeat(c, this.options, this));
    } else {
      this.type = GroupRuleType.All;
      return this.getObjectRules(config);
    }
  }

  getObjectRules(config: any) {
    const rules: Rule<RuleType>[] = [];

    // Add interval rule
    if (config.every) {
      if (isString(config.every)) {
        config.every = [1, `${config.every}s`];
      }
      if (isArray(config.every)) {
        const [interval = 1, type = IntervalRuleType.Days] = config.every;
        rules.push(new IntervalRule(type, interval, this.from!));
        switch (type) {
          case IntervalRuleType.Weeks: {
            if (!config.weekdays && !config.on && this.from) {
              config.weekdays = this.from.weekday;
            }
          }
        }
      }
    }

    // Add component rules
    Object.values(ComponentRuleType).forEach(type => {
      if (!(type in config)) return;
      rules.push(new ComponentRule(type, config[type]));
    });

    // Add ordinal component rules
    Object.values(OrdinalComponentRuleType).forEach(type => {
      if (!(type in config)) return;
      rules.push(new OrdinalComponentRule(type, config[type]));
    });

    // Add group rules
    if (config.on) {
      rules.push(new DateRepeat(config.on, this.options, this.parent));
    }

    return rules;
  }

  passes(dayParts: DayParts) {
    if (this.from && dayParts.dayIndex <= this.from.dayIndex) return false;
    if (this.until && dayParts.dayIndex >= this.until.dayIndex) return false;

    if (this.type === GroupRuleType.Any) return this.passesAny(dayParts);
    return this.passesAll(dayParts);
  }

  passesAny(dayParts: DayParts) {
    return this.rules.some(r => r.passes(dayParts));
  }

  passesAll(dayParts: DayParts) {
    return this.rules.every(r => r.passes(dayParts));
  }
}
