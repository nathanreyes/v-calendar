import {
  DayOfWeek,
  DayInMonth,
  WeekInMonth,
  DayParts,
  diffInDays,
  diffInWeeks,
  diffInMonths,
  diffInYears,
} from '../dates';
import { DateRecurrence } from './index';
import { isArray, isNumber, isObject } from '../helpers';

export enum IntervalRuleType {
  Days = 'days',
  Weeks = 'weeks',
  Months = 'months',
  Years = 'years',
}

export enum ComponentRuleType {
  Days = 'days',
  Weekdays = 'weekdays',
  Weeks = 'weeks',
  Months = 'months',
  Years = 'years',
}

export enum OrdinalComponentRuleType {
  OrdinalWeekdays = 'ordinalWeekdays',
}

export enum GroupRuleType {
  Any = 'any',
  All = 'all',
}

export type RuleType =
  | GroupRuleType
  | IntervalRuleType
  | ComponentRuleType
  | OrdinalComponentRuleType;

type OrdinalObjectConfig = Record<string | number, number | number[]>;
type OrdinalArrayConfig = number[] | number[][];

enum RepeatInterval {
  Days = 'days',
  Weeks = 'weeks',
  Months = 'months',
  Years = 'years',
}

export interface RuleConfig {
  every: [number, RepeatInterval];
  weekdays: DayOfWeek | DayOfWeek[];
  days: DayInMonth | DayInMonth[];
  weeks: WeekInMonth | WeekInMonth[];
  years: number | number[];
  ordinalWeekdays: OrdinalObjectConfig | OrdinalArrayConfig;
  on: RuleConfig[];
}

interface ComponentRuleRange {
  min: number;
  max: number;
  ordinal?: ComponentRuleRange;
}

export const RuleRanges: Record<
  ComponentRuleType | OrdinalComponentRuleType,
  ComponentRuleRange
> = {
  weekdays: { min: 1, max: 7 },
  days: { min: 1, max: 31 },
  weeks: { min: 1, max: 5 },
  months: { min: 1, max: 12 },
  years: { min: 0, max: 4000 },
  ordinalWeekdays: { ordinal: { min: 1, max: 5 }, min: 1, max: 5 },
};

export interface Rule<T extends RuleType> {
  type: T;
  recurrence: DateRecurrence;
  validate(): void;
  passes(dayParts: DayParts): boolean;
}

export class GroupRule implements Rule<GroupRuleType> {
  type = GroupRuleType.Any;
  rules: Rule<RuleType>[] = [];

  constructor(public recurrence: DateRecurrence, public config: any) {
    this.validate();
    this.rules = this.normalizeRules(config);
  }

  validate() {
    if (isObject(this.config) || isArray(this.config)) return;
    throw Error('Rule group configuration must be an object or an array.');
  }

  normalizeRules(config: any) {
    if (isArray(config)) {
      this.type = GroupRuleType.Any;
      return config.map(c => new GroupRule(this.recurrence, c));
    } else {
      this.type = GroupRuleType.All;
      return this.getObjectRules(config);
    }
  }

  getObjectRules(config: any) {
    const rules: Rule<RuleType>[] = [];

    // Add interval rule
    if (config.every) {
      const [interval = 1, type = IntervalRuleType.Days] = config.every;
      rules.push(new IntervalRule(this.recurrence, type, interval));
    }

    // Add interval rules
    // Object.values(IntervalRuleType).forEach(type => {
    //   if (!(type in config)) return;
    //   rules.push(new IntervalRule(this.recurrence, type, config[type]!));
    // });

    // Add component rules
    Object.values(ComponentRuleType).forEach(type => {
      if (!(type in config)) return;
      rules.push(new ComponentRule(this.recurrence, type, config[type]));
    });

    // Add ordinal component rules
    Object.values(OrdinalComponentRuleType).forEach(type => {
      if (!(type in config)) return;
      rules.push(new OrdinalComponentRule(this.recurrence, type, config[type]));
    });

    // Add group rules
    if (config.on) {
      rules.push(new GroupRule(this.recurrence, config.on));
    }

    return rules;
  }

  passes(dayParts: DayParts) {
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

export class IntervalRule implements Rule<IntervalRuleType> {
  constructor(
    public recurrence: DateRecurrence,
    public type: IntervalRuleType,
    public interval: number,
  ) {
    this.validate();
  }

  validate() {
    // Start date needed for interval rules
    if (!this.recurrence.fromDate) {
      throw Error(
        'You can only set an interval if this recurrence has a start date.',
      );
    }
  }

  passes(dateParts: DayParts) {
    const { date } = dateParts;
    const fromDate = this.recurrence.fromDate || new Date();
    switch (this.type) {
      case IntervalRuleType.Days: {
        return diffInDays(fromDate, date) % this.interval === 0;
      }
      case IntervalRuleType.Weeks: {
        return diffInWeeks(fromDate, date) % this.interval === 0;
      }
      case IntervalRuleType.Months: {
        return diffInMonths(fromDate, date) % this.interval === 0;
      }
      case IntervalRuleType.Years: {
        return diffInYears(fromDate, date) % this.interval === 0;
      }
      default: {
        return false;
      }
    }
  }
}

export class ComponentRule implements Rule<ComponentRuleType> {
  components: number[] = [];

  constructor(
    public recurrence: DateRecurrence,
    public type: ComponentRuleType,
    components: number | number[],
  ) {
    this.components = isArray(components) ? components : [components];
    this.validate();
  }

  validate() {
    const range = RuleRanges[this.type];
    this.components.forEach(component => {
      if (component < range.min || component > range.max) {
        throw Error(
          `Acceptable range for ${this.type} is from ${range.min} to ${range.max}.`,
        );
      }
    });
  }

  getTestComponents(dayParts: DayParts) {
    const { day, dayFromEnd, weekday, week, weekFromEnd, month, year } =
      dayParts;
    switch (this.type) {
      case ComponentRuleType.Days:
        return [day, -dayFromEnd];
      case ComponentRuleType.Weekdays:
        return [weekday];
      case ComponentRuleType.Weeks:
        return [week, -weekFromEnd];
      case ComponentRuleType.Months:
        return [month];
      case ComponentRuleType.Years:
        return [year];
      default:
        return [];
    }
  }

  passes(dayParts: DayParts) {
    const comps = this.getTestComponents(dayParts);
    return comps.some(comp => this.components.includes(comp));
  }
}

export class OrdinalComponentRule implements Rule<OrdinalComponentRuleType> {
  components: [WeekInMonth, DayOfWeek][];

  constructor(
    public recurrence: DateRecurrence,
    public type: OrdinalComponentRuleType,
    components: OrdinalObjectConfig | OrdinalArrayConfig,
  ) {
    this.components = this.normalizeComponents(components);
    this.validate();
  }

  normalizeArrayConfig(config: OrdinalArrayConfig) {
    const result: [WeekInMonth, DayOfWeek][] = [];
    config.forEach((numOrArray, i) => {
      if (isNumber(numOrArray)) {
        if (i === 0) return;
        result.push([config[0] as WeekInMonth, numOrArray as DayOfWeek]);
      } else if (isArray(numOrArray)) {
        return [...result, this.normalizeArrayConfig(numOrArray)];
      }
    });
    return result;
  }

  normalizeComponents(config: OrdinalObjectConfig | OrdinalArrayConfig) {
    if (isObject(config)) {
      config = Object.entries(config as OrdinalObjectConfig).map(
        ([numOrString, numOrArray]) => {
          const num = parseInt(numOrString, 10);
          if (isArray(numOrArray)) return [num, ...numOrArray];
          return [num, numOrArray];
        },
      );
    }
    return this.normalizeArrayConfig(config as OrdinalArrayConfig);
  }

  validate() {
    const range = RuleRanges[this.type];
    this.components.forEach(([ordinal, ordinalDayOfWeek]) => {
      if (range.ordinal) {
        if (ordinal < range.ordinal.min || ordinal > range.ordinal.max) {
          throw Error(
            `Acceptable ordinal range for ${this.type} is from ${range.ordinal.min} to ${range.ordinal.max}.`,
          );
        }
      }
      if (ordinalDayOfWeek < range.min || ordinalDayOfWeek > range.max) {
        throw Error(
          `Acceptable range for ${this.type} is from ${range.min} to ${range.max}.`,
        );
      }
    });
  }

  passes(dayParts: DayParts) {
    const { weekday, weekdayOrdinal, weekdayOrdinalFromEnd } = dayParts;
    return this.components.some(
      ([ordinalWeek, ordinalWeekday]) =>
        (ordinalWeek === weekdayOrdinal ||
          ordinalWeek === -weekdayOrdinalFromEnd) &&
        weekday === ordinalWeekday,
    );
  }
}
