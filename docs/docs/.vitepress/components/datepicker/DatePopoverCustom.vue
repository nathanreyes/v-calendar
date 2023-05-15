<template>
  <DateDisplay v-model="date" :popover="popover">
    <template #default="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const popover = ref({
  visibility: 'click',
  placement: 'right',
});
</script>
