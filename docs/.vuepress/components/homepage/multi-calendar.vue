<template>
  <div class="section">
    <h2 class="h2">Multi-Paned Calendars</h2>
    <p class="mb-8">Display calendars using multiple rows and columns.</p>
    <div class="flex justify-center">
      <v-calendar :rows="2" :columns="$screens({ default: 1, lg: 2 })"/>
    </div>
  </div>
</template>
    