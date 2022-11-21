import {
  DayOfWeek,
  WeekInMonth,
  DayParts,
  diffInDays,
  diffInWeeks,
  diffInMonths,
  diffInYears,
} from './helpers';
import { isArray, isNumber, isObject } from '../helpers';

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

export type RuleType =
  | GroupRuleType
  | IntervalRuleType
  | ComponentRuleType
  | OrdinalComponentRuleType;

export type OrdinalObjectConfig = Record<string | number, number | number[]>;
export type OrdinalArrayConfig = number[] | number[][];

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
  validate(): void;
  passes(dayParts: DayParts): boolean;
}

export class IntervalRule implements Rule<IntervalRuleType> {
  private validated = true;

  constructor(
    public type: IntervalRuleType,
    public interval: number,
    public from: DayParts,
  ) {
    this.validate();
  }

  validate() {
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

export class ComponentRule implements Rule<ComponentRuleType> {
  private validated = true;
  components: number[] = [];

  constructor(public type: ComponentRuleType, components: number | number[]) {
    this.components = isArray(components) ? components : [components];
    this.validate();
  }

  validate() {
    const range = RuleRanges[this.type];
    this.components.forEach(component => {
      if (component < range.min || component > range.max) {
        console.error(
          `Acceptable range for "${this.type}" rule is from ${range.min} to ${range.max}. This rull will be skipped.`,
        );
        this.validated = false;
      }
    });
  }

  getComponentsToTest(dayParts: DayParts) {
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
    if (!this.validated) return true;

    const comps = this.getComponentsToTest(dayParts);
    const result = comps.some(comp => this.components.includes(comp));
    return result;
  }
}

export class OrdinalComponentRule implements Rule<OrdinalComponentRuleType> {
  private validated = true;
  components: [WeekInMonth, DayOfWeek][];

  constructor(
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
          console.error(
            `Acceptable ordinal range for "${this.type}" rule is from ${range.ordinal.min} to ${range.ordinal.max}.`,
          );
          this.validated = false;
        }
      }
      if (ordinalDayOfWeek < range.min || ordinalDayOfWeek > range.max) {
        console.error(
          `Acceptable range for "${this.type}" rule is from ${range.min} to ${range.max}. This rule will be skipped`,
        );
        this.validated = false;
      }
    });
  }

  passes(dayParts: DayParts) {
    if (!this.validated) return false;

    const { weekday, weekdayOrdinal, weekdayOrdinalFromEnd } = dayParts;
    return this.components.some(
      ([ordinalWeek, ordinalWeekday]) =>
        (ordinalWeek === weekdayOrdinal ||
          ordinalWeek === -weekdayOrdinalFromEnd) &&
        weekday === ordinalWeekday,
    );
  }
}
