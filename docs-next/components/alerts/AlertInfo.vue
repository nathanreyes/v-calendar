<script setup>
import IconInfo from '../icons/IconInfo.vue';
</script>
<template>
  <div class="flex">
    <IconInfo class="text-accent-600 flex-shrink-0" />
    <span class="font-semibold ml-2"><slot /></span>
  </div>
</template>
