<template>
  <DateDisplay v-model="date" show-input>
    <template #popover="{ togglePopover }">
      <div class="flex">
        <button
          class="flex justify-center items-center px-2 bg-accent-100 text-accent-700 rounded-l-md popover-ref"
          @click="() => togglePopover({ refSelector: '.popover-ref' })"
        >
          <IconCalendar class="w-4 h-4" />
        </button>
        <input class="" />
      </div>
    </template>
  </DateDisplay>
</template>
<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
