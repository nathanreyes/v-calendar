<template>
  <div class="section">
    <h2 class="h2">Date Picker</h2>
    <p>
      Oh, and there's a date picker that can do everything VCalendar can do with extra support for
      <a
        class="has-text-primary"
        href="#"
        @click.prevent="enableSingleMode"
      >single date</a>,
      <a class="has-text-primary" href="#" @click.prevent="enableMultipleMode">multiple date</a> and
      <a class="has-text-primary" href="#" @click.prevent="enableRangeMode">date range</a> selections.
    </p>
    <p>
      You can even disable complex date patterns like
      <a
        class="has-text-primary"
        href="#"
        @click.prevent="disableWeekends"
      >weekends</a>,
      <a class="has-text-primary" href="#" @click.prevent="disableDays">the 1st and 15th</a> or the
      <a
        class="has-text-primary"
        href="#"
        @click.prevent="disableOrdinalWeekdays"
      >last Saturday</a> of every month.
    </p>
    <p>So...date pickers don't have to be boring after all.</p>
    <div class="example">
      <div class="w-full max-w-sm">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
          <div class="mb-4">
            <label :class="labelClass" for="name">{{ inputLabel }}</label>
            <v-date-picker
              v-model="date"
              :mode="mode"
              :input-props="{ id: 'birthdate', class: inputClass }"
              :disabled-dates="disabledDates"
            ></v-date-picker>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
const { getThisMonthComps, getNextMonthComps } = require('@/utils/helpers');
let { month: thisMonth, year: thisMonthYear } = getThisMonthComps();
let { month: nextMonth, year: nextMonthYear } = getNextMonthComps(
  thisMonth,
  thisMonthYear,
);
thisMonth--;
nextMonth--;

export default {
  data() {
    return {
      // Tailwind classes
      labelClass: 'block text-grey-7 text-sm text-left font-bold mb-2',
      inputClass:
        'shadow appearance-none border rounded w-full py-2 px-3 text-grey-7',
      date: new Date(),
      mode: 'single',
      fromPage: null,
      toPage: null,
      disabledDates: null,
    };
  },
  computed: {
    inputLabel() {
      if (this.mode === 'single') return 'Select Date';
      if (this.mode === 'multiple') return 'Select Dates';
      return 'Select Range';
    },
  },
  watch: {
    mode() {
      this.resetPages();
    },
  },
  methods: {
    resetPages() {
      this.fromPage = { month: thisMonth + 1, year: thisMonthYear };
      this.toPage = { month: nextMonth + 1, year: nextMonthYear };
    },
    enableSingleMode() {
      this.mode = 'single';
      this.$nextTick(() => (this.date = new Date()));
    },
    enableMultipleMode() {
      this.mode = 'multiple';
      this.$nextTick(
        () =>
          (this.date = [
            new Date(thisMonthYear, thisMonth, 3),
            new Date(thisMonthYear, thisMonth, 15),
            new Date(thisMonthYear, thisMonth, 25),
            new Date(nextMonthYear, nextMonth, 2),
          ]),
      );
    },
    enableRangeMode() {
      this.mode = 'range';
      this.$nextTick(
        () =>
          (this.date = {
            start: new Date(thisMonthYear, thisMonth, 6),
            end: new Date(thisMonthYear, thisMonth, 23),
          }),
      );
    },
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

