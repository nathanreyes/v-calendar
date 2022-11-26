import {
  DayInMonth,
  DayOfWeek,
  WeekInMonth,
  OrdinalWeekInMonth,
  DayParts,
  diffInDays,
  diffInWeeks,
  diffInMonths,
  diffInYears,
  isDayInMonth,
  isDayOfWeek,
  isWeekInMonth,
  isMonthInYear,
  isOrdinalWeekInMonth,
  MonthInYear,
} from './helpers';
import { isArray, isNumber, isObject, isFunction } from '../helpers';

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
export type OrdinalObjectConfig = Record<
  string | number,
  SingleOrArray<DayOfWeek>[]
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
      case IntervalRuleType.Days: {
        return diffInDays(this.from.date, date) % this.interval === 0;
      }
      case IntervalRuleType.Weeks: {
        return diffInWeeks(this.from.date, date) % this.interval === 0;
      }
      case IntervalRuleType.Months: {
        return diffInMonths(this.from.date, date) % this.interval === 0;
      }
      case IntervalRuleType.Years: {
        return diffInYears(this.from.date, date) % this.interval === 0;
      }
      default: {
        return false;
      }
    }
  }
}

export class ComponentRule<T extends number>
  implements Rule<ComponentRuleType>
{
  components: T[] = [];

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
    public validator: (component: unknown) => component is T,
    public getter: (dayParts: DayParts) => T[],
  ) {
    this.components = this.normalizeComponents(components);
  }

  normalizeComponents(components: unknown) {
    if (this.validator(components)) return [components];
    if (!isArray(components)) return [];
    const result: T[] = [];
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

export class DaysRule extends ComponentRule<DayInMonth> {
  constructor(components: unknown) {
    super(
      ComponentRuleType.Days,
      components,
      isDayInMonth,
      ({ day, dayFromEnd }) => [day, -dayFromEnd],
    );
  }
}

export class WeekdaysRule extends ComponentRule<DayOfWeek> {
  constructor(components: unknown) {
    super(
      ComponentRuleType.Weekdays,
      components,
      isDayOfWeek,
      ({ weekday }) => [weekday],
    );
  }
}

export class WeeksRule extends ComponentRule<WeekInMonth> {
  constructor(components: unknown) {
    super(
      ComponentRuleType.Weeks,
      components,
      isWeekInMonth,
      ({ week, weekFromEnd }) => [week, -weekFromEnd],
    );
  }
}

export class MonthsRule extends ComponentRule<MonthInYear> {
  constructor(components: unknown) {
    super(ComponentRuleType.Months, components, isMonthInYear, ({ month }) => [
      month,
    ]);
  }
}

export class YearsRule extends ComponentRule<number> {
  constructor(components: unknown) {
    super(ComponentRuleType.Years, components, isNumber, ({ year }) => [year]);
  }
}

export class OrdinalComponentRule implements Rule<OrdinalComponentRuleType> {
  components: [OrdinalWeekInMonth, DayOfWeek][];

  constructor(
    public type: OrdinalComponentRuleType,
    components: OrdinalObjectConfig | OrdinalArrayConfig,
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
  validated = true;

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
