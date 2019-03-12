## Working With Dates

Understanding how to configure dates and date patterns is a critical part to using attributes. In this section, we'll cover all the options that are at your disposal to efficiently display attributes.

::: tip
Wrapping dates into an array is only required if need to use one or more dates. If you wish to assign a single date, the array isn't necessary (although it is still allowed).
:::

Currently, there are four props where you can use date expressions:
  * [`dates`](/api/attribute.md#dates): Date or date range objects (patterns supported) to include for the attributes.
  * [`exclude-dates`](/api/attribute.html#excludedates): Date or date range objects (patterns supported) to exclude for attributes. All other dates are included.
  * [`disabled-dates`](/api/datepicker.html#disabled-dates) Disabled dates for `v-date-picker`.
  * [`available-dates`](/api/datepicker.html#available-dates) Available dates for `v-date-picker`. All other dates are disabled.

### Explicit vs Implicit

In both occasions where date expressions are used (attributes and `v-date-picker`), you'll notice that they come in pairs. One expression is for the explicit form (`dates` for attributes, `disabled-dates` for `v-date-picker`), and the other expression is for the implicit form (`exclude-dates` for attributes, `available-dates` for `v-date-picker`).

The explicit form is the most direct form of expressing what dates you want; you give it the date and the calendar displays the attribute on (or the date picker disables) that date.

However, it might be more efficient to express what dates you would like to exclude, or avoid. For example, in `v-date-picker`, if you only want to allow date selections in the month of January of 2018, both of these expressions would work:

```html
<v-date-picker
  v-model='myDate'
  :disabled-dates='[{ start: null, end: new Date(2017, 11, 31)}, { start: new Date(2018, 1, 1), end: null }]'>
</v-date-picker>
```

```html
<v-date-picker
  v-model='myDate'
  :available-dates='{ start: new Date(2018, 0, 1), end: new Date(2018, 0, 31) }'>
</v-date-picker>
```

As you can see, the second expression is more terse and declarative than the first. It even performs slighly better. The point is, just take a second to consider which method is best suited for your application.

### Simple Dates

The first kind of date expression allowed is a simple native Javascript date object. It is the most simple, and perhaps most common, way to configure `dates` for an attribute. Here is an example of displaying an attribute on today's date.

```javascript
...
data() {
  return {
    attributes: [
      {
        key: 'today',
        highlight: {
          ...
        },
        contentStyle: {
          ...
        },
        dates: new Date()
      }
    ]
  }
}
```

### Date Ranges

The second kind of date expression allowed is date ranges. They are expressed as a simple object with optionally defined start and end dates. For example, here is a date range for the month of January, 2018.

```javascript
{
  start: new Date(2018, 0, 1),
  end: new Date(2018, 0, 31)
}
```

If you would like to to specify an infinite start or end date, use a `null` value.

```javascript
{
  start: null, // From the beginning of time
  end: new Date() // Until today
}
```

Optionally, if using `null` dates, you can omit them entirely.

```javascript
{ end: new Date() } // Same as before
```

So an empty object is totally valid...

```javascript
{ } // From the beginning of time to the end of time
```

### Date Patterns

The third kind of date expression is date patterns. They can target dates that would be incredibly difficult, if not impossible, to do otherwise with simple dates or date ranges. To configure a date pattern, let's first start with a date range.

```javascript
{
  start: new Date(2018, 0, 1),  // Jan 1st, 2018
  end: new Date(2019, 0, 1)     // Jan 1st, 2019
}
```

The only thing we need to do to convert this date range into a date pattern is to start adding patterns to it. For this simple example, we'll just target the weekends.

```javascript
{
  start: new Date(2018, 0, 1),  // Jan 1st, 2018
  end: new Date(2019, 0, 1)     // Jan 1st, 2019
  weekdays: [1, 7]              // ...on Sundays and Saturdays
}
```

We can also target other specific day properties, like `days: [6, 15]` for the 6th and 15th of the month, `weeks: [-1]` for the last week of the month and even `ordinalWeekdays: { [-1]: 1 }` for the last Sunday of the month.

Consider another example of displaying dot indicators on the last Friday of every other month, starting on January 1st of 2018. We could do so like this.

```javascript
...
  attrs: [
    {
      dot: { backgroundColor: 'red' },
      dates: {
        start: new Date('1/1/2018'),
        monthlyInterval: 2,           // Every other month
        ordinalWeekdays: { [-1]: 6 }  // ...on the last Friday
      }
    }
  ]
...
```

Now, for some reason, we also want to display them on the 15th of every other month, so our first attempt might be to modify the dates to this:

```javascript
...
dates: {
  start: new Date('1/1/2018'),
  monthlyInterval: 2,           // Every other month
  ordinalWeekdays: { [-1]: 6 }, // ...on the last Friday
  days: 15                      // ...and on the 15th? (WRONG!)
},
...
```

But this would be **wrong**, because all component specifiers are conditionally *anded* with each other.

To evaluate a set of conditions *or* another set, we can break the sets of conditions out into an array assigned to the `on` property.

```javascript
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

Note how we kept the `monthlyInterval` condition outside of the others. Any conditions that should be **anded** with all the others can be extracted out of the array. This prevents unnecessary duplication of conditions within the array.

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