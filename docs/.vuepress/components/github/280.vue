<template>
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
</template>

<script>
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
        attributes: [],
        availablities: [
          {
            Date: '2019-03-21T00:00:00',
            ColorCode: '#9fcd69',
            Description: 'Testing A',
          },
          // .... 1 attribute per day
          {
            Date: '2019-10-31T00:00:00',
            ColorCode: '#9FCD69',
            Description: 'Testing B',
          },
        ],
      },
    };
  },
  methods: {
    initCalendarAttributes() {
      var calendarAttributes = [];
      // Calendar availability attributes
      var calendarAvailabilites = this.calendar.availablities.map(
        availability => ({
          key: `availability.${availability.Date}`,
          highlight: {
            class: 'av-highlight',
          },
          popover: {
            label: availability.Description,
          },
          dates: availability.Date,
          customData: availability,
        }),
      );

      // Merge arrays
      calendarAttributes = this.mergeArraysWithoutDuplicates(
        calendarAttributes,
        calendarAvailabilites,
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
  background-color: #9fcd69;
}
</style>
