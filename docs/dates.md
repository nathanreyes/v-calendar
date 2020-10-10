---
sidebarDepth: 2
---

# Working with dates

Understanding how to configure date expressions is a critical part to using VCalendar. Specifically, they are used for the following purposes:

- Determining where and how attributes are displayed
- Disabling date selection by the user
- Setting the selected date(s) for `v-date-picker`

In this guide, a **date expression** may be used to denote any of the following:

* Single Dates
* Date Ranges
* Date Patterns
* Collection of any of the above

## Single Dates

The first type of date expression is a simple native Javascript date object.

Here is an example of using a date to display a simple attribute. We'll get into how to configure attributes in more detail later, but for now we can just focus on the `dates` expression below:

<guide-attributes-highlight/>

```js{8}
...
data() {
  return {
    attributes: [
      {
        key: 'today',
        highlight: true,
        dates: new Date()
      }
    ]
  }
}
```

:::tip
The `dates` key implies that an array should be used. While arrays are allowed, if you pass a single date object, it will get wrapped in an array for you.
:::

## Date Ranges

Date ranges define a range of contiguous dates. They are expressed as a simple object with the following properties:

| Property | Description |
| --- | --- |
| `start` | Start of the date range |
| `end` | End of the date range (optional) |
|`span` | Number of days to extend the range after the start date (optional). This may be used instead of the `end` date. |

<guide-readme-cal-date-ranges/>

```js
  ...
  dates: [
    { start: new Date(2018, 0, 1), end: new Date(2018, 0, 5) },
    { start: new Date(2018, 0, 15), span: 5 } // # of days
  ]
  ...
```

A `null` value denotes an infinite start or end date.

<guide-readme-cal-date-range-no-start/>

```js
  ...
  dates: {
    start: null, // From the beginning of time
    end: new Date() // Until today
  }
  ...
```

Optionally, if using `null` dates, you can omit them entirely.

```js
...
dates: {
  end: new Date() // Same as before
}
...
```

Thus, an empty object is a valid date expression...

<guide-readme-cal-date-range-no-start-end/>

```js
  ...
  // From the beginning of time until the end of time
  dates: {},
  ...
```

## Date Patterns

Date patterns are an extension of date ranges. They can target dates that would be incredibly difficult, if not impossible, to do otherwise with simple dates or date ranges. To configure a date pattern, let's first start with a simple date range.

```js
  ...
  dates: {
    start: new Date(2018, 0, 1),  // Jan 1st, 2018
    end: new Date(2019, 0, 1)     // Jan 1st, 2019
  },
  ...
```

The only thing we need to do to convert this date range into a date pattern is to start adding patterns to it. For this example, we'll just target the weekends.

<guide-readme-cal-date-patterns/>

```js
  ...
  dates: {
    start: new Date(2018, 0, 1),  // Jan 1st, 2018
    end: new Date(2019, 0, 1),    // Jan 1st, 2019
    weekdays: [1, 7]              // ...on Sundays and Saturdays
  },
  ...
```

We can also target other specific day properties, like `days: [6, 15]` for the 6th and 15th of the month, `weeks: [-1]` for the last week of the month and even `ordinalWeekdays: { [-1]: 1 }` for the last Sunday of the month.

For the next example, let's display dot indicators on the last Friday of every other month, starting on January 1st of 2018.

<guide-readme-cal-date-patterns-1 />

```js
...
  attrs: [
    {
      dot: 'red',
      dates: {
        start: new Date('1/1/2018'),
        monthlyInterval: 2,           // Every other month
        ordinalWeekdays: { [-1]: 6 }  // ...on the last Friday
      }
    }
  ]
...
```

*Pretty cool!!* :ok_hand:

Now, for some reason, we also want to target the 15th of every other month (in addition to the last Friday), so this might be our first attempt:

```js{6}
...
dates: {
  start: new Date('1/1/2018'),
  monthlyInterval: 2,           // Every other month
  ordinalWeekdays: { [-1]: 6 }, // ...on the last Friday
  days: 15                      // ...and on the 15th? (WRONG!)
},
...
```

But this would be **wrong**, because all component specifiers are conditionally *anded* with each other. In other words, this would only target the last Friday of every other month that also happened to be on the 15th of the month (which would never occur).

To evaluate a set of conditions *or* another set, we can break the sets of conditions out into an array assigned to the `on` property.

```js{5-8}
...
dates: {
  start: new Date('1/1/2018'),
  monthlyInterval: 2,                 // Every other month
  on: [                               // ...on...
    { ordinalWeekdays: { [-1]: 6 } }, // ...the last Friday
    { days: 15 }                      // ...or the 15th of the month
  ]
}
...
```

Note how we kept the `monthlyInterval` condition outside of the array. Any conditions that should be **anded** with all the others can be extracted out of the array. This prevents unnecessary duplication of conditions within the array.

Here is a complete reference of date component specifiers available.

| Property | Type | Description | Range |
| --- | --- | --- | --- |
| `days` | Number, Array | Day number from the start or end of the month. | 1 to 31, -1 to -31 |
| `weekdays` | Number, Array | Day of the week. | 1: Sun to 7: Sat |
| `ordinalWeekdays` | Object (key: Number / value: Number, Array) | Weekday ordinal position from the start or end of the month. | key: 1 to 6, -1 to -6 / value: 1: Sun to 7: Sat |
| `weeks` | Number, Array | Week number from the start or end of the month. | 1 to 6, -1 to -6 |
| `months` | Number, Array | Months of the year. | 1 to 12 |
| `years` | Number, Array | Year numbers. | 4-digit integer |
| `dailyInterval` | Number | Interval number of days from the start date (or today when no start date provided). | n > 0 |
| `weeklyInterval` | Number | Interval number of weeks from the start date (or today). | n > 0 |
| `monthlyInterval` | Number | Interval number of months from the start date (or today). | n > 0 |
| `yearlyInterval` | Number | Interval number of years from the start date (or today). | n > 0 |

## Collections

Any of the previously mentioned singular date expressions may be combined using an array.

<guide-attributes-multiple-dates/>

```js
  ...
  dates: [
    new Date(2018, 0, 1),
    {
      start: new Date(2018, 0, 10),
      end: new Date(2018, 0, 12)
    },
    new Date(2018, 0, 15),
  ],
  ...
```

## Disabling Dates

:::tip
In pre-v1 versions, dates could only be disabled for `v-date-picker`. Disabling dates are now supported for `v-calendar` as well.
:::

As mentioned earlier, date expressions are not only used to define attributes. They can also be used to "disable" calendar days. Disabled dates have the following effects:

* Day text color has less contrast than normal day cells
* If using `min-date` navigation is disabled for months before specified date
* If using `max-date` navigation is disabled for months after specified date
* Hover, focus and click events are still active for disabled dates

::: tip
Use the `dayContentDisabled` and `dayDisabled` theme settings to customize how disabled days look and behave. For example, a class applied with `pointer-events: none` could disable interaction with disabled dates.
:::

You can disable dates, date ranges and date patterns using the following methods:

### 1. Explicitly via `min-date`

<guide-readme-dp-min-max-dates is-min />

```html
<v-date-picker
  v-model='date'
  :min-date='new Date()'
  />
```

:::tip
When using `min-date`, this also prevents the user from navigating to pages before the date specified.
:::

### 2. Explicitly via `max-date`

<guide-readme-dp-min-max-dates />

```html
<v-date-picker v-model='date' :max-date='new Date()' />
```

:::tip
When using `max-date`, this also prevents the user from navigating to pages after the date specified.
:::

### 3. Explicitly via `disabled-dates`

When using `disabled-dates`, you can use a full date expression to specify a set of disabled dates. That is, a date object, date range object, date pattern or an array of either of these may be used. 

:::tip
`disabled-dates` may be used in combination with the `min-date` and `max-date` props.
:::

<guide-readme-dp-disabled-dates />

```html
<!--Disable weekend selection-->
<v-date-picker
  v-model='date'
  :disabled-dates='{ weekdays: [1, 7] }'
  is-range
  />
```

### 4. Implicitly via `available-dates`.

Any dates not included in `available-dates` are disabled.

<guide-readme-dp-available-dates />

```html
<v-date-picker
  :available-dates='{ start: new Date(), end: null }'
  v-model='date'
  />
```

::: warning
When using `disabled-dates` and `available-dates`, `v-calendar` will not automatically disable page navigation for you, whereas using `min-date` and `max-date` will disable pages that are before `min-date` and after `max-date`.

Use the `min-date`, `min-page`, `max-date` or `max-page` props to manually assign the page bounds when using `disabled-dates` or `available-dates`.
:::

## Include vs Exclude Dates

Currently, there are four places where date expressions are used:
* [`attribute.dates`](/api/attribute.md#dates): Date(s) to display attributes .
* [`attribute.excludeDates`](/api/attribute.html#exclude-dates): Date(s) to NOT display attributes. All other dates are displayed.
* [`disabled-dates`](/api/datepicker.html#disabled-dates) Date(s) to disable for `v-calendar` & `v-date-picker`.
* [`available-dates`](/api/datepicker.html#available-dates) Date(s) to enable for `v-calendar` & `v-date-picker`. All other dates are disabled.

In all places where date expressions are used, you'll notice that they come in pairs. One expression is for the explicit form (`dates`, `disabled-dates`), and the other expression is for the implicit form (`excludeDates`, `available-dates`).

The explicit form is the most direct form of expressing what dates to target.

However, it might be more efficient to express what dates you would like to exclude, or avoid. For example, in `v-date-picker`, if you only want to allow date selections in the month of January of 2018, both of these expressions would work just fine:

```html
<v-date-picker
  v-model='myDate'
  :disabled-dates='[
    {
      start: null,
      end: new Date(2017, 11, 31)
    },
    {
      start: new Date(2018, 1, 1),
      end: null
    }
  ]'
  />
```

```html
<v-date-picker
  v-model='myDate'
  :available-dates='{
    start: new Date(2018, 0, 1),
    end: new Date(2018, 0, 31)
  }'
  />
```

The second expression is more terse and declarative than the first. It even performs slighly better. The point is, just take a second to consider which method is best suited for your application.