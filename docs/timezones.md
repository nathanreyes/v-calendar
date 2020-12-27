---
title: 'Timezones (Beta) :tada:'
sidebarDepth: 2
---

# Timezones (Beta)

:::warning
While multiple tests have been written for timezone support, it still may be supported differently across different browsers.
:::

Timezones are supported for both `v-date-picker` and `v-calendar` via the [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). To assign a timezone, pass the `timezone: String` prop with the desired timezone setting. Reference this [stack overflow](https://stackoverflow.com/questions/38399465/how-to-get-list-of-all-timezones-in-javascript) question for a base list of available timezones.

By default, the `timezone` prop is `undefined`, which defaults to using the browser's local timezone.

## UTC

In addition to the timezones supported, `UTC` may be used for the Coordinated Universal Time setting.

## Calendar Attributes

In `v-calendar`, the timezone is used to set the beginning and ending time boundaries for each calendar day. As a result, a calendar attribute that displays for a user in one timezone may display differently in another timezone.

<guide-timezones-range />

```html
<div>
  <v-calendar
    :from-page="{ month: 10, year: 2020 }"
    :timezone="timezone"
    :attributes="attrs"
    />
  <div class="w-full mt-4">
    <div class="flex justify-between w-full">
      <span class="text-sm font-bold text-gray-800">-11:00</span>
      <span class="text-sm font-bold text-gray-800">UTC</span>
      <span class="text-sm font-bold text-gray-800">+11:00</span>
    </div>
    <input
      class="w-full"
      type="range"
      min="0"
      :max="timezones.length - 1"
      v-model="timezoneIndex"
    />
    <div class="flex">
      <span class="font-semibold text-gray-600 mr-2">Timezone:</span>
      <span class="text-gray-900">{{ timezone }}</span>
    </div>
  </div>
</div>
```

```js
export default {
  data() {
    return {
      timezoneIndex: 0,
      timezones: [
        'Pacific/Niue', // -11
        'US/Hawaii', // -10
        'America/Anchorage', // -9
        'America/Los_Angeles', // -8
        'America/Boise', // -7
        'America/Chicago', // -6
        'America/New_York', // -5
        'America/Aruba', // -4
        'America/Buenos_Aires', // -3
        'Brazil/DeNoronha', // -2,
        'Atlantic/Azores', // -1
        'UTC', // 0
        'Europe/Amsterdam', // +1
        'Europe/Athens', // +2
        'Europe/Moscow', // +3
        'Indian/Mahe', // +4
        'Asia/Ashgabat', // +5
        'Asia/Dhaka', // +6
        'Asia/Bangkok', // +7
        'Asia/Hong_Kong', // +8
        'Asia/Pyongyang', // +9
        'Australia/Sydney', // +10
        'Asia/Magadan', // +11
      ],
      attrs: [
        {
          highlight: true,
          dates: { start: '2020-10-05T10:00:00Z', end: '2020-10-09T09:00:00Z' },
        },
        {
          dot: 'pink',
          dates: '2020-10-01T18:00:00Z',
        },
        {
          dot: 'indigo',
          dates: '2020-10-11T19:00:00Z',
        },
        {
          dot: 'indigo',
          dates: '2020-10-15T01:00:00Z',
        },
        {
          dot: 'red',
          dates: '2020-10-21T05:00:00Z',
        },
        {
          dot: 'green',
          dates: '2020-10-21T00:00:00Z',
        },
        {
          dot: 'blue',
          dates: '2020-10-29T03:00:00Z',
        },
      ],
    };
  },
  computed: {
    timezone() {
      return this.timezones[this.timezoneIndex];
    },
  },
};
```

## Date Picker

### Time Selection

When using the `timezone` prop with `v-date-picker`, the displayed time will reflect the time associated with the date in the specified timezone.

<guide-timezones-picker-time />

```html
<div>
  <v-date-picker
    mode="dateTime"
    v-model="dateRange"
    :timezone="timezone"
    is-range
  />
  <div class="flex mt-2">
    <span class="font-semibold text-gray-600 w-12">Start:</span
    ><span class="ml-2">{{
      dateRange && dateRange.start.toISOString()
    }}</span>
  </div>
  <div class="flex mt-2">
    <span class="font-semibold text-gray-600 w-12">End:</span
    ><span class="ml-2">{{ dateRange && dateRange.end.toISOString() }}</span>
  </div>
  <div class="w-full mt-4">
    <div class="flex justify-between w-full">
      <span class="text-sm font-bold text-gray-800">-11:00</span>
      <span class="text-sm font-bold text-gray-800">UTC</span>
      <span class="text-sm font-bold text-gray-800">+11:00</span>
    </div>
    <input
      class="w-full"
      type="range"
      min="0"
      :max="timezones.length - 1"
      v-model="timezoneIndex"
    />
    <div class="flex">
      <span class="font-semibold text-gray-600 mr-2">Timezone:</span>
      <span class="text-gray-900">{{ timezone }}</span>
    </div>
  </div>
</div>
```

```js
export default {
  data() {
    const start = new Date(2020, 0, 6);
    const end = new Date(2020, 0, 10);
    return {
      dateRange: {
        start,
        end,
      },
      timezoneIndex: 0,
      timezones: [
        'Pacific/Niue', // -11
        'US/Hawaii', // -10
        'America/Anchorage', // -9
        'America/Los_Angeles', // -8
        'America/Boise', // -7
        'America/Chicago', // -6
        'America/New_York', // -5
        'America/Aruba', // -4
        'America/Buenos_Aires', // -3
        'Brazil/DeNoronha', // -2,
        'Atlantic/Azores', // -1
        'UTC', // 0
        'Europe/Amsterdam', // +1
        'Europe/Athens', // +2
        'Europe/Moscow', // +3
        'Indian/Mahe', // +4
        'Asia/Ashgabat', // +5
        'Asia/Dhaka', // +6
        'Asia/Bangkok', // +7
        'Asia/Hong_Kong', // +8
        'Asia/Pyongyang', // +9
        'Australia/Sydney', // +10
        'Asia/Magadan', // +11
      ],
    };
  },
  computed: {
    timezone() {
      return this.timezones[this.timezoneIndex];
    },
  },
};
```

### Time Assignment

Similarly, if `mode === 'date'` and the `modelConfig.timeAssign` has been explicitly set, then the assigned time will reflect the assigned `timezone` or the local browser's timezone otherwise.

<guide-timezones-picker-date />

```html
<v-date-picker
  v-model="dateRange"
  :model-config="modelConfig"
  is-range
/>
```

```js
export default {
  data() {
    return {
      dateRange: {
        start: new Date(2020, 0, 6),
        end: new Date(2020, 0, 10),
      },
      modelConfig: {
        timeAdjust: '12:00:00',
      },
    };
  },
};
```