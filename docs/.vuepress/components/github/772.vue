<template>
  <div class="flex flex-col">
    <div>Time: {{ time ? time : 'Empty' }}</div>
    <v-date-picker
      v-model="time"
      mode="time"
      :model-config="modelConfig"
      :popover="{ visibility: 'click' }"
      timezone="utc"
    >
      <template v-slot="{ inputValue, inputEvents }">
        <input
          class="px-2 py-1 rounded border-2 focus:border-blue-300 focus:outline-none"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </v-date-picker>
    <div>Date: {{ date ? date : 'Empty' }}</div>
    <v-date-picker
      v-model="date"
      mode="dateTime"
      :model-config="modelConfig"
      :masks="masks"
      timezone="utc"
    >
      <template v-slot="{ inputValue, inputEvents }">
        <input
          class="px-2 py-1 rounded border-2 focus:border-blue-300 focus:outline-none"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </v-date-picker>
    <div>Start: {{ range ? range.start : 'Empty' }}</div>
    <div>End: {{ range ? range.end : 'Empty' }}</div>
    <v-date-picker
      v-model="range"
      mode="time"
      :model-config="modelConfig"
      timezone="utc"
      is-range
    >
      <template v-slot="{ inputValue, inputEvents }">
        <input
          class="px-2 py-1 rounded border-2"
          :value="inputValue.start"
          v-on="inputEvents.start"
        />
        <input
          class="px-2 py-1 rounded border-2"
          :value="inputValue.end"
          v-on="inputEvents.end"
        />
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  githubTitle: 'Time cannot be null',
  data() {
    return {
      date: '2021-01-15T04:15:00.123Z',
      range: {
        start: '2021-01-01T00:00:00.000Z',
        end: '2021-01-24T00:00:00.000Z',
      },
      time: '2021-01-15T04:15:00.000Z',
      modelConfig: {
        type: 'string',
        fillDate: new Date(1920, 0, 1),
        // timeAdjust: '09:00',
      },
      masks: {
        inputDateTime: 'MM/DD/YYYY',
      },
    };
  },
};
</script>
