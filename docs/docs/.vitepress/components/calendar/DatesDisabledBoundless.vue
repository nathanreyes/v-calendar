<template>
  <VCalendar :disabled-dates="disabledDates" />
</template>

<script setup>
import { ref } from 'vue';

const disabledDates = ref([{ start: new Date(2022, 10, 7), end: null }]);
</script>
