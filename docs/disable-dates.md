## Disable Dates

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

## Explicit vs Implicit Dates

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

### Simultaneous Use

We can discuss using both explicit and implicit date expressions by observing the `disabled-dates` and `available-dates` props for `v-date-picker`.

The rules are as follows:

1. If `disabled-dates` is provided and `available-dates` is not, `disabled-dates` is simply evaluated to directly disable calendar days.
2. If `disabled-dates` is NOT provided and `available-dates` is provided, then an infinite disabled date range(`{ start: null, end: null }`) is first added to effectively disable all dates. Then, `available-dates` is evaluted to re-enable the dates it specifies.
3. If `disabled-dates` and `available-dates` are both provided, the `disabled-dates` expression is evaluated first. Then, `available-dates` is evaluated to re-enable any dates not explicitly disabled by `disabled-dates`. Specifying dates in `available-dates` that lie outside the range of any `disabled-dates` has no effect and should be avoided.