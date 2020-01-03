<template>
  <div class="flex">
    <div class="block flex flex-col items-start">
      <a
        class="cursor-pointer px-2 py-1 rounded mt-1"
        :class="{ 'bg-indigo-100': holiday === selectedHoliday }"
        v-for="holiday in holidays"
        :key="holiday.name"
        @click="onHolidaySelected(holiday)"
      >
        {{ holiday.name }}
      </a>
    </div>
    <div class="ml-4">
      <h4 v-if="selectedHoliday">
        {{ selectedHoliday.name }}
      </h4>
      <div class="mt-3">
        <v-calendar
          :rows="2"
          :columns="1"
          :attributes="attributes"
          ref="calendar"
        />
      </div>
    </div>
  </div>
</template>

<script>
const holidays = [
  {
    name: `Today`,
    date: new Date(),
  },
  {
    name: `New Year's Day`,
    date: new Date(2020, 0, 1),
  },
  {
    name: `Martin Luther King Jr. Day`,
    date: new Date(2020, 0, 20),
  },
  {
    name: `Groundhog Day`,
    date: new Date(2020, 1, 2),
  },
  {
    name: `Valentine's Day`,
    date: new Date(2020, 1, 14),
  },
  {
    name: `St. Patrick's Day`,
    date: new Date(2020, 2, 17),
  },
  {
    name: `Good Friday`,
    date: new Date(2020, 3, 19),
  },
  {
    name: `Mother's Day`,
    date: new Date(2020, 4, 12),
  },
];

export default {
  githubTitle: `Jump to date dynamically`,
  data() {
    return {
      selectedHoliday: null,
      holidays,
      attributes: holidays.map(h => ({
        dot: true,
        dates: h.date,
        popover: { label: h.name },
      })),
    };
  },
  watch: {
    selectedHoliday(val) {
      if (val) {
        this.$refs.calendar.focusDate(val.date);
      }
    },
  },
  mounted() {
    this.selectedHoliday = this.holidays[0];
  },
  methods: {
    onHolidaySelected(holiday) {
      this.selectedHoliday = holiday;
    },
  },
};
</script>
