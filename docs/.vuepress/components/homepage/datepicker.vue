<template>
  <div class="section text-center">
    <h2 class="h2">Date Picker</h2>
    <p class="text-lg font-medium text-gray-600 mb-2">Single Dates</p>
    <div class="flex flex-col items-center mb-6">
      <v-date-picker v-model="date" is-inline />
    </div>
    <p class="text-lg font-medium text-gray-600 mb-2">Multiple Dates</p>
    <div class="flex flex-col items-center mb-6">
      <v-date-picker mode="multiple" v-model="dates" is-inline />
    </div>
    <p class="text-lg font-medium text-gray-600 mb-2">Date Ranges</p>
    <div class="flex flex-col items-center mb-6">
      <v-date-picker mode="range" v-model="range" is-inline />
    </div>
    <p class="text-lg font-medium text-gray-600">Popover Mode</p>
    <div class="example-home mt-0">
      <div class="w-full max-w-sm">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
          <div class="mb-4">
            <label :class="labelClass" for="name">{{ inputLabel }}</label>
            <v-date-picker
              mode="range"
              v-model="range2"
              :input-props="{ id: 'birthdate' }"
              :disabled-dates="disabledDates"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
const { pageForThisMonth } = require('@/utils/helpers');
let { month: thisMonth, year: thisMonthYear } = pageForThisMonth();
thisMonth--;

export default {
  data() {
    return {
      labelClass: 'block text-gray-700 text-sm text-left font-bold mb-2',
      inputLabel: 'Select Range',
      date: new Date(),
      dates: [
        new Date(thisMonthYear, thisMonth, 3),
        new Date(thisMonthYear, thisMonth, 15),
        new Date(thisMonthYear, thisMonth, 25),
      ],
      range: {
        start: new Date(thisMonthYear, thisMonth, 6),
        end: new Date(thisMonthYear, thisMonth, 23),
      },
      range2: {
        start: new Date(thisMonthYear, thisMonth, 6),
        end: new Date(thisMonthYear, thisMonth, 23),
      },
      disabledDates: null,
    };
  },
  methods: {
    disableWeekends() {
      this.disabledDates = { weekdays: [1, 7] };
    },
    disableDays() {
      this.disabledDates = { days: [1, 15] };
    },
    disableOrdinalWeekdays() {
      this.disabledDates = { ordinalWeekdays: { [-1]: 7 } };
    },
  },
};
</script>

