<template>
  <div>
    <div class="calendar-examples">
      <Calendar
        :attributes="attributes"
        :columns="$screens({ default: 1, md: 2 })"
        transition="slide-h"
        :masks="{ weekdays: 'WWW' }"
        show-weeknumbers="right-outside"
      >
        <template #day-popover="{}"> Helloooo </template>
      </Calendar>
    </div>
    <div class="date-examples">
      <div>
        <div>
          <label for="dark">
            <input id="dark" type="checkbox" v-model="isDark" />
            Is Dark</label
          >
          <label for="range">
            <input id="range" type="checkbox" v-model="isRange" />
            Is Range</label
          >
        </div>
        <div>
          <label for="date">
            <input id="date" type="radio" v-model="mode" value="date" />
            date
          </label>
          <label for="datetime">
            <input id="datetime" type="radio" v-model="mode" value="datetime" />
            datetime</label
          >
          <label for="time">
            <input id="time" type="radio" v-model="mode" value="time" />
            time</label
          >
        </div>
        <DatePicker
          :mode="mode"
          v-model="date"
          :is-dark="isDark"
          :is-range="isRange"
        />
      </div>
      <div>
        <DatePicker
          :mode="mode"
          v-model="date"
          :is-dark="isDark"
          :is-range="isRange"
        >
          <template #default="{ inputValue, inputEvents }">
            <template v-if="isRange">
              <input :value="inputValue.start" v-on="inputEvents.start" />
              <input :value="inputValue.end" v-on="inputEvents.end" />
            </template>
            <template v-else>
              <input :value="inputValue" v-on="inputEvents" />
            </template>
          </template>
        </DatePicker>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      date: new Date(),
      mode: 'datetime',
      isDark: false,
      isRange: false,
      attributes: [
        {
          highlight: true,
          popover: {
            label: 'Testing',
          },
          dates: [new Date(), new Date(2020, 10, 12)],
        },
        {
          dot: true,
          dates: new Date(2020, 10, 5),
        },
      ],
    };
  },
  watch: {
    isRange(val) {
      if (val) {
        this.date = {
          start: new Date(2020, 10, 16),
          end: new Date(2020, 10, 20),
        };
      } else {
        this.date = new Date();
      }
    },
  },
};
</script>

<style scoped>
.calendar-examples {
  margin: 2rem;
}
.date-examples {
  margin: 2rem;
  display: flex;
}
</style>
