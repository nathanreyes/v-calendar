<template>
  <div class="py-6 flex flex-col">
    <!-- <DatePicker v-model="date" mode="dateTime" /> -->
    {{ date }}
    <div class="flex mt-2">
      <button class="px-2 py-1 bg-gray-100 rounded" @click="clearDate">
        Clear
      </button>
    </div>
    <DatePicker
      class="inline-block h-full"
      v-model="date"
      mode="dateTime"
      :valid-hours="validHours"
      :minute-increment="minuteIncrement"
      is-inline
    >
      <template v-slot="{ inputValue, inputEvents }">
        <input
          class="bg-white border px-2 py-1 rounded"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </DatePicker>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const date = ref(new Date());
    return {
      date,
      validHours: [2, 4, 7, 10, 14, 15, 16],
      minuteIncrement: 15,
      clearDate() {
        date.value = null;
      },
    };
  },
});
</script>
