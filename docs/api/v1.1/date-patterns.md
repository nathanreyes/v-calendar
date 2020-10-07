---
title: Date Patterns
sidebarDepth: 2
pageClass: docs-page
---

## Date Patterns

### `days`

**Type:** Number, Array

**Description:** Day number from the start or end of the month.

**Range:** 1 to 31, -1 to -31

### `weekdays`

**Type:** Number, Array

**Description:** Day of the week.

**Range:** 1: Sun to 7: Sat

### `ordinalWeekdays`

**Type:** Object (key: Number / value: Number, Array)

**Description:** Weekday ordinal position from the start or end of the month.

**Range:**  
  * key: 1 to 6, -1 to -6
  * value: 1: Sun to 7: Sat

### `weeks`

**Type:** Number, Array

**Description:** Week number from the start or end of the month.

**Range:** 1 to 6, -1 to -6

### `months`

**Type:** Number, Array

**Description:** Months of the year.

**Range:** 1 to 12

### `years`

**Type:** Number, Array

**Description:** Year numbers.

**Range:** 4-digit integer

### `dailyInterval`

**Type:** Number

**Description:** Interval number of days from the start date (or today when no start date provided).

**Range:** n > 0

### `weeklyInterval`

**Type:** Number

**Description:** Interval number of weeks from the start date (or today).

**Range:** n > 0

### `monthlyInterval`

**Type:** Number

**Description:** Interval number of months from the start date (or today).

**Range:** n > 0

### `yearlyInterval`

**Type:** Number

**Description:** Interval number of years from the start date (or today).

**Range:** n > 0
