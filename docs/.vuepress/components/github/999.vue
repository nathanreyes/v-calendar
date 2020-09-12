<template>
  <div class="flex flex-col items-center">
    <div class="w-full">
      <div class="w-full">
        <span class="font-semibold text-gray-600">Timezone</span>
        <select class="border px-3 py-1 ml-2" v-model="timezone">
          <option v-for="tz in timezones" :key="tz" :value="tz">{{
            tz
          }}</option>
        </select>
      </div>
      <div class="flex items-center mt-2">
        <span class="font-semibold text-gray-600 w-12">Mode:</span>
        <label for="single" class="ml-2">
          <input id="single" type="radio" v-model="mode" value="date" />
          Date
        </label>
        <label for="dateTime" class="ml-2">
          <input id="dateTime" type="radio" v-model="mode" value="dateTime" />
          Date & Time
        </label>
        <label for="time" class="ml-2">
          <input id="time" type="radio" v-model="mode" value="time" />
          Time
        </label>
      </div>
      <div class="flex mt-2">
        <label for="range">
          <input id="range" type="checkbox" v-model="range" /><span class="ml-2"
            >Range</span
          >
        </label>
        <label for="inline" class="ml-2">
          <input id="inline" type="checkbox" v-model="inline" /><span
            class="ml-2"
            >Inline</span
          >
        </label>
        <label for="dark" class="ml-2">
          <input id="dark" type="checkbox" v-model="dark" /><span class="ml-2"
            >Dark</span
          >
        </label>
      </div>
      <div class="mt-2">
        <button
          class="text-red-700 font-semibold bg-red-100 hover:bg-red-200 px-3 py-1 rounded ml-2"
          @click="clear"
        >
          Clear
        </button>
      </div>
    </div>
    <!--Date values-->
    <template v-if="!range">
      <div class="flex mt-2">
        <span class="font-semibold text-gray-600 w-12">Date:</span
        ><span class="ml-2">{{ date }}</span>
      </div>
    </template>
    <template v-else>
      <div class="flex mt-2">
        <span class="font-semibold text-gray-600 w-12">Start:</span
        ><span class="ml-2">{{ dateRange && dateRange.start }}</span>
      </div>
      <div class="flex mt-2">
        <span class="font-semibold text-gray-600 w-12">End:</span
        ><span class="ml-2">{{ dateRange && dateRange.end }}</span>
      </div>
    </template>
    <div class="flex mt-2">
      <!--Date picker-->
      <div v-if="!range">
        <v-date-picker
          v-model="date"
          :mode="mode"
          :model-config="dateConfig"
          :masks="masks"
          :timezone="timezone"
          :popover="{ visibility: 'hover-focus' }"
          :is-dark="dark"
        >
          <template v-slot="{ inputValue, inputEvents }" v-if="!inline">
            <div class="flex items-center">
              <input
                class="px-3 py-1 flex-grow border rounded"
                :value="inputValue"
                v-on="inputEvents"
              />
            </div>
          </template>
        </v-date-picker>
      </div>
      <!--Date range picker-->
      <div v-else>
        <v-date-picker
          v-model="dateRange"
          :mode="mode"
          :model-config="dateConfig"
          :masks="masks"
          :timezone="timezone"
          :popover="{ visibility: 'hover-focus' }"
          :is-dark="dark"
          is-range
        >
          <template v-slot="{ inputValue, inputEvents }" v-if="!inline">
            <div class="flex items-center">
              <input
                class="px-3 py-1 flex-grow border rounded mr-2"
                :value="inputValue.start"
                v-on="inputEvents.start"
              />
              <span>&#8594;</span>
              <input
                class="px-3 py-1 flex-grow border rounded ml-2"
                :value="inputValue.end"
                v-on="inputEvents.end"
              />
            </div>
          </template>
        </v-date-picker>
        <!-- <div class="w-10 bg-blue-300" style="height:500px"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import timezones from '../../../../tests/timezones';
import { padStart, orderBy } from 'lodash';

export default {
  githubTitle: 'Testing',
  data() {
    const date = new Date();
    const start = new Date(2020, 0, 6);
    const end = new Date(2020, 0, 10);
    return {
      mode: 'dateTime',
      date,
      dateConfig: {
        type: 'string',
        time: 'startOfDay',
      },
      timezone: '',
      timezones: orderBy(timezones),
      dateRange: { start, end },
      masks: {
        input: 'MM/DD/YYYY hh:mm a',
      },
      minDate: new Date(),
      range: false,
      inline: false,
      dark: false,
    };
  },
  methods: {
    clear() {
      this.date = '';
      this.range = null;
    },
  },
};
</script>
