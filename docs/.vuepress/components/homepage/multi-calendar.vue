<template>
  <div class="flex justify-center">
    <v-calendar :rows="2" :columns="$screens({ default: 1, lg: 2 })"></v-calendar>
  </div>
</template>
    