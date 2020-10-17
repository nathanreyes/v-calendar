<template>
  <div class="example">
    <v-date-picker v-model="range" is-range>
      <template v-slot="{ inputValue, inputEvents }">
        <div class="flex justify-center items-center">
          <input
            :value="inputValue.start"
            v-on="inputEvents.start"
            class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
          />
          <svg
            class="w-4 h-4 mx-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          <input
            :value="inputValue.end"
            v-on="inputEvents.end"
            class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
          />
        </div>
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      range: {
        start: new Date(2020, 9, 12),
        end: new Date(2020, 9, 16),
      },
    };
  },
};
</script>
