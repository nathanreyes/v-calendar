<template>
  <div class="py-6">
    <DatePicker v-model="date" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const date = ref(new Date());
    return {
      date,
    };
  },
});
</script>
