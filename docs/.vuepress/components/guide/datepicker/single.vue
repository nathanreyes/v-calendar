<template>
  <div class="example">
    <v-date-picker v-model="date">
      <template v-slot="{ inputValue, inputEvents }">
        <div class="flex items-baseline">
          <label for="date" class="font-semibold text-sm text-gray-600 mr-2"
            >Enter Date:</label
          >
          <input
            id="date"
            class="px-2 py-1 border rounded"
            :value="inputValue"
            v-on="inputEvents"
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
      date: new Date(2018, 0, 25), // Jan 25th, 2018
    };
  },
};
</script>

