---
sidebarDepth: 2
---

# Date Expressions

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