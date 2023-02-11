<template>
  <VCalendar class="my-calendar" />
</template>

<style>
/* Global with container */
.my-calendar :is(.vc-weekday-1, .vc-weekday-7) {
  color: #6366f1;
}
</style>

<!-- <style scoped>
/* Scoped with container */
.my-calendar :deep(.vc-weekday-1, .vc-weekday-7) {
  color: #6366f1;
}
</style> -->
