import { isArray, isObject, isString, isFunction } from '../helpers';
import {
  DayOfWeek,
  DayInMonth,
  WeekInMonth,
  MonthInYear,
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
  FunctionRule,
  SingleOrArray,
} from './rules';

export type RepeatIntervalShort = 'day' | 'week' | 'month' | 'year';

export type RepeatInterval = 'days' | 'weeks' | 'months' | 'years';
export interface DateRepeatConfig {
  every: RepeatIntervalShort | [number, RepeatInterval];
  from: Date;
  until: Date;
  weekdays: SingleOrArray<DayOfWeek>;
  days: SingleOrArray<DayInMonth>;
  weeks: SingleOrArray<WeekInMonth>;
  months: SingleOrArray<MonthInYear>;
  years: SingleOrArray<number>;
  ordinalWeekdays: SingleOrArray<number[]>;
  on: SingleOrArray<DateRepeatFn | Partial<DateRepeatConfig>>;
}

export type DateRepeatFn = (dayParts: DayParts) => boolean;

export interface DateRepeatOptions {
  firstDayOfWeek: DayOfWeek;
  timezone?: string;
}

export class DateRepeat implements Rule<GroupRuleType> {
  validated = true;

  config: Partial<DateRepeatConfig> | DateRepeatFn;
  type = GroupRuleType.Any;
  from: DateParts | undefined;
  until: DateParts | undefined;
  rules: Rule<RuleType>[] = [];
  options: DateRepeatOptions = { firstDayOfWeek: 1 };

  constructor(
    config: Partial<DateRepeatConfig> | DateRepeatFn,
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

    if (isFunction(config)) {
      this.type = GroupRuleType.All;
      this.rules = [new FunctionRule(config)];
    } else if (isArray(config)) {
      this.type = GroupRuleType.Any;
      this.rules = config.map(c => new DateRepeat(c, this.options, this));
    } else if (isObject(config)) {
      this.type = GroupRuleType.All;
      // Assign bounding dates
      this.from = config.from
        ? getDateParts(config.from, this.firstDayOfWeek, this.timezone)
        : parent?.from;
      this.until = config.until
        ? getDateParts(config.until, this.firstDayOfWeek, this.timezone)
        : parent?.until;
      this.rules = this.getObjectRules(config);
    } else {
      console.error('Rule group configuration must be an object or an array.');
      this.validated = false;
    }
  }

  get firstDayOfWeek() {
    return this.options.firstDayOfWeek;
  }

  get timezone() {
    return this.options.timezone;
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
      }
    }

    // Add component rules
    Object.values(ComponentRuleType).forEach(type => {
      if (!(type in config)) return;
      rules.push(ComponentRule.create(type, config[type]));
    });

    // Add ordinal component rules
    Object.values(OrdinalComponentRuleType).forEach(type => {
      if (!(type in config)) return;
      rules.push(new OrdinalComponentRule(type, config[type]));
    });

    // Add group rules
    if (config.on != null) {
      if (!isArray(config.on)) config.on = [config.on];
      rules.push(new DateRepeat(config.on, this.options, this.parent));
    }

    return rules;
  }

  passes(dayParts: DayParts) {
    if (!this.validated) return true;

    if (this.from && dayParts.dayIndex <= this.from.dayIndex) return false;
    if (this.until && dayParts.dayIndex >= this.until.dayIndex) return false;

    if (this.type === GroupRuleType.Any) {
      return this.rules.some(r => r.passes(dayParts));
    }
    return this.rules.every(r => r.passes(dayParts));
  }
}
