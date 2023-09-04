import { isArray, isFunction, isNumber } from '../helpers';
import {
  type DayOfWeek,
  type DayParts,
  type OrdinalWeekInMonth,
  diffInDays,
  diffInMonths,
  diffInWeeks,
  diffInYears,
  isDayInMonth,
  isDayOfWeek,
  isMonthInYear,
  isOrdinalWeekInMonth,
  isWeekInMonth,
} from './helpers';

export type SingleOrArray<T> = T | T[];

export enum GroupRuleType {
  Any = 'any',
  All = 'all',
}

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

export enum FunctionRuleType {
  Function = 'function',
}

export type RuleType =
  | GroupRuleType
  | IntervalRuleType
  | ComponentRuleType
  | OrdinalComponentRuleType
  | FunctionRuleType;

export type OrdinalArrayConfig = SingleOrArray<
  [OrdinalWeekInMonth, ...DayOfWeek[]]
>;

export interface Rule<T> {
  type: T;
  passes(dayParts: DayParts): boolean;
}

export class IntervalRule implements Rule<IntervalRuleType> {
  private validated = true;

  constructor(
    public type: IntervalRuleType,
    public interval: number,
    public from: DayParts,
  ) {
    // Start date needed for interval rules
    if (!this.from) {
      console.error(
        `A valid "from" date is required for date interval rule. This rule will be skipped.`,
      );
      this.validated = false;
    }
  }

  passes(dateParts: DayParts) {
    if (!this.validated) return true;

    const { date } = dateParts;
    switch (this.type) {
      case 'days': {
        return diffInDays(this.from.date, date) % this.interval === 0;
      }
      case 'weeks': {
        return diffInWeeks(this.from.date, date) % this.interval === 0;
      }
      case 'months': {
        return diffInMonths(this.from.date, date) % this.interval === 0;
      }
      case 'years': {
        return diffInYears(this.from.date, date) % this.interval === 0;
      }
      default: {
        return false;
      }
    }
  }
}

export class ComponentRule implements Rule<ComponentRuleType> {
  components: number[] = [];

  static create(type: ComponentRuleType, config: unknown) {
    switch (type) {
      case ComponentRuleType.Days:
        return new DaysRule(config);
      case ComponentRuleType.Weekdays:
        return new WeekdaysRule(config);
      case ComponentRuleType.Weeks:
        return new WeeksRule(config);
      case ComponentRuleType.Months:
        return new MonthsRule(config);
      case ComponentRuleType.Years:
        return new YearsRule(config);
    }
  }

  constructor(
    public type: ComponentRuleType,
    components: unknown,
    public validator: (component: unknown) => component is number,
    public getter: (dayParts: DayParts) => number[],
  ) {
    this.components = this.normalizeComponents(components);
  }

  normalizeComponents(components: unknown) {
    if (this.validator(components)) return [components];
    if (!isArray(components)) return [];
    const result: number[] = [];
    components.forEach(component => {
      if (!this.validator(component)) {
        console.error(
          `Component value ${component} in invalid for "${this.type}" rule. This rule will be skipped.`,
        );
        return;
      }
      result.push(component);
    });
    return result;
  }

  passes(dayParts: DayParts) {
    const comps = this.getter(dayParts);
    const result = comps.some(comp => this.components.includes(comp));
    return result;
  }
}

export class DaysRule extends ComponentRule {
  constructor(components: unknown) {
    super(
      ComponentRuleType.Days,
      components,
      isDayInMonth,
      ({ day, dayFromEnd }) => [day, -dayFromEnd],
    );
  }
}

export class WeekdaysRule extends ComponentRule {
  constructor(components: unknown) {
    super(
      ComponentRuleType.Weekdays,
      components,
      isDayOfWeek,
      ({ weekday }) => [weekday],
    );
  }
}

export class WeeksRule extends ComponentRule {
  constructor(components: unknown) {
    super(
      ComponentRuleType.Weeks,
      components,
      isWeekInMonth,
      ({ week, weekFromEnd }) => [week, -weekFromEnd],
    );
  }
}

export class MonthsRule extends ComponentRule {
  constructor(components: unknown) {
    super(ComponentRuleType.Months, components, isMonthInYear, ({ month }) => [
      month,
    ]);
  }
}

export class YearsRule extends ComponentRule {
  constructor(components: unknown) {
    super(ComponentRuleType.Years, components, isNumber, ({ year }) => [year]);
  }
}

export class OrdinalComponentRule implements Rule<OrdinalComponentRuleType> {
  components: [OrdinalWeekInMonth, DayOfWeek][];

  constructor(
    public type: OrdinalComponentRuleType,
    components: OrdinalArrayConfig,
  ) {
    this.components = this.normalizeComponents(components);
  }

  normalizeArrayConfig(config: OrdinalArrayConfig) {
    const result: [OrdinalWeekInMonth, DayOfWeek][] = [];
    config.forEach((numOrArray, i) => {
      if (isNumber(numOrArray)) {
        if (i === 0) return;
        if (!isOrdinalWeekInMonth(config[0])) {
          console.error(
            `Ordinal range for "${this.type}" rule is from -5 to -1 or 1 to 5. This rule will be skipped.`,
          );
          return;
        }
        if (!isDayOfWeek(numOrArray)) {
          console.error(
            `Acceptable range for "${this.type}" rule is from 1 to 5. This rule will be skipped`,
          );
          return;
        }
        result.push([config[0], numOrArray]);
      } else if (isArray(numOrArray)) {
        result.push(...this.normalizeArrayConfig(numOrArray));
      }
    });
    return result;
  }

  normalizeComponents(config: OrdinalArrayConfig) {
    const result: [OrdinalWeekInMonth, DayOfWeek][] = [];
    config.forEach((numOrArray, i) => {
      if (isNumber(numOrArray)) {
        if (i === 0) return;
        if (!isOrdinalWeekInMonth(config[0])) {
          console.error(
            `Ordinal range for "${this.type}" rule is from -5 to -1 or 1 to 5. This rule will be skipped.`,
          );
          return;
        }
        if (!isDayOfWeek(numOrArray)) {
          console.error(
            `Acceptable range for "${this.type}" rule is from 1 to 5. This rule will be skipped`,
          );
          return;
        }
        result.push([config[0], numOrArray]);
      } else if (isArray(numOrArray)) {
        result.push(...this.normalizeArrayConfig(numOrArray));
      }
    });
    return result;
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

export class FunctionRule implements Rule<FunctionRuleType> {
  type = FunctionRuleType.Function;
  private validated = true;

  constructor(public fn: Function) {
    if (!isFunction(fn)) {
      console.error(
        `The function rule requires a valid function. This rule will be skipped.`,
      );
      this.validated = false;
    }
  }

  passes(dayParts: DayParts) {
    if (!this.validated) return true;

    return this.fn(dayParts);
  }
}
