<template>
  <v-date-picker v-model="range" is-range>
    <template #default="{ inputValue, inputEvents }">
      <input
        class="px-2 py-1 border rounded"
        :value="inputValue.start"
        v-on="inputEvents.start"
      />
      <input
        class="px-2 py-1 border rounded"
        :value="inputValue.end"
        v-on="inputEvents.end"
      />
    </template>
  </v-date-picker>
</template>

<script>
export default {
  githubTitle: `Hitting "esc" doesn't update input`,
  data() {
    return {
      range: null,
    };
  },
};
</script>
