type ConstraintType =
  | 'MIN_DURATION'
  | 'MAX_DURATION'
  | 'BEFORE_DAY'
  | 'AFTER_DAY'
  | 'OUTSIDE_DAY';

type ConstraintRecovery = false | 'RESIZE';

interface ConstraintOptions {
  durationMinutes?: number;
  recover: ConstraintRecovery;
}

export interface Constraint {
  type: ConstraintType;
  options?: ConstraintOptions;
}

export class Constraints {
  constraints: Constraint[];

  constructor(constraints: Constraint[]) {
    this.constraints = constraints.filter(c => this.validConstraint(c));
  }

  validConstraint(constraint: Constraint) {
    switch (constraint.type) {
      case 'MIN_DURATION':
      case 'MAX_DURATION': {
        if (!constraint.options?.durationMinutes) {
          console.error(
            `Invalid constraint option for ${constraint.type}. Missing duration.`,
          );
          return false;
        }
      }
    }
  }
}
