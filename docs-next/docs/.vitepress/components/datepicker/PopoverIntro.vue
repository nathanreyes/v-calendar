<template>
  <Example centered>
    <DatePicker v-model="date" :popover="{ visibility: 'click' }">
      <template v-slot="{ inputValue, inputEvents }">
        <BaseInput :value="inputValue" v-on="inputEvents" />
      </template>
    </DatePicker>
  </Example>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
