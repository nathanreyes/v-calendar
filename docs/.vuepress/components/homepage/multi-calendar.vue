<template>
  <div class="section">
    <h2>Multi-Paned Calendars</h2>
    <h3>
      Responsive multi-row and column layouts
    </h3>
    <div class="flex justify-center">
      <v-calendar :rows="2" :columns="$screens({ default: 1, lg: 2 })" />
    </div>
  </div>
</template>
