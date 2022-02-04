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
      v-model="date"
      mode="dateTime"
      :valid-hours="validHours"
      :minute-increment="minuteIncrement"
      is-range
    >
      <template #default="{ inputValue, inputEvents }">
        <div class="flex items-center space-x-2">
          <input
            :value="inputValue.start"
            v-on="inputEvents.start"
            class="px-2 py-1 border rounded-md"
          />
          <span>-</span>
          <input
            :value="inputValue.end"
            v-on="inputEvents.end"
            class="px-2 py-1 border rounded-md"
          />
        </div>
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
      minuteIncrement: 2,
      clearDate() {
        date.value = null;
      },
    };
  },
});
</script>
