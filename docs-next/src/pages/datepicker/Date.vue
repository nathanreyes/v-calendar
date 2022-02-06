<template>
  <div class="py-6">
    <DatePicker v-model="date" mode="dateTime">
      <template #default="{ inputValue, inputEvents }">
        <input :value="inputValue" v-on="inputEvents" />
      </template>
    </DatePicker>
    <DatePicker v-model="date" mode="dateTime" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const date = ref(new Date(2000, 0, 15));
    const minDate = ref(new Date(2000, 0, 5));
    return {
      date,
      minDate,
    };
  },
});
</script>
