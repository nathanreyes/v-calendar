---
title: 'Date Pickers'
sidebarDepth: 2
---

## Multiple Dates

### Legacy Multiple Mode

In `2.0`, the `mode: "multiple"` option was deprecated. However, you can still use the native `attributes` prop and `dayclick` event to re-create the save behavior.

<examples-multiple-dates-legacy />

```html
<v-calendar :attributes="attributes" @dayclick="onDayClick" />
```

```js
export default {
  data() {
    return {
      days: [],
    };
  },
  computed: {
    dates() {
      return this.days.map(day => day.date);
    },
    attributes() {
      return this.dates.map(date => ({
        highlight: true,
        dates: date,
      }));
    },
  },
  methods: {
    onDayClick(day) {
      const idx = this.days.findIndex(d => d.id === day.id);
      if (idx >= 0) {
        this.days.splice(idx, 1);
      } else {
        this.days.push({
          id: day.id,
          date: day.date,
        });
      }
    },
  },
};
```

### Date Buttons

<examples-multiple-dates />

```html
<template>
  <div class="bg-white p-2 w-full border rounded">
    <v-date-picker v-model="selected.date">
      <template #default="{ inputValue, togglePopover, hidePopover }">
        <div class="flex flex-wrap">
          <button
            v-for="(date, i) in dates"
            :key="date.date.getTime()"
            class="flex items-center bg-indigo-100 hover:bg-indigo-200 text-sm text-indigo-600 font-semibold h-8 px-2 m-1 rounded-lg border-2 border-transparent focus:border-indigo-600 focus:outline-none"
            @click.stop="dateSelected($event, date, togglePopover)"
            ref="button"
          >
            {{ date.date.toLocaleDateString() }}
            <svg
              class="w-4 h-4 text-gray-600 hover:text-indigo-600 ml-1 -mr-1"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              @click.stop="removeDate(date, hidePopover)"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </template>
    </v-date-picker>
    <button
      class="text-sm text-indigo-600 font-semibold hover:text-indigo-500 px-2 h-8 focus:outline-none"
      @click.stop="addDate"
    >
      + Add Date
    </button>
  </div>
</template>
```

```js
export default {
  data() {
    return {
      dates: [
        {
          date: new Date(),
        },
      ],
      selected: {},
    };
  },
  methods: {
    addDate() {
      this.dates.push({
        date: new Date(),
      });
      this.$nextTick(() => {
        const btn = this.$refs.button[this.$refs.button.length - 1];
        btn.click();
      });
    },
    removeDate(date, hide) {
      this.dates = this.dates.filter((d) => d !== date);
      hide();
    },
    dateSelected(e, date, toggle) {
      this.selected = date;
      toggle({ ref: e.target });
    },
  },
};
```

## Date Range

<examples-date-range />

```html
<template>
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
    <div class="mb-4">
      <span class="block text-gray-600 text-sm text-left font-bold mb-2"
        >Select Range</span
      >
      <v-date-picker
        v-model="range"
        mode="dateTime"
        :masks="masks"
        is-range
      >
        <template v-slot="{ inputValue, inputEvents, isDragging }">
          <div class="flex flex-col sm:flex-row justify-start items-center">
            <div class="relative flex-grow">
              <svg
                class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <input
                class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                :value="inputValue.start"
                v-on="inputEvents.start"
              />
            </div>
            <span class="flex-shrink-0 m-2">
              <svg
                class="w-4 h-4 stroke-current text-gray-600"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <div class="relative flex-grow">
              <svg
                class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <input
                class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                :value="inputValue.end"
                v-on="inputEvents.end"
              />
            </div>
          </div>
        </template>
      </v-date-picker>
    </div>
  </form>
</template>
```

```js
export default {
  data() {
    return {
      range: {
        start: new Date(2020, 0, 6),
        end: new Date(2020, 0, 23),
      },
      masks: {
        input: 'YYYY-MM-DD h:mm A',
      },
    };
  },
};
```

## Button Dropdown

This examples utilizes a dedicated button for displaying the dropdown picker. Here, the `input` element is readonly, so the user is required to use the picker for date selection.

<examples-button-dropdown />

```html
<template>
  <v-date-picker class="inline-block h-full" v-model="date">
    <template v-slot="{ inputValue, togglePopover }">
      <div class="flex items-center">
        <button
          class="p-2 bg-blue-100 border border-blue-200 hover:bg-blue-200 text-blue-600 rounded-l focus:bg-blue-500 focus:text-white focus:border-blue-500 focus:outline-none"
          @click="togglePopover()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="w-4 h-4 fill-current"
          >
            <path
              d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
            ></path>
          </svg>
        </button>
        <input
          :value="inputValue"
          class="bg-white text-gray-700 w-full py-1 px-2 appearance-none border rounded-r focus:outline-none focus:border-blue-500"
          readonly
        />
      </div>
    </template>
  </v-date-picker>
</template>
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