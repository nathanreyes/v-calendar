<template>
  <div class="section">
    <h2 class="h2">Multi-Paned Calendars</h2>
    <p class="text-lg font-medium text-grey-6 mb-8">Use multiple rows and columns.</p>
    <div class="flex justify-center">
      <v-calendar :rows="2" :columns="$screens({ default: 1, lg: 2 })"/>
    </div>
  </div>
</template>
    