---
title: Date Picker | Date Types
---

# Date Types

*Introduced in **`v2.0.0`***

The `model-config` prop is used to provide information about the date bound to `v-date-picker`. For example, if the date you provide is stored in a database as a string, this string value can be bound to `v-date-picker` directly, without any extra conversion logic required by your application.

In short, the `model-config` and `timezone` props help provide a no-hassle approach to working with your data.

### Strings

To bind to a string value, provide a `model-config` with the necessary `type: 'string'` and `mask` properties.

<!-- <guide-datepicker-model-string /> -->

```html
<v-date-picker
  v-model="customer.birthday"
  :model-config="modelConfig"
  is-required
  />
```

```js
export default {
  data() {
    return {
      customer: {
        name: 'Nathan Reyes',
        birthday: '1983-01-21',
      },
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DD', // Uses 'iso' if missing
      },
    }
  }
};
```

### Numbers

To bind to a number value, provide a `model-config` with the necessary `type: 'number'` property.

<!-- <guide-datepicker-model-number /> -->

```html
<v-date-picker v-model="customer.birthday" :model-config="modelConfig" />
```

```js
export default {
  data() {
    return {
      customer: {
        name: 'Nathan Reyes',
        birthday: 411976800000, // Milliseconds since 1 January 1970 
      },
      modelConfig: {
        type: 'number',
      },
    }
  }
};
```

### Time Adjust

By default, when the user selects a new date, it leaves the existing time value. To auto-adjust the time for selected dates, provide a `model-config` with the desired `timeAdjust` setting in `HH:mm:ss` format. All times use the specified `timezone`, or local timezone if none is provided.

This example assigns the time of selected dates to noon in the browser's local timezone.

<!-- <guide-datepicker-time-adjust /> -->

```html
<v-date-picker v-model="date" :model-config="modelConfig">
```

```js
data() {
  return {
    customer: {
      name: 'Nathan Reyes',
      birthday: '1983-01-21T02:30:00-5:00',
    },
    modelConfig: {
      type: 'string',
      mask: 'YYYY-MM-DDTHH:mm:ssXXX',
      timeAdjust: '12:00:00',
    },
  }
}
```

| Time Setting | Description |
| --- | --- |
| *`HH:MM:SS`* | Custom time in `HH:MM:SS` format |
| `now` | Assign to the instant of date selection. |

#### Adjust Date Range Times

When used with date ranges, the `modelConfig` may be specified as an object with `start` and `end` properties. For example, when the users selects a date range, we might want to set the selected range to start at the very beginning of the first day until the end of the last day.

<!-- <guide-datepicker-time-adjust-range /> -->

```html
<v-date-picker v-model="range" :model-config="modelConfig">
```

```js
data() {
  return {
    range: {
      start: new Date(2020, 0, 6),
      end: new Date(2020, 0, 9),
    },
    modelConfig: {
      start: {
        timeAdjust: '00:00:00',
      },
      end: {
        timeAdjust: '23:59:59',
      },
    },
  }
}
```