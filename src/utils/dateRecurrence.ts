import { isArray } from './helpers';

type OnWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type OnWeek = -6 | -5 | -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4 | 5 | 6;
type OnMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type IntervalRuleType =
  | 'dailyInterval'
  | 'weeklyInterval'
  | 'monthlyInterval'
  | 'yearlyInterval';

type ComponentRuleType =
  | 'weekdays'
  | 'daysInMonth'
  | 'weeksInMonth'
  | 'weeksInYear'
  | 'monthsInYear';

type OrdinalComponentRuleType =
  | 'ordinalWeekdaysInMonth'
  | 'ordinalWeekdaysInYear';

type RuleType = IntervalRuleType | ComponentRuleType | OrdinalComponentRuleType;

interface DateRecurrenceRules extends Record<RuleType, any> {
  dailyInterval: number;
  weeklyInterval: number;
  monthlyInterval: number;
  yearlyInterval: number;
  days: number[];
  weekdays: OnWeekday[];
  weeks: OnWeek[];
  months: OnMonth[];
  years: number[];
  on: Array<DateRecurrenceRules>;
}

export interface DateRecurrenceConfig extends DateRecurrenceRules {
  start: Date | null;
  until?: Date;
  count?: number;
  startOfWeek?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

const INTERVAL_RULE_TYPES: IntervalRuleType[] = [
  'dailyInterval',
  'weeklyInterval',
  'monthlyInterval',
  'yearlyInterval',
];

const COMPONENT_RULE_TYPES: ComponentRuleType[] = [
  'weekdays',
  'daysInMonth',
  'weeksInMonth',
  'weeksInYear',
  'monthsInYear',
];

const ORDINAL_RULE_TYPES: OrdinalComponentRuleType[] = [
  'ordinalWeekdaysInMonth',
  'ordinalWeekdaysInYear',
];

interface ComponentRuleRange {
  min: number;
  max: number;
  ordinal?: ComponentRuleRange;
}

const RuleRanges: Record<
  ComponentRuleType | OrdinalComponentRuleType,
  ComponentRuleRange
> = {
  weekdays: { min: 1, max: 7 },
  daysInMonth: { min: 1, max: 31 },
  weeksInMonth: { min: 1, max: 5 },
  ordinalWeekdaysInMonth: { ordinal: { min: 1, max: 5 }, min: 1, max: 5 },
  weeksInYear: { min: 1, max: 53 },
  ordinalWeekdaysInYear: { ordinal: { min: 1, max: 5 }, min: 1, max: 5 },
  monthsInYear: { min: 1, max: 12 },
};

class Rule {
  recurrence: DateRecurrence;
  type: RuleType;

  constructor(recurrence: DateRecurrence, type: RuleType) {
    this.recurrence = recurrence;
    this.type = type;
  }
}

class IntervalRule extends Rule {
  declare type: IntervalRuleType;
  interval: number;

  constructor(
    recurrence: DateRecurrence,
    type: IntervalRuleType,
    interval: number,
  ) {
    super(recurrence, type);
    this.interval = interval;
    this.validate();
  }

  validate() {
    // Start date needed for interval rules
    if (!this.recurrence.start) {
      throw Error(
        'You can only set an interval if this recurrence has a start date.',
      );
    }
  }
}

class ComponentRule extends Rule {
  declare type: ComponentRuleType;
  components: number[] = [];

  constructor(
    recurrence: DateRecurrence,
    type: ComponentRuleType,
    components: number | number[],
  ) {
    super(recurrence, type);
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
}

class OrdinalComponentRule extends Rule {
  declare type: OrdinalComponentRuleType;
  components: [number[]];

  constructor(
    recurrence: DateRecurrence,
    type: OrdinalComponentRuleType,
    components: [number[]],
  ) {
    super(recurrence, type);
    this.components = components;
    this.validate();
  }

  validate() {
    const range = RuleRanges[this.type];
    this.components.forEach(([ordinal, ...components]) => {
      if (range.ordinal) {
        if (ordinal < range.ordinal.min || ordinal > range.ordinal.max) {
          throw Error(
            `Acceptable ordinal range for ${this.type} is from ${range.ordinal.min} to ${range.ordinal.max}.`,
          );
        }
      }
      components.forEach(component => {
        if (component < range.min || component > range.max) {
          throw Error(
            `Acceptable range for ${this.type} is from ${range.min} to ${range.max}.`,
          );
        }
      });
    });
  }
}

export class DateRecurrence {
  start: Date | null = null;
  until: Date | null = null;
  count = NaN;
  startOfWeek: number;
  rules: Rule[] = [];

  constructor(config: DateRecurrenceConfig) {
    this.start = config.start || null;
    this.until = config.until || null;
    this.count = config.count || NaN;

    // Assign start of week
    if (config.startOfWeek) {
      const startOfWeek = config.startOfWeek;
      if (startOfWeek < 1 || startOfWeek > 7) {
        throw Error('Start of week must be between 1 and 7.');
      }
      this.startOfWeek = startOfWeek;
    } else {
      // Default to Sunday as start of week
      this.startOfWeek = 1;
    }

    // Add interval rules
    INTERVAL_RULE_TYPES.forEach(type => {
      if (!(type in config)) return;
      this.rules.push(new IntervalRule(this, type, config[type]!));
    });

    // Add component rules
    COMPONENT_RULE_TYPES.forEach(type => {
      if (!(type in config)) return;
      this.rules.push(new ComponentRule(this, type, config[type]));
    });

    // Add ordinal component rules
    ORDINAL_RULE_TYPES.forEach(type => {
      if (!(type in config)) return;
      this.rules.push(new OrdinalComponentRule(this, type, config[type]));
    });
  }
}

// static get patterns() {
//   return {
//     dailyInterval: {
//       test: (day: DateParts, interval: number, di: DateInfo) =>
//         di.diffInDays(di.start || new Date(), day.date) % interval === 0,
//     },
//     weeklyInterval: {
//       test: (day: DateParts, interval: number, di: DateInfo) =>
//         di.diffInWeeks(di.start || new Date(), day.date) % interval === 0,
//     },
//     monthlyInterval: {
//       test: (day: DateParts, interval: number, di: DateInfo) =>
//         di.diffInMonths(di.start || new Date(), day.date) % interval === 0,
//     },
//     yearlyInterval: {
//       test: () => (day: DateParts, interval: number, di: DateInfo) =>
//         di.diffInYears(di.start || new Date(), day.date) % interval === 0,
//     },
//     days: {
//       validate: days => (isArray(days) ? days : [parseInt(days, 10)]),
//       test: (day: DateParts, days) =>
//         days.includes(day.day) || days.includes(-day.dayFromEnd),
//     },
//     weekdays: {
//       validate: weekdays =>
//         isArray(weekdays) ? weekdays : [parseInt(weekdays, 10)],
//       test: (day: DateParts, weekdays) => weekdays.includes(day.weekday),
//     },
//     ordinalWeekdays: {
//       validate: ordinalWeekdays =>
//         Object.keys(ordinalWeekdays).reduce((obj, ck) => {
//           const weekdays = ordinalWeekdays[ck];
//           if (!weekdays) return obj;
//           obj[ck] = isArray(weekdays) ? weekdays : [parseInt(weekdays, 10)];
//           return obj;
//         }, {}),
//       test: (day: DateParts, ordinalWeekdays) =>
//         Object.keys(ordinalWeekdays)
//           .map(k => parseInt(k, 10))
//           .find(
//             k =>
//               ordinalWeekdays[k].includes(day.weekday) &&
//               (k === day.weekdayOrdinal || k === -day.weekdayOrdinalFromEnd),
//           ),
//     },
//     weekends: {
//       validate: config => config,
//       test: (day: DateParts) => day.weekday === 1 || day.weekday === 7,
//     },
//     workweek: {
//       validate: config => config,
//       test: (day: DateParts) => day.weekday >= 2 && day.weekday <= 6,
//     },
//     weeks: {
//       validate: weeks => (isArray(weeks) ? weeks : [parseInt(weeks, 10)]),
//       test: (day: DateParts, weeks: number[]) =>
//         weeks.includes(day.week) || weeks.includes(-day.weekFromEnd),
//     },
//     months: {
//       validate: months => (isArray(months) ? months : [parseInt(months, 10)]),
//       test: (day: DateParts, months: number[]) => months.includes(day.month),
//     },
//     years: {
//       validate: years => (isArray(years) ? years : [parseInt(years, 10)]),
//       test: (day: DateParts, years: number[]) => years.includes(day.year),
//     },
//   };
// }

// static get patternProps() {
//   return Object.keys(DateInfo.patterns).map(k => ({
//     name: k,
//     validate: DateInfo.patterns[k].validate,
//   }));
// }

// static testConfig(config, day, dateInfo) {
//   // if (isFunction(config)) return config(day);
//   if (isObject(config)) {
//     return Object.keys(config).every(k =>
//       DateInfo.patterns[k].test(day, config[k], dateInfo),
//     );
//   }
//   return null;
// }

// diffInDays(d1: Date, d2: Date) {
//   return Math.round((d2.getTime() - d1.getTime()) / millisecondsPerDay);
// }

// diffInWeeks(d1: Date, d2: Date) {
//   return this.diffInDays(this.startOfWeek(d1), this.startOfWeek(d2));
// }

// diffInYears(d1: Date, d2: Date) {
//   return d2.getUTCFullYear() - d1.getUTCFullYear();
// }

// diffInMonths(d1: Date, d2: Date) {
//   return this.diffInYears(d1, d2) * 12 + (d2.getMonth() - d1.getMonth());
// }
