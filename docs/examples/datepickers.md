---
title: 'Date Pickers'
sidebarDepth: 2
---

## Multiple Dates

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
      <v-date-picker v-model="range" mode="dateTime" is-range>
        <template v-slot="{ inputValue, inputEvents, isDragging }">
          <div class="flex justify-start items-center">
            <div class="relative w-40">
              <svg
                class="text-gray-600 w-4 h-4 m-2 absolute pointer-events-none"
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
            <span class="flex-shrink-0 mx-2">&#8594;</span>
            <div class="relative w-40">
              <svg
                class="text-gray-600 w-4 h-4 m-2 absolute pointer-events-none"
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
    };
  },
};
```
