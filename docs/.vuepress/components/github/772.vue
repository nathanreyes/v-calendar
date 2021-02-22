<template>
  <div>
    <v-date-picker
      v-model="time"
      mode="time"
      :model-config="modelConfig"
      :popover="{ visibility: 'click' }"
    >
      <template v-slot="{ inputValue, inputEvents }">
        <input
          class="px-2 py-1 rounded border-2 focus:border-blue-300 focus:outline-none"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </v-date-picker>
    <div>
      {{ time ? time.toISOString() : 'Empty' }}
    </div>
  </div>
</template>

<script>
export default {
  githubTitle: 'Time cannot be null',
  data() {
    return {
      time: new Date(2020, 0, 1),
      modelConfig: {
        fillDate: {
          year: 1920,
        },
      },
    };
  },
};
</script>
