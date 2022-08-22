---
title: Date Picker | Selection Modes
---

# Selection Modes

`DatePicker` can be

Use the `mode` prop to switch between 3 different date selection modes: `date`, `dateTime` and `time`.

## Date

To limit user selection to only date components (month, day, year), use `mode: 'date'`. This is the default prop value, so it isn't explicitly required.

<DateWithValue mode="date" />

```html
<DatePicker mode="date" v-model="date" />
```

## Date & Time

To allow user selection of date and time components, use `mode: 'dateTime'`. A time picker now appears below the calendar.

<BaseAlert info>
  Time components are set using the current timezone setting set by the `timezone` prop. By default, this value is `undefined`, which specifies the local timezone.
</BaseAlert>

<DateWithValue mode="dateTime" />

```html
<div>
  <div class="flex mb-2">
    <label class="text-gray-600 font-medium"><input class="mr-1" type="radio" value="" v-model="timezone">Local</label>
    <label class="text-gray-600 font-medium ml-3"><input class="mr-1" type="radio" value="utc" v-model="timezone">UTC</label>
  </div>
  <v-date-picker v-model="date" mode="dateTime" :timezone="timezone" />
</div>
```

```js
data() {
  return {
    date: new Date(),
    timezone: '',
  }
}
```

### 24-hr Mode

Use the `is24hr` prop to adjust the hour `select` element and default input format for 24-hr mode.

<!-- <guide-datepicker-24hr /> -->

```html
<v-date-picker v-model="date" mode="dateTime" is24hr>
  <template v-slot="{ inputValue, inputEvents }">
    <input
      class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
      :value="inputValue"
      v-on="inputEvents"
    />
  </template>
</v-date-picker>
```

```js
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
```

### Minute Increments

Use the `minute-increment` prop to set custom intervals for the minute `select` options.

<!-- <guide-datepicker-minute-increment /> -->

```html
<v-date-picker v-model="date" mode="dateTime" :minute-increment="5" />
```

```js
export default {
  data() {
    let date = new Date();
    date.setMinutes(0, 0, 0);
    return {
      date,
    };
  },
};
```

<BaseAlert warning>
If the bound date does not match of the the minute options derived by the `minute-increment` amount, the accurate `minute` amount will be displayed, but this option will be disabled.
</BaseAlert>

## Time

To limit user selction to only time components (hours, minutes, seconds), use `mode: 'time'`.

<DateWithValue mode="time" />

```html
<div>
  <div class="flex mb-2" v-if="mode !== 'date'">
    <label class="text-gray-600 font-medium"><input class="mr-1" type="radio" value="" v-model="timezone">Local</label>
    <label class="text-gray-600 font-medium ml-3"><input class="mr-1" type="radio" value="utc" v-model="timezone">UTC</label>
  </div>
  <v-date-picker mode="time" v-model="date" :timezone="timezone" />
  <div class="flex items-baseline mt-2">
    <span class="text-gray-600 font-semibold tracking-wide">Date (ISO):</span>
    <span class="text-gray-800 ml-2">{{ date.toISOString() }}</span>
  </div>
</div>
```

```js
export default {
  data() {
    return {
      date: new Date(),
      timezone: '',
    };
  },
}
```