<template>
  <Example centered>
    <div class="space-y-2">
      <div class="flex items-center space-x-2">
        <input id="darkmode" type="checkbox" v-model="isDark" />
        <label for="darkmode"> Dark Mode </label>
      </div>
      <VCalendar :is-dark="isDark" />
    </div>
  </Example>
</template>
<script setup>
import { ref } from 'vue';
const isDark = ref(false);
</script>
