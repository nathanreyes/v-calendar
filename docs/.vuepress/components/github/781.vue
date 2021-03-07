<template>
  <div>
    <div>Start: {{ range && range.start }}</div>
    <div>End: {{ range && range.end }}</div>
    <v-date-picker
      v-model="range"
      :min-date="new Date()"
      mode="dateTime"
      is24hr
      is-range
    >
      <template v-slot="{ inputValue, inputEvents }">
        <div class="flex">
          <input
            type="text"
            :value="inputValue.start"
            v-on="inputEvents.start"
          />
          <input type="text" :value="inputValue.end" v-on="inputEvents.end" />
        </div>
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  githubTitle: 'is24hr issue when selecting time',
  data() {
    return {
      range: null,
    };
  },
};
</script>
