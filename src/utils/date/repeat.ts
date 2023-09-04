import { isArray, isFunction, isObject, isString } from '../helpers';
import Locale from '../locale';
import type {
  DateParts,
  DayInMonth,
  DayOfWeek,
  DayParts,
  MonthInYear,
  WeekInMonth,
} from './helpers';
import {
  ComponentRule,
  ComponentRuleType,
  FunctionRule,
  GroupRuleType,
  IntervalRule,
  IntervalRuleType,
  OrdinalComponentRule,
  OrdinalComponentRuleType,
  type Rule,
  type RuleType,
  type SingleOrArray,
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
  locale: Locale;
}

export class DateRepeat implements Rule<GroupRuleType> {
  validated = true;

  config: Partial<DateRepeatConfig> | DateRepeatFn;
  type = GroupRuleType.Any;
  from: DateParts | undefined;
  until: DateParts | undefined;
  rules: Rule<RuleType>[] = [];
  locale = new Locale();

  constructor(
    config: Partial<DateRepeatConfig> | DateRepeatFn,
    options: Partial<DateRepeatOptions> = {},
    private parent?: DateRepeat,
  ) {
    if (options.locale) this.locale = options.locale;

    this.config = config;
    if (isFunction(config)) {
      this.type = GroupRuleType.All;
      this.rules = [new FunctionRule(config)];
    } else if (isArray(config)) {
      this.type = GroupRuleType.Any;
      this.rules = config.map(c => new DateRepeat(c, options, this));
    } else if (isObject(config)) {
      this.type = GroupRuleType.All;
      // Assign bounding dates
      this.from = config.from
        ? this.locale.getDateParts(config.from)
        : parent?.from;
      this.until = config.until
        ? this.locale.getDateParts(config.until)
        : parent?.until;
      this.rules = this.getObjectRules(config);
    } else {
      console.error('Rule group configuration must be an object or an array.');
      this.validated = false;
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
      rules.push(
        new DateRepeat(config.on, { locale: this.locale }, this.parent),
      );
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
