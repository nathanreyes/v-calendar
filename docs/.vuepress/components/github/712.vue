<template>
  <div>
    <v-date-picker v-model="range" mode="datetime" is-range is24hr>
      <template #default="{ inputValue, inputEvents }">
        <input :value="inputValue.start" v-on="inputEvents.start" />
        <input :value="inputValue.end" v-on="inputEvents.end" />
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  githubTitle: 'Highlight style rectangles with v2?',
  data() {
    return {
      range: null,
    };
  },
};
</script>
