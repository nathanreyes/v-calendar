<template>
  <div class="max-w-md mx-auto px-4 my-10">
    <h3>Multi-Paned Calendars</h3>
    <p class="mb-8">Display calendars using multiple rows and columns.</p>
    <div class="flex justify-center">
      <v-calendar :rows="2" :columns="$screens({ default: 1, lg: 2 })"/>
    </div>
  </div>
</template>
    