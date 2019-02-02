---
title: 'Page Object'
sidebarDepth: 2
pageClass: docs-page
---

## `position`

**Type:** Number

**Description:** Position of the the pane that contains this page (`0`: single-paned, `1`: double-paned, left side, `2`: double-paned, right side).

## `month`

**Type:** Number

**Description:** Page month number.

## `year`

**Type:** Number

**Description:** Page year number.

## `monthLabel`

**Type:** String

**Description:** Page month label as specified by the `monthLabels` prop or locale settings.

## `shortMonthLabel`

**Type:** String

**Description:**  Shortened month label as specified by the `shortMonthLabels` prop or locale settings.

## `yearLabel`

**Type:** String

**Description:** Page year label in YYYY format.

## `shortYearLabel`

**Type:** String

**Description:** Page year label in YY format.

## `monthComps`

**Type:** Object

**Description:** Components of the current page month.

## `prevMonthComps`

**Type:** Object

**Description:** Components of the previous page month.

## `nextMonthComps`

**Type:** Object

**Description:** Components of the next page page.

## `canMove(Object) => Boolean`

**Type:** Function

**Description:** Function that determines if calendar can move to a desired page (due to `min-page` or `max-page` setting).

## `move(Object)`

**Type:** Function

**Description:** Function that moves to the specified page.

## `moveThisMonth()`

**Type:** Function

**Description:** Function that moves to the page for today's month.

## `movePrevMonth()`

**Type:** Function

**Description:** Function that moves to the page for the previous month.

## `moveNextMonth()`

**Type:** Function

**Description:** Function that moves to the page for the next month.

<!--
## 

**Type:** 

**Description:** 
-->
