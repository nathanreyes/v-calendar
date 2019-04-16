<template>
  <div>
    <h2
      class="text-center text-lg font-medium mt-4"
    >280: Date Picker - Poor performance when showing multiple months with attributes</h2>
    <div class="example">
      <v-date-picker
        v-model="calendar.selectedDate"
        mode="range"
        :rows="4"
        :columns="2"
        :min-date="new Date()"
        :attributes="calendar.attributes"
        class="calendar mt-lg"
        is-inline
      />
    </div>
  </div>
</template>

<script>
import availabilities from './data/280/availabilites.json';
import events from './data/280/events.json';

export default {
  name: 'VCalendarTest',
  data() {
    return {
      calendar: {
        // date: null,
        selectedDate: {
          start: new Date(),
          end: new Date(),
        },
        availabilities,
        events,
        attributes: [],
      },
    };
  },
  methods: {
    initCalendarAttributes() {
      var calendarAttributes = [];
      // Calendar availability attributes
      var calendarAvailabilites = this.calendar.availabilities.map(
        availability => ({
          key: `availability.${availability.Date}`,
          highlight: availability.ColorCode,
          dates: availability.Date,
          customData: availability,
        }),
      );

      // Calendar event attributes
      var calendarEvents = this.calendar.events.map(event => ({
        key: `event.${event.id}`,
        bar: 'orange',
        popover: {
          label: event.title,
        },
        dates: { start: event.startDate, end: event.endDate },
        customData: event,
      }));

      // Merge arrays
      calendarAttributes = this.mergeArraysWithoutDuplicates(
        // calendarAttributes,
        calendarEvents,
        // calendarAvailabilites,
      );

      this.calendar.attributes = calendarAttributes;
    },
    mergeArraysWithoutDuplicates(...arr) {
      return [...new Set([].concat(...arr))];
    },
  },
  created() {
    this.initCalendarAttributes();
  },
};
</script>

<style>
.av-highlight {
  width: 100%;
  height: 100%;
}
</style>
